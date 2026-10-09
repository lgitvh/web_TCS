<script setup>
// Gunny-style chibi "paper doll": big head, big shiny eyes, swappable hair,
// outfit, hat, glasses, wings and weapon. Faces right; `flip` mirrors it.
import { computed } from 'vue'
import { LOOK } from '@shared/data.js'

const props = defineProps({
  look: { type: Object, default: () => ({}) },
  worn: { type: Object, default: () => ({}) },
  weapon: { type: String, default: 'broadsword' }, // item icon name
  weaponQ: { type: Number, default: 0 },
  pose: { type: String, default: 'idle' }, // idle | run | attack | hit | win | ko
  size: { type: Number, default: 160 },
  flip: Boolean,
  head: Boolean, // crop to the face (for small portraits)
})

let uid = 0
const id = `av${++uid}${Math.random().toString(36).slice(2, 6)}`

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const c = (v) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`
}

const L = computed(() => {
  const l = props.look || {}
  const hair = LOOK.hairColor[l.hairColor ?? 0] || LOOK.hairColor[0]
  const outfit = LOOK.outfit[l.outfit ?? 0] || LOOK.outfit[0]
  const skin = LOOK.skin[l.skin ?? 0] || LOOK.skin[0]
  return {
    girl: l.gender === 'nu',
    style: l.hair ?? 0,
    hair, hairDark: shade(hair, -0.18), hairLight: shade(hair, 0.25),
    skin, skinDark: shade(skin, -0.12),
    eyes: LOOK.eyes[l.eyes ?? 0] || LOOK.eyes[0],
    outfit, outfitDark: shade(outfit, -0.2), outfitLight: shade(outfit, 0.2),
  }
})

const weaponKind = computed(() => ({
  'battle-axe': 'axe', 'crystal-wand': 'wand', 'mailed-fist': 'claw',
}[props.weapon] || 'sword'))
const glow = computed(() => ['#ffffff00', '#7dff8a', '#d68bff', '#ffb04a', '#ff4a4a'][props.weaponQ] || '#fff0')

const face = computed(() => {
  if (props.pose === 'hit' || props.pose === 'ko') return 'hurt'
  if (props.pose === 'win') return 'happy'
  if (props.pose === 'attack') return 'angry'
  return 'normal'
})
const EYE = [[88, 106], [126, 106]]
</script>

<template>
  <svg :width="size" :height="head ? size : size * 1.4" :viewBox="head ? '28 18 150 150' : '0 -40 200 280'" class="avatar" :class="[pose, { flip }]">
    <defs>
      <filter :id="`${id}g`" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" />
        <feFlood :flood-color="glow" />
        <feComposite in2="b" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient :id="`${id}fairy`" cx="30%" cy="30%">
        <stop offset="0" stop-color="#fff" stop-opacity=".95" />
        <stop offset="1" stop-color="#9ff3ff" stop-opacity=".55" />
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="228" rx="46" ry="8" fill="#0003" class="shadow" />
    <g class="body">
      <!-- wings -->
      <g v-if="worn.wings === 'wing_angel'" class="wings">
        <g v-for="s in [1, -1]" :key="s" :transform="`translate(100 0) scale(${s} 1) translate(-100 0)`">
          <path d="M92 165 C60 120 18 112 10 140 C24 140 26 150 18 160 C34 158 36 168 28 178 C44 174 48 184 44 194 C62 186 80 184 92 178 Z" fill="#fff" stroke="#9fd8ff" stroke-width="3" stroke-linejoin="round" />
          <path d="M84 166 C64 150 44 146 30 150 M82 174 C66 166 52 166 40 170" stroke="#bfe6ff" stroke-width="2.5" fill="none" stroke-linecap="round" />
        </g>
      </g>
      <g v-else-if="worn.wings === 'wing_devil'" class="wings">
        <g v-for="s in [1, -1]" :key="s" :transform="`translate(100 0) scale(${s} 1) translate(-100 0)`">
          <path d="M92 168 L40 116 L36 132 L14 128 L22 150 L6 160 L30 170 L26 186 L52 180 L92 182 Z" fill="#5b2a86" stroke="#2a103f" stroke-width="3" stroke-linejoin="round" />
          <path d="M90 170 L36 132 M90 174 L22 150 M90 178 L30 170" stroke="#8d4fc4" stroke-width="2" />
        </g>
      </g>
      <g v-else-if="worn.wings === 'wing_fairy'" class="wings">
        <g v-for="s in [1, -1]" :key="s" :transform="`translate(100 0) scale(${s} 1) translate(-100 0)`">
          <ellipse cx="58" cy="140" rx="36" ry="22" transform="rotate(-30 58 140)" :fill="`url(#${id}fairy)`" stroke="#7fdcff" stroke-width="2.5" />
          <ellipse cx="64" cy="184" rx="24" ry="14" transform="rotate(25 64 184)" :fill="`url(#${id}fairy)`" stroke="#7fdcff" stroke-width="2.5" />
        </g>
      </g>

      <!-- hair behind head -->
      <path v-if="L.style === 1" d="M44 90 Q38 168 56 178 L144 178 Q162 168 156 90 Z" :fill="L.hairDark" />
      <g v-if="L.style === 3" :fill="L.hair" :stroke="L.hairDark" stroke-width="3">
        <ellipse cx="34" cy="128" rx="16" ry="36" />
        <ellipse cx="166" cy="128" rx="16" ry="36" />
      </g>

      <!-- back arm -->
      <g class="arm-back">
        <rect x="60" y="154" width="15" height="34" rx="7.5" :fill="L.outfitDark" transform="rotate(18 67 158)" />
        <circle cx="58" cy="190" r="8" :fill="L.skinDark" />
      </g>

      <!-- legs & shoes -->
      <g>
        <rect x="83" y="194" width="14" height="26" rx="6" :fill="L.girl ? '#fff' : '#3d3f63'" stroke="#0002" />
        <rect x="103" y="194" width="14" height="26" rx="6" :fill="L.girl ? '#fff' : '#3d3f63'" stroke="#0002" />
        <ellipse cx="91" cy="222" rx="12" ry="7" fill="#6b3f22" />
        <ellipse cx="112" cy="222" rx="12" ry="7" fill="#6b3f22" />
      </g>

      <!-- torso -->
      <path d="M70 150 Q66 186 72 200 L128 200 Q134 186 130 150 Q100 140 70 150 Z" :fill="L.outfit" :stroke="L.outfitDark" stroke-width="3" />
      <path v-if="L.girl" d="M66 184 L134 184 L144 208 Q100 216 56 208 Z" :fill="L.outfitLight" :stroke="L.outfitDark" stroke-width="3" />
      <rect v-else x="70" y="186" width="60" height="8" rx="3" fill="#4a2c18" />
      <path d="M88 150 L100 166 L112 150" fill="#fff" stroke="#0002" stroke-width="2" />
      <circle cx="100" cy="176" r="4" fill="#ffd34a" stroke="#c9900a" stroke-width="1.5" />

      <!-- head -->
      <g class="head">
        <circle cx="46" cy="104" r="10" :fill="L.skinDark" />
        <circle cx="154" cy="104" r="10" :fill="L.skinDark" />
        <circle cx="100" cy="94" r="58" :fill="L.skin" :stroke="L.skinDark" stroke-width="3" />

        <!-- eyes -->
        <template v-if="face === 'hurt'">
          <path v-for="([x, y], i) in EYE" :key="i" :d="i ? `M${x + 9} ${y - 8} L${x - 7} ${y} L${x + 9} ${y + 8}` : `M${x - 9} ${y - 8} L${x + 7} ${y} L${x - 9} ${y + 8}`" stroke="#3a2a1a" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </template>
        <template v-else-if="face === 'happy'">
          <path v-for="([x, y], i) in EYE" :key="i" :d="`M${x - 9} ${y + 3} Q${x} ${y - 10} ${x + 9} ${y + 3}`" stroke="#3a2a1a" stroke-width="4.5" fill="none" stroke-linecap="round" />
        </template>
        <template v-else>
          <g v-for="([x, y], i) in EYE" :key="i">
            <ellipse :cx="x" :cy="y" rx="10" ry="13" fill="#2a1d14" />
            <ellipse :cx="x" :cy="y + 3" rx="7.5" ry="9" :fill="L.eyes" />
            <circle :cx="x + 3.5" :cy="y - 5" r="4.2" fill="#fff" />
            <circle :cx="x - 3" :cy="y + 5" r="2" fill="#fff" />
            <path v-if="L.girl" :d="i ? `M${x + 6} ${y - 10} l7 -5` : `M${x - 6} ${y - 10} l-7 -5`" stroke="#2a1d14" stroke-width="3" stroke-linecap="round" />
          </g>
          <g v-if="face === 'angry'" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round">
            <path d="M76 86 L96 92" /><path d="M136 86 L116 92" />
          </g>
        </template>
        <ellipse cx="76" cy="124" rx="9" ry="5" fill="#ff7b9c" opacity=".5" />
        <ellipse cx="140" cy="124" rx="9" ry="5" fill="#ff7b9c" opacity=".5" />

        <!-- mouth -->
        <path v-if="face === 'happy'" d="M98 124 Q108 140 118 124 Z" fill="#c0392b" stroke="#7a1f14" stroke-width="2" stroke-linejoin="round" />
        <ellipse v-else-if="face === 'hurt'" cx="108" cy="130" rx="5" ry="6" fill="#7a1f14" />
        <path v-else-if="face === 'angry'" d="M100 130 Q108 124 116 130" stroke="#7a1f14" stroke-width="3" fill="none" stroke-linecap="round" />
        <path v-else d="M101 126 Q108 133 115 126" stroke="#7a1f14" stroke-width="3" fill="none" stroke-linecap="round" />

        <!-- hair front -->
        <g :fill="L.hair" :stroke="L.hairDark" stroke-width="3" stroke-linejoin="round">
          <path v-if="L.style === 0" d="M40 100 Q34 36 100 30 Q166 36 160 100 L152 80 L142 94 L132 68 L116 88 L104 62 L90 86 L76 66 L66 90 L54 74 L48 98 Z" />
          <path v-else-if="L.style === 2" d="M38 104 Q34 28 100 28 Q166 28 162 104 Q160 86 150 82 L138 90 L124 80 L110 90 L96 80 L82 90 L68 80 L50 82 Q40 86 38 104 Z" />
          <path v-else d="M40 112 Q32 32 100 30 Q168 32 160 112 Q152 76 124 62 Q110 84 78 80 Q56 84 40 112 Z" />
          <path v-if="L.style === 2" d="M70 78 Q74 60 80 48 M100 78 L100 44 M128 78 Q124 60 118 48" fill="none" stroke-width="2.5" />
          <g v-if="L.style === 3">
            <circle cx="44" cy="62" r="13" fill="#ff5a8a" stroke="#c22a5a" />
            <circle cx="156" cy="62" r="13" fill="#ff5a8a" stroke="#c22a5a" />
          </g>
        </g>
        <path d="M64 50 Q90 34 120 40" stroke="#fff" stroke-opacity=".45" stroke-width="6" fill="none" stroke-linecap="round" />

        <!-- glasses -->
        <g v-if="worn.glasses === 'glass_round'" fill="#ffffff30" stroke="#2a2a2a" stroke-width="3.5">
          <circle cx="88" cy="106" r="16" /><circle cx="126" cy="106" r="16" />
          <path d="M104 104 L110 104" fill="none" />
        </g>
        <g v-else-if="worn.glasses === 'glass_star'" fill="#ff5ab480" stroke="#d6006e" stroke-width="3" stroke-linejoin="round">
          <path v-for="([x, y], i) in EYE" :key="i" :transform="`translate(${x} ${y})`" d="M0 -18 L5 -6 L18 -6 L8 2 L12 15 L0 7 L-12 15 L-8 2 L-18 -6 L-5 -6 Z" />
        </g>

        <!-- hats -->
        <g v-if="worn.hat === 'hat_crown'" stroke="#a86a00" stroke-width="3" stroke-linejoin="round">
          <path d="M64 46 L68 12 L84 30 L100 4 L116 30 L132 12 L136 46 Z" fill="#ffd34a" />
          <circle cx="100" cy="34" r="5" fill="#ff3a5a" /><circle cx="80" cy="38" r="3.5" fill="#3ab0ff" /><circle cx="120" cy="38" r="3.5" fill="#3ab0ff" />
        </g>
        <g v-else-if="worn.hat === 'hat_cat'" stroke="#c94f7c" stroke-width="3" stroke-linejoin="round">
          <path d="M50 42 L56 2 L80 26 Z M150 42 L144 2 L120 26 Z" fill="#ffb3cf" />
          <path d="M60 30 L60 14 L72 26 M140 30 L140 14 L128 26" fill="#ff7fa8" stroke="none" />
          <path d="M42 66 Q42 18 100 16 Q158 18 158 66 Q100 52 42 66 Z" fill="#ffb3cf" />
          <path d="M42 66 Q100 52 158 66" fill="none" stroke="#fff" stroke-width="7" />
        </g>
        <g v-else-if="worn.hat === 'hat_wizard'" stroke="#2c1a5e" stroke-width="3" stroke-linejoin="round">
          <path d="M58 46 L112 -32 L142 46 Z" fill="#6a3aff" />
          <ellipse cx="100" cy="46" rx="64" ry="11" fill="#5229d6" />
          <path d="M104 4 l4 9 l10 1 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -1 Z" fill="#ffd34a" stroke="#c99a00" stroke-width="1.5" />
        </g>
      </g>

      <!-- front arm + weapon -->
      <g class="arm-front">
        <g :filter="weaponQ ? `url(#${id}g)` : undefined" transform="translate(154 190) rotate(24) scale(1.2)">
          <g v-if="weaponKind === 'sword'">
            <path d="M-6 -8 L6 -8 L6 -66 L0 -80 L-6 -66 Z" fill="#eef6ff" stroke="#6a7a8c" stroke-width="2.5" stroke-linejoin="round" />
            <path d="M0 -12 L0 -66" stroke="#b9c9db" stroke-width="2" />
            <rect x="-16" y="-12" width="32" height="7" rx="3" fill="#ffc83a" stroke="#a86a00" stroke-width="2" />
            <rect x="-3.5" y="-5" width="7" height="18" rx="2" fill="#7a4a24" />
            <circle cx="0" cy="15" r="4.5" fill="#ffc83a" stroke="#a86a00" stroke-width="1.5" />
          </g>
          <g v-else-if="weaponKind === 'axe'">
            <rect x="-3.5" y="-64" width="7" height="82" rx="3" fill="#8a5428" stroke="#5a3418" stroke-width="2" />
            <path d="M3 -62 Q40 -72 36 -30 Q24 -40 3 -38 Z" fill="#dfe8f2" stroke="#5a6a7c" stroke-width="2.5" stroke-linejoin="round" />
            <path d="M-3 -58 L-16 -50 L-3 -44 Z" fill="#dfe8f2" stroke="#5a6a7c" stroke-width="2" />
          </g>
          <g v-else-if="weaponKind === 'wand'">
            <rect x="-3" y="-58" width="6" height="74" rx="3" fill="#8b5a2b" stroke="#5a3418" stroke-width="2" />
            <circle cx="0" cy="-64" r="11" fill="#7fe3ff" stroke="#2a8ab0" stroke-width="2.5" />
            <circle cx="-3" cy="-68" r="3.5" fill="#fff" />
          </g>
          <g v-else>
            <path v-for="dx in [-8, 0, 8]" :key="dx" :d="`M${dx - 3} -6 Q${dx - 6} -34 ${dx + 6} -48 Q${dx + 2} -30 ${dx + 4} -6 Z`" fill="#eef6ff" stroke="#6a7a8c" stroke-width="2" stroke-linejoin="round" />
            <rect x="-14" y="-8" width="28" height="12" rx="5" fill="#8a8fa0" stroke="#4a4f60" stroke-width="2" />
          </g>
        </g>
        <rect x="124" y="154" width="15" height="36" rx="7.5" :fill="L.outfit" :stroke="L.outfitDark" stroke-width="2.5" transform="rotate(-34 131 158)" />
        <circle cx="152" cy="190" r="8.5" :fill="L.skin" :stroke="L.skinDark" stroke-width="2" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.avatar { overflow: visible; display: block; }
.avatar.flip { transform: scaleX(-1); }
.body, .head, .arm-front, .wings { transform-box: view-box; }
.idle .body { animation: bob 1.4s ease-in-out infinite; transform-origin: 100px 225px; }
.idle .wings, .run .wings { animation: flap 1.4s ease-in-out infinite; transform-origin: 100px 165px; }
.run .body { animation: bob .36s ease-in-out infinite; transform-origin: 100px 225px; }
.attack .body { animation: lunge .5s ease-out; transform-origin: 100px 225px; }
.attack .arm-front { animation: swing .5s ease-out; transform-origin: 131px 160px; }
.hit .body { animation: shake .35s linear; }
.hit .head { filter: brightness(1.15) saturate(.6) hue-rotate(-20deg); }
.win .body { animation: hop .55s ease-in-out infinite; transform-origin: 100px 225px; }
.ko .body { transform: rotate(-22deg) translateY(8px); transform-origin: 100px 225px; transition: transform .4s; filter: grayscale(.5); }
@keyframes bob { 50% { transform: translateY(-4px) scaleY(1.01); } }
@keyframes flap { 50% { transform: scaleX(0.9); } }
@keyframes lunge { 30% { transform: translateX(26px) rotate(6deg); } 100% { transform: none; } }
@keyframes swing { 0% { transform: rotate(-40deg); } 35% { transform: rotate(70deg); } 100% { transform: none; } }
@keyframes shake { 25% { transform: translateX(-8px); } 50% { transform: translateX(6px); } 75% { transform: translateX(-4px); } }
@keyframes hop { 50% { transform: translateY(-16px); } }
</style>
