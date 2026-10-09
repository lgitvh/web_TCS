<script setup>
import Icon from './Icon.vue'
import { QUALITIES } from '@shared/data.js'
const props = defineProps({ item: Object, size: { type: Number, default: 58 }, label: String })
defineEmits(['tap'])
const bg = ['linear-gradient(#e9eef2,#b9c3cc)', 'linear-gradient(#d9ffd9,#7fd88f)', 'linear-gradient(#f3dcff,#b77ef0)', 'linear-gradient(#ffe8c2,#ffad4a)', 'linear-gradient(#ffd6d6,#ff5a5a)']
</script>
<template>
  <button class="slot" :class="item ? `q${item.q}` : 'empty'" :style="{ width: `${size}px`, height: `${size}px`, background: item ? bg[item.q] : undefined, borderColor: item ? QUALITIES[item.q].color : undefined }" @click="$emit('tap', item)">
    <template v-if="item">
      <Icon :name="item.icon" color="#fff" :size="size * 0.62" class="shadowed" />
      <span v-if="item.e" class="plus">+{{ item.e }}</span>
      <span class="lv">Lv{{ item.lv }}</span>
      <span v-if="item.locked" class="lock">🔒</span>
    </template>
    <span v-else-if="label" class="label">{{ label }}</span>
  </button>
</template>
<style scoped>
.slot { position: relative; border: 3px solid #fff; border-radius: 14px; display: grid; place-items: center; padding: 0; box-shadow: 0 3px 0 #0002, inset 0 2px 0 #fff8; background: #ffffffaa; font-family: inherit; }
.slot.empty { border-style: dashed; border-color: #ffffffcc; background: #ffffff55; }
.q3 { box-shadow: 0 0 10px #ff9a2e, 0 3px 0 #0002; }
.q4 { box-shadow: 0 0 14px #ff3a3a, 0 3px 0 #0002; animation: pulse 1.6s infinite; }
@keyframes pulse { 50% { box-shadow: 0 0 22px #ff3a3a, 0 3px 0 #0002; } }
.shadowed { filter: drop-shadow(0 2px 0 #0005); }
.plus { position: absolute; top: -2px; right: 3px; font-weight: 800; font-size: 13px; color: #fff; text-shadow: 0 0 3px #c25e00, 0 1px 0 #c25e00; }
.lv { position: absolute; bottom: -1px; left: 4px; font-size: 10px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px #000a; }
.lock { position: absolute; top: 0; left: 2px; font-size: 10px; }
.label { font-size: 11px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px #0006; text-align: center; line-height: 1.1; }
</style>
