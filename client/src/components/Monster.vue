<script setup>
// Cute cartoon monsters (faces left, toward the hero). Bosses get a crown and angry brows.
import { computed } from 'vue'

const props = defineProps({
  kind: { type: String, default: 'slime' },
  color: { type: String, default: '#5fd36b' },
  boss: Boolean,
  state: { type: String, default: 'idle' }, // idle | attack | hit | dead
  size: { type: Number, default: 140 },
})

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`
}
const C = computed(() => ({ base: props.color, dark: shade(props.color, -0.25), light: shade(props.color, 0.3) }))
const hurt = computed(() => props.state === 'hit' || props.state === 'dead')
// Eye positions per kind (monster faces left).
const eyes = computed(() => ({
  slime: [[78, 120], [112, 120]], mushroom: [[82, 150], [110, 150]], bat: [[84, 104], [114, 104]],
  ghost: [[78, 96], [110, 96]], dragon: [[72, 92], [100, 88]],
}[props.kind] || [[80, 110], [110, 110]]))
const mouth = computed(() => {
  const [[x1, y1], [x2]] = eyes.value
  return { x: (x1 + x2) / 2, y: y1 + 20 }
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 200 200" class="mon" :class="[state, kind]">
    <ellipse cx="100" cy="190" rx="58" ry="9" fill="#0003" />
    <g class="mbody">
      <!-- slime -->
      <g v-if="kind === 'slime'">
        <path d="M30 180 Q22 120 70 84 Q100 60 130 84 Q178 120 170 180 Z" :fill="C.base" :stroke="C.dark" stroke-width="5" stroke-linejoin="round" />
        <ellipse cx="72" cy="104" rx="16" ry="10" fill="#fff" opacity=".55" transform="rotate(-30 72 104)" />
      </g>
      <!-- mushroom -->
      <g v-else-if="kind === 'mushroom'">
        <path d="M66 126 Q60 180 72 184 L128 184 Q140 180 134 126 Z" fill="#fff1d6" stroke="#c9a77a" stroke-width="5" />
        <path d="M18 128 Q20 50 100 46 Q180 50 182 128 Q100 112 18 128 Z" :fill="C.base" :stroke="C.dark" stroke-width="5" stroke-linejoin="round" />
        <circle cx="70" cy="80" r="11" fill="#fff" /><circle cx="122" cy="70" r="14" fill="#fff" /><circle cx="152" cy="104" r="8" fill="#fff" /><circle cx="44" cy="110" r="7" fill="#fff" />
      </g>
      <!-- bat -->
      <g v-else-if="kind === 'bat'" class="flap">
        <path d="M70 100 L14 64 L22 90 L4 98 L26 116 L20 136 L70 124 Z" :fill="C.dark" :stroke="C.dark" stroke-width="4" stroke-linejoin="round" />
        <path d="M130 100 L186 64 L178 90 L196 98 L174 116 L180 136 L130 124 Z" :fill="C.dark" :stroke="C.dark" stroke-width="4" stroke-linejoin="round" />
        <path d="M70 62 L74 34 L90 56 M130 62 L126 34 L110 56" :fill="C.base" :stroke="C.dark" stroke-width="4" stroke-linejoin="round" />
        <circle cx="100" cy="110" r="50" :fill="C.base" :stroke="C.dark" stroke-width="5" />
        <ellipse cx="100" cy="132" rx="24" ry="18" :fill="C.light" />
      </g>
      <!-- ghost -->
      <g v-else-if="kind === 'ghost'">
        <path d="M40 176 L40 100 Q40 40 100 40 Q160 40 160 100 L160 176 L140 160 L120 178 L100 160 L80 178 L60 160 Z" :fill="C.base" :stroke="C.dark" stroke-width="5" stroke-linejoin="round" opacity=".95" />
        <path d="M40 120 Q20 110 22 92 M160 120 Q180 110 178 92" :stroke="C.dark" stroke-width="5" fill="none" stroke-linecap="round" />
      </g>
      <!-- dragon -->
      <g v-else>
        <path d="M150 150 Q196 150 190 110 Q180 136 150 130 Z" :fill="C.base" :stroke="C.dark" stroke-width="5" stroke-linejoin="round" />
        <path d="M120 96 L170 60 L162 92 L182 100 L136 120 Z" :fill="C.light" :stroke="C.dark" stroke-width="4" stroke-linejoin="round" />
        <ellipse cx="108" cy="140" rx="56" ry="48" :fill="C.base" :stroke="C.dark" stroke-width="5" />
        <ellipse cx="96" cy="152" rx="32" ry="30" fill="#ffe7a8" />
        <circle cx="86" cy="94" r="44" :fill="C.base" :stroke="C.dark" stroke-width="5" />
        <path d="M64 58 L56 26 L80 52 M104 54 L116 22 L118 56" fill="#fff1c2" stroke="#b08a3a" stroke-width="4" stroke-linejoin="round" />
        <ellipse cx="54" cy="112" rx="18" ry="13" :fill="C.light" :stroke="C.dark" stroke-width="4" />
        <circle cx="48" cy="110" r="2.5" :fill="C.dark" />
        <ellipse cx="80" cy="186" rx="14" ry="8" :fill="C.dark" /><ellipse cx="132" cy="186" rx="14" ry="8" :fill="C.dark" />
      </g>

      <!-- face -->
      <g v-if="hurt">
        <path v-for="([x, y], i) in eyes" :key="i" :d="`M${x - 8} ${y - 8} L${x + 8} ${y + 8} M${x + 8} ${y - 8} L${x - 8} ${y + 8}`" stroke="#2a1d14" stroke-width="5" stroke-linecap="round" />
      </g>
      <g v-else>
        <g v-for="([x, y], i) in eyes" :key="i">
          <ellipse :cx="x" :cy="y" rx="10" ry="12" fill="#fff" stroke="#2a1d14" stroke-width="3" />
          <circle :cx="x - 3" :cy="y + 2" r="6" fill="#2a1d14" />
          <circle :cx="x - 5" :cy="y - 1" r="2.2" fill="#fff" />
        </g>
        <g v-if="boss" stroke="#2a1d14" stroke-width="5" stroke-linecap="round">
          <path :d="`M${eyes[0][0] - 12} ${eyes[0][1] - 20} L${eyes[0][0] + 8} ${eyes[0][1] - 12}`" />
          <path :d="`M${eyes[1][0] + 12} ${eyes[1][1] - 20} L${eyes[1][0] - 8} ${eyes[1][1] - 12}`" />
        </g>
      </g>
      <path v-if="kind === 'bat' || kind === 'dragon'" :d="`M${mouth.x - 14} ${mouth.y} Q${mouth.x} ${mouth.y + 12} ${mouth.x + 14} ${mouth.y} M${mouth.x - 8} ${mouth.y + 3} l3 8 l3 -7 M${mouth.x + 4} ${mouth.y + 4} l3 7 l3 -8`" stroke="#2a1d14" stroke-width="3.5" fill="#fff" stroke-linejoin="round" />
      <path v-else-if="kind === 'ghost'" :d="`M${mouth.x - 10} ${mouth.y} Q${mouth.x} ${mouth.y + 18} ${mouth.x + 10} ${mouth.y} Z`" fill="#ff6a8a" stroke="#2a1d14" stroke-width="3.5" stroke-linejoin="round" />
      <path v-else :d="`M${mouth.x - 9} ${mouth.y} Q${mouth.x} ${mouth.y + (hurt ? -6 : 9)} ${mouth.x + 9} ${mouth.y}`" stroke="#2a1d14" stroke-width="4" fill="none" stroke-linecap="round" />
      <ellipse :cx="eyes[0][0] - 10" :cy="eyes[0][1] + 16" rx="7" ry="4" fill="#ff7b9c" opacity=".5" />
      <ellipse :cx="eyes[1][0] + 10" :cy="eyes[1][1] + 16" rx="7" ry="4" fill="#ff7b9c" opacity=".5" />

      <!-- boss crown -->
      <g v-if="boss" :transform="`translate(${kind === 'mushroom' ? 100 : kind === 'dragon' ? 86 : 100} ${kind === 'mushroom' ? 44 : kind === 'dragon' ? 48 : kind === 'slime' ? 66 : 42})`" stroke="#a86a00" stroke-width="3" stroke-linejoin="round">
        <path d="M-26 4 L-30 -26 L-14 -10 L0 -34 L14 -10 L30 -26 L26 4 Z" fill="#ffd34a" />
        <circle cx="0" cy="-8" r="5" fill="#ff3a5a" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.mon { overflow: visible; display: block; }
.mbody { transform-box: view-box; transform-origin: 100px 186px; }
.idle .mbody { animation: squish 1.1s ease-in-out infinite; }
.bat.idle .mbody, .ghost.idle .mbody { animation: float 1.4s ease-in-out infinite; }
.attack .mbody { animation: pounce .45s ease-out; }
.hit .mbody { animation: knock .3s linear; filter: brightness(1.6); }
.dead .mbody { animation: poof .5s ease-in forwards; }
@keyframes squish { 50% { transform: scale(1.05, .94); } }
@keyframes float { 50% { transform: translateY(-10px); } }
@keyframes pounce { 35% { transform: translateX(-30px) scale(1.08, .92); } }
@keyframes knock { 30% { transform: translateX(14px) rotate(6deg); } 70% { transform: translateX(-4px); } }
@keyframes poof { to { transform: scale(1.4, 0.1) translateY(60px); opacity: 0; } }
</style>
