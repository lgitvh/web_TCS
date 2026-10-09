// Server-authoritative player actions. Each takes the player's state, mutates it
// and returns a result for the client. Errors are thrown as GameError (shown to the player).
import {
  SLOTS, QUALITIES, UNIQUE, BAG_SIZE, ENHANCE_MAX, REBIRTH_ATTRS, FASHION, SLOT_NAMES,
} from '../shared/data.js'
import {
  computeStats, currentHp, createDungeonList, createEndless, fight, visualHits, rollLoot,
  WALK_MS, fightMs, enhanceCost, rollEnhance, recastCost, recastEntry, sellPrice, shopPrice,
  createItem, randomQuality, rebirthPoints, starterItem, regenPerSec, fmt,
} from '../shared/rules.js'

export class GameError extends Error {}
const fail = (msg) => { throw new GameError(msg) }

function findItem(state, id) {
  const i = state.bag.findIndex((x) => x.id === id)
  if (i >= 0) return { item: state.bag[i], where: 'bag', index: i }
  for (const s of SLOTS) if (state.equip[s]?.id === id) return { item: state.equip[s], where: 'equip', slot: s }
  fail('Không tìm thấy trang bị')
}

function addToBag(state, item, log) {
  if (state.autoSell[item.q] && item.q !== UNIQUE) {
    const g = sellPrice(item)
    state.gold += g
    log.sold += g
    return false
  }
  if (state.bag.length >= BAG_SIZE) {
    const g = sellPrice(item)
    state.gold += g
    log.sold += g
    log.full = true
    return false
  }
  state.bag.push(item)
  return true
}

// ---------- dungeons ----------

export function refreshDungeons(state, force) {
  const now = Date.now()
  if (!force && now - state.dungeonsAt < 30e3) fail(`Chờ ${Math.ceil((30e3 - (now - state.dungeonsAt)) / 1000)} giây để làm mới bản đồ`)
  state.dungeons = createDungeonList(state.lv)
  state.dungeonsAt = force ? 0 : now
}

export function runDungeon(state, dungeonId, announce) {
  const now = Date.now()
  if (state.run && state.run.endsAt > now) fail('Bạn đang trong phó bản')
  let dungeon
  if (dungeonId === 'endless') {
    if (!state.endlessLv) fail('Chưa mở khóa Vô Tận (vượt phó bản cấp 10)')
    dungeon = createEndless(state.endlessLv)
  } else {
    dungeon = state.dungeons.find((d) => d.id === dungeonId)
    if (!dungeon) fail('Phó bản không còn tồn tại, hãy làm mới bản đồ')
  }
  const stats = computeStats(state)
  const ms = fightMs(state)
  let hp = currentHp(state, stats, now)
  const startHp = Math.round(hp)
  let t = 0
  const events = []
  const log = { gold: 0, sold: 0, full: false, items: [] }
  let cleared = true
  for (const ev of dungeon.events) {
    t += WALK_MS
    hp = Math.min(stats.MAXHP, hp + regenPerSec(stats) * WALK_MS / 1000)
    const res = fight(stats, hp, ev)
    const out = { name: ev.name, kind: ev.kind, color: ev.color, boss: ev.boss, HP: ev.HP, ATK: ev.ATK, win: res.win, taken: res.taken }
    t += ms
    if (!res.win) {
      out.hits = visualHits(Math.floor(ev.HP * 0.6), stats)
      events.push(out)
      hp = 1
      cleared = false
      break
    }
    out.hits = visualHits(ev.HP, stats)
    hp -= res.taken
    const loot = rollLoot(dungeon, ev)
    state.gold += loot.gold
    log.gold += loot.gold
    out.gold = loot.gold
    out.items = []
    for (const it of loot.items) {
      if (addToBag(state, it, log)) out.items.push(it)
      if (it.q >= 3) announce?.(`vừa nhận được <q${it.q}>[${QUALITIES[it.q].name}] ${it.name}</q${it.q}> tại ${dungeon.endless ? 'Vô Tận' : `phó bản Lv${dungeon.lv}`}!`)
    }
    out.hpAfter = Math.round(hp)
    events.push(out)
    if (ev.boss && !dungeon.endless && dungeon.lv > state.lv) state.lv = dungeon.lv
  }
  const result = { cleared, lvUp: false, endlessUp: false, unlockEndless: false }
  if (cleared) {
    if (dungeon.endless) {
      state.endlessLv++
      hp = stats.MAXHP
      result.endlessUp = true
    } else {
      if (dungeon.difficulty !== 1) state.dungeons = state.dungeons.filter((d) => d.id !== dungeon.id)
      if (dungeon.lv >= 10 && !state.endlessLv) {
        state.endlessLv = 1
        result.unlockEndless = true
      }
    }
  }
  state.hp = { value: hp, at: now + t }
  state.run = { id: dungeon.id, endsAt: now + t }
  return {
    dungeon: { id: dungeon.id, lv: dungeon.lv, difficulty: dungeon.difficulty, theme: dungeon.theme, endless: !!dungeon.endless, endlessLv: dungeon.endlessLv },
    events, walkMs: WALK_MS, fightMs: ms, totalMs: t, startHp,
    maxHp: stats.MAXHP, log, ...result,
  }
}

export function resetEndless(state) {
  if (!state.endlessLv) fail('Chưa mở khóa Vô Tận')
  state.endlessLv = 1
}

// ---------- equipment ----------

export function equip(state, id) {
  const f = findItem(state, id)
  if (f.where !== 'bag') fail('Trang bị đang được mặc')
  const old = state.equip[f.item.slot]
  state.equip[f.item.slot] = f.item
  state.bag.splice(f.index, 1)
  if (old) state.bag.push(old)
  clampHp(state)
}

function clampHp(state) {
  const st = computeStats(state)
  const now = Date.now()
  state.hp = { value: Math.min(st.MAXHP, currentHp(state, st, now)), at: Math.max(now, state.hp?.at || 0) }
}

export function sell(state, ids) {
  let gold = 0
  for (const id of ids) {
    const f = findItem(state, id)
    if (f.where !== 'bag') fail('Không thể bán trang bị đang mặc')
    if (f.item.locked) continue
    gold += sellPrice(f.item)
    state.bag.splice(state.bag.indexOf(f.item), 1)
  }
  state.gold += gold
  return { gold }
}

export function sellQuality(state, q) {
  const ids = state.bag.filter((x) => x.q <= q && !x.locked && x.q !== UNIQUE).map((x) => x.id)
  return sell(state, ids)
}

export function lock(state, id) {
  const f = findItem(state, id)
  f.item.locked = !f.item.locked
}

export function enhance(state, id, announce) {
  const { item } = findItem(state, id)
  if ((item.e || 0) >= ENHANCE_MAX) fail(`Đã đạt cường hóa tối đa +${ENHANCE_MAX}`)
  const cost = enhanceCost(item)
  if (state.gold < cost) fail('Không đủ vàng')
  state.gold -= cost
  const before = item.e || 0
  const r = rollEnhance(item)
  item.e = r.e
  if (r.ok && r.e >= 10) announce?.(`vừa cường hóa <q${item.q}>[${QUALITIES[item.q].name}] ${item.name}</q${item.q}> lên <b>+${r.e}</b>!`)
  clampHp(state)
  return { ok: r.ok, before, e: r.e, cost }
}

export function recast(state, id, index) {
  const { item } = findItem(state, id)
  if (!Number.isInteger(index) || !item.extra[index]) fail('Thuộc tính không hợp lệ')
  const cost = recastCost(item)
  if (state.gold < cost) fail('Không đủ vàng')
  state.gold -= cost
  item.extra[index] = recastEntry(item, index)
  clampHp(state)
  return { cost, entry: item.extra[index] }
}

export function setAutoSell(state, arr) {
  if (!Array.isArray(arr)) fail('Sai dữ liệu')
  state.autoSell = [0, 1, 2, 3].map((i) => !!arr[i])
}

// ---------- shop ----------

function stockShop(state) {
  const items = []
  for (let i = 0; i < 6; i++) {
    const lv = Math.floor(state.lv + Math.random() * 3)
    const it = createItem(SLOTS[Math.floor(Math.random() * 4)], randomQuality(), lv)
    items.push({ item: it, price: shopPrice(it) })
  }
  state.shop.items = items
}

export function shopView(state) {
  if (!state.shop.items.length) stockShop(state)
  return state.shop
}

export function shopRefresh(state, paid) {
  if (paid) {
    if (state.gold < 10000) fail('Cần 10.000 vàng để làm mới')
    state.gold -= 10000
  } else {
    if (state.shop.free < 1) fail('Hết lượt làm mới miễn phí')
    if (state.shop.free >= 5) state.shop.freeAt = Date.now()
    state.shop.free--
  }
  stockShop(state)
}

export function shopBuy(state, index) {
  const entry = state.shop.items[index]
  if (!entry || entry.sold) fail('Món hàng không tồn tại')
  if (state.gold < entry.price) fail('Không đủ vàng')
  if (state.bag.length >= BAG_SIZE) fail('Túi đồ đã đầy')
  state.gold -= entry.price
  state.bag.push(entry.item)
  entry.sold = true
}

// ---------- rebirth ----------

export function rebirth(state) {
  const gain = rebirthPoints(state)
  if (gain < 1) fail('Cần cấp 20+ để luân hồi nhận điểm')
  state.rebirth.count++
  state.rebirth.points += gain
  state.lv = 1
  state.gold = 0
  for (const s of SLOTS) state.equip[s] = starterItem(s)
  state.bag = []
  state.endlessLv = 0
  state.hp = null
  state.dungeons = createDungeonList(1)
  state.dungeonsAt = 0
  state.shop.items = []
  return { gain }
}

export function allocRebirth(state, alloc) {
  let total = 0
  const next = { ...state.rebirth.attrs }
  for (const [k, v] of Object.entries(alloc || {})) {
    const def = REBIRTH_ATTRS[k]
    const n = Number(v)
    if (!def || !Number.isInteger(n) || n < 0) fail('Sai dữ liệu')
    if (def.max && (next[k] || 0) + n > def.max) fail(`${def.name} tối đa ${def.max} điểm`)
    next[k] = (next[k] || 0) + n
    total += n
  }
  if (total > state.rebirth.points) fail('Không đủ điểm luân hồi')
  state.rebirth.points -= total
  state.rebirth.attrs = next
  clampHp(state)
}

// ---------- fashion & daily ----------

export function buyFashion(state, id) {
  const f = FASHION.find((x) => x.id === id)
  if (!f) fail('Không tồn tại')
  if (state.fashion.owned.includes(id)) fail('Đã sở hữu')
  if (state.gems < f.price) fail('Không đủ kim cương')
  state.gems -= f.price
  state.fashion.owned.push(id)
  state.fashion.worn[f.slot] = id
  clampHp(state)
}

export function wearFashion(state, slot, id) {
  if (!['hat', 'glasses', 'wings'].includes(slot)) fail('Sai dữ liệu')
  if (id === null) delete state.fashion.worn[slot]
  else {
    const f = FASHION.find((x) => x.id === id)
    if (!f || f.slot !== slot || !state.fashion.owned.includes(id)) fail('Chưa sở hữu')
    state.fashion.worn[slot] = id
  }
  clampHp(state)
}

export function setLook(state, look, cleanLook) {
  state.look = cleanLook(look)
}

export function claimDaily(state) {
  if (state.daily.claimed) fail('Hôm nay đã nhận quà')
  state.daily.claimed = true
  const gold = Math.round(100 * state.lv ** 1.3)
  state.gems += 50
  state.gold += gold
  return { gems: 50, gold }
}

export { fmt, SLOT_NAMES }
