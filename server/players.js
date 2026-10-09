import { db } from './db.js'
import { SLOTS, LOOK, ARENA_TICKETS } from '../shared/data.js'
import { starterItem, computeStats, currentHp, createDungeonList, rebirthPoints } from '../shared/rules.js'

const cache = new Map() // user id -> state

// Vietnam time (UTC+7) day key for daily resets.
export const dayKey = (t = Date.now()) => new Date(t + 7 * 3600e3).toISOString().slice(0, 10)

export function cleanLook(look = {}) {
  const pickIdx = (v, arr) => (Number.isInteger(v) && v >= 0 && v < arr.length ? v : 0)
  return {
    gender: look.gender === 'nu' ? 'nu' : 'nam',
    hair: pickIdx(look.hair, LOOK.hair),
    hairColor: pickIdx(look.hairColor, LOOK.hairColor),
    skin: pickIdx(look.skin, LOOK.skin),
    eyes: pickIdx(look.eyes, LOOK.eyes),
    outfit: pickIdx(look.outfit, LOOK.outfit),
  }
}

export function newState(name, look) {
  const equip = {}
  for (const s of SLOTS) equip[s] = starterItem(s)
  const state = {
    name,
    look: cleanLook(look),
    lv: 1,
    gold: 0,
    gems: 100,
    endlessLv: 0,
    equip,
    bag: [],
    hp: null,
    dungeons: createDungeonList(1),
    dungeonsAt: 0,
    run: null,
    autoSell: [false, false, false, false],
    shop: { items: [], free: 5, freeAt: Date.now() },
    rebirth: { count: 0, points: 0, attrs: {} },
    fashion: { owned: [], worn: {} },
    arena: { tickets: ARENA_TICKETS, day: dayKey(), wins: 0 },
    daily: { day: '', claimed: false },
    boss: { lastAttack: 0 },
  }
  return state
}

export function load(id) {
  if (cache.has(id)) return cache.get(id)
  const row = db.prepare('SELECT state FROM users WHERE id = ?').get(id)
  if (!row) return null
  const state = JSON.parse(row.state)
  cache.set(id, state)
  return state
}

export function save(id, state) {
  cache.set(id, state)
  const st = computeStats(state)
  db.prepare('UPDATE users SET state = ?, power = ?, lv = ?, endless = ? WHERE id = ?')
    .run(JSON.stringify(state), st.POWER, state.lv, state.endlessLv, id)
}

// Daily resets that happen lazily whenever the player is loaded.
export function tick(state) {
  const today = dayKey()
  if (state.arena.day !== today) state.arena = { ...state.arena, tickets: ARENA_TICKETS, day: today }
  if (state.daily.day !== today) state.daily = { day: today, claimed: false }
  // Free shop refreshes regenerate one every 10 minutes, up to 5.
  const gained = Math.floor((Date.now() - state.shop.freeAt) / 600e3)
  if (gained > 0) {
    state.shop.free = Math.min(5, state.shop.free + gained)
    state.shop.freeAt = state.shop.free >= 5 ? Date.now() : state.shop.freeAt + gained * 600e3
  }
}

// What the client receives about its own player.
export function view(id, state) {
  const stats = computeStats(state)
  return {
    id,
    ...state,
    stats,
    hpNow: currentHp(state, stats),
    rebirthGain: rebirthPoints(state),
    serverTime: Date.now(),
  }
}
