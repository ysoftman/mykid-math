import type { PowerUpId, TopicId } from '../types/math';
import { generateProblem } from './problemGenerators';
import {
  addWrongNote,
  BADGE_DEFINITIONS,
  DAILY_MISSION_GOAL,
  dateKey,
  getStats,
  POWER_UP_MAX,
  POWER_UPS,
  SHOP_ITEMS,
  saveStats,
  todayKey,
} from './storage';

// Local testing only (the button is rendered behind import.meta.env.DEV, so builds drop it):
// unlocks every badge, shop item and power-up, fills a 7-day attendance streak, leaves today's
// mission one problem short and adds one wrong note per topic for the review screen.
export function unlockEverything(): void {
  const stats = getStats();
  const topics = Object.keys(stats.topicProgress) as TopicId[];
  for (const topic of topics) {
    const progress = stats.topicProgress[topic];
    progress.solvedCount = Math.max(progress.solvedCount, 10);
    progress.correctCount = Math.max(progress.correctCount, 5);
  }
  stats.totalSolved = Math.max(stats.totalSolved, 50);
  stats.totalCorrect = Math.max(stats.totalCorrect, 25);
  stats.stars = Math.max(stats.stars, 500);
  stats.level = Math.floor(stats.stars / 10) + 1;
  stats.badges = BADGE_DEFINITIONS.map((b) => b.id);
  stats.ownedItems = SHOP_ITEMS.map((item) => item.id);
  stats.inventory = Object.fromEntries(POWER_UPS.map((p) => [p.id, POWER_UP_MAX])) as Record<
    PowerUpId,
    number
  >;
  stats.bossCleared = topics;
  stats.timeAttackBest = Math.max(stats.timeAttackBest, 10);
  stats.bestCombo = Math.max(stats.bestCombo, 5);
  stats.wrongConquered = Math.max(stats.wrongConquered, 5);

  const lastWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i - 1);
    return dateKey(d);
  });
  stats.attendance = [...new Set([...stats.attendance, ...lastWeek])];
  if (!stats.attendance.includes(todayKey())) {
    stats.daily = { date: todayKey(), solved: DAILY_MISSION_GOAL - 1 };
  }
  saveStats(stats);

  for (const topic of topics) {
    addWrongNote({
      id: `wrong_dev_${topic}`,
      problem: generateProblem(topic, 'medium'),
      userAnswer: '0',
      solvedAt: new Date().toLocaleDateString('ko-KR'),
    });
  }
}
