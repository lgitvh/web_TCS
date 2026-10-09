// Multiplayer features: world boss, arena, rankings, practice bots.
import { db, kvGet, kvSet } from './db.js'
import { load, save, newState } from './players.js'
import { GameError } from './actions.js'
import { computeStats, createItem, fmt } from '../shared/rules.js'
import { SLOTS, LOOK } from '../shared/data.js'

const fail = (msg) => { throw new GameError(msg) }

// ---------- world boss ----------

export const BOSS_COOLDOWN = 60e3
const BOSS_NAMES = ['Ma Vương Hắc Ám', 'Long Vương Băng Giá', 'Quỷ Chúa Hỏa Ngục', 'Cự Nhân Đá Cổ', 'Bạch Tuộc Khổng Lồ']
const BOSS_KINDS = [['ghost', '#6a3aff'], ['dragon', '#4fb5ff'], ['dragon', '#ff3a1a'], ['slime', '#8a8a8a'], ['bat', '#ff5aa8']]

function spawnBoss(lv) {
  const i = (lv - 1) % BOSS_NAMES.length
  const maxHp = Math.round(20000 * 1.8 ** (lv - 1))
  return { lv, name: BOSS_NAMES[i], kind: BOSS_KINDS[i][0], color: BOSS_KINDS[i][1], hp: maxHp, maxHp, dmg: {}, names: {}, spawnedAt: Date.now() }
}

export function getBoss() {
  let boss = kvGet('boss')
  if (!boss) {
    boss = spawnBoss(1)
    kvSet('boss', boss)
  }
  return boss
}

export function bossView(boss) {
  const top = Object.entries(boss.dmg).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([id, d]) => ({ id: +id, name: boss.names[id], dmg: d }))
  return { lv: boss.lv, name: boss.name, kind: boss.kind, color: boss.color, hp: boss.hp, maxHp: boss.maxHp, top }
}

// Each attack is a 30-second fight using the player's DPS (crits rolled per second).
export function attackBoss(uid, state, broadcast, announce) {
  const now = Date.now()
  const wait = state.boss.lastAttack + BOSS_COOLDOWN - now
  if (wait > 0) fail(`Hồi chiêu còn ${Math.ceil(wait / 1000)} giây`)
  const st = computeStats(state)
  const hits = []
  let dmg = 0
  for (let s = 0; s < 30; s++) {
    const crit = Math.random() * 100 < st.CRIT
    const d = Math.max(1, Math.round(st.ATK * (crit ? st.CRITDMG / 100 : 1) * (0.9 + Math.random() * 0.2)))
    dmg += d
    if (hits.length < 8) hits.push({ dmg: d, crit })
  }
  const boss = getBoss()
  dmg = Math.min(dmg, boss.hp)
  boss.hp -= dmg
  boss.dmg[uid] = (boss.dmg[uid] || 0) + dmg
  boss.names[uid] = state.name
  state.boss.lastAttack = now
  let killed = null
  if (boss.hp <= 0) killed = rewardBossKill(boss, uid, announce)
  kvSet('boss', killed ? spawnBoss(boss.lv + 1) : boss)
  broadcast(bossView(getBoss()))
  return { dmg, hits, killed }
}

function rewardBossKill(boss, lastHitId, announce) {
  const ranking = Object.entries(boss.dmg).sort((a, b) => b[1] - a[1])
  const total = ranking.reduce((a, [, d]) => a + d, 0)
  const rewards = []
  ranking.forEach(([id, d], i) => {
    const uid = +id
    const st = load(uid)
    if (!st) return
    const gems = 20 + ([100, 70, 50][i] || 0) + (uid === lastHitId ? 50 : 0)
    const gold = Math.round(boss.lv * 5000 * d / total) + 500
    st.gems += gems
    st.gold += gold
    st.mail = [...(st.mail || []), { t: Date.now(), text: `Boss Thế Giới ${boss.name} Lv${boss.lv} bị hạ! Hạng ${i + 1}: +${gems} kim cương, +${fmt(gold)} vàng` }].slice(-20)
    save(uid, st)
    rewards.push({ id: uid, name: boss.names[id], gems, gold })
  })
  announce(`<b>${boss.names[lastHitId]}</b> đã tung đòn kết liễu Boss Thế Giới <b>${boss.name}</b> Lv${boss.lv}! Boss mới đã xuất hiện.`)
  return { name: boss.name, lv: boss.lv, rewards }
}

// ---------- arena ----------

function nextRank() {
  return (db.prepare('SELECT MAX(arena_rank) AS m FROM users').get().m || 0) + 1
}

export function assignRank(uid) {
  db.prepare('UPDATE users SET arena_rank = ? WHERE id = ?').run(nextRank(), uid)
}

function publicRow(row) {
  const st = load(row.id)
  return { id: row.id, name: row.name, lv: row.lv, power: row.power, rank: row.arena_rank, look: st?.look, worn: st?.fashion?.worn || {}, weapon: st?.equip?.weapon?.icon, bot: !!row.bot }
}

export function arenaView(uid) {
  const me = db.prepare('SELECT id, name, lv, power, arena_rank, bot FROM users WHERE id = ?').get(uid)
  const above = db.prepare('SELECT id, name, lv, power, arena_rank, bot FROM users WHERE arena_rank < ? ORDER BY arena_rank DESC LIMIT 5').all(me.arena_rank)
  const top = db.prepare('SELECT id, name, lv, power, arena_rank, bot FROM users ORDER BY arena_rank LIMIT 3').all()
  const map = new Map([...top, ...above].map((r) => [r.id, r]))
  return { me: publicRow(me), opponents: [...map.values()].sort((a, b) => a.arena_rank - b.arena_rank).map(publicRow) }
}

// Time-to-kill comparison (same model as dungeon fights) with ±15% luck each side.
function duel(a, b) {
  const luck = () => 0.85 + Math.random() * 0.3
  const tA = (b.MAXHP + b.BLOC) / Math.max(0.01, a.DPS * b.REDUC * luck())
  const tB = (a.MAXHP + a.BLOC) / Math.max(0.01, b.DPS * a.REDUC * luck())
  return { win: tA <= tB, tA, tB }
}

export function arenaFight(uid, state, targetId, announce) {
  if (state.arena.tickets < 1) fail('Hết lượt khiêu chiến hôm nay')
  if (targetId === uid) fail('Không thể tự khiêu chiến')
  const me = db.prepare('SELECT arena_rank FROM users WHERE id = ?').get(uid)
  const them = db.prepare('SELECT id, name, arena_rank FROM users WHERE id = ?').get(targetId)
  if (!them) fail('Đối thủ không tồn tại')
  if (them.arena_rank > me.arena_rank) fail('Chỉ được khiêu chiến người xếp trên bạn')
  const other = load(them.id)
  const a = computeStats(state)
  const b = computeStats(other)
  const res = duel(a, b)
  state.arena.tickets--
  let gems = 3
  let newRank = me.arena_rank
  if (res.win) {
    gems = 10
    state.arena.wins = (state.arena.wins || 0) + 1
    db.prepare('UPDATE users SET arena_rank = ? WHERE id = ?').run(me.arena_rank, them.id)
    db.prepare('UPDATE users SET arena_rank = ? WHERE id = ?').run(them.arena_rank, uid)
    newRank = them.arena_rank
    if (newRank === 1) announce(`đã đánh bại <b>${them.name}</b> và lên <b>Hạng 1 Đấu Trường</b>!`)
  }
  state.gems += gems
  return { win: res.win, gems, newRank, oldRank: me.arena_rank, enemy: { name: them.name, look: other.look, worn: other.fashion?.worn || {}, weapon: other.equip?.weapon?.icon, stats: b }, me: a }
}

// ---------- rankings ----------

export function ranking(type) {
  const col = { power: 'power', lv: 'lv', endless: 'endless', arena: 'arena_rank' }[type] || 'power'
  const order = col === 'arena_rank' ? 'arena_rank ASC' : `${col} DESC, power DESC`
  return db.prepare(`SELECT id, name, lv, power, endless, arena_rank, bot FROM users ORDER BY ${order} LIMIT 50`).all()
    .map((r) => ({ ...publicRow(r), endless: r.endless }))
}

// ---------- practice bots ----------

const BOT_NAMES = ['Tiểu Long Nữ', 'Bạch Hổ', 'Gà Con Lv1', 'Hắc Kiếm Sĩ', 'Mèo Ú', 'Phong Vân', 'Thỏ Ngọc', 'Sát Thủ Bóng Đêm', 'Kẹo Bông', 'Cáo Chín Đuôi', 'Lão Ngoan Đồng', 'Băng Tâm']

export function seedBots() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users WHERE bot = 1').get().c
  if (count > 0) return
  BOT_NAMES.forEach((name, i) => {
    const lv = Math.max(1, Math.round(3 + i * 4 + Math.random() * 3))
    const r = (n) => Math.floor(Math.random() * n)
    const st = newState(name, { gender: i % 2 ? 'nu' : 'nam', hair: r(LOOK.hair.length), hairColor: r(LOOK.hairColor.length), skin: r(LOOK.skin.length), eyes: r(LOOK.eyes.length), outfit: r(LOOK.outfit.length) })
    st.lv = lv
    for (const s of SLOTS) {
      const it = createItem(s, Math.min(3, Math.floor(i / 3)), lv)
      it.e = Math.min(12, Math.floor(i / 1.5))
      st.equip[s] = it
    }
    if (i > 6) st.fashion = { owned: ['wing_angel'], worn: { wings: i % 2 ? 'wing_angel' : 'wing_devil' } }
    const info = db.prepare('INSERT INTO users (username, name, pass, created, state, bot) VALUES (?, ?, NULL, ?, ?, 1)')
      .run(`bot_${i}`, name, Date.now(), JSON.stringify(st))
    save(Number(info.lastInsertRowid), st)
  })
  // Strongest bots at the top of the arena.
  const rows = db.prepare('SELECT id FROM users WHERE bot = 1 ORDER BY power DESC').all()
  rows.forEach((row, i) => db.prepare('UPDATE users SET arena_rank = ? WHERE id = ?').run(i + 1, row.id))
}
