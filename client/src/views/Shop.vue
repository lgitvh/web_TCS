<script setup>
import { ref, computed, onMounted } from 'vue'
import ItemSlot from '../components/ItemSlot.vue'
import ItemModal from '../components/ItemModal.vue'
import Avatar from '../components/Avatar.vue'
import { store, api, toast } from '../store.js'
import { FASHION, FASHION_SLOTS, STAT_NAMES, QUALITIES } from '@shared/data.js'
import { fmt, statText } from '@shared/rules.js'

const me = computed(() => store.me)
const tab = ref('gear')
const pick = ref(null)
const shop = computed(() => me.value.shop)

onMounted(() => api('shop').catch(() => {}))

async function refresh(paid) {
  try { await api('shop/refresh', { paid }) } catch { /* toast */ }
}
async function buy(i) {
  try { await api('shop/buy', { index: i }); toast('Đã mua! Xem trong Túi Đồ', 'ok'); pick.value = null } catch { /* toast */ }
}
async function buyFashion(f) {
  if (!confirm(`Mua ${f.name} với ${f.price} kim cương?`)) return
  try { await api('fashion/buy', { id: f.id }); toast(`Đã mua ${f.name}!`, 'ok') } catch { /* toast */ }
}
const preview = (f) => ({ ...me.value.fashion.worn, [f.slot]: f.id })
</script>

<template>
  <div class="shop scroll">
    <div class="title">Cửa Hàng</div>
    <div class="row tabs">
      <button :class="{ on: tab === 'gear' }" @click="tab = 'gear'">⚔ Trang bị</button>
      <button :class="{ on: tab === 'fashion' }" @click="tab = 'fashion'">👗 Thời trang</button>
    </div>

    <template v-if="tab === 'gear'">
      <div class="goods">
        <button v-for="(g, i) in shop.items" :key="g.item.id" class="good panel" :class="{ sold: g.sold }" @click="pick = i">
          <ItemSlot :item="g.item" :size="56" />
          <div class="gname" :class="`q${g.item.q}`">{{ g.item.name }}</div>
          <div class="price">💰 {{ fmt(g.price) }}</div>
          <div v-if="g.sold" class="soldtag">Đã bán</div>
        </button>
      </div>
      <div class="row center">
        <button class="btn blue" :disabled="shop.free < 1" @click="refresh(false)">⟳ Miễn phí ({{ shop.free }}/5)</button>
        <button class="btn" @click="refresh(true)">⟳ 10K vàng</button>
      </div>
      <div class="sub center white">Lượt miễn phí hồi 1 lần mỗi 10 phút</div>
    </template>

    <template v-else>
      <div class="fgrid">
        <div v-for="f in FASHION" :key="f.id" class="fcard panel">
          <Avatar :look="me.look" :worn="preview(f)" :weapon="me.equip.weapon?.icon" :size="74" />
          <div class="gname">{{ f.name }}</div>
          <div class="sub">{{ FASHION_SLOTS[f.slot] }} · <span v-for="(v, k) in f.bonus" :key="k">{{ STAT_NAMES[k] }} {{ statText(k, v) }} </span></div>
          <button v-if="me.fashion.owned.includes(f.id)" class="btn gray sm" disabled>Đã có</button>
          <button v-else class="btn sm" :class="me.gems >= f.price ? 'green' : 'gray'" @click="buyFashion(f)">💎 {{ f.price }}</button>
        </div>
      </div>
    </template>

    <ItemModal v-if="pick !== null && shop.items[pick]" :shop="shop.items[pick]" @close="pick = null" @buy="buy(pick)" />
  </div>
</template>

<style scoped>
.shop { height: 100%; padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.tabs button { flex: 1; border: 3px solid #fff; border-radius: 14px; background: #ffffff99; font-weight: 800; color: #b0661a; padding: 5px; font-size: 15px; }
.tabs button.on { background: linear-gradient(#ffb04a, #ff8a1a); color: #fff; }
.goods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.good { position: relative; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 4px; color: var(--ink); }
.good.sold { opacity: .5; }
.gname { font-weight: 800; font-size: 12px; text-align: center; line-height: 1.1; min-height: 26px; }
.price { font-weight: 800; font-size: 13px; }
.soldtag { position: absolute; top: 30%; background: #d8202e; color: #fff; font-weight: 800; transform: rotate(-15deg); padding: 0 8px; border-radius: 6px; }
.center { justify-content: center; text-align: center; }
.white { color: #fff; text-shadow: 0 1px 2px #0005; }
.fgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.fcard { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px; text-align: center; background: linear-gradient(#fff, #fff0f7); }
</style>
