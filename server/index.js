import express from 'express'
import { createServer } from 'node:http'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync } from 'node:fs'
import { Server } from 'socket.io'
import { db } from './db.js'
import { load, save, newState, tick, view, cleanLook } from './players.js'
import * as A from './actions.js'
import * as S from './social.js'
import { GAME_NAME } from '../shared/data.js'

const PORT = Number(process.env.PORT) || 3000
const app = express()
const http = createServer(app)
// The iOS app runs from capacitor://localhost, so allow any origin. Auth uses a bearer token, not cookies.
const io = new Server(http, { cors: { origin: '*' } })

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.json({ limit: '32kb' }))

// ---------- helpers ----------

const hash = (pw, salt = randomBytes(16).toString('hex')) => `${salt}:${scryptSync(pw, salt, 32).toString('hex')}`
function checkPw(pw, stored) {
  if (!stored) return false
  const [salt, h] = stored.split(':')
  return timingSafeEqual(Buffer.from(h, 'hex'), scryptSync(pw, salt, 32))
}
function newSession(uid) {
  const token = randomBytes(24).toString('hex')
  db.prepare('INSERT INTO sessions (token, user_id, created) VALUES (?, ?, ?)').run(token, uid, Date.now())
  return token
}
function userFromToken(token) {
  if (!token) return null
  return db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token)?.user_id ?? null
}

function announce(name, html) {
  const msg = { kind: 'system', name, text: html, ts: Date.now() }
  db.prepare('INSERT INTO chat (user_id, name, text, kind, ts) VALUES (0, ?, ?, ?, ?)').run(name, html, 'system', msg.ts)
  io.emit('chat:msg', msg)
}

// Wrap an authenticated action: load state, run, save, reply with the fresh view.
function act(fn) {
  return (req, res) => {
    const uid = userFromToken((req.get('Authorization') || '').replace('Bearer ', ''))
    if (!uid) return res.status(401).json({ error: 'Phiên đăng nhập hết hạn' })
    const state = load(uid)
    tick(state)
    const before = JSON.stringify(state)
    try {
      const result = fn(state, req.body || {}, uid, req) ?? null
      save(uid, state)
      res.json({ result, me: view(uid, state) })
    } catch (e) {
      // Restore the state on failure so partial changes never stick.
      Object.assign(state, JSON.parse(before))
      if (e instanceof A.GameError) return res.status(400).json({ error: e.message })
      console.error(e)
      res.status(500).json({ error: 'Lỗi máy chủ' })
    }
  }
}

const sysAnnounce = (state) => (html) => announce(state.name, `<b>${state.name}</b> ${html}`)

// ---------- auth ----------

app.post('/api/register', (req, res) => {
  const { username, password, name, look } = req.body || {}
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username || '')) return res.status(400).json({ error: 'Tên đăng nhập 3-20 ký tự (chữ, số, _)' })
  if (typeof password !== 'string' || password.length < 4 || password.length > 64) return res.status(400).json({ error: 'Mật khẩu tối thiểu 4 ký tự' })
  const nick = String(name || '').trim().replace(/\s+/g, ' ')
  if (!/^[\p{L}\p{N} ]{2,16}$/u.test(nick)) return res.status(400).json({ error: 'Tên nhân vật 2-16 ký tự (chữ, số)' })
  if (db.prepare('SELECT 1 FROM users WHERE username = ? OR name = ?').get(username, nick)) return res.status(400).json({ error: 'Tên đăng nhập hoặc tên nhân vật đã tồn tại' })
  const state = newState(nick, look)
  const info = db.prepare('INSERT INTO users (username, name, pass, created, state) VALUES (?, ?, ?, ?, ?)').run(username, nick, hash(password), Date.now(), JSON.stringify(state))
  const uid = Number(info.lastInsertRowid)
  save(uid, state)
  S.assignRank(uid)
  announce(nick, `Chào mừng tân thủ <b>${nick}</b> gia nhập ${GAME_NAME}!`)
  res.json({ token: newSession(uid) })
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {}
  const row = db.prepare('SELECT id, pass FROM users WHERE username = ? AND bot = 0').get(String(username || ''))
  if (!row || !checkPw(String(password || ''), row.pass)) return res.status(400).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' })
  res.json({ token: newSession(row.id) })
})

// ---------- player ----------

app.get('/api/me', act(() => null))
app.post('/api/daily', act((s) => A.claimDaily(s)))
app.post('/api/look', act((s, b) => A.setLook(s, b.look, cleanLook)))
app.post('/api/mail/clear', act((s) => { s.mail = [] }))

app.post('/api/dungeons/refresh', act((s) => A.refreshDungeons(s, false)))
app.post('/api/run', act((s, b) => A.runDungeon(s, String(b.id || ''), sysAnnounce(s))))
app.post('/api/endless/reset', act((s) => A.resetEndless(s)))

app.post('/api/item/equip', act((s, b) => A.equip(s, b.id)))
app.post('/api/item/sell', act((s, b) => A.sell(s, Array.isArray(b.ids) ? b.ids.slice(0, 50) : [])))
app.post('/api/item/sell-quality', act((s, b) => A.sellQuality(s, Number(b.q))))
app.post('/api/item/lock', act((s, b) => A.lock(s, b.id)))
app.post('/api/item/enhance', act((s, b) => A.enhance(s, b.id, sysAnnounce(s))))
app.post('/api/item/recast', act((s, b) => A.recast(s, b.id, b.index)))
app.post('/api/autosell', act((s, b) => A.setAutoSell(s, b.autoSell)))

app.post('/api/shop', act((s) => A.shopView(s)))
app.post('/api/shop/refresh', act((s, b) => A.shopRefresh(s, !!b.paid)))
app.post('/api/shop/buy', act((s, b) => A.shopBuy(s, Number(b.index))))
app.post('/api/fashion/buy', act((s, b) => A.buyFashion(s, b.id)))
app.post('/api/fashion/wear', act((s, b) => A.wearFashion(s, b.slot, b.id ?? null)))

app.post('/api/rebirth', act((s) => A.rebirth(s)))
app.post('/api/rebirth/alloc', act((s, b) => A.allocRebirth(s, b.alloc)))

// ---------- multiplayer ----------

app.post('/api/boss', act(() => ({ boss: S.bossView(S.getBoss()), cooldown: S.BOSS_COOLDOWN })))
app.post('/api/boss/attack', act((s, b, uid) => S.attackBoss(uid, s, (v) => io.emit('boss:update', v), (html) => announce('Hệ thống', html))))
app.post('/api/arena', act((s, b, uid) => S.arenaView(uid)))
app.post('/api/arena/fight', act((s, b, uid) => S.arenaFight(uid, s, Number(b.id), sysAnnounce(s))))
app.post('/api/rank', act((s, b) => S.ranking(String(b.type || 'power'))))

app.get('/api/health', (req, res) => res.json({ ok: true, name: GAME_NAME }))

// Serve the built web client so the game is also playable in a browser.
const dist = new URL('../client/dist', import.meta.url).pathname
if (existsSync(dist)) app.use(express.static(dist))

// ---------- realtime: chat, presence, boss updates ----------

const lastChat = new Map()
io.use((socket, next) => {
  const uid = userFromToken(socket.handshake.auth?.token)
  if (!uid) return next(new Error('unauthorized'))
  socket.data.uid = uid
  next()
})
io.on('connection', (socket) => {
  const history = db.prepare('SELECT name, text, kind, ts FROM chat ORDER BY id DESC LIMIT 40').all().reverse()
  socket.emit('chat:history', history)
  io.emit('online', io.engine.clientsCount)
  socket.on('chat:send', (text) => {
    const uid = socket.data.uid
    const now = Date.now()
    if (now - (lastChat.get(uid) || 0) < 1500) return
    const clean = String(text || '').replace(/[<>]/g, '').trim().slice(0, 120)
    if (!clean) return
    lastChat.set(uid, now)
    const st = load(uid)
    const msg = { kind: 'player', name: st.name, text: clean, ts: now }
    db.prepare('INSERT INTO chat (user_id, name, text, kind, ts) VALUES (?, ?, ?, ?, ?)').run(uid, st.name, clean, 'player', now)
    io.emit('chat:msg', msg)
  })
  socket.on('disconnect', () => io.emit('online', io.engine.clientsCount))
})

S.seedBots()
S.getBoss()
http.listen(PORT, () => console.log(`${GAME_NAME} server on http://localhost:${PORT}`))
