<script setup>
import { ref, computed } from 'vue'
import ItemSlot from '../components/ItemSlot.vue'
import ItemModal from '../components/ItemModal.vue'
import { store, api, toast } from '../store.js'
import { QUALITIES, BAG_SIZE } from '@shared/data.js'
import { fmt, itemPower } from '@shared/rules.js'

const me = computed(() => store.me)
const showItem = ref(null)
const sort = ref('new')
const items = computed(() => {
  const list = [...me.value.bag]
  if (sort.value === 'q') list.sort((a, b) => b.q - a.q || b.lv - a.lv)
  else if (sort.value === 'power') list.sort((a, b) => itemPower(b) - itemPower(a))
  else list.reverse()
  return list
})

async function sellUpTo(q) {
  if (!confirm(`Bán tất cả trang bị chưa khóa từ phẩm chất ${QUALITIES[q].name} trở xuống?`)) return
  try { const r = await api('item/sell-quality', { q }); toast(`Bán được ${fmt(r.result.gold)} vàng`, 'ok') } catch { /* toast */ }
}
async function toggleAuto(i) {
  const a = [...me.value.autoSell]
  a[i] = !a[i]
  try { await api('autosell', { autoSell: a }) } catch { /* toast */ }
}
</script>

<template>
  <div class="bag scroll">
    <div class="row">
      <div class="title grow" style="text-align:left;margin:0">Túi Đồ</div>
      <span class="pill">{{ me.bag.length }}/{{ BAG_SIZE }}</span>
    </div>
    <div class="row tabs">
      <button :class="{ on: sort === 'new' }" @click="sort = 'new'">Mới nhất</button>
      <button :class="{ on: sort === 'q' }" @click="sort = 'q'">Phẩm chất</button>
      <button :class="{ on: sort === 'power' }" @click="sort = 'power'">Lực chiến</button>
    </div>
    <div class="grid panel">
      <ItemSlot v-for="it in items" :key="it.id" :item="it" :size="60" @tap="showItem = it.id" />
      <ItemSlot v-for="n in Math.max(0, BAG_SIZE - items.length)" :key="'e' + n" :size="60" />
    </div>
    <div class="panel">
      <b>Bán nhanh</b>
      <div class="row wrap">
        <button v-for="q in [0, 1, 2]" :key="q" class="btn sm" :class="['gray', 'green', 'blue'][q]" @click="sellUpTo(q)">≤ {{ QUALITIES[q].name }}</button>
      </div>
      <b>Tự động bán khi nhặt</b>
      <div class="row wrap">
        <label v-for="q in [0, 1, 2, 3]" :key="q" class="chk" :class="`q${q}`"><input type="checkbox" :checked="me.autoSell[q]" @change="toggleAuto(q)" /> {{ QUALITIES[q].name }}</label>
      </div>
    </div>
    <ItemModal v-if="showItem" :item-id="showItem" @close="showItem = null" />
  </div>
</template>

<style scoped>
.bag { height: 100%; padding: 8px 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.tabs button { flex: 1; border: 3px solid #fff; border-radius: 12px; background: #ffffff99; font-weight: 800; color: #1a6fc0; padding: 3px; }
.tabs button.on { background: linear-gradient(#7fd0ff, #3aa8ff); color: #fff; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 7px; justify-items: center; background: #e9f7ff; }
.wrap { flex-wrap: wrap; margin: 4px 0 8px; }
.chk { font-weight: 800; display: flex; align-items: center; gap: 3px; background: #fff; border-radius: 10px; padding: 0 8px; border: 2px solid #eee; }
</style>
