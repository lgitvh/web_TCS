// Game rules shared by the server (authoritative) and the client (display).
// Formulas are ported from Couy69/vue-idle-game (MIT): item rolls, enhancement,
// dungeon generation, the DPS-vs-HP battle model, loot tables and rebirth points.
import {
  QUALITIES, UNIQUE, ITEM_TYPES, STARTER_GEAR, SLOTS, DIFFICULTIES, themeFor,
  REBIRTH_ATTRS, FASHION, ENHANCE_MAX, PERCENT_STATS,
} from './data.js'

const int = (x) => Math.trunc(x)
const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)]

export function newId(rng = Math.random) {
  return Math.floor(rng() * 2 ** 48).toString(36) + Date.now().toString(36).slice(-4)
}

// ---------- items ----------

function rollBase(type, vc, lv, qc, rng) {
  let v
  switch (type) {
    case 'ATK': case 'DEF': v = int(lv * vc + (rng() * lv / 2 + 1)); break
    case 'HP': v = int(lv * vc * 10 + (rng() * lv / 2 + 1)); break
    case 'CRIT': v = int(rng() * 5 + 7); break
    case 'CRITDMG': v = int(rng() * 20 + 20); break
    case 'BLOC': v = int(lv * 0.4 + (rng() * lv / 2 + 1)); break
    default: v = 1
  }
  return Math.max(1, int(v * qc))
}

export function rollExtra(type, lv, qc, rng = Math.random) {
  const r = rng()
  let v
  switch (type) {
    case 'ATK': v = int(int(lv + (r * lv / 2 + 1)) * qc); break
    case 'DEF': v = int(int(lv * 0.4 + (r * lv / 2 + 1)) * qc); break
    case 'HP': v = int(int(lv * 0.2 * 15 + (r * lv / 2 + 1)) * qc); break
    case 'BLOC': v = int(int(lv * 0.6 + (r * lv / 2 + 1)) * qc); break
    case 'ATKPERCENT': v = +((lv * 0.11 + (r * lv / 10 + 4)) * qc).toFixed(2); break
    case 'DEFPERCENT': case 'BLOCPERCENT': v = +((lv * 0.1 + (r * lv / 10 + 4)) * qc).toFixed(2); break
    case 'HPPERCENT': v = +((lv * 0.13 + (r * lv / 10 + 4)) * qc).toFixed(2); break
    case 'CRIT': v = int(int(r * 5 + 5) * qc); break
    case 'CRITDMG': v = int(int(r * 12 + 20) * qc); break
  }
  return { type, value: Math.max(1, v || 1), roll: Math.floor(r * 100) }
}

export function createItem(slot, q, lv, rng = Math.random) {
  const table = ITEM_TYPES[slot]
  const [name, icon, entries] = pick(q === UNIQUE ? table.unique : table.normal, rng)
  const qc = QUALITIES[q].coef
  const base = Object.entries(entries).map(([type, vc]) => ({ type, value: rollBase(type, vc, lv, qc, rng) }))
  const extra = []
  for (let i = 0; i < QUALITIES[q].extra; i++) extra.push(rollExtra(pick(table.extra, rng), lv, qc, rng))
  return { id: newId(rng), slot, name, icon, q, lv, e: 0, base, extra, locked: false }
}

export function starterItem(slot, rng = Math.random) {
  const s = STARTER_GEAR[slot]
  return { id: newId(rng), slot, name: s.name, icon: s.icon, q: 0, lv: 1, e: 0, base: structuredClone(s.base), extra: structuredClone(s.extra), locked: false }
}

// Original quality odds when no quality is forced: 25% / 55% / 15% / 5%.
export function randomQuality(rng = Math.random) {
  const r = rng()
  return r < 0.25 ? 0 : r < 0.8 ? 1 : r < 0.95 ? 2 : 3
}

export const enhanceMultiplier = (e) => 1.055 ** (e ** 1.1)

export function enhancedBase(item) {
  const a = enhanceMultiplier(item.e || 0)
  return item.base.map((b) => ({ type: b.type, value: Math.round(a * b.value) }))
}

export function enhanceCost(item) {
  return int((item.lv + 1) * (1.1 ** ((item.e || 0) ** 1.1)) * (10 + item.lv / 5)) + 100
}

export function enhanceChance(e) {
  if (e <= 5) return 1
  return { 6: 0.8, 7: 0.65, 8: 0.45, 9: 0.3 }[e] ?? 0.2
}

// Returns the new enhance level. On failure at +5 or more the item loses a level.
export function rollEnhance(item, rng = Math.random) {
  const e = item.e || 0
  if (e >= ENHANCE_MAX) return { ok: false, e }
  if (rng() < enhanceChance(e)) return { ok: true, e: e + 1 }
  return { ok: false, e: e >= 5 ? e - 1 : e }
}

export const recastCost = (item) => int(item.lv * QUALITIES[item.q].coef * (200 + 10 * item.lv) / 4)
export const sellPrice = (item) => int(item.lv * QUALITIES[item.q].coef * 30)
export const shopPrice = (item) => int(item.lv * QUALITIES[item.q].coef * (250 + 20 * item.lv))

export function recastEntry(item, index, rng = Math.random) {
  const type = ITEM_TYPES[item.slot].extra
  return rollExtra(pick(type, rng), item.lv, QUALITIES[item.q].coef, rng)
}

// ---------- stats ----------

export function computeStats(player) {
  const r = player.rebirth?.attrs || {}
  const per = (k) => (r[k] || 0) * REBIRTH_ATTRS[k].per
  const s = { ATK: per('ATK'), DEF: per('DEF'), HP: per('HP'), CRIT: per('CRIT'), CRITDMG: per('CRITDMG'), BLOC: per('BLOC') }
  const pct = { ATKPERCENT: 0, DEFPERCENT: 0, HPPERCENT: 0, BLOCPERCENT: 0 }
  const add = (t, v) => {
    if (t in pct) pct[t] += Number(v)
    else if (t in s) s[t] += Number(v)
  }
  for (const slot of SLOTS) {
    const it = player.equip?.[slot]
    if (!it) continue
    for (const b of enhancedBase(it)) add(b.type, b.value)
    for (const x of it.extra) add(x.type, x.value)
  }
  for (const id of Object.values(player.fashion?.worn || {})) {
    const f = FASHION.find((x) => x.id === id)
    if (f) for (const [t, v] of Object.entries(f.bonus)) add(t, v)
  }
  const ATK = int(s.ATK * (100 + pct.ATKPERCENT) / 100)
  const DEF = int(s.DEF * (100 + pct.DEFPERCENT) / 100)
  const MAXHP = int(s.HP * (100 + pct.HPPERCENT) / 100) + 200
  const BLOC = int(s.BLOC * (100 + pct.BLOCPERCENT) / 100)
  const CRIT = Math.min(100, +s.CRIT.toFixed(1))
  const CRITDMG = s.CRITDMG + 150
  const DPS = (1 - CRIT / 100) * ATK + (CRIT / 100) * (CRITDMG / 100) * ATK
  // Fraction of incoming damage actually taken.
  const REDUC = 1 - (0.05 * DEF) / (1 + 0.0525 * DEF)
  const POWER = Math.round(DPS * 8 + MAXHP * 0.8 + DEF * 6 + BLOC * 4)
  return { ATK, DEF, MAXHP, BLOC, CRIT, CRITDMG, DPS, REDUC, POWER }
}

export const regenPerSec = (stats) => stats.MAXHP / 50

export function currentHp(player, stats, now = Date.now()) {
  const h = player.hp || { value: stats.MAXHP, at: now }
  const v = h.value + regenPerSec(stats) * Math.max(0, now - h.at) / 1000
  return Math.min(stats.MAXHP, Math.max(1, v))
}

// ---------- dungeons ----------

export function createDungeon(lv, difficulty = 1, rng = Math.random) {
  lv = Math.max(1, lv)
  const df = DIFFICULTIES[difficulty].df
  const theme = themeFor(lv)
  const events = []
  for (let i = 0; i < 5; i++) {
    const boss = i === 4
    const [kind, color, name] = boss ? theme.boss : pick(theme.monsters, rng)
    events.push({
      name, kind, color, boss,
      HP: int(lv * lv ** 1.1 * (rng() * 5 + (boss ? 30 : 16)) * df),
      ATK: int(lv * lv ** 1.1 * (rng() * 1 + (boss ? 3 : 2)) * df),
      gold: int(lv ** 1.16 * (boss ? rng() * 10 + 28 : rng() * 5 + 11) * df),
      equip: boss
        ? [0.25 - 0.05 * df, 0.55 - 0.15 * df, 0.15 + 0.15 * df, 0.05 + 0.05 * df]
        : [0.2 * df, 0.08 * df, 0.03 * df, 0],
    })
  }
  return {
    id: `${lv}_${difficulty}`, lv, difficulty, theme: theme.name,
    needDPS: int(lv * lv ** 1.3 * 2 * difficulty), events,
  }
}

// The original map: levels lv-4 .. lv+5, each with a 10% chance of an extra
// Hard and 5% chance of an extra Extreme dungeon.
export function createDungeonList(playerLv, rng = Math.random) {
  const list = []
  const push = (lv) => {
    const r = rng()
    const diff = r <= 0.85 ? 1 : r < 0.95 ? 2 : 3
    list.push(createDungeon(lv, 1, rng))
    if (diff !== 1) list.push(createDungeon(lv, diff, rng))
  }
  for (let i = playerLv - 1; i > playerLv - 5 && i >= 1; i--) push(i > 100 ? int(playerLv * (100 - (playerLv - i)) / 100) : i)
  for (let i = playerLv; i < playerLv + 6; i++) push(i > 100 ? int(playerLv * (100 + (i - playerLv)) / 100) : i)
  return list.sort((a, b) => a.lv - b.lv || a.difficulty - b.difficulty)
}

export const createEndless = (endlessLv, rng) => ({ ...createDungeon(endlessLv * 5, 3, rng), id: 'endless', endless: true, endlessLv })

// Original battle model: compare time-to-kill using expected DPS.
export function fight(stats, hp, mon) {
  const playerDeadTime = (hp + stats.BLOC) / stats.REDUC / Math.max(1, mon.ATK)
  const monsterDeadTime = mon.HP / Math.max(0.01, stats.DPS)
  if (monsterDeadTime < playerDeadTime) {
    let taken = int(monsterDeadTime * mon.ATK * stats.REDUC) - stats.BLOC
    taken = Math.max(1, taken)
    return { win: true, time: monsterDeadTime, taken }
  }
  return { win: false, time: playerDeadTime, taken: hp }
}

// Split a total into a few hit numbers for the animation (crits shown bigger).
export function visualHits(total, stats, rng = Math.random, maxHits = 6) {
  const n = Math.max(1, Math.min(maxHits, Math.ceil(total / Math.max(1, stats.DPS))))
  const raw = []
  for (let i = 0; i < n; i++) {
    const crit = rng() * 100 < stats.CRIT
    raw.push({ crit, w: (crit ? stats.CRITDMG / 100 : 1) * (0.85 + rng() * 0.3) })
  }
  const sum = raw.reduce((a, h) => a + h.w, 0)
  return raw.map((h) => ({ crit: h.crit, dmg: Math.max(1, Math.round(total * h.w / sum)) }))
}

export function rollLoot(dungeon, ev, rng = Math.random) {
  const items = []
  const lv = dungeon.lv
  if (ev.boss && !dungeon.endless) {
    const chance = 0.02 * ((dungeon.difficulty - 1) * 2 + 1)
    if (rng() < chance) {
      const r = rng()
      const slot = r <= 0.3 ? 'weapon' : r <= 0.5 ? 'armor' : r <= 0.75 ? 'ring' : 'neck'
      items.push(createItem(slot, UNIQUE, int(lv + rng() * 6), rng))
    }
  }
  const p = ev.equip
  const r = rng()
  let q = -1
  if (r < p[0]) q = 0
  else if (r < p[0] + p[1]) q = 1
  else if (r < p[0] + p[1] + p[2]) q = 2
  else if (r < p[0] + p[1] + p[2] + p[3]) q = 3
  let gold = ev.gold
  if (dungeon.endless) gold = int(gold * (q !== -1 ? 1.5 : 2.6))
  else if (q !== -1) items.push(createItem(pick(SLOTS, rng), q, lv, rng))
  return { gold, items }
}

export const WALK_MS = 2000
export const FIGHT_MS = 2000

export function fightMs(player) {
  return Math.max(1000, FIGHT_MS - (player.rebirth?.attrs?.SPEED || 0) * REBIRTH_ATTRS.SPEED.per)
}

// ---------- rebirth ----------

export function rebirthPoints(player) {
  const lv = player.lv
  let pts = lv >= 20 ? Math.floor((lv - 20) ** 1.1 / 2.1) : 0
  for (const slot of SLOTS) {
    const it = player.equip?.[slot]
    if (!it || it.lv < 20) continue
    pts += Math.floor(((it.lv - 20) / 10) ** 1.1 * (0.1 * (it.e || 0) ** 1.5 + 1) * QUALITIES[it.q].coef / 3.5)
  }
  return pts
}

// ---------- formatting ----------

export function fmt(n) {
  n = Number(n) || 0
  const a = Math.abs(n)
  if (a >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B'
  if (a >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
  if (a >= 1e4) return (n / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
  return String(Math.round(n))
}

export function statText(type, value) {
  return '+' + (PERCENT_STATS.has(type) ? `${value}%` : fmt(value))
}

export function itemPower(item) {
  return computeStats({ equip: { [item.slot]: item } }).POWER - computeStats({ equip: {} }).POWER
}
