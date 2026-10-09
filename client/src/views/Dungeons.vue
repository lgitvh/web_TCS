<script setup>
import { ref, computed } from 'vue'
import Monster from '../components/Monster.vue'
import Battle from './Battle.vue'
import { store, api, toast } from '../store.js'
import { DIFFICULTIES, themeFor } from '@shared/data.js'
import { fmt } from '@shared/rules.js'

const battle = ref(null) // { id, first }
const busy = ref(false)
const me = computed(() => store.me)

async function enter(id) {
  if (busy.value) return
  busy.value = true
  try {
    const r = await api('run', { id })
    battle.value = { id, first: r.result }
  } catch { /* toast */ } finally { busy.value = false }
}
async function refresh() {
  try { await api('dungeons/refresh'); toast('Đã làm mới bản đồ', 'ok') } catch { /* toast */ }
}
async function resetEndless() {
  if (!confirm('Đặt lại Vô Tận về tầng 1?')) return
  try { await api('endless/reset') } catch { /* toast */ }
}
const boss = (lv) => themeFor(lv).boss
</script>

<template>
  <Battle v-if="battle" :first="battle.first" :dungeon-id="battle.id" @exit="battle = null" />
  <div v-else class="map scroll">
    <div class="row head">
      <div class="title grow">Bản Đồ Phó Bản</div>
      <button class="btn blue sm" @click="refresh">⟳ Làm mới</button>
    </div>
    <div class="sub center">DPS của bạn: <b>{{ fmt(me.stats.DPS) }}</b> · Sinh lực {{ fmt(me.hpNow) }}/{{ fmt(me.stats.MAXHP) }}</div>

    <button v-if="me.endlessLv" class="card endless" :disabled="busy" @click="enter('endless')">
      <Monster kind="dragon" color="#7a3aff" boss :size="64" state="idle" />
      <div class="grow info">
        <div class="name">♾ Vô Tận · Tầng {{ me.endlessLv }}</div>
        <div class="sub">Không rơi đồ · Vàng x1.5–2.6 · Vượt tầng để lên cao</div>
      </div>
      <span class="btn sm red" @click.stop="resetEndless">Đặt lại</span>
    </button>

    <button v-for="d in me.dungeons" :key="d.id" class="card" :class="`d${d.difficulty}`" :disabled="busy" @click="enter(d.id)">
      <Monster :kind="boss(d.lv)[0]" :color="boss(d.lv)[1]" :boss="d.difficulty > 1" :size="58" state="idle" />
      <div class="grow info">
        <div class="name">{{ d.theme }} <span class="lv">Lv{{ d.lv }}</span></div>
        <div class="sub">DPS đề xuất: <b :class="me.stats.DPS >= d.needDPS ? 'ok' : 'no'">{{ fmt(d.needDPS) }}</b></div>
      </div>
      <span class="diff" :style="{ background: DIFFICULTIES[d.difficulty].color }">{{ DIFFICULTIES[d.difficulty].name }}</span>
    </button>
    <div class="sub center tip">Đánh bại Boss ở phó bản cấp cao hơn để lên cấp. Phó bản Khó/Cực Khó chỉ đánh được 1 lần và dễ rơi đồ xịn hơn.</div>
  </div>
</template>

<style scoped>
.map { height: 100%; padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.head .title { text-align: left; margin: 0; }
.center { text-align: center; }
.card { display: flex; align-items: center; gap: 10px; border: 3px solid #fff; border-radius: 18px; padding: 4px 10px 4px 4px; background: linear-gradient(#fff, #fff3dd); box-shadow: 0 4px 0 #0002; text-align: left; color: var(--ink); }
.card:active { transform: translateY(2px); }
.card.d2 { background: linear-gradient(#fff, #ffe4c2); border-color: #ffc27a; }
.card.d3 { background: linear-gradient(#fff, #ffd6d6); border-color: #ff9a9a; }
.card.endless { background: linear-gradient(#f3e6ff, #d9c2ff); border-color: #b48aff; }
.info .name { font-weight: 800; font-size: 16px; }
.lv { background: #ff8a1a; color: #fff; border-radius: 8px; padding: 0 6px; font-size: 13px; }
.ok { color: #1f8a36 } .no { color: #d8202e }
.diff { color: #fff; font-weight: 800; border-radius: 10px; padding: 1px 8px; font-size: 12px; text-shadow: 0 1px 0 #0003; }
.tip { color: #fff; text-shadow: 0 1px 2px #0005; }
</style>
