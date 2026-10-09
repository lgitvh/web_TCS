<script setup>
import { computed, ref } from 'vue'
import Icon from './Icon.vue'
import { store, api, toast } from '../store.js'
import { QUALITIES, SLOT_NAMES, STAT_NAMES, ENHANCE_MAX } from '@shared/data.js'
import { enhancedBase, enhanceCost, enhanceChance, recastCost, sellPrice, statText, itemPower, fmt } from '@shared/rules.js'

const props = defineProps({ itemId: String, shop: Object })
const emit = defineEmits(['close', 'buy'])

const item = computed(() => {
  if (props.shop) return props.shop.item
  const me = store.me
  return me.bag.find((x) => x.id === props.itemId) || Object.values(me.equip).find((x) => x?.id === props.itemId)
})
const equipped = computed(() => !props.shop && Object.values(store.me.equip).some((x) => x?.id === props.itemId))
const current = computed(() => item.value && store.me.equip[item.value.slot])
const powerDiff = computed(() => (item.value && current.value && !equipped.value ? itemPower(item.value) - itemPower(current.value) : null))
const mode = ref('info') // info | enhance | recast
const flash = ref('')
const recastIdx = ref(0)
const busy = ref(false)

async function run(path, body, after) {
  if (busy.value) return
  busy.value = true
  try {
    const r = await api(path, body)
    after?.(r.result)
  } catch { /* toast shown */ } finally { busy.value = false }
}
const equip = () => run('item/equip', { id: item.value.id }, () => { toast('Đã trang bị!', 'ok'); emit('close') })
const sell = () => run('item/sell', { ids: [item.value.id] }, (r) => { toast(`Bán được ${fmt(r.gold)} vàng`, 'ok'); emit('close') })
const lock = () => run('item/lock', { id: item.value.id })
function enhance() {
  run('item/enhance', { id: item.value.id }, (r) => {
    flash.value = r.ok ? 'ok' : 'fail'
    setTimeout(() => (flash.value = ''), 700)
    toast(r.ok ? `Cường hóa thành công +${r.e}!` : `Thất bại... (+${r.e})`, r.ok ? 'ok' : 'error')
  })
}
const recast = () => run('item/recast', { id: item.value.id, index: recastIdx.value }, () => toast('Tẩy luyện xong!', 'ok'))
</script>

<template>
  <div class="modal-bg" @click.self="emit('close')">
    <div v-if="item" class="panel modal" :class="flash">
      <div class="head">
        <div class="frame" :class="`f${item.q}`"><Icon :name="item.icon" :size="48" /></div>
        <div class="grow">
          <div class="name" :class="`q${item.q}`">{{ item.name }} <span v-if="item.e" class="plus">+{{ item.e }}</span></div>
          <div class="sub">[{{ QUALITIES[item.q].name }}] · {{ SLOT_NAMES[item.slot] }} · Lv{{ item.lv }}</div>
          <div v-if="powerDiff !== null" class="diff" :class="powerDiff >= 0 ? 'up' : 'down'">Lực chiến {{ powerDiff >= 0 ? '▲ +' : '▼ ' }}{{ fmt(powerDiff) }}</div>
          <div v-if="equipped" class="pill eq">Đang mặc</div>
        </div>
        <button class="x" @click="emit('close')">✕</button>
      </div>

      <div class="stats">
        <div class="lbl">Thuộc tính cơ bản</div>
        <div v-for="(b, i) in enhancedBase(item)" :key="'b' + i" class="st"><span>{{ STAT_NAMES[b.type] }}</span><b>{{ statText(b.type, b.value) }}</b></div>
        <div class="lbl">Thuộc tính phụ</div>
        <label v-for="(x, i) in item.extra" :key="'x' + i" class="st extra" :class="{ pick: mode === 'recast', sel: mode === 'recast' && recastIdx === i }">
          <input v-if="mode === 'recast'" v-model="recastIdx" type="radio" :value="i" />
          <span>{{ STAT_NAMES[x.type] }}</span><b class="q2">{{ statText(x.type, x.value) }}</b>
          <i v-if="x.roll != null" class="roll">{{ x.roll }}%</i>
        </label>
      </div>

      <template v-if="shop">
        <div class="row actions">
          <span class="pill">💰 {{ fmt(shop.price) }}</span><span class="grow" />
          <button class="btn green" :disabled="shop.sold" @click="emit('buy')">{{ shop.sold ? 'Đã bán' : 'Mua' }}</button>
        </div>
      </template>
      <template v-else-if="mode === 'enhance'">
        <div class="enh">
          <div class="big">+{{ item.e || 0 }} → +{{ Math.min(ENHANCE_MAX, (item.e || 0) + 1) }}</div>
          <div>Tỉ lệ thành công: <b>{{ Math.round(enhanceChance(item.e || 0) * 100) }}%</b></div>
          <div v-if="(item.e || 0) >= 5" class="sub">Thất bại từ +5 trở lên sẽ bị giảm 1 cấp</div>
          <div>Chi phí: <b>💰 {{ fmt(enhanceCost(item)) }}</b> (có {{ fmt(store.me.gold) }})</div>
        </div>
        <div class="row actions">
          <button class="btn gray sm" @click="mode = 'info'">Quay lại</button><span class="grow" />
          <button class="btn" :disabled="busy || (item.e || 0) >= ENHANCE_MAX || store.me.gold < enhanceCost(item)" @click="enhance">⚒ Cường hóa</button>
        </div>
      </template>
      <template v-else-if="mode === 'recast'">
        <div class="enh">Chọn 1 thuộc tính phụ để tẩy luyện lại ngẫu nhiên.<br />Chi phí: <b>💰 {{ fmt(recastCost(item)) }}</b></div>
        <div class="row actions">
          <button class="btn gray sm" @click="mode = 'info'">Quay lại</button><span class="grow" />
          <button class="btn blue" :disabled="busy || store.me.gold < recastCost(item)" @click="recast">🔮 Tẩy luyện</button>
        </div>
      </template>
      <template v-else>
        <div class="row actions wrap">
          <button v-if="!equipped" class="btn green" :disabled="busy" @click="equip">Trang bị</button>
          <button class="btn" @click="mode = 'enhance'">Cường hóa</button>
          <button class="btn blue" @click="mode = 'recast'">Tẩy luyện</button>
          <template v-if="!equipped">
            <button class="btn gray sm" @click="lock">{{ item.locked ? 'Mở khóa' : 'Khóa' }}</button>
            <button class="btn red sm" :disabled="item.locked || busy" @click="sell">Bán {{ fmt(sellPrice(item)) }}</button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.head { display: flex; gap: 10px; align-items: flex-start; }
.frame { width: 64px; height: 64px; border-radius: 16px; display: grid; place-items: center; border: 3px solid #fff; box-shadow: 0 3px 0 #0002; flex: none; }
.f0 { background: linear-gradient(#e9eef2, #9aa7b2) } .f1 { background: linear-gradient(#bff5c9, #3cc95a) } .f2 { background: linear-gradient(#ecd0ff, #a24bf0) }
.f3 { background: linear-gradient(#ffe0a8, #ff8a00) } .f4 { background: linear-gradient(#ffc2c2, #ff2d2d); box-shadow: 0 0 14px #ff3a3a }
.name { font-weight: 800; font-size: 18px; line-height: 1.15; }
.plus { color: #ff8a00; }
.diff { font-weight: 800; font-size: 13px; } .up { color: #1f9a3a } .down { color: #d8202e }
.eq { display: inline-block; margin-top: 2px; background: #e6ffe9; border-color: #3cc95a; }
.x { border: none; background: #ffe2c2; color: var(--ink); font-weight: 800; border-radius: 50%; width: 30px; height: 30px; flex: none; }
.stats { background: #fff; border-radius: 14px; padding: 8px 10px; margin: 10px 0; border: 2px solid #ffe2b8; }
.lbl { font-size: 12px; font-weight: 800; color: #c9781a; margin-top: 4px; }
.st { display: flex; justify-content: space-between; align-items: center; font-size: 14px; gap: 6px; padding: 1px 0; }
.st span { flex: 1; }
.extra.pick { border-radius: 8px; padding: 2px 4px; }
.extra.sel { background: #e8f5ff; }
.roll { font-size: 11px; color: #aaa; font-style: normal; width: 32px; text-align: right; }
.actions { justify-content: flex-end; margin-top: 4px; }
.wrap { flex-wrap: wrap; }
.enh { background: #fff3e0; border-radius: 14px; padding: 8px 10px; text-align: center; font-size: 14px; }
.big { font-size: 26px; font-weight: 800; color: #ff8a00; }
.ok { animation: okflash .7s; } .fail { animation: failflash .7s; }
@keyframes okflash { 30% { box-shadow: 0 0 40px #ffd34a, 0 0 0 6px #ffd34a; } }
@keyframes failflash { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
</style>
