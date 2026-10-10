import type { PowerUpId, TopicId, UserStats, WrongNoteItem } from '../types/math';
import type { GameAssetKey } from './gameAssets';

export type { PowerUpId };

const STATS_KEY = 'mykid_math_stats';
const WRONG_NOTES_KEY = 'mykid_math_wrong_notes';

export const DAILY_MISSION_GOAL = 5;
export const DAILY_MISSION_BONUS = 3;
export const BOSS_CLEAR_STARS = 10;
export const POWER_UP_MAX = 9; // max count per power-up in inventory
export const XP_BOOST_PROBLEMS = 5;
export const XP_BOOST_STARS = 2; // extra stars per correct answer while boosted

export interface RewardResult {
  updatedStats: UserStats;
  newBadges: string[];
  leveledUp: boolean;
  bonusStars: number; // extra stars beyond the base reward (combo bonus, mission bonus...)
  missionCompleted: boolean;
}

export type ShopSlot = 'hat' | 'pet' | 'prop' | 'theme' | 'character';

export interface ShopItem {
  id: string;
  name: string;
  slot: ShopSlot;
  price: number;
  gradient?: string; // roadmap banner classes, theme only
  banner?: GameAssetKey; // roadmap banner scenery, theme only
  image: GameAssetKey;
}

const DEFAULT_CHARACTER = 'char_hero';

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'char_hero', name: '수학 히어로', slot: 'character', price: 0, image: 'hero' },
  { id: 'char_solver', name: '문제 해결사', slot: 'character', price: 15, image: 'solver' },
  { id: 'char_wizard', name: '수학 마법사', slot: 'character', price: 30, image: 'wizard' },
  { id: 'char_explorer', name: '탐험가', slot: 'character', price: 30, image: 'explorer' },
  { id: 'hat_cap', name: '야구 모자', slot: 'hat', price: 5, image: 'hatCap' },
  { id: 'hat_beanie', name: '눈꽃 비니', slot: 'hat', price: 8, image: 'hatBeanie' },
  { id: 'hat_captain', name: '선장 모자', slot: 'hat', price: 10, image: 'hatCaptain' },
  { id: 'hat_cat', name: '고양이 모자', slot: 'hat', price: 12, image: 'hatCat' },
  { id: 'hat_headphone', name: '헤드폰 모자', slot: 'hat', price: 12, image: 'hatHeadphone' },
  { id: 'hat_bunny', name: '토끼 모자', slot: 'hat', price: 15, image: 'hatBunny' },
  { id: 'hat_cowboy', name: '카우보이 모자', slot: 'hat', price: 15, image: 'hatCowboy' },
  { id: 'hat_goggles', name: '탐험가 헬멧', slot: 'hat', price: 18, image: 'hatGoggles' },
  { id: 'hat_wizard', name: '마법사 모자', slot: 'hat', price: 20, image: 'hatWizard' },
  { id: 'hat_dino', name: '공룡 모자', slot: 'hat', price: 20, image: 'hatDino' },
  { id: 'hat_viking', name: '바이킹 투구', slot: 'hat', price: 25, image: 'hatViking' },
  { id: 'hat_crown', name: '황금 왕관', slot: 'hat', price: 35, image: 'hatCrown' },
  { id: 'pet_dog', name: '멍멍이', slot: 'pet', price: 8, image: 'petHusky' },
  { id: 'pet_cat', name: '야옹이', slot: 'pet', price: 8, image: 'petCat' },
  { id: 'pet_chick', name: '삐약이', slot: 'pet', price: 8, image: 'petChick' },
  { id: 'pet_slime', name: '말랑 슬라임', slot: 'pet', price: 10, image: 'petSlime' },
  { id: 'pet_cactus', name: '선인장 친구', slot: 'pet', price: 12, image: 'petCactus' },
  { id: 'pet_penguin', name: '꼬마 펭귄', slot: 'pet', price: 15, image: 'petPenguin' },
  { id: 'pet_panda', name: '아기 판다', slot: 'pet', price: 20, image: 'petPanda' },
  { id: 'pet_robot', name: '꼬마 로봇', slot: 'pet', price: 25, image: 'petRobot' },
  { id: 'pet_ghost', name: '물방울 요정', slot: 'pet', price: 25, image: 'petGhost' },
  { id: 'pet_unicorn', name: '아기 유니콘', slot: 'pet', price: 35, image: 'petUnicorn' },
  { id: 'pet_dragon', name: '아기 드래곤', slot: 'pet', price: 40, image: 'petDragon' },
  { id: 'pet_golem', name: '용암 골렘', slot: 'pet', price: 40, image: 'petGolem' },
  { id: 'prop_pencil', name: '별 연필', slot: 'prop', price: 5, image: 'itemPencil' },
  { id: 'prop_book', name: '수학 교재', slot: 'prop', price: 8, image: 'itemBook' },
  { id: 'prop_calculator', name: '계산기', slot: 'prop', price: 10, image: 'itemCalculator' },
  { id: 'prop_clover', name: '네잎클로버', slot: 'prop', price: 10, image: 'itemClover' },
  { id: 'prop_potion', name: '에너지 포션', slot: 'prop', price: 12, image: 'itemPotion' },
  { id: 'prop_magnet', name: '자석', slot: 'prop', price: 12, image: 'itemMagnet' },
  { id: 'prop_rocket', name: '로켓', slot: 'prop', price: 20, image: 'rocket' },
  {
    id: 'theme_forest',
    name: '초록 숲',
    image: 'themeForest',
    banner: 'bannerForest',
    slot: 'theme',
    price: 12,
    gradient: 'from-emerald-700 to-teal-800',
  },
  {
    id: 'theme_ocean',
    name: '푸른 바다',
    image: 'themeSea',
    banner: 'bannerSea',
    slot: 'theme',
    price: 12,
    gradient: 'from-sky-700 to-blue-800',
  },
  {
    id: 'theme_sunset',
    name: '노을 하늘',
    image: 'themeSunset',
    banner: 'bannerSunset',
    slot: 'theme',
    price: 25,
    gradient: 'from-violet-800 via-purple-700 to-fuchsia-800',
  },
];

export interface PowerUp {
  id: PowerUpId;
  name: string;
  desc: string;
  price: number;
  image: GameAssetKey;
}

export const POWER_UPS: PowerUp[] = [
  { id: 'time_charge', name: '시간 충전', desc: '타임어택 시간 +10초', price: 6, image: 'time' },
  { id: 'heart_recover', name: '체력 회복', desc: '보스전 하트 +1', price: 6, image: 'heart' },
  { id: 'shield', name: '보호막', desc: '보스전 오답 1번 막기', price: 8, image: 'shield' },
  {
    id: 'xp_booster',
    name: '경험치 부스터',
    desc: '도전 퀴즈 다음 5문제 별 2배',
    price: 10,
    image: 'xpBooster',
  },
];

const defaultStats: UserStats = {
  totalSolved: 0,
  totalCorrect: 0,
  stars: 0,
  level: 1,
  badges: [],
  topicProgress: {
    factors: { solvedCount: 0, correctCount: 0, stars: 0 },
    fractions: { solvedCount: 0, correctCount: 0, stars: 0 },
    decimals: { solvedCount: 0, correctCount: 0, stars: 0 },
    geometry: { solvedCount: 0, correctCount: 0, stars: 0 },
    ratios: { solvedCount: 0, correctCount: 0, stars: 0 },
  },
  spentStars: 0,
  bestCombo: 0,
  wrongConquered: 0,
  ownedItems: [DEFAULT_CHARACTER],
  equipped: { character: DEFAULT_CHARACTER },
  daily: { date: '', solved: 0 },
  attendance: [],
  timeAttackBest: 0,
  bossCleared: [],
  inventory: {},
  boostRemaining: 0,
};

export const BADGE_DEFINITIONS: {
  id: string;
  name: string;
  desc: string;
  image: GameAssetKey;
}[] = [
  { id: 'first_step', name: '첫 걸음', desc: '첫 문제를 맞혔어요!', image: 'badgeFirstStep' },
  {
    id: 'factor_pro',
    name: '약수 탐정',
    desc: '약수와 배수 문제를 5개 이상 맞혔어요!',
    image: 'topicFactors',
  },
  {
    id: 'fraction_master',
    name: '분수 연금술사',
    desc: '분수 연산 문제를 5개 이상 맞혔어요!',
    image: 'topicFractions',
  },
  {
    id: 'decimal_wiz',
    name: '소수 마법사',
    desc: '소수 연산 문제를 5개 이상 맞혔어요!',
    image: 'topicDecimals',
  },
  {
    id: 'geometry_architect',
    name: '도형 건축가',
    desc: '도형 넓이 문제를 5개 이상 맞혔어요!',
    image: 'topicGeometry',
  },
  {
    id: 'ratio_master',
    name: '비율의 달인',
    desc: '비와 비율 문제를 5개 이상 맞혔어요!',
    image: 'topicRatios',
  },
  {
    id: 'star_collector',
    name: '별자리 수집가',
    desc: '별을 20개 이상 모았어요!',
    image: 'badgeStar',
  },
  { id: 'math_hero', name: '수학 슈퍼히어로', desc: '레벨 5에 도달했어요!', image: 'badgeHero' },
  { id: 'combo_5', name: '콤보 마스터', desc: '5문제를 연속으로 맞혔어요!', image: 'badgeCombo' },
  {
    id: 'wrong_conqueror',
    name: '오답 정복자',
    desc: '오답 노트 문제를 5개 다시 맞혔어요!',
    image: 'badgeWrong',
  },
  {
    id: 'attendance_7',
    name: '꾸준함 챔피언',
    desc: '7일 연속으로 오늘의 미션을 끝냈어요!',
    image: 'badgeAttendance',
  },
  {
    id: 'time_attack_10',
    name: '번개 계산왕',
    desc: '타임어택에서 10문제 이상 맞혔어요!',
    image: 'badgeSpeed',
  },
  {
    id: 'boss_slayer',
    name: '보스 사냥꾼',
    desc: '보스전을 처음으로 이겼어요!',
    image: 'badgeBoss',
  },
];

const BADGE_CHECKS: Record<string, (s: UserStats) => boolean> = {
  first_step: (s) => s.totalCorrect >= 1,
  factor_pro: (s) => s.topicProgress.factors.correctCount >= 5,
  fraction_master: (s) => s.topicProgress.fractions.correctCount >= 5,
  decimal_wiz: (s) => s.topicProgress.decimals.correctCount >= 5,
  geometry_architect: (s) => s.topicProgress.geometry.correctCount >= 5,
  ratio_master: (s) => s.topicProgress.ratios.correctCount >= 5,
  star_collector: (s) => s.stars >= 20,
  math_hero: (s) => s.level >= 5,
  combo_5: (s) => s.bestCombo >= 5,
  wrong_conqueror: (s) => s.wrongConquered >= 5,
  attendance_7: (s) => getAttendanceStreak(s) >= 7,
  time_attack_10: (s) => s.timeAttackBest >= 10,
  boss_slayer: (s) => s.bossCleared.length >= 1,
};

export function dateKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function getAttendanceStreak(stats: UserStats): number {
  const done = new Set(stats.attendance);
  const day = new Date();
  if (!done.has(dateKey(day))) day.setDate(day.getDate() - 1);
  let streak = 0;
  while (done.has(dateKey(day))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

export function getStats(): UserStats {
  const base = structuredClone(defaultStats);
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    const stats: UserStats = {
      ...base,
      ...parsed,
      topicProgress: {
        ...base.topicProgress,
        ...(parsed.topicProgress || {}),
      },
      equipped: { ...base.equipped, ...(parsed.equipped || {}) },
    };
    if (!stats.ownedItems.includes(DEFAULT_CHARACTER)) stats.ownedItems.unshift(DEFAULT_CHARACTER);
    return stats;
  } catch {
    return base;
  }
}

export function saveStats(stats: UserStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// Every star-giving action ends here: recalculates level, awards badges and saves.
function commitReward(stats: UserStats, bonusStars = 0, missionCompleted = false): RewardResult {
  const prevLevel = stats.level;
  // Level calculation: Every 10 stars = 1 level up
  stats.level = Math.max(1, Math.floor(stats.stars / 10) + 1);
  const newBadges = BADGE_DEFINITIONS.map((b) => b.id).filter(
    (id) => !stats.badges.includes(id) && BADGE_CHECKS[id](stats),
  );
  stats.badges.push(...newBadges);
  saveStats(stats);
  return {
    updatedStats: stats,
    newBadges,
    leveledUp: stats.level > prevLevel,
    bonusStars,
    missionCompleted,
  };
}

export function recordProblemResult(topicId: TopicId, isCorrect: boolean, combo = 0): RewardResult {
  const stats = getStats();
  let bonusStars = 0;

  stats.totalSolved += 1;
  const currentTopic = stats.topicProgress[topicId] || {
    solvedCount: 0,
    correctCount: 0,
    stars: 0,
  };
  currentTopic.solvedCount += 1;

  if (isCorrect) {
    stats.totalCorrect += 1;
    stats.stars += 2;
    currentTopic.correctCount += 1;
    currentTopic.stars += 2;
    stats.bestCombo = Math.max(stats.bestCombo, combo);
    if (combo > 0 && combo % 3 === 0) bonusStars += 1;
  }

  stats.topicProgress[topicId] = currentTopic;

  if (stats.boostRemaining > 0) {
    stats.boostRemaining -= 1;
    if (isCorrect) bonusStars += XP_BOOST_STARS;
  }

  const today = todayKey();
  if (stats.daily.date !== today) stats.daily = { date: today, solved: 0 };
  stats.daily.solved += 1;
  const missionCompleted =
    stats.daily.solved === DAILY_MISSION_GOAL && !stats.attendance.includes(today);
  if (missionCompleted) {
    stats.attendance.push(today);
    bonusStars += DAILY_MISSION_BONUS;
  }

  stats.stars += bonusStars;
  return commitReward(stats, bonusStars, missionCompleted);
}

export function recordWrongConquered(): RewardResult {
  const stats = getStats();
  stats.wrongConquered += 1;
  stats.stars += 1;
  return commitReward(stats);
}

export function recordTimeAttack(correctCount: number): RewardResult & { isNewBest: boolean } {
  const stats = getStats();
  const isNewBest = correctCount > stats.timeAttackBest;
  if (isNewBest) stats.timeAttackBest = correctCount;
  stats.stars += correctCount;
  return { ...commitReward(stats), isNewBest };
}

export function recordBossClear(topicId: TopicId): RewardResult {
  const stats = getStats();
  if (!stats.bossCleared.includes(topicId)) stats.bossCleared.push(topicId);
  stats.stars += BOSS_CLEAR_STARS;
  return commitReward(stats);
}

export function buyItem(itemId: string): boolean {
  const stats = getStats();
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item || stats.ownedItems.includes(itemId)) return false;
  if (stats.stars - stats.spentStars < item.price) return false;
  stats.spentStars += item.price;
  stats.ownedItems.push(itemId);
  stats.equipped = { ...stats.equipped, [item.slot]: itemId };
  saveStats(stats);
  return true;
}

export function equipItem(itemId: string | null, slot: ShopSlot): void {
  const stats = getStats();
  if (itemId === null && slot === 'character') return; // character slot cannot be empty
  if (itemId !== null) {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item || item.slot !== slot || !stats.ownedItems.includes(itemId)) return;
  }
  stats.equipped = { ...stats.equipped, [slot]: itemId ?? undefined };
  saveStats(stats);
}

export function getEquippedCharacter(stats: UserStats): ShopItem {
  const characters = SHOP_ITEMS.filter((i) => i.slot === 'character');
  return characters.find((i) => i.id === stats.equipped.character) ?? characters[0];
}

export function buyPowerUp(id: PowerUpId): boolean {
  const stats = getStats();
  const powerUp = POWER_UPS.find((p) => p.id === id);
  const count = stats.inventory[id] ?? 0;
  if (!powerUp || count >= POWER_UP_MAX) return false;
  if (stats.stars - stats.spentStars < powerUp.price) return false;
  stats.spentStars += powerUp.price;
  stats.inventory = { ...stats.inventory, [id]: count + 1 };
  saveStats(stats);
  return true;
}

export function consumePowerUp(id: PowerUpId): boolean {
  const stats = getStats();
  const count = stats.inventory[id] ?? 0;
  if (count <= 0) return false;
  stats.inventory = { ...stats.inventory, [id]: count - 1 };
  if (id === 'xp_booster') stats.boostRemaining += XP_BOOST_PROBLEMS;
  saveStats(stats);
  return true;
}

export function getWrongNotes(): WrongNoteItem[] {
  try {
    const raw = localStorage.getItem(WRONG_NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWrongNote(item: WrongNoteItem): void {
  const notes = getWrongNotes();
  // Filter out duplicate problem ID
  const filtered = notes.filter((n) => n.problem.id !== item.problem.id);
  filtered.unshift(item); // Put on top
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(filtered.slice(0, 50))); // max 50
}

export function removeWrongNote(problemId: string): void {
  const notes = getWrongNotes();
  const filtered = notes.filter((n) => n.problem.id !== problemId);
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(filtered));
}

export function exportData(): string {
  return JSON.stringify(
    {
      app: 'mykid-math',
      version: 1,
      exportedAt: new Date().toISOString(),
      stats: getStats(),
      wrongNotes: getWrongNotes(),
    },
    null,
    2,
  );
}

export function importData(json: string): void {
  const data = JSON.parse(json);
  if (
    data?.app !== 'mykid-math' ||
    typeof data.stats?.stars !== 'number' ||
    typeof data.stats?.topicProgress !== 'object' ||
    !Array.isArray(data.wrongNotes)
  ) {
    throw new Error('Invalid backup file');
  }
  saveStats(data.stats);
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(data.wrongNotes.slice(0, 50)));
}
