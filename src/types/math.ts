export type TopicId = 'factors' | 'fractions' | 'decimals' | 'geometry' | 'ratios';

export interface TopicInfo {
  id: TopicId;
  title: string;
  grade: string;
  icon: string;
  badge: string;
  description: string;
  color: string;
  accentColor: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

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
}

export interface WrongNoteItem {
  id: string;
  problem: Problem;
  userAnswer: string;
  solvedAt: string;
}
