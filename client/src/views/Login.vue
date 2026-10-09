<script setup>
import { reactive, ref } from 'vue'
import Avatar from '../components/Avatar.vue'
import { store, api, login, setServer, toast } from '../store.js'
import { LOOK, GAME_NAME } from '@shared/data.js'

const mode = ref('login')
const f = reactive({ username: '', password: '', name: '' })
const look = reactive({ gender: 'nam', hair: 0, hairColor: 0, skin: 0, eyes: 0, outfit: 0 })
const showServer = ref(false)
const serverInput = ref(store.server)
const busy = ref(false)

const cycle = (key) => { look[key] = (look[key] + 1) % LOOK[key].length }

async function submit() {
  busy.value = true
  try {
    const r = mode.value === 'login'
      ? await api('login', { username: f.username, password: f.password })
      : await api('register', { ...f, look })
    await login(r.token)
  } catch { /* toast shown */ } finally { busy.value = false }
}

async function saveServer() {
  setServer(serverInput.value)
  try {
    const r = await fetch(`${store.server}/api/health`).then((x) => x.json())
    toast(`Đã kết nối: ${r.name}`, 'ok')
    showServer.value = false
  } catch {
    toast('Không kết nối được máy chủ này', 'error')
  }
}
</script>

<template>
  <div class="login">
    <div class="logo">
      <div class="logo-text">{{ GAME_NAME }}</div>
      <div class="tag">Nhập vai treo máy · Săn trang bị</div>
    </div>

    <div class="panel box">
      <div class="tabs">
        <button :class="{ on: mode === 'login' }" @click="mode = 'login'">Đăng nhập</button>
        <button :class="{ on: mode === 'register' }" @click="mode = 'register'">Tạo nhân vật</button>
      </div>

      <div v-if="mode === 'register'" class="creator">
        <Avatar :look="look" :size="120" pose="idle" />
        <div class="opts">
          <div class="opt"><span>Giới tính</span>
            <button class="btn sm" :class="look.gender === 'nam' ? 'blue' : 'gray'" @click="look.gender = 'nam'">Nam</button>
            <button class="btn sm" :class="look.gender === 'nu' ? 'red' : 'gray'" @click="look.gender = 'nu'">Nữ</button>
          </div>
          <div class="opt"><span>Kiểu tóc</span><button class="btn sm" @click="cycle('hair')">Kiểu {{ look.hair + 1 }} ▸</button></div>
          <div class="opt"><span>Màu tóc</span><i v-for="(c, i) in LOOK.hairColor" :key="c" class="dot" :class="{ on: look.hairColor === i }" :style="{ background: c }" @click="look.hairColor = i" /></div>
          <div class="opt"><span>Da</span><i v-for="(c, i) in LOOK.skin" :key="c" class="dot" :class="{ on: look.skin === i }" :style="{ background: c }" @click="look.skin = i" /></div>
          <div class="opt"><span>Mắt</span><i v-for="(c, i) in LOOK.eyes" :key="c" class="dot" :class="{ on: look.eyes === i }" :style="{ background: c }" @click="look.eyes = i" /></div>
          <div class="opt"><span>Áo</span><i v-for="(c, i) in LOOK.outfit" :key="c" class="dot" :class="{ on: look.outfit === i }" :style="{ background: c }" @click="look.outfit = i" /></div>
        </div>
      </div>

      <form @submit.prevent="submit">
        <input v-if="mode === 'register'" v-model="f.name" placeholder="Tên nhân vật" maxlength="16" />
        <input v-model="f.username" placeholder="Tên đăng nhập" autocapitalize="off" autocomplete="username" />
        <input v-model="f.password" type="password" placeholder="Mật khẩu" autocomplete="current-password" />
        <button class="btn big" :disabled="busy">{{ mode === 'login' ? 'Vào Game' : 'Tạo & Vào Game' }}</button>
      </form>
    </div>

    <button class="server-btn" @click="showServer = !showServer">⚙ Máy chủ: {{ store.server || 'mặc định' }}</button>
    <div v-if="showServer" class="panel server">
      <div class="sub">Địa chỉ máy chủ game (ví dụ http://192.168.1.10:3000)</div>
      <input v-model="serverInput" placeholder="http://localhost:3000" autocapitalize="off" />
      <button class="btn blue sm" @click="saveServer">Lưu & kiểm tra</button>
    </div>
  </div>
</template>

<style scoped>
.login { height: 100%; overflow-y: auto; padding: calc(24px + var(--safe-top)) 16px 24px; background: radial-gradient(circle at 30% 10%, #fff 0, #bfeaff 30%, #5fc2ff 75%); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.logo { text-align: center; margin-top: 6px; }
.logo-text { font-size: 38px; font-weight: 800; line-height: 1; color: #fff; -webkit-text-stroke: 2px #d95f00; text-shadow: 0 4px 0 #d95f00, 0 6px 12px #0004; background: linear-gradient(#fffbe0, #ffd000 50%, #ff8a00); -webkit-background-clip: text; background-clip: text; }
.tag { font-weight: 800; color: #1a6fc0; background: #fff; display: inline-block; border-radius: 999px; padding: 0 12px; margin-top: 6px; border: 2px solid #8fd3ff; }
.box { width: min(400px, 100%); }
.tabs { display: flex; gap: 6px; margin-bottom: 10px; }
.tabs button { flex: 1; border: none; border-radius: 12px; padding: 8px; font-weight: 800; font-size: 15px; background: #ffe9cc; color: #b0661a; }
.tabs button.on { background: linear-gradient(#ffb04a, #ff8a1a); color: #fff; box-shadow: 0 3px 0 #d95f00; }
.creator { display: flex; gap: 6px; align-items: center; background: linear-gradient(#e8f8ff, #fff); border-radius: 16px; padding: 6px; margin-bottom: 8px; }
.opts { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.opt { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; font-size: 13px; font-weight: 700; }
.opt > span { width: 52px; }
.dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #0003; display: inline-block; }
.dot.on { box-shadow: 0 0 0 3px #ff8a1a; }
form { display: flex; flex-direction: column; gap: 8px; }
input { border: 3px solid #ffd9a8; border-radius: 14px; padding: 9px 12px; font-size: 16px; outline: none; background: #fff; color: var(--ink); }
input:focus { border-color: #ff8a1a; }
.big { font-size: 20px; padding: 8px; }
.server-btn { border: none; background: #ffffffaa; border-radius: 999px; padding: 3px 12px; font-size: 12px; font-weight: 700; color: #1a6fc0; }
.server { width: min(400px, 100%); display: flex; flex-direction: column; gap: 6px; }
</style>
