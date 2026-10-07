import type { TopicId, TopicInfo, Problem, Difficulty } from '../../types/math';
import { generateFactorProblem } from './factors';
import { generateFractionProblem } from './fractions';
import { generateDecimalProblem } from './decimals';
import { generateGeometryProblem } from './geometry';
import { generateRatioProblem } from './ratios';

export const TOPICS: TopicInfo[] = [
  {
    id: 'factors',
    title: '약수와 배수',
    grade: '5학년 1학기',
    icon: '🔍',
    badge: '약수 탐정',
    description: '최대공약수(GCD), 최소공배수(LCM)와 배수의 원리를 탐구해요.',
    color: 'from-amber-500 to-orange-500',
    accentColor: '#f59e0b',
  },
  {
    id: 'fractions',
    title: '분수의 덧셈·뺄셈·곱셈·나눗셈',
    grade: '5~6학년',
    icon: '🍕',
    badge: '분수 연금술사',
    description: '통분, 약분, 분수의 곱셈과 나눗셈을 그림으로 보며 정복해요.',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
  },
  {
    id: 'decimals',
    title: '소수의 연산',
    grade: '5~6학년',
    icon: '✨',
    badge: '소수 마법사',
    description: '모눈 격자와 자릿수 이동으로 소수 곱셈과 나눗셈을 마스터해요.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
  },
  {
    id: 'geometry',
    title: '다각형과 원의 넓이',
    grade: '5~6학년',
    icon: '📐',
    badge: '도형 건축가',
    description: '삼각형, 사다리꼴, 원의 넓이 공식이 왜 나오는지 직접 변형해봐요.',
    color: 'from-purple-500 to-pink-600',
    accentColor: '#a855f7',
  },
  {
    id: 'ratios',
    title: '비와 비율 · 비례배분',
    grade: '6학년 1~2학기',
    icon: '⚖️',
    badge: '비율의 달인',
    description: '비율, 백분율(%), 비례식과 실생활 비례배분을 익혀요.',
    color: 'from-rose-500 to-red-600',
    accentColor: '#f43f5e',
  },
];

export function generateProblem(topicId: TopicId, difficulty: Difficulty = 'medium'): Problem {
  switch (topicId) {
    case 'factors':
      return generateFactorProblem(difficulty);
    case 'fractions':
      return generateFractionProblem(difficulty);
    case 'decimals':
      return generateDecimalProblem(difficulty);
    case 'geometry':
      return generateGeometryProblem(difficulty);
    case 'ratios':
      return generateRatioProblem(difficulty);
  }
}
