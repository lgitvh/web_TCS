<script setup>
// Game-icons.net SVG used as a mask so it can be tinted any colour.
defineProps({ name: String, color: { type: String, default: '#fff' }, size: { type: [Number, String], default: 24 } })
</script>
<template>
  <span class="ico" :style="{ width: `${size}px`, height: `${size}px`, background: color, WebkitMaskImage: `url(icons/${name}.svg)`, maskImage: `url(icons/${name}.svg)` }" />
</template>
<style scoped>
.ico { display: inline-block; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; vertical-align: middle; flex: none; }
</style>
