import { afterEach, beforeEach, expect, setSystemTime, test } from 'bun:test';
import {
  BOSS_CLEAR_STARS,
  buyItem,
  buyPowerUp,
  consumePowerUp,
  DAILY_MISSION_BONUS,
  DAILY_MISSION_GOAL,
  equipItem,
  getAttendanceStreak,
  getEquippedCharacter,
  getStats,
  POWER_UP_MAX,
  recordBossClear,
  recordProblemResult,
  recordTimeAttack,
  recordWrongConquered,
  saveStats,
  todayKey,
} from './storage';

const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
  key: () => null,
  get length() {
    return store.size;
  },
} as Storage;

// Local noon avoids any timezone edge around midnight.
const day = (d: number) => new Date(2026, 9, d, 12);

beforeEach(() => {
  store.clear();
  setSystemTime(day(10));
});
afterEach(() => setSystemTime());

test('todayKey uses local YYYY-MM-DD', () => {
  expect(todayKey()).toBe('2026-10-10');
  setSystemTime(new Date(2026, 0, 5, 0, 30));
  expect(todayKey()).toBe('2026-01-05');
});

test('fresh stats are not shared between calls', () => {
  getStats().badges.push('x');
  expect(getStats().badges).toEqual([]);
});

test('combo bonus every 3rd consecutive correct answer', () => {
  expect(recordProblemResult('factors', true, 1).bonusStars).toBe(0);
  expect(recordProblemResult('factors', true, 2).bonusStars).toBe(0);
  const r = recordProblemResult('factors', true, 3);
  expect(r.bonusStars).toBe(1);
  expect(r.updatedStats.stars).toBe(7);
  expect(r.updatedStats.bestCombo).toBe(3);
  expect(recordProblemResult('factors', false, 0).bonusStars).toBe(0);
});

test('combo_5 badge from bestCombo', () => {
  saveStats({ ...getStats(), daily: { date: todayKey(), solved: 99 } });
  const r = recordProblemResult('fractions', true, 5);
  expect(r.newBadges).toContain('combo_5');
});

test('daily mission completes once and gives bonus once', () => {
  let completed = 0;
  let bonus = 0;
  for (let i = 0; i < DAILY_MISSION_GOAL + 3; i++) {
    const r = recordProblemResult('decimals', false);
    if (r.missionCompleted) completed += 1;
    bonus += r.bonusStars;
  }
  const s = getStats();
  expect(completed).toBe(1);
  expect(bonus).toBe(DAILY_MISSION_BONUS);
  expect(s.stars).toBe(DAILY_MISSION_BONUS);
  expect(s.attendance).toEqual(['2026-10-10']);
  expect(s.daily).toEqual({ date: '2026-10-10', solved: DAILY_MISSION_GOAL + 3 });
});

test('daily progress resets on a new day', () => {
  recordProblemResult('ratios', true, 1);
  recordProblemResult('ratios', true, 2);
  setSystemTime(day(11));
  const r = recordProblemResult('ratios', true, 3);
  expect(r.updatedStats.daily).toEqual({ date: '2026-10-11', solved: 1 });
});

test('attendance streak counts back from today or yesterday', () => {
  const s = getStats();
  s.attendance = ['2026-10-05', '2026-10-07', '2026-10-08', '2026-10-09'];
  expect(getAttendanceStreak(s)).toBe(3); // today not done yet
  s.attendance.push('2026-10-10');
  expect(getAttendanceStreak(s)).toBe(4);
  setSystemTime(day(12));
  expect(getAttendanceStreak(s)).toBe(0);
});

test('streak crosses month boundary and earns attendance_7', () => {
  setSystemTime(new Date(2026, 10, 2, 12)); // Nov 2
  saveStats({
    ...getStats(),
    attendance: [
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ],
  });
  for (let i = 0; i < DAILY_MISSION_GOAL - 1; i++) recordProblemResult('geometry', false);
  const r = recordProblemResult('geometry', false);
  expect(r.missionCompleted).toBe(true);
  expect(getAttendanceStreak(r.updatedStats)).toBe(7);
  expect(r.newBadges).toContain('attendance_7');
});

test('level up and badges are reported once', () => {
  saveStats({ ...getStats(), stars: 9, daily: { date: todayKey(), solved: 99 } });
  const r = recordProblemResult('factors', true, 1);
  expect(r.leveledUp).toBe(true);
  expect(r.updatedStats.level).toBe(2);
  expect(r.newBadges).toEqual(['first_step']);
  expect(recordProblemResult('factors', true, 2).newBadges).toEqual([]);
});

test('wrong conquered, time attack and boss rewards', () => {
  for (let i = 0; i < 4; i++) recordWrongConquered();
  const w = recordWrongConquered();
  expect(w.updatedStats.wrongConquered).toBe(5);
  expect(w.newBadges).toContain('wrong_conqueror');

  const t1 = recordTimeAttack(10);
  expect(t1.isNewBest).toBe(true);
  expect(t1.newBadges).toContain('time_attack_10');
  const t2 = recordTimeAttack(4);
  expect(t2.isNewBest).toBe(false);
  expect(t2.updatedStats.timeAttackBest).toBe(10);

  const before = getStats().stars;
  const b1 = recordBossClear('fractions');
  expect(b1.updatedStats.stars).toBe(before + BOSS_CLEAR_STARS);
  expect(b1.newBadges).toContain('boss_slayer');
  expect(recordBossClear('fractions').updatedStats.bossCleared).toEqual(['fractions']);
});

test('buyItem rejects unknown, poor and duplicate purchases', () => {
  expect(buyItem('nope')).toBe(false);
  saveStats({ ...getStats(), stars: 12 });
  expect(buyItem('hat_tophat')).toBe(true); // 10
  let s = getStats();
  expect(s.spentStars).toBe(10);
  expect(s.ownedItems).toEqual(['char_hero', 'hat_tophat']);
  expect(s.equipped.hat).toBe('hat_tophat');
  expect(buyItem('hat_tophat')).toBe(false); // already owned
  expect(buyItem('hat_cap')).toBe(false); // 5 > 2 spendable
  s = getStats();
  expect(s.stars).toBe(12);
  expect(s.level).toBe(1);
});

test('equipItem only equips owned items into the right slot', () => {
  saveStats({ ...getStats(), stars: 40 });
  buyItem('pet_dog');
  buyItem('pet_cat');
  expect(getStats().equipped.pet).toBe('pet_cat');
  equipItem('pet_dog', 'pet');
  expect(getStats().equipped.pet).toBe('pet_dog');
  equipItem('pet_fox', 'pet'); // not owned
  equipItem('pet_cat', 'hat'); // wrong slot
  expect(getStats().equipped).toEqual({ character: 'char_hero', pet: 'pet_dog' });
  equipItem(null, 'pet');
  expect(getStats().equipped.pet).toBeUndefined();
});

test('old saves without new fields still work', () => {
  store.set(
    'mykid_math_stats',
    JSON.stringify({
      totalSolved: 3,
      totalCorrect: 2,
      stars: 4,
      level: 1,
      badges: ['first_step'],
      topicProgress: { factors: { solvedCount: 3, correctCount: 2, stars: 4 } },
    }),
  );
  const s = getStats();
  expect(s.spentStars).toBe(0);
  expect(s.ownedItems).toEqual(['char_hero']);
  expect(s.equipped.character).toBe('char_hero');
  expect(s.inventory).toEqual({});
  expect(s.boostRemaining).toBe(0);
  expect(s.topicProgress.ratios.solvedCount).toBe(0);
  const r = recordProblemResult('factors', true, 3);
  expect(r.updatedStats.stars).toBe(7);
  expect(r.updatedStats.daily.solved).toBe(1);
  expect(getAttendanceStreak(r.updatedStats)).toBe(0);
  expect(buyItem('hat_cap')).toBe(true);
});

test('old saves with equipped items still get the default character', () => {
  store.set(
    'mykid_math_stats',
    JSON.stringify({ stars: 30, ownedItems: ['pet_dog'], equipped: { pet: 'pet_dog' } }),
  );
  const s = getStats();
  expect(s.ownedItems).toEqual(['char_hero', 'pet_dog']);
  expect(s.equipped).toEqual({ character: 'char_hero', pet: 'pet_dog' });
  expect(getEquippedCharacter(s).id).toBe('char_hero');
  expect(getEquippedCharacter(s).image).toBe('hero');
});

test('characters can be bought and equipped, but the slot cannot be emptied', () => {
  expect(buyItem('char_hero')).toBe(false); // owned by default
  saveStats({ ...getStats(), stars: 50 });
  expect(buyItem('char_wizard')).toBe(true);
  expect(getEquippedCharacter(getStats()).id).toBe('char_wizard');
  expect(buyItem('char_explorer')).toBe(false); // 30 > 20 spendable
  equipItem('char_hero', 'character');
  expect(getStats().equipped.character).toBe('char_hero');
  equipItem('char_explorer', 'character'); // not owned
  equipItem(null, 'character'); // ignored
  expect(getStats().equipped.character).toBe('char_hero');
});

test('buyPowerUp checks spendable stars and the max count', () => {
  expect(buyPowerUp('shield')).toBe(false); // 0 stars
  saveStats({ ...getStats(), stars: 100 });
  for (let i = 0; i < POWER_UP_MAX; i++) expect(buyPowerUp('time_charge')).toBe(true);
  expect(buyPowerUp('time_charge')).toBe(false); // max reached
  const s = getStats();
  expect(s.inventory.time_charge).toBe(POWER_UP_MAX);
  expect(s.spentStars).toBe(6 * POWER_UP_MAX);
  saveStats({ ...getStats(), stars: 6 * POWER_UP_MAX + 6 }); // 6 spendable
  expect(buyPowerUp('xp_booster')).toBe(false); // costs 10
  expect(buyPowerUp('heart_recover')).toBe(true); // costs 6
  expect(buyPowerUp('heart_recover')).toBe(false); // 0 spendable
  expect(getStats().inventory).toEqual({ time_charge: POWER_UP_MAX, heart_recover: 1 });
});

test('consumePowerUp decrements and fails at zero', () => {
  expect(consumePowerUp('shield')).toBe(false);
  saveStats({ ...getStats(), inventory: { shield: 1 } });
  expect(consumePowerUp('shield')).toBe(true);
  expect(getStats().inventory.shield).toBe(0);
  expect(getStats().boostRemaining).toBe(0);
  expect(consumePowerUp('shield')).toBe(false);
});

test('xp booster gives +2 per correct answer for 5 recorded answers', () => {
  saveStats({
    ...getStats(),
    inventory: { xp_booster: 1 },
    daily: { date: todayKey(), solved: 99 },
  });
  expect(consumePowerUp('xp_booster')).toBe(true);
  expect(getStats().boostRemaining).toBe(5);

  expect(recordProblemResult('factors', true, 1).bonusStars).toBe(2);
  expect(recordProblemResult('factors', false, 0).bonusStars).toBe(0); // still uses one
  expect(recordProblemResult('factors', true, 1).bonusStars).toBe(2);
  expect(recordProblemResult('factors', true, 2).bonusStars).toBe(2);
  const last = recordProblemResult('factors', true, 3);
  expect(last.bonusStars).toBe(3); // boost + combo
  expect(last.updatedStats.boostRemaining).toBe(0);
  expect(last.updatedStats.stars).toBe(4 * 2 + 4 * 2 + 1);

  const after = recordProblemResult('factors', true, 4);
  expect(after.bonusStars).toBe(0);
  expect(after.updatedStats.boostRemaining).toBe(0);
});
