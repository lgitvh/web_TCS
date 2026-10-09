<script setup>
// Plays back a server-resolved dungeon run as an animated side-view battle,
// then optionally starts the next run automatically (idle farming).
import { ref, reactive, computed, onBeforeUnmount, onMounted } from 'vue'
import Avatar from '../components/Avatar.vue'
import Monster from '../components/Monster.vue'
import ItemSlot from '../components/ItemSlot.vue'
import ItemModal from '../components/ItemModal.vue'
import { store, api } from '../store.js'
import { THEMES, QUALITIES, DIFFICULTIES } from '@shared/data.js'
import { fmt } from '@shared/rules.js'

const props = defineProps({ first: Object, dungeonId: String })
const emit = defineEmits(['exit'])

const run = ref(props.first)
const auto = ref(true)
const s = reactive({ step: 0, phase: 'walk', heroPose: 'run', monPose: 'idle', mon: null, monHp: 0, hp: 0, floats: [], log: [], done: false, waiting: false })
const showItem = ref(null)
let alive = true
let fid = 0

const theme = computed(() => THEMES.find((t) => t.name === run.value.dungeon.theme) || THEMES[0])
const title = computed(() => {
  const d = run.value.dungeon
  return d.endless ? `Vô Tận · Tầng ${d.endlessLv}` : `${d.theme} · Lv${d.lv} · ${DIFFICULTIES[d.difficulty].name}`
})
const look = computed(() => store.me.look)
const wpn = computed(() => store.me.equip.weapon)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
function float(text, side, kind = '') {
  const f = { id: ++fid, text, side, kind, x: (Math.random() - 0.5) * 50 }
  s.floats.push(f)
  setTimeout(() => { const i = s.floats.indexOf(f); if (i >= 0) s.floats.splice(i, 1) }, 1100)
}
function log(text, kind = '') {
  s.log.unshift({ id: ++fid, text, kind })
  if (s.log.length > 4) s.log.pop()
}

async function play() {
  const r = run.value
  s.done = false
  s.hp = r.startHp
  s.step = 0
  for (const ev of r.events) {
    if (!alive) return
    s.step++
    s.phase = 'walk'
    s.mon = null
    s.heroPose = 'run'
    await sleep(r.walkMs)
    if (!alive) return
    s.phase = 'fight'
    s.mon = ev
    s.monHp = ev.HP
    s.monPose = 'idle'
    s.heroPose = 'idle'
    log(`Gặp ${ev.name}${ev.boss ? ' (BOSS)' : ''}!`, ev.boss ? 'boss' : '')
    const gap = r.fightMs / (ev.hits.length + 1)
    const perHitTaken = ev.taken / ev.hits.length
    for (const h of ev.hits) {
      await sleep(gap * 0.55)
      if (!alive) return
      s.heroPose = 'attack'
      s.monPose = 'hit'
      s.monHp = Math.max(0, s.monHp - h.dmg)
      float(h.crit ? `BẠO KÍCH ${fmt(h.dmg)}` : `-${fmt(h.dmg)}`, 'mon', h.crit ? 'crit' : '')
      await sleep(gap * 0.45)
      s.monPose = 'attack'
      s.heroPose = 'hit'
      s.hp = Math.max(1, s.hp - perHitTaken)
      float(`-${fmt(perHitTaken)}`, 'hero', 'taken')
    }
    if (!ev.win) {
      s.heroPose = 'ko'
      s.monPose = 'idle'
      s.hp = 1
      log('Bạn đã bị hạ gục! Hãy cường hóa trang bị rồi thử lại.', 'bad')
      break
    }
    s.monPose = 'dead'
    s.heroPose = 'win'
    s.hp = ev.hpAfter
    float(`+${fmt(ev.gold)} 💰`, 'mon', 'gold')
    log(`Hạ ${ev.name}: +${fmt(ev.gold)} vàng${ev.items.length ? `, nhận ${ev.items.length} trang bị` : ''}`, 'win')
    for (const it of ev.items) log(`Nhận [${QUALITIES[it.q].name}] ${it.name}`, `q${it.q}`)
    await sleep(700)
  }
  if (!alive) return
  s.done = true
  s.heroPose = run.value.cleared ? 'win' : 'ko'
  if (auto.value && run.value.cleared) {
    await sleep(1800)
    if (alive && auto.value) next()
  }
}

async function next() {
  if (s.waiting) return
  s.waiting = true
  try {
    const r = await api('run', { id: props.dungeonId })
    run.value = r.result
    play()
  } catch {
    auto.value = false
  } finally {
    s.waiting = false
  }
}

const allItems = computed(() => run.value.events.flatMap((e) => e.items || []))
const goldTotal = computed(() => run.value.log.gold)

onMounted(play)
onBeforeUnmount(() => { alive = false })
</script>

<template>
  <div class="battle" :style="{ '--sky1': theme.sky[0], '--sky2': theme.sky[1], '--ground': theme.ground }">
    <div class="hud">
      <button class="btn gray sm" @click="emit('exit')">◀ Rời</button>
      <div class="grow ttl">{{ title }}</div>
      <label class="auto"><input v-model="auto" type="checkbox" /> Tự động</label>
    </div>
    <div class="steps">
      <i v-for="n in 5" :key="n" :class="{ on: n <= s.step, boss: n === 5 }">{{ n === 5 ? '👑' : '' }}</i>
    </div>

    <div class="scene" :class="{ walking: s.phase === 'walk' && !s.done }">
      <div class="clouds" /><div class="hills" /><div class="ground" />
      <div class="hero">
        <div class="hpbar"><i :style="{ width: `${(s.hp / run.maxHp) * 100}%` }" /><span>{{ fmt(s.hp) }}/{{ fmt(run.maxHp) }}</span></div>
        <Avatar :look="look" :worn="store.me.fashion.worn" :weapon="wpn?.icon" :weapon-q="wpn?.q" :pose="s.heroPose" :size="118" />
      </div>
      <transition name="slide">
        <div v-if="s.mon" :key="s.step" class="monster" :class="{ boss: s.mon.boss }">
          <div class="hpbar red"><i :style="{ width: `${(s.monHp / s.mon.HP) * 100}%` }" /><span>{{ s.mon.name }}</span></div>
          <Monster :kind="s.mon.kind" :color="s.mon.color" :boss="s.mon.boss" :state="s.monPose" :size="s.mon.boss ? 150 : 118" />
        </div>
      </transition>
      <div v-for="f in s.floats" :key="f.id" class="float" :class="[f.side, f.kind]" :style="{ '--dx': `${f.x}px` }">{{ f.text }}</div>
    </div>

    <div class="log panel">
      <div v-for="l in s.log" :key="l.id" :class="l.kind">{{ l.text }}</div>
    </div>

    <div v-if="s.done" class="modal-bg">
      <div class="panel modal result">
        <div class="title">{{ run.cleared ? 'Chiến Thắng!' : 'Thất Bại!' }}</div>
        <Avatar :look="look" :worn="store.me.fashion.worn" :weapon="wpn?.icon" :weapon-q="wpn?.q" :pose="run.cleared ? 'win' : 'hit'" :size="90" class="center" />
        <div class="row center-row"><span class="pill">💰 +{{ fmt(goldTotal) }}</span><span v-if="run.log.sold" class="pill">Tự bán +{{ fmt(run.log.sold) }}</span></div>
        <div v-if="allItems.length" class="items">
          <ItemSlot v-for="it in allItems" :key="it.id" :item="it" :size="52" @tap="showItem = it.id" />
        </div>
        <div v-if="run.log.full" class="warn">Túi đồ đã đầy! Đồ mới được bán tự động.</div>
        <div v-if="run.unlockEndless" class="good">🎉 Đã mở khóa chế độ Vô Tận!</div>
        <div v-if="run.endlessUp" class="good">Lên tầng Vô Tận {{ store.me.endlessLv }}!</div>
        <div v-if="!run.cleared" class="warn">Mẹo: cường hóa vũ khí hoặc thử phó bản cấp thấp hơn.</div>
        <div class="row center-row">
          <button class="btn gray" @click="emit('exit')">Về bản đồ</button>
          <button v-if="run.cleared" class="btn green" :disabled="s.waiting" @click="next">{{ auto ? 'Tiếp tục...' : 'Đánh tiếp' }}</button>
          <button v-else class="btn" :disabled="s.waiting" @click="next">Thử lại</button>
        </div>
      </div>
    </div>
    <ItemModal v-if="showItem" :item-id="showItem" @close="showItem = null" />
  </div>
</template>

<style scoped>
.battle { display: flex; flex-direction: column; height: 100%; gap: 8px; padding: 8px; }
.hud { display: flex; align-items: center; gap: 8px; }
.ttl { font-weight: 800; color: #fff; text-shadow: 0 2px 0 #0004; text-align: center; font-size: 15px; }
.auto { font-weight: 800; color: #fff; background: #0003; border-radius: 12px; padding: 2px 8px; font-size: 13px; display: flex; align-items: center; gap: 3px; }
.steps { display: flex; justify-content: center; gap: 8px; }
.steps i { width: 26px; height: 26px; border-radius: 50%; background: #fff6; border: 3px solid #fff; display: grid; place-items: center; font-style: normal; font-size: 13px; }
.steps i.on { background: #ffcf3a; box-shadow: 0 0 8px #ffcf3a; }
.scene { position: relative; flex: 1; min-height: 280px; border-radius: 22px; overflow: hidden; border: 4px solid #fff; box-shadow: 0 5px 0 #0002;
  background: linear-gradient(var(--sky1), var(--sky2) 70%); }
.clouds { position: absolute; inset: 0 -100% 40% 0; background: radial-gradient(ellipse 60px 22px at 60px 50px, #fff 98%, #0000), radial-gradient(ellipse 80px 26px at 260px 90px, #fffd 98%, #0000), radial-gradient(ellipse 50px 18px at 420px 40px, #fff 98%, #0000); background-size: 520px 100%; }
.hills { position: absolute; left: 0; right: -100%; bottom: 22%; height: 30%; background: radial-gradient(ellipse 120px 70px at 100px 100%, #ffffff55 98%, #0000), radial-gradient(ellipse 160px 90px at 330px 100%, #ffffff40 98%, #0000); background-size: 460px 100%; }
.ground { position: absolute; left: 0; right: -100%; bottom: 0; height: 26%; background: repeating-linear-gradient(90deg, var(--ground) 0 40px, color-mix(in srgb, var(--ground), #000 8%) 40px 80px); border-top: 5px solid color-mix(in srgb, var(--ground), #fff 30%); }
.walking .clouds { animation: scroll 9s linear infinite; }
.walking .hills { animation: scroll 4s linear infinite; }
.walking .ground { animation: scroll 1.2s linear infinite; }
@keyframes scroll { to { transform: translateX(-50%); } }
.hero { position: absolute; left: 6%; bottom: 14%; }
.monster { position: absolute; right: 5%; bottom: 15%; }
.hpbar { position: relative; height: 16px; width: 112px; margin: 0 auto 2px; border-radius: 8px; background: #0005; border: 2px solid #fff; overflow: hidden; }
.hpbar i { display: block; height: 100%; background: linear-gradient(#8aff7a, #2fbf3a); transition: width .25s; }
.hpbar.red i { background: linear-gradient(#ff8a7a, #e0242e); }
.hpbar span { position: absolute; inset: 0; font-size: 10px; font-weight: 800; color: #fff; text-align: center; line-height: 12px; text-shadow: 0 1px 1px #000; white-space: nowrap; }
.slide-enter-active { transition: transform .35s ease-out, opacity .35s; }
.slide-enter-from { transform: translateX(120px); opacity: 0; }
.slide-leave-active { transition: opacity .2s; } .slide-leave-to { opacity: 0; }
.float { position: absolute; bottom: 52%; font-weight: 800; font-size: 22px; color: #fff; -webkit-text-stroke: 1.5px #b8202e; text-shadow: 0 3px 0 #0004; animation: rise 1.1s ease-out forwards; white-space: nowrap; pointer-events: none; }
.float.mon { right: 12%; } .float.hero { left: 14%; font-size: 16px; -webkit-text-stroke: 1px #7a1f14; color: #ffb3b3; }
.float.crit { font-size: 28px; color: #ffe14a; -webkit-text-stroke: 2px #d95f00; }
.float.gold { color: #ffe14a; -webkit-text-stroke: 1.5px #a86a00; }
@keyframes rise { 0% { transform: translate(var(--dx), 20px) scale(.6); opacity: 0; } 20% { transform: translate(var(--dx), 0) scale(1.15); opacity: 1; } 100% { transform: translate(var(--dx), -60px) scale(1); opacity: 0; } }
.log { padding: 6px 10px; min-height: 92px; font-size: 13px; font-weight: 700; line-height: 1.35; }
.log .win { color: #1f8a36 } .log .bad { color: #d8202e } .log .boss { color: #b23cff }
.result { text-align: center; }
.center { margin: 0 auto; }
.center-row { justify-content: center; margin: 6px 0; flex-wrap: wrap; }
.items { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 6px 0; }
.warn { color: #d8202e; font-weight: 700; font-size: 13px; }
.good { color: #1f8a36; font-weight: 800; }
</style>
