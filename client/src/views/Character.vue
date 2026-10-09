<script setup>
import { ref, reactive, computed } from 'vue'
import Avatar from '../components/Avatar.vue'
import ItemSlot from '../components/ItemSlot.vue'
import ItemModal from '../components/ItemModal.vue'
import { store, api, toast } from '../store.js'
import { SLOT_NAMES, FASHION, FASHION_SLOTS, REBIRTH_ATTRS } from '@shared/data.js'
import { fmt } from '@shared/rules.js'

const me = computed(() => store.me)
const st = computed(() => store.me.stats)
const showItem = ref(null)
const showRebirth = ref(false)
const alloc = reactive({})

const stats = computed(() => [
  ['Tấn công', fmt(st.value.ATK)], ['Phòng thủ', `${fmt(st.value.DEF)} (-${((1 - st.value.REDUC) * 100).toFixed(1)}%)`],
  ['Sinh lực', `${fmt(me.value.hpNow)}/${fmt(st.value.MAXHP)}`], ['Chặn', fmt(st.value.BLOC)],
  ['Bạo kích', `${st.value.CRIT}%`], ['ST bạo kích', `${st.value.CRITDMG}%`],
  ['DPS', fmt(st.value.DPS)], ['Vô Tận', me.value.endlessLv ? `Tầng ${me.value.endlessLv}` : 'Chưa mở'],
])
const owned = computed(() => FASHION.filter((f) => me.value.fashion.owned.includes(f.id)))
const spent = computed(() => Object.values(alloc).reduce((a, b) => a + (b || 0), 0))

async function wear(f) {
  const worn = me.value.fashion.worn[f.slot] === f.id
  try { await api('fashion/wear', { slot: f.slot, id: worn ? null : f.id }) } catch { /* toast */ }
}
async function doRebirth() {
  if (!confirm(`Luân hồi sẽ đặt lại cấp, vàng, trang bị và túi đồ. Bạn nhận ${me.value.rebirthGain} điểm luân hồi. Tiếp tục?`)) return
  try { const r = await api('rebirth'); toast(`Luân hồi thành công! +${r.result.gain} điểm`, 'ok') } catch { /* toast */ }
}
async function saveAlloc() {
  try {
    await api('rebirth/alloc', { alloc: { ...alloc } })
    for (const k in alloc) delete alloc[k]
    toast('Đã cộng điểm', 'ok')
  } catch { /* toast */ }
}
const step = (k, d) => {
  const v = (alloc[k] || 0) + d
  if (v < 0 || spent.value + d > me.value.rebirth.points) return
  alloc[k] = v
}
</script>

<template>
  <div class="char scroll">
    <div class="stage">
      <div class="power"><small>LỰC CHIẾN</small>{{ st.POWER.toLocaleString('vi-VN') }}</div>
      <div class="col left">
        <div v-for="s in ['weapon', 'armor']" :key="s" class="slotwrap"><ItemSlot :item="me.equip[s]" :label="SLOT_NAMES[s]" :size="62" @tap="me.equip[s] && (showItem = me.equip[s].id)" /><span>{{ SLOT_NAMES[s] }}</span></div>
      </div>
      <div class="hero">
        <div class="ring" />
        <Avatar :look="me.look" :worn="me.fashion.worn" :weapon="me.equip.weapon?.icon" :weapon-q="me.equip.weapon?.q" :size="150" />
        <div class="nameplate">{{ me.name }} <span>Lv{{ me.lv }}</span></div>
      </div>
      <div class="col right">
        <div v-for="s in ['ring', 'neck']" :key="s" class="slotwrap"><ItemSlot :item="me.equip[s]" :label="SLOT_NAMES[s]" :size="62" @tap="me.equip[s] && (showItem = me.equip[s].id)" /><span>{{ SLOT_NAMES[s] }}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="grid2">
        <div v-for="[k, v] in stats" :key="k" class="stat"><span>{{ k }}</span><b>{{ v }}</b></div>
      </div>
    </div>

    <div class="panel">
      <div class="row"><b class="grow">👗 Thời trang</b><span class="sub">Mua thêm ở Cửa Hàng</span></div>
      <div v-if="!owned.length" class="sub">Chưa có món thời trang nào.</div>
      <div class="fashion">
        <button v-for="f in owned" :key="f.id" class="fbtn" :class="{ on: me.fashion.worn[f.slot] === f.id }" @click="wear(f)">
          {{ f.name }}<small>{{ FASHION_SLOTS[f.slot] }}</small>
        </button>
      </div>
    </div>

    <div class="panel">
      <div class="row"><b class="grow">♻ Luân Hồi (lần {{ me.rebirth.count }})</b><span class="pill">Điểm: {{ me.rebirth.points }}</span></div>
      <div class="sub">Luân hồi bây giờ nhận: <b>{{ me.rebirthGain }}</b> điểm (cần Lv20+, trang bị Lv20+ cho thêm điểm)</div>
      <div class="row" style="margin-top:6px">
        <button class="btn blue sm" @click="showRebirth = true">Cộng điểm</button>
        <span class="grow" />
        <button class="btn red sm" :disabled="me.rebirthGain < 1" @click="doRebirth">Luân Hồi</button>
      </div>
    </div>

    <ItemModal v-if="showItem" :item-id="showItem" @close="showItem = null" />
    <div v-if="showRebirth" class="modal-bg" @click.self="showRebirth = false">
      <div class="panel modal">
        <div class="title">Cộng Điểm Luân Hồi</div>
        <div class="sub center">Còn {{ me.rebirth.points - spent }} điểm</div>
        <div v-for="(a, k) in REBIRTH_ATTRS" :key="k" class="ra">
          <span class="grow">{{ a.name }} <small class="sub">(+{{ a.per }}{{ a.pct ? '%' : a.unit || '' }}/điểm)</small></span>
          <b>{{ (me.rebirth.attrs[k] || 0) + (alloc[k] || 0) }}</b>
          <button class="btn gray sm" @click="step(k, -1)">−</button>
          <button class="btn sm" @click="step(k, 1)">+</button>
          <button class="btn sm" @click="step(k, 10)">+10</button>
        </div>
        <div class="row" style="justify-content:flex-end;margin-top:8px">
          <button class="btn gray" @click="showRebirth = false">Đóng</button>
          <button class="btn green" :disabled="!spent" @click="saveAlloc">Xác nhận</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.char { height: 100%; padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.stage { position: relative; display: flex; align-items: center; justify-content: space-between; padding-top: 52px; border-radius: 24px; background: radial-gradient(circle at 50% 60%, #fff 0, #ffffff00 55%), linear-gradient(#8fe3ff, #d8f6ff); border: 4px solid #fff; box-shadow: 0 5px 0 #0002; min-height: 300px; }
.power { position: absolute; top: 4px; left: 0; right: 0; text-align: center; font-weight: 800; font-size: 30px; line-height: 1; color: #fff; -webkit-text-stroke: 2px #d95f00; text-shadow: 0 3px 0 #d95f00; }
.power small { display: block; font-size: 12px; -webkit-text-stroke: 0; color: #d95f00; text-shadow: none; }
.col { display: flex; flex-direction: column; gap: 18px; padding: 8px; z-index: 1; }
.slotwrap { display: flex; flex-direction: column; align-items: center; font-size: 11px; font-weight: 800; color: #1a6fc0; }
.hero { position: relative; display: flex; flex-direction: column; align-items: center; }
.hero :deep(svg) { position: relative; z-index: 1; }
.ring { position: absolute; z-index: 0; bottom: 40px; width: 150px; height: 34px; border-radius: 50%; background: radial-gradient(#ffe57a, #ffb800 60%, #ffb80000 70%); opacity: .7; }
.nameplate { background: #fff; border-radius: 999px; padding: 0 12px; font-weight: 800; border: 3px solid #ffb84a; margin-top: -10px; white-space: nowrap; }
.nameplate span { color: #ff8a1a; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 14px; }
.stat { display: flex; justify-content: space-between; font-size: 14px; border-bottom: 1px dashed #ffd9a8; }
.fashion { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.fbtn { border: 3px solid #ffd9a8; background: #fff; border-radius: 14px; padding: 2px 10px; font-weight: 800; color: var(--ink); display: flex; flex-direction: column; line-height: 1.1; }
.fbtn small { font-size: 10px; color: #aaa; }
.fbtn.on { border-color: #3cc95a; background: #eaffee; }
.ra { display: flex; align-items: center; gap: 6px; padding: 3px 0; border-bottom: 1px dashed #ffd9a8; }
.ra b { width: 36px; text-align: right; }
.center { text-align: center; }
</style>
