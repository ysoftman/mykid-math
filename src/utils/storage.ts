import type { TopicId, UserStats, WrongNoteItem } from '../types/math';

const STATS_KEY = 'mykid_math_stats';
const WRONG_NOTES_KEY = 'mykid_math_wrong_notes';

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
};

export const BADGE_DEFINITIONS = [
  { id: 'first_step', name: '첫 걸음', desc: '첫 문제를 맞혔어요!', icon: '🌱' },
  {
    id: 'factor_pro',
    name: '약수 탐정',
    desc: '약수와 배수 문제를 5개 이상 맞혔어요!',
    icon: '🔍',
  },
  {
    id: 'fraction_master',
    name: '분수 연금술사',
    desc: '분수 연산 문제를 5개 이상 맞혔어요!',
    icon: '🍕',
  },
  {
    id: 'decimal_wiz',
    name: '소수 마법사',
    desc: '소수 연산 문제를 5개 이상 맞혔어요!',
    icon: '✨',
  },
  {
    id: 'geometry_architect',
    name: '도형 건축가',
    desc: '도형 넓이 문제를 5개 이상 맞혔어요!',
    icon: '📐',
  },
  {
    id: 'ratio_master',
    name: '비율의 달인',
    desc: '비와 비율 문제를 5개 이상 맞혔어요!',
    icon: '⚖️',
  },
  { id: 'star_collector', name: '별자리 수집가', desc: '별을 20개 이상 모았어요!', icon: '⭐' },
  { id: 'math_hero', name: '수학 슈퍼히어로', desc: '레벨 5에 도달했어요!', icon: '👑' },
];

export function getStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;
    const parsed = JSON.parse(raw);
    return {
      ...defaultStats,
      ...parsed,
      topicProgress: {
        ...defaultStats.topicProgress,
        ...(parsed.topicProgress || {}),
      },
    };
  } catch {
    return defaultStats;
  }
}

export function saveStats(stats: UserStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordProblemResult(
  topicId: TopicId,
  isCorrect: boolean,
): { updatedStats: UserStats; newBadges: string[]; leveledUp: boolean } {
  const stats = getStats();
  const prevLevel = stats.level;
  const newBadges: string[] = [];

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
  }

  stats.topicProgress[topicId] = currentTopic;

  // Level calculation: Every 10 stars = 1 level up
  const calcLevel = Math.max(1, Math.floor(stats.stars / 10) + 1);
  const leveledUp = calcLevel > prevLevel;
  stats.level = calcLevel;

  // Check Badges
  if (stats.totalCorrect >= 1 && !stats.badges.includes('first_step')) {
    stats.badges.push('first_step');
    newBadges.push('first_step');
  }
  if (stats.topicProgress.factors.correctCount >= 5 && !stats.badges.includes('factor_pro')) {
    stats.badges.push('factor_pro');
    newBadges.push('factor_pro');
  }
  if (
    stats.topicProgress.fractions.correctCount >= 5 &&
    !stats.badges.includes('fraction_master')
  ) {
    stats.badges.push('fraction_master');
    newBadges.push('fraction_master');
  }
  if (stats.topicProgress.decimals.correctCount >= 5 && !stats.badges.includes('decimal_wiz')) {
    stats.badges.push('decimal_wiz');
    newBadges.push('decimal_wiz');
  }
  if (
    stats.topicProgress.geometry.correctCount >= 5 &&
    !stats.badges.includes('geometry_architect')
  ) {
    stats.badges.push('geometry_architect');
    newBadges.push('geometry_architect');
  }
  if (stats.topicProgress.ratios.correctCount >= 5 && !stats.badges.includes('ratio_master')) {
    stats.badges.push('ratio_master');
    newBadges.push('ratio_master');
  }
  if (stats.stars >= 20 && !stats.badges.includes('star_collector')) {
    stats.badges.push('star_collector');
    newBadges.push('star_collector');
  }
  if (stats.level >= 5 && !stats.badges.includes('math_hero')) {
    stats.badges.push('math_hero');
    newBadges.push('math_hero');
  }

  saveStats(stats);
  return { updatedStats: stats, newBadges, leveledUp };
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
