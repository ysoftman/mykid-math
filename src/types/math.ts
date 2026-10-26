export type TopicId =
  | 'factors'
  | 'fractions'
  | 'decimals'
  | 'geometry'
  | 'symmetry'
  | 'decimalMul'
  | 'solids'
  | 'averages'
  | 'ratios';

export interface TopicInfo {
  id: TopicId;
  title: string;
  grade: string;
  image: string; // chapter badge art
  badge: string;
  description: string;
  color: string;
  accentColor: string;
}

export type PowerUpId = 'time_charge' | 'heart_recover' | 'shield' | 'xp_booster';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SymmetryFigureId =
  | 'square'
  | 'rectangle'
  | 'equilateral-triangle'
  | 'isosceles-triangle'
  | 'rhombus'
  | 'parallelogram'
  | 'hexagon'
  | 'trapezoid';

export type TriangleSideId = 'AB' | 'BC' | 'CA' | 'DE' | 'EF' | 'FD';

export type ProblemVisual =
  | {
      kind: 'shape-set';
      shapes: { figure: SymmetryFigureId; label: string }[];
    }
  | {
      kind: 'congruent-triangles';
      // Side lengths AB, BC, CA used to draw both triangles to scale
      lengths?: [number, number, number];
      firstSides: Partial<Record<TriangleSideId, string>>;
      secondSides?: Partial<Record<TriangleSideId, string>>;
    };

export interface StepExplanation {
  title: string;
  content: string;
}

export interface Problem {
  id: string;
  topicId: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  question: string;
  context?: string; // Additional context or scenario
  visual?: ProblemVisual;
  hint: string;
  answerType: 'number' | 'fraction' | 'choice' | 'text';
  correctAnswer: number | string | { whole?: number; num: number; den: number };
  options?: string[]; // If choice
  explanations: StepExplanation[];
}

export interface UserStats {
  totalSolved: number;
  totalCorrect: number;
  stars: number;
  level: number;
  badges: string[];
  topicProgress: Record<
    TopicId,
    {
      solvedCount: number;
      correctCount: number;
      stars: number;
    }
  >;
  spentStars: number; // spendable = stars - spentStars; level still uses total stars
  bestCombo: number;
  wrongConquered: number;
  ownedItems: string[];
  equipped: { hat?: string; pet?: string; prop?: string; theme?: string; character?: string }; // character is always set by getStats
  daily: { date: string; solved: number }; // date = local 'YYYY-MM-DD'
  attendance: string[]; // local dates on which the daily mission was completed
  timeAttackBest: number;
  bossCleared: TopicId[];
  inventory: Partial<Record<PowerUpId, number>>; // power-up counts
  boostRemaining: number; // problems left with the xp booster active
}

export interface WrongNoteItem {
  id: string;
  problem: Problem;
  userAnswer: string;
  solvedAt: string;
}
