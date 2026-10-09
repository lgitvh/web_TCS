// Static game data. Item tables, qualities and formulas are ported from
// Couy69/vue-idle-game (MIT, see THIRD_PARTY_NOTICES.md) and translated to Vietnamese.

export const GAME_NAME = 'Huyền Kiếm Truyền Kỳ'

export const SLOTS = ['weapon', 'armor', 'ring', 'neck']
export const SLOT_NAMES = { weapon: 'Vũ khí', armor: 'Áo giáp', ring: 'Nhẫn', neck: 'Dây chuyền' }

// index = quality level. coef = qualityCoefficient, extra = number of random affixes.
export const QUALITIES = [
  { name: 'Cũ Nát', coef: 0.7, extra: 1, color: '#8d969e' },
  { name: 'Thường', coef: 1, extra: 2, color: '#2fa84f' },
  { name: 'Thần Khí', coef: 1.5, extra: 3, color: '#b23cff' },
  { name: 'Sử Thi', coef: 2, extra: 4, color: '#ff8a00' },
  { name: 'Độc Nhất', coef: 2.2, extra: 5, color: '#ff2d2d' },
]
export const UNIQUE = 4

export const STAT_NAMES = {
  ATK: 'Tấn công',
  DEF: 'Phòng thủ',
  HP: 'Sinh lực',
  CRIT: 'Tỉ lệ bạo kích',
  CRITDMG: 'ST bạo kích',
  BLOC: 'Chặn',
  ATKPERCENT: 'Tấn công',
  DEFPERCENT: 'Phòng thủ',
  HPPERCENT: 'Sinh lực',
  BLOCPERCENT: 'Chặn',
}
export const PERCENT_STATS = new Set(['CRIT', 'CRITDMG', 'ATKPERCENT', 'DEFPERCENT', 'HPPERCENT', 'BLOCPERCENT'])

// Base item types per slot: [name, icon, {stat: valCoefficient}]
export const ITEM_TYPES = {
  weapon: {
    normal: [
      ['Thái Đao Ngục Nham', 'broadsword', { ATK: 1.2, CRIT: 1.3 }],
      ['Trường Kiếm Chiến Binh', 'broadsword', { ATK: 1.2, DEF: 0.5 }],
      ['Huyết Nhận Xích Liễu', 'winged-sword', { ATK: 1.3, HP: 1.1 }],
      ['Trường Kiếm Thường', 'broadsword', { ATK: 1.7 }],
      ['Tử Viêm Ba Nhận Kiếm', 'winged-sword', { ATK: 1.7 }],
      ['Móng Vuốt Mao Mao', 'mailed-fist', { ATK: 2, CRIT: 0.7 }],
      ['Băng Tinh Nhận', 'crystal-wand', { ATK: 1.4, CRITDMG: 1.3 }],
    ],
    unique: [
      ['Sáng Thế Vong Mệnh Kiếm', 'sword-in-stone', { ATK: 1.8, CRIT: 1.5, CRITDMG: 1.3 }],
      ['Vô Danh Kiếm', 'broadsword', { ATK: 2.7, CRIT: 2.5 }],
      ['Tử Vong Chi Nhận', 'winged-sword', { ATK: 1.8, CRIT: 1.5, CRITDMG: 1.3 }],
      ['Sương Long Lợi Nhận', 'crystal-wand', { ATK: 1.8, CRIT: 1.5, CRITDMG: 1.3 }],
      ['Huyết Cự Kiếm Agares', 'battle-axe', { ATK: 1.8, CRIT: 1.5, CRITDMG: 1.3 }],
      ['Thần Long Nhận Naglin', 'winged-sword', { ATK: 2.8, CRITDMG: 2.2 }],
      ['Kiếm Đại Mạo Hiểm Gia', 'sword-in-stone', { ATK: 2.4, HP: 1.8 }],
      ['Lục Dực Thiên Sứ Nhận', 'winged-sword', { ATK: 2.6, DEF: 1.8 }],
      ['Juzumaru Tsunetsugu', 'broadsword', { ATK: 3.9 }],
      ['Quân Đao Esuleibus', 'battle-axe', { ATK: 1.9, DEF: 1.2, BLOC: 1.2 }],
    ],
    extra: ['ATK', 'CRIT', 'CRITDMG', 'HP', 'DEF', 'ATKPERCENT', 'DEFPERCENT', 'HPPERCENT'],
  },
  armor: {
    normal: [
      ['Tử Kim Hộ Giáp', 'chest-armor', { DEF: 2, HP: 0.6 }],
      ['Trọng Giáp Chiến Binh', 'chest-armor', { DEF: 1.1, HP: 0.8 }],
      ['Khinh Giáp Thiên Quyền', 'robe', { DEF: 0.7, HP: 0.5, ATK: 0.5 }],
      ['Huyết Giáp Xích Liễu', 'chest-armor', { DEF: 0.9, HP: 1.2 }],
      ['Áo Liền Thân Mao Mao', 'robe', { DEF: 0.8, HP: 0.8, ATK: 0.4 }],
    ],
    unique: [
      ['Dạ Hành Y Hồng Nguyệt', 'robe', { DEF: 1.2, HP: 1.5, ATK: 1.2 }],
      ['Chiến Y Kẻ Thanh Trừng', 'robe', { HP: 1.6, ATK: 2.4, BLOC: 1.2 }],
      ['Áo Tranh Phong', 'robe', { DEF: 1, HP: 1.4, ATK: 1.4 }],
      ['Giáp Kiếm Hào', 'chest-armor', { DEF: 2.1, HP: 2.6 }],
      ['Giáp Ẩn Võ Sĩ', 'chest-armor', { DEF: 1.3, HP: 1.7, ATK: 0.9 }],
      ['Truy Tung Giả Fensaril', 'robe', { DEF: 0.9, CRITDMG: 1.7, ATK: 1.7 }],
      ['Giáp Cuồng Long Tiên Đại', 'chest-armor', { DEF: 1.5, BLOC: 1.2, HP: 1.4 }],
    ],
    extra: ['ATK', 'HP', 'DEF', 'DEFPERCENT', 'HPPERCENT'],
  },
  ring: {
    normal: [
      ['Nhẫn Sinh Mệnh', 'ring', { HP: 1.1 }],
      ['Nhẫn Mao Mao', 'ring', { HP: 0.9, ATK: 0.3, CRIT: 0.8 }],
      ['Nhẫn Ngự Hồn', 'diamond-ring', { HP: 0.7, ATK: 0.5 }],
    ],
    unique: [
      ['Chân · Nhẫn Mao Mao', 'diamond-ring', { CRITDMG: 1.2, CRIT: 0.5, ATK: 0.7 }],
      ['Nhẫn Danh Thiếp Tử Thần', 'diamond-ring', { CRITDMG: 1, CRIT: 0.5, HP: 0.8 }],
      ['Nhẫn Tiên Phong', 'diamond-ring', { CRITDMG: 1, CRIT: 0.5, HP: 0.7 }],
      ['Ý Chí Susanoo', 'diamond-ring', { CRITDMG: 1.6, ATK: 1.1 }],
      ['Ý Chí Tsukuyomi', 'diamond-ring', { CRITDMG: 1.5, HP: 1.2 }],
    ],
    extra: ['ATK', 'CRIT', 'CRITDMG', 'HP', 'DEF', 'BLOC'],
  },
  neck: {
    normal: [
      ['Dây Chuyền Thập Tự Quân', 'ankh', { DEF: 0.9, HP: 0.5, BLOC: 0.6 }],
      ['Băng Long Ngưng Tuyết', 'gem-pendant', { CRITDMG: 0.75, CRIT: 0.5, HP: 0.5 }],
      ['Mắt Ngân Hồn', 'necklace', { CRIT: 1.1, HP: 0.5, ATK: 0.6 }],
    ],
    unique: [
      ['Dây Chuyền Hàng Ma Thập Tự', 'ankh', { ATK: 0.7, HP: 0.8, DEF: 0.9 }],
      ['Dây Chuyền Hắc Long Vương', 'gem-pendant', { CRITDMG: 1, CRIT: 0.5, HP: 0.8 }],
      ['Dây Chuyền Hội Độc Thân Vĩ Đại', 'necklace', { CRITDMG: 1, BLOC: 1.2, HP: 0.7 }],
      ['Ma Tộc Dực Triển', 'gem-pendant', { CRITDMG: 1.6, ATK: 1.6 }],
      ['Dây Chuyền Ipaya', 'necklace', { BLOC: 0.9, DEF: 0.9, HP: 1.3 }],
    ],
    extra: ['ATK', 'CRIT', 'CRITDMG', 'HP', 'DEF', 'BLOC'],
  },
}

// Starter gear (same as the original game's new-player items).
export const STARTER_GEAR = {
  weapon: { name: 'Đoản Kiếm Tân Thủ', icon: 'broadsword', base: [{ type: 'ATK', value: 1 }], extra: [{ type: 'ATK', value: 1 }] },
  armor: { name: 'Áo Vải Tân Thủ', icon: 'robe', base: [{ type: 'DEF', value: 1 }], extra: [{ type: 'HP', value: 10 }] },
  ring: { name: 'Nhẫn Tân Thủ', icon: 'ring', base: [{ type: 'HP', value: 20 }], extra: [{ type: 'CRIT', value: 10 }] },
  neck: { name: 'Mặt Dây Tân Thủ', icon: 'gem-pendant', base: [{ type: 'HP', value: 20 }], extra: [{ type: 'CRIT', value: 10 }] },
}

export const DIFFICULTIES = [
  null,
  { name: 'Thường', df: 1, color: '#2fa84f' },
  { name: 'Khó', df: 1.15, color: '#ff8a00' },
  { name: 'Cực Khó', df: 1.4, color: '#ff2d2d' },
]

// Dungeon themes: name, background colours, monster kinds + colours, boss.
export const THEMES = [
  { name: 'Rừng Slime', sky: ['#8fe3ff', '#e6fbff'], ground: '#7ddc5a', monsters: [['slime', '#5fd36b', 'Slime Xanh'], ['slime', '#4fb5ff', 'Slime Nước']], boss: ['slime', '#ffcc00', 'Vua Slime'] },
  { name: 'Đồi Nấm', sky: ['#ffd2f0', '#fff4fb'], ground: '#9ad66b', monsters: [['mushroom', '#ff5a5a', 'Nấm Đỏ'], ['mushroom', '#b27cff', 'Nấm Tím']], boss: ['mushroom', '#ff9a2e', 'Nấm Chúa'] },
  { name: 'Hang Dơi', sky: ['#7a6bd6', '#c9c1ff'], ground: '#8b7a6a', monsters: [['bat', '#6d5acf', 'Dơi Đêm'], ['bat', '#ff6a8a', 'Dơi Hồng']], boss: ['bat', '#3a2f7a', 'Dơi Chúa'] },
  { name: 'Nghĩa Địa Ma', sky: ['#5b6b8c', '#b8c4dc'], ground: '#6f7f6a', monsters: [['ghost', '#e8f0ff', 'Ma Trơi'], ['ghost', '#b8ffe9', 'Ma Xanh']], boss: ['ghost', '#9b7bff', 'Quỷ Vương'] },
  { name: 'Núi Lửa Rồng', sky: ['#ff9a5a', '#ffe0b0'], ground: '#b0603a', monsters: [['dragon', '#ff6a3a', 'Rồng Lửa Con'], ['dragon', '#4fc36b', 'Rồng Lá Con']], boss: ['dragon', '#d91a1a', 'Hỏa Long Vương'] },
]

export function themeFor(lv) {
  return THEMES[Math.floor((lv - 1) / 10) % THEMES.length]
}

// Rebirth attribute points: value gained per point, optional max points.
export const REBIRTH_ATTRS = {
  HP: { name: 'Sinh lực', per: 10 },
  ATK: { name: 'Tấn công', per: 3 },
  CRIT: { name: 'Tỉ lệ bạo kích', per: 0.1, max: 500, pct: true },
  CRITDMG: { name: 'ST bạo kích', per: 0.5, pct: true },
  DEF: { name: 'Phòng thủ', per: 1 },
  BLOC: { name: 'Chặn', per: 2 },
  SPEED: { name: 'Tốc độ phó bản', per: 2, max: 500, unit: 'ms' },
}

// Gunny-style look options chosen at character creation.
export const LOOK = {
  gender: ['nam', 'nu'],
  hair: [0, 1, 2, 3],
  hairColor: ['#3a2a1a', '#f2c14e', '#ff6fa8', '#5aa9ff', '#ffffff', '#ff5a3a'],
  skin: ['#ffe0c7', '#f5c9a6', '#d9a07a', '#a8714f'],
  eyes: ['#3a2a1a', '#2f7bff', '#2fa84f', '#d94aff'],
  outfit: ['#ff6a3a', '#3a9bff', '#2fa84f', '#ffcc00', '#b23cff', '#ff5aa8'],
}

// Fashion items (bought with gems). Small % bonuses like Gunny's fashion.
export const FASHION = [
  { id: 'hat_crown', slot: 'hat', name: 'Vương Miện Vàng', price: 300, bonus: { ATKPERCENT: 3 } },
  { id: 'hat_cat', slot: 'hat', name: 'Mũ Tai Mèo', price: 200, bonus: { HPPERCENT: 3 } },
  { id: 'hat_wizard', slot: 'hat', name: 'Mũ Phù Thủy', price: 250, bonus: { CRITDMG: 10 } },
  { id: 'glass_round', slot: 'glasses', name: 'Kính Tròn', price: 150, bonus: { CRIT: 2 } },
  { id: 'glass_star', slot: 'glasses', name: 'Kính Ngôi Sao', price: 250, bonus: { CRIT: 3 } },
  { id: 'wing_angel', slot: 'wings', name: 'Cánh Thiên Thần', price: 600, bonus: { HPPERCENT: 5, DEFPERCENT: 5 } },
  { id: 'wing_devil', slot: 'wings', name: 'Cánh Ác Ma', price: 600, bonus: { ATKPERCENT: 5, CRITDMG: 10 } },
  { id: 'wing_fairy', slot: 'wings', name: 'Cánh Tiên', price: 450, bonus: { BLOCPERCENT: 8, HPPERCENT: 3 } },
]
export const FASHION_SLOTS = { hat: 'Mũ', glasses: 'Kính', wings: 'Cánh' }

export const BAG_SIZE = 40
export const ENHANCE_MAX = 20
export const ARENA_TICKETS = 5
