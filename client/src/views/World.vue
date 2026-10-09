<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Avatar from '../components/Avatar.vue'
import Monster from '../components/Monster.vue'
import { store, api, toast } from '../store.js'
import { fmt } from '@shared/rules.js'

const tab = ref('boss')
const me = computed(() => store.me)

// ---------- boss ----------
const cooldown = ref(60000)
const now = ref(Date.now())
const offset = ref(0)
const hits = ref([])
const attacking = ref(false)
let timer
const boss = computed(() => store.boss)
const wait = computed(() => Math.max(0, me.value.boss.lastAttack + cooldown.value - (now.value + offset.value)))

async function loadBoss() {
  try {
    const r = await api('boss')
    store.boss = r.result.boss
    cooldown.value = r.result.cooldown
    offset.value = r.me.serverTime - Date.now()
  } catch { /* toast */ }
}
async function attack() {
  attacking.value = true
  try {
    const r = await api('boss/attack')
    offset.value = r.me.serverTime - Date.now()
    hits.value = r.result.hits.map((h, i) => ({ ...h, id: Date.now() + i, d: i * 160, x: 8 + ((i * 37) % 70) }))
    toast(`Gây ${fmt(r.result.dmg)} sát thương!`, 'ok')
    if (r.result.killed) toast(`Boss bị hạ! Phần thưởng đã gửi vào hòm thư.`, 'ok')
    setTimeout(() => { hits.value = [] }, 2200)
  } catch { /* toast */ } finally {
    setTimeout(() => { attacking.value = false }, 1200)
  }
}

// ---------- arena ----------
const arena = ref(null)
const duel = ref(null)
async function loadArena() {
  try { arena.value = (await api('arena')).result } catch { /* toast */ }
}
async function challenge(o) {
  try {
    const r = await api('arena/fight', { id: o.id })
    duel.value = { ...r.result, enemyName: o.name, stage: 'fight' }
    setTimeout(() => { if (duel.value) duel.value.stage = 'done' }, 2200)
    loadArena()
  } catch { /* toast */ }
}

// ---------- ranking ----------
const rankType = ref('power')
const rank = ref([])
async function loadRank() {
  try { rank.value = (await api('rank', { type: rankType.value })).result } catch { /* toast */ }
}
const rankValue = (r) => ({ power: fmt(r.power), lv: `Lv${r.lv}`, endless: `Tầng ${r.endless}`, arena: `Hạng ${r.rank}` }[rankType.value])

function load() {
  if (tab.value === 'boss') loadBoss()
  else if (tab.value === 'arena') loadArena()
  else loadRank()
}
watch(tab, load)
watch(rankType, loadRank)
onMounted(() => {
  load()
  timer = setInterval(() => { now.value = Date.now() }, 500)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="world scroll">
    <div class="row tabs">
      <button :class="{ on: tab === 'boss' }" @click="tab = 'boss'">🐲 Boss</button>
      <button :class="{ on: tab === 'arena' }" @click="tab = 'arena'">⚔ Đấu Trường</button>
      <button :class="{ on: tab === 'rank' }" @click="tab = 'rank'">🏆 Xếp Hạng</button>
    </div>

    <!-- WORLD BOSS -->
    <template v-if="tab === 'boss' && boss">
      <div class="panel bossbox">
        <div class="title">{{ boss.name }} <span class="lv">Lv{{ boss.lv }}</span></div>
        <div class="bossstage">
          <Monster :kind="boss.kind" :color="boss.color" boss :size="170" :state="attacking ? 'hit' : 'idle'" />
          <div v-for="h in hits" :key="h.id" class="bfloat" :class="{ crit: h.crit }" :style="{ animationDelay: `${h.d}ms`, left: `${h.x}%` }">{{ h.crit ? '💥' : '-' }}{{ fmt(h.dmg) }}</div>
        </div>
        <div class="bosshp"><i :style="{ width: `${(boss.hp / boss.maxHp) * 100}%` }" /><span>{{ fmt(boss.hp) }} / {{ fmt(boss.maxHp) }}</span></div>
        <div class="sub center">Tất cả người chơi cùng đánh 1 Boss. Hạ Boss: ai cũng nhận thưởng, top 3 và người kết liễu nhận thêm kim cương!</div>
        <button class="btn red attack" :disabled="wait > 0 || attacking" @click="attack">
          {{ wait > 0 ? `Hồi chiêu ${Math.ceil(wait / 1000)}s` : '⚔ TẤN CÔNG' }}
        </button>
      </div>
      <div class="panel">
        <b>Bảng sát thương</b>
        <div v-for="(t, i) in boss.top" :key="t.id" class="rrow" :class="{ mine: t.id === me.id }">
          <span class="medal">{{ ['🥇', '🥈', '🥉'][i] || i + 1 }}</span><span class="grow">{{ t.name }}</span><b>{{ fmt(t.dmg) }}</b>
        </div>
        <div v-if="!boss.top.length" class="sub">Chưa ai tấn công. Hãy là người đầu tiên!</div>
      </div>
    </template>

    <!-- ARENA -->
    <template v-if="tab === 'arena' && arena">
      <div class="panel row">
        <Avatar :look="me.look" :worn="me.fashion.worn" :weapon="me.equip.weapon?.icon" :size="56" />
        <div class="grow"><b>Hạng của bạn: {{ arena.me.rank }}</b><div class="sub">Lực chiến {{ fmt(me.stats.POWER) }}</div></div>
        <span class="pill">🎫 {{ me.arena.tickets }}/5</span>
      </div>
      <div class="sub center white">Khiêu chiến người xếp trên. Thắng: đổi hạng + 10💎, thua: +3💎</div>
      <div v-for="o in arena.opponents" :key="o.id" class="panel opp">
        <span class="rk">#{{ o.rank }}</span>
        <Avatar :look="o.look" :worn="o.worn" :weapon="o.weapon" :size="50" />
        <div class="grow"><b>{{ o.name }}</b><div class="sub">Lv{{ o.lv }} · Lực chiến {{ fmt(o.power) }}</div></div>
        <button class="btn sm" :class="o.power > me.stats.POWER * 1.3 ? 'gray' : 'green'" :disabled="me.arena.tickets < 1" @click="challenge(o)">Khiêu chiến</button>
      </div>
    </template>

    <!-- RANKING -->
    <template v-if="tab === 'rank'">
      <div class="row tabs small">
        <button v-for="[k, n] in [['power', 'Lực chiến'], ['lv', 'Cấp'], ['endless', 'Vô Tận'], ['arena', 'Đấu Trường']]" :key="k" :class="{ on: rankType === k }" @click="rankType = k">{{ n }}</button>
      </div>
      <div class="panel">
        <div v-for="(r, i) in rank" :key="r.id" class="rrow" :class="{ mine: r.id === me.id }">
          <span class="medal">{{ ['🥇', '🥈', '🥉'][i] || i + 1 }}</span>
          <Avatar :look="r.look" :worn="r.worn" :weapon="r.weapon" :size="34" />
          <span class="grow">{{ r.name }}</span><b>{{ rankValue(r) }}</b>
        </div>
      </div>
    </template>

    <div v-if="duel" class="modal-bg" @click.self="duel.stage === 'done' && (duel = null)">
      <div class="panel modal duel">
        <div class="vs">
          <Avatar :look="me.look" :worn="me.fashion.worn" :weapon="me.equip.weapon?.icon" :size="96" :pose="duel.stage === 'fight' ? 'attack' : duel.win ? 'win' : 'ko'" />
          <div class="vstext">VS</div>
          <Avatar :look="duel.enemy.look" :worn="duel.enemy.worn" :weapon="duel.enemy.weapon" :size="96" flip :pose="duel.stage === 'fight' ? 'attack' : duel.win ? 'ko' : 'win'" />
        </div>
        <template v-if="duel.stage === 'done'">
          <div class="title">{{ duel.win ? 'Chiến Thắng!' : 'Thua Rồi...' }}</div>
          <div class="center">{{ duel.win ? `Bạn lên hạng ${duel.newRank}!` : `${duel.enemyName} quá mạnh.` }} <b>+{{ duel.gems }} 💎</b></div>
          <div class="row" style="justify-content:center;margin-top:8px"><button class="btn" @click="duel = null">OK</button></div>
        </template>
        <div v-else class="title">Đang chiến đấu...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.world { height: 100%; padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.tabs button { flex: 1; border: 3px solid #fff; border-radius: 14px; background: #ffffff99; font-weight: 800; color: #b0661a; padding: 5px 2px; font-size: 14px; }
.tabs button.on { background: linear-gradient(#ffb04a, #ff8a1a); color: #fff; }
.tabs.small button { font-size: 12px; padding: 2px; color: #1a6fc0; }
.tabs.small button.on { background: linear-gradient(#7fd0ff, #3aa8ff); color: #fff; }
.bossbox { background: linear-gradient(#3b2a6a, #7a4ad6); color: #fff; text-align: center; }
.bossbox .sub { color: #e6dcff; }
.lv { font-size: 16px; background: #ff4a5a; border-radius: 8px; padding: 0 6px; -webkit-text-stroke: 0; }
.bossstage { position: relative; display: flex; justify-content: center; }
.bfloat { position: absolute; top: 40%; white-space: nowrap; font-weight: 800; font-size: 20px; color: #fff; -webkit-text-stroke: 1.5px #b8202e; opacity: 0; animation: up 1.2s ease-out forwards; }
.bfloat.crit { color: #ffe14a; font-size: 26px; -webkit-text-stroke: 2px #d95f00; }
@keyframes up { 0% { opacity: 0; transform: translateY(20px) scale(.6); } 20% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(-70px); } }
.bosshp { position: relative; height: 22px; border-radius: 11px; background: #0006; border: 3px solid #fff; overflow: hidden; margin: 8px 0; }
.bosshp i { display: block; height: 100%; background: linear-gradient(#ff8a7a, #e0242e); transition: width .4s; }
.bosshp span { position: absolute; inset: 0; font-size: 12px; font-weight: 800; line-height: 16px; text-shadow: 0 1px 1px #000; }
.attack { font-size: 22px; width: 100%; margin-top: 6px; }
.rrow { display: flex; align-items: center; gap: 8px; padding: 3px 4px; border-bottom: 1px dashed #ffd9a8; font-size: 14px; }
.rrow.mine { background: #fff2c2; border-radius: 10px; }
.medal { width: 26px; text-align: center; font-weight: 800; }
.center { text-align: center; }
.white { color: #fff; text-shadow: 0 1px 2px #0005; }
.opp { display: flex; align-items: center; gap: 8px; padding: 6px 10px; }
.rk { font-weight: 800; font-size: 18px; color: #ff8a1a; width: 34px; }
.duel .vs { overflow: hidden; display: flex; align-items: flex-end; justify-content: center; gap: 6px; background: linear-gradient(#8fe3ff, #e6fbff); border-radius: 16px; padding: 8px; }
.vstext { font-size: 34px; font-weight: 800; color: #ff4a5a; -webkit-text-stroke: 2px #fff; align-self: center; }
</style>
