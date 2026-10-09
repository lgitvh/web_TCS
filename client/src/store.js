import { reactive } from 'vue'
import { io } from 'socket.io-client'

const isNative = !!window.Capacitor?.isNativePlatform?.()

function lsGet(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
function lsSet(key, value) {
  try { value == null ? localStorage.removeItem(key) : localStorage.setItem(key, value) } catch { /* private mode */ }
}

// In the iOS app the game files are local, so we must know where the server is.
// In a browser served by the game server, same-origin ('') works.
const defaultServer = isNative ? 'http://localhost:3000' : ''

export const store = reactive({
  isNative,
  server: lsGet('server', defaultServer),
  token: lsGet('token', null),
  me: null,
  tab: 'dungeon',
  chat: [],
  online: 0,
  boss: null,
  toasts: [],
  busy: false,
})

let socket = null
let toastId = 0

export function toast(text, kind = 'info') {
  const id = ++toastId
  store.toasts.push({ id, text, kind })
  setTimeout(() => {
    const i = store.toasts.findIndex((t) => t.id === id)
    if (i >= 0) store.toasts.splice(i, 1)
  }, 2600)
}

export function setServer(url) {
  store.server = url.trim().replace(/\/+$/, '')
  lsSet('server', store.server)
}

export async function api(path, body = {}, { silent = false } = {}) {
  let res
  try {
    res = await fetch(`${store.server}/api/${path}`, {
      method: path === 'me' ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json', ...(store.token ? { Authorization: `Bearer ${store.token}` } : {}) },
      body: path === 'me' ? undefined : JSON.stringify(body),
    })
  } catch {
    if (!silent) toast('Không kết nối được máy chủ', 'error')
    throw new Error('network')
  }
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    logout()
    throw new Error('auth')
  }
  if (!res.ok) {
    if (!silent) toast(data.error || 'Có lỗi xảy ra', 'error')
    throw new Error(data.error || 'error')
  }
  if (data.me) store.me = data.me
  return data
}

export async function login(token) {
  store.token = token
  lsSet('token', token)
  await api('me')
  connect()
}

export function logout() {
  store.token = null
  store.me = null
  lsSet('token', null)
  socket?.disconnect()
  socket = null
}

function connect() {
  socket?.disconnect()
  socket = io(store.server || undefined, { auth: { token: store.token }, transports: ['websocket'] })
  socket.on('chat:history', (list) => { store.chat = list })
  socket.on('chat:msg', (m) => {
    store.chat.push(m)
    if (store.chat.length > 80) store.chat.shift()
  })
  socket.on('online', (n) => { store.online = n })
  socket.on('boss:update', (b) => { store.boss = b })
}

export function sendChat(text) {
  socket?.emit('chat:send', text)
}

export async function boot() {
  if (!store.token) return
  try {
    await api('me', {}, { silent: true })
    connect()
  } catch (e) {
    if (e.message !== 'auth') toast('Không kết nối được máy chủ', 'error')
  }
}
