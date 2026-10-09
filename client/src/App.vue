<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import Login from './views/Login.vue'
import Dungeons from './views/Dungeons.vue'
import Character from './views/Character.vue'
import Bag from './views/Bag.vue'
import Shop from './views/Shop.vue'
import World from './views/World.vue'
import Avatar from './components/Avatar.vue'
import Icon from './components/Icon.vue'
import { store, boot, api, toast, sendChat, logout } from './store.js'
import { fmt } from '@shared/rules.js'

const views = { dungeon: Dungeons, char: Character, bag: Bag, shop: Shop, world: World }
const nav = [
  ['dungeon', 'Phó Bản', 'castle'],
  ['char', 'Nhân Vật', 'swords-emblem'],
  ['bag', 'Túi Đồ', 'knapsack'],
  ['shop', 'Cửa Hàng', 'two-coins'],
  ['world', 'Thế Giới', 'dragon-spiral'],
]
const me = computed(() => store.me)
const chatOpen = ref(false)
const mailOpen = ref(false)
const chatText = ref('')
const chatBox = ref(null)
const last = computed(() => store.chat[store.chat.length - 1])

onMounted(boot)

async function daily() {
  try { const r = await api('daily'); toast(`Quà hằng ngày: +${r.result.gems} 💎, +${fmt(r.result.gold)} vàng`, 'ok') } catch { /* toast */ }
}
function send() {
  if (!chatText.value.trim()) return
  sendChat(chatText.value)
  chatText.value = ''
}
async function clearMail() {
  try { await api('mail/clear'); mailOpen.value = false } catch { /* toast */ }
}
watch(() => store.chat.length, async () => {
  await nextTick()
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
})
watch(chatOpen, async (o) => {
  await nextTick()
  if (o && chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
})
</script>

<template>
  <div class="shell">
    <Login v-if="!store.token || !me" />
    <template v-else>
      <header class="top">
        <div class="me" @click="store.tab = 'char'">
          <div class="face"><Avatar :look="me.look" :worn="{ ...me.fashion.worn, wings: undefined }" :size="40" head pose="none" /></div>
          <div class="who">
            <div class="nm">{{ me.name }}</div>
            <div class="lv">Lv {{ me.lv }} · ⚡{{ fmt(me.stats.POWER) }}</div>
          </div>
        </div>
        <div class="res"><Icon name="two-coins" color="#ffb800" :size="18" />{{ fmt(me.gold) }}</div>
        <div class="res"><Icon name="cut-diamond" color="#3aa8ff" :size="18" />{{ fmt(me.gems) }}</div>
      </header>

      <div class="side">
        <button v-if="!me.daily.claimed" class="round gold bounce" @click="daily"><Icon name="open-treasure-chest" color="#fff" :size="28" /><span>Quà ngày</span></button>
        <button v-if="me.mail?.length" class="round blue bounce" @click="mailOpen = true"><Icon name="scroll-unfurled" color="#fff" :size="28" /><span>Thư ({{ me.mail.length }})</span></button>
      </div>

      <main class="content">
        <component :is="views[store.tab]" />
      </main>

      <button class="ticker" @click="chatOpen = true">
        <span class="online">● {{ store.online }}</span>
        <span v-if="last" class="tk chat-html"><b :class="{ sys: last.kind === 'system' }">{{ last.kind === 'system' ? 'HỆ THỐNG' : last.name }}:</b>
          <span v-if="last.kind === 'system'" v-html="last.text" /><span v-else> {{ last.text }}</span></span>
        <span v-else class="tk">Chạm để trò chuyện...</span>
      </button>

      <nav class="nav">
        <button v-for="[k, n, ic] in nav" :key="k" :class="{ on: store.tab === k }" @click="store.tab = k">
          <Icon :name="ic" :color="store.tab === k ? '#7a3b00' : '#1a6fc0'" :size="26" /><span>{{ n }}</span>
        </button>
      </nav>

      <div v-if="chatOpen" class="modal-bg" @click.self="chatOpen = false">
        <div class="panel chat">
          <div class="row"><b class="grow">💬 Kênh Thế Giới · {{ store.online }} online</b><button class="btn gray sm" @click="chatOpen = false">✕</button></div>
          <div ref="chatBox" class="msgs scroll">
            <div v-for="(m, i) in store.chat" :key="i" class="msg chat-html" :class="m.kind">
              <template v-if="m.kind === 'system'"><b class="sys">HỆ THỐNG:</b> <span v-html="m.text" /></template>
              <template v-else><b>{{ m.name }}:</b> {{ m.text }}</template>
            </div>
          </div>
          <form class="row" @submit.prevent="send">
            <input v-model="chatText" class="grow" maxlength="120" placeholder="Nhập tin nhắn..." />
            <button class="btn sm">Gửi</button>
          </form>
          <button class="logout" @click="logout">Đăng xuất</button>
        </div>
      </div>

      <div v-if="mailOpen" class="modal-bg" @click.self="mailOpen = false">
        <div class="panel modal">
          <div class="title">Hòm Thư</div>
          <div v-for="(m, i) in me.mail" :key="i" class="mail">{{ m.text }}</div>
          <div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn green" @click="clearMail">Đã đọc</button></div>
        </div>
      </div>
    </template>

    <div class="toasts">
      <div v-for="t in store.toasts" :key="t.id" class="toast" :class="t.kind">{{ t.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.shell { position: relative; height: 100%; max-width: 520px; margin: 0 auto; display: flex; flex-direction: column; overflow: hidden;
  background: radial-gradient(circle at 20% 0%, #ffffffaa 0, #ffffff00 40%), linear-gradient(#5fc2ff, #a8e2ff 60%, #d6f3ff); }
.top { display: flex; align-items: center; gap: 6px; padding: calc(6px + var(--safe-top)) 8px 8px; background: linear-gradient(#ffa63a, #ff7a00); border-radius: 0 0 20px 20px; border-bottom: 4px solid #fff; box-shadow: 0 4px 0 #d95f00, 0 6px 12px #0003; z-index: 2; }
.me { display: flex; align-items: center; gap: 4px; flex: 1; min-width: 0; }
.face { width: 46px; height: 46px; border-radius: 50%; background: #fff; border: 3px solid #fff; overflow: hidden; display: grid; place-items: center; box-shadow: 0 2px 0 #d95f00; flex: none; background: linear-gradient(#bfeaff, #fff); }
.who { min-width: 0; }
.nm { font-weight: 800; color: #fff; text-shadow: 0 2px 0 #c25000; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lv { font-size: 12px; font-weight: 800; color: #fff2c2; }
.res { display: flex; align-items: center; gap: 3px; background: #fff; border-radius: 999px; padding: 1px 8px 1px 4px; font-weight: 800; font-size: 14px; border: 2px solid #ffd27a; }
.side { position: absolute; right: 10px; bottom: calc(150px + var(--safe-bottom)); display: flex; flex-direction: column; gap: 8px; z-index: 5; }
.round { width: 58px; height: 58px; border-radius: 50%; border: 3px solid #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; font-weight: 800; color: #fff; text-shadow: 0 1px 0 #0005; padding: 0; }
.round.gold { background: linear-gradient(#ffd34a, #ff9a00); box-shadow: 0 3px 0 #c27000; }
.round.blue { background: linear-gradient(#7fd0ff, #3aa8ff); box-shadow: 0 3px 0 #1a6fc0; }
.bounce { animation: bounce 1.2s infinite; }
@keyframes bounce { 50% { transform: translateY(-5px) rotate(-4deg); } }
.content { flex: 1; min-height: 0; position: relative; }
.ticker { margin: 0 8px 6px; border: 3px solid #8fd3ff; background: #fffffff2; border-radius: 16px; padding: 3px 10px; font-size: 12px; text-align: left; display: flex; gap: 6px; align-items: center; box-shadow: 0 3px 0 #3a9be0; color: #444; }
.online { color: #2fbf3a; font-weight: 800; flex: none; }
.tk { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sys { color: #ff6a00 !important; }
.nav { display: flex; justify-content: space-around; gap: 4px; padding: 6px 6px calc(6px + var(--safe-bottom)); background: linear-gradient(#4fc3ff, #1a7fd6); border-top: 4px solid #fff; border-radius: 20px 20px 0 0; }
.nav button { flex: 1; display: flex; flex-direction: column; align-items: center; border: 3px solid #fff; border-radius: 16px; background: linear-gradient(#fff, #d8f0ff); box-shadow: inset 0 -3px 0 #9cc9ec, 0 3px 0 #0d5fa8; padding: 4px 0 2px; font-weight: 800; font-size: 11px; color: #1a6fc0; transition: transform .1s; }
.nav button.on { background: linear-gradient(#ffe066, #ff9d00); color: #7a3b00; transform: translateY(-6px); box-shadow: inset 0 -3px 0 #d98200, 0 3px 0 #a85a00; }
.chat { width: min(420px, 100%); height: min(560px, 80vh); display: flex; flex-direction: column; gap: 6px; }
.msgs { flex: 1; background: #fff; border-radius: 14px; padding: 6px 8px; border: 2px solid #ffe2b8; }
.msg { font-size: 13px; padding: 2px 0; border-bottom: 1px dashed #f2e2cc; }
.msg b { color: #1a6fc0; }
.msg.system { background: #fff6e0; }
.chat input { border: 3px solid #ffd9a8; border-radius: 12px; padding: 6px 10px; font-size: 15px; outline: none; }
.logout { border: none; background: none; color: #aaa; font-size: 12px; text-decoration: underline; }
.mail { background: #fff; border-radius: 12px; padding: 6px 10px; margin: 4px 0; font-size: 14px; border: 2px solid #ffe2b8; }
.toasts { position: fixed; top: calc(80px + var(--safe-top)); left: 0; right: 0; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; z-index: 100; }
.toast { background: #fff; border: 3px solid #3aa8ff; border-radius: 16px; padding: 4px 14px; font-weight: 800; box-shadow: 0 4px 0 #0002; animation: pop .25s; max-width: 90%; text-align: center; }
.toast.ok { border-color: #3cc95a; color: #1f8a36; }
.toast.error { border-color: #ff4a5a; color: #b8202e; }
@keyframes pop { from { transform: scale(.6); opacity: 0; } }
</style>
