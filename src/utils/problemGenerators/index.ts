import type { Difficulty, Problem, TopicId, TopicInfo } from '../../types/math';
import { GAME_ASSETS } from '../gameAssets';
import { generateAveragesProblem } from './averages';
import { generateDecimalMulProblem } from './decimalMul';
import { generateDecimalProblem } from './decimals';
import { generateFactorProblem } from './factors';
import { generateFractionProblem } from './fractions';
import { generateGeometryProblem } from './geometry';
import { generateRatioProblem } from './ratios';
import { generateSolidsProblem } from './solids';
import { generateSymmetryProblem } from './symmetry';

export const TOPICS: TopicInfo[] = [
  {
    id: 'factors',
    title: '약수와 배수',
    grade: '5학년 1학기',
    image: GAME_ASSETS.topicFactors,
    badge: '약수 탐정',
    description: '최대공약수, 최소공배수와 배수의 원리를 탐구해요.',
    color: 'from-amber-500 to-orange-500',
    accentColor: '#f59e0b',
  },
  {
    id: 'fractions',
    title: '분수의 덧셈·뺄셈·곱셈·나눗셈',
    grade: '5~6학년',
    image: GAME_ASSETS.topicFractions,
    badge: '분수 연금술사',
    description: '통분, 약분, 분수의 곱셈과 나눗셈을 그림으로 보며 정복해요.',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
  },
  {
    id: 'decimals',
    title: '소수의 연산',
    grade: '5~6학년',
    image: GAME_ASSETS.topicDecimals,
    badge: '소수 마법사',
    description: '모눈 격자와 자릿수 이동으로 소수 곱셈과 나눗셈을 마스터해요.',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
  },
  {
    id: 'geometry',
    title: '다각형과 원의 넓이',
    grade: '5~6학년',
    image: GAME_ASSETS.topicGeometry,
    badge: '도형 건축가',
    description: '삼각형, 사다리꼴, 원의 넓이 공식이 왜 나오는지 직접 변형해봐요.',
    color: 'from-purple-500 to-pink-600',
    accentColor: '#a855f7',
  },
  {
    id: 'symmetry',
    title: '합동과 대칭',
    grade: '5학년 2학기',
    image: GAME_ASSETS.topicSymmetry,
    badge: '대칭 탐험가',
    description: '도형을 뒤집고 돌려 포개며 합동, 선대칭, 점대칭을 배워요.',
    color: 'from-cyan-500 to-sky-600',
    accentColor: '#06b6d4',
  },
  {
    id: 'decimalMul',
    title: '소수의 곱셈',
    grade: '5학년 2학기',
    image: GAME_ASSETS.topicDecimalMul,
    badge: '소수 곱셈 챔피언',
    description: '소수끼리 곱할 때 소수점 아래 자리 수가 어떻게 정해지는지 익혀요.',
    color: 'from-sky-500 to-blue-600',
    accentColor: '#0ea5e9',
  },
  {
    id: 'solids',
    title: '직육면체와 정육면체',
    grade: '5학년 2학기',
    image: GAME_ASSETS.topicSolids,
    badge: '상자 설계사',
    description: '면, 모서리, 꼭짓점을 세고 전개도를 접어 직육면체와 정육면체를 알아봐요.',
    color: 'from-violet-500 to-purple-600',
    accentColor: '#8b5cf6',
  },
  {
    id: 'averages',
    title: '평균과 가능성',
    grade: '5학년 2학기',
    image: GAME_ASSETS.topicAverages,
    badge: '평균 예측가',
    description: '자료의 평균을 구하고 일이 일어날 가능성을 말과 수로 나타내요.',
    color: 'from-green-500 to-lime-600',
    accentColor: '#22c55e',
  },
  {
    id: 'ratios',
    title: '비와 비율 · 비례배분',
    grade: '6학년 1~2학기',
    image: GAME_ASSETS.topicRatios,
    badge: '비율의 달인',
    description: '비율, 백분율(%), 비례식과 실생활 비례배분을 익혀요.',
    color: 'from-rose-500 to-red-600',
    accentColor: '#f43f5e',
  },
];

const recentQuestions: string[] = [];

export function generateProblem(topicId: TopicId, difficulty: Difficulty = 'medium'): Problem {
  let problem = generateFreshProblem(topicId, difficulty);
  for (let i = 0; i < 20 && recentQuestions.includes(problem.question); i++) {
    problem = generateFreshProblem(topicId, difficulty);
  }
  recentQuestions.push(problem.question);
  if (recentQuestions.length > 30) recentQuestions.shift();
  return problem;
}

function generateFreshProblem(topicId: TopicId, difficulty: Difficulty): Problem {
  switch (topicId) {
    case 'factors':
      return generateFactorProblem(difficulty);
    case 'fractions':
      return generateFractionProblem(difficulty);
    case 'decimals':
      return generateDecimalProblem(difficulty);
    case 'geometry':
      return generateGeometryProblem(difficulty);
    case 'symmetry':
      return generateSymmetryProblem(difficulty);
    case 'decimalMul':
      return generateDecimalMulProblem(difficulty);
    case 'solids':
      return generateSolidsProblem(difficulty);
    case 'averages':
      return generateAveragesProblem(difficulty);
    case 'ratios':
      return generateRatioProblem(difficulty);
  }
}
