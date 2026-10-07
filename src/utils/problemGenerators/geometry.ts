import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt } from '../mathHelpers';

export function generateGeometryProblem(difficulty: Difficulty): Problem {
  const shape = pickOne(['triangle', 'parallelogram', 'trapezoid', 'rhombus', 'circle']);
  const id = `geo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (shape === 'triangle') {
    const base = randomInt(4, 14);
    // Make either base or height even so area is integer
    const height = base % 2 === 0 ? randomInt(3, 12) : randomInt(2, 6) * 2;
    const area = (base * height) / 2;

    return {
      id,
      topicId: 'geometry',
      subtopic: '삼각형의 넓이',
      difficulty,
      question: `밑변의 길이가 ${base}cm이고, 높이가 ${height}cm인 삼각형의 넓이는 몇 cm²인가요?`,
      hint: `삼각형의 넓이는 같은 밑변과 높이를 가진 평행사변형 넓이의 절반(÷ 2)이에요! 공식: (밑변 × 높이) ÷ 2`,
      answerType: 'number',
      correctAnswer: area,
      diagramType: 'triangle',
      diagramData: { base, height },
      explanations: [
        {
          title: '1단계: 삼각형 넓이 공식 떠올리기',
          content: `삼각형의 넓이 = (밑변 × 높이) ÷ 2`,
        },
        {
          title: '2단계: 수치 대입하기',
          content: `(${base} × ${height}) ÷ 2 = ${base * height} ÷ 2 = ${area}cm²`,
        },
      ],
    };
  }

  if (shape === 'parallelogram') {
    const base = randomInt(4, 15);
    const height = randomInt(3, 12);
    const area = base * height;

    return {
      id,
      topicId: 'geometry',
      subtopic: '평행사변형의 넓이',
      difficulty,
      question: `밑변의 길이가 ${base}cm이고, 높이가 ${height}cm인 평행사변형의 넓이는 몇 cm²인가요?`,
      hint: `평행사변형을 한쪽에서 잘라 다른 쪽에 붙이면 직사각형이 돼요! 공식: 밑변 × 높이`,
      answerType: 'number',
      correctAnswer: area,
      diagramType: 'parallelogram',
      diagramData: { base, height },
      explanations: [
        {
          title: '1단계: 공식 확인',
          content: `평행사변형의 넓이 = 밑변 × 높이`,
        },
        {
          title: '2단계: 계산하기',
          content: `${base} × ${height} = ${area}cm²`,
        },
      ],
    };
  }

  if (shape === 'trapezoid') {
    const top = randomInt(3, 8);
    const bottom = randomInt(5, 12);
    // Make sum or height even
    const sum = top + bottom;
    const height = sum % 2 === 0 ? randomInt(4, 10) : randomInt(2, 5) * 2;
    const area = (sum * height) / 2;

    return {
      id,
      topicId: 'geometry',
      subtopic: '사다리꼴의 넓이',
      difficulty,
      question: `윗변의 길이가 ${top}cm, 아랫변의 길이가 ${bottom}cm이고, 높이가 ${height}cm인 사다리꼴의 넓이는 몇 cm²인가요?`,
      hint: `사다리꼴 2개를 엇갈려 붙이면 (윗변+아랫변)을 밑변으로 하는 평행사변형이 돼요! 공식: (윗변 + 아랫변) × 높이 ÷ 2`,
      answerType: 'number',
      correctAnswer: area,
      diagramType: 'trapezoid',
      diagramData: { top, bottom, height },
      explanations: [
        {
          title: '1단계: 윗변과 아랫변 더하기',
          content: `윗변 + 아랫변 = ${top} + ${bottom} = ${sum}cm`,
        },
        {
          title: '2단계: 높이 곱하고 2로 나누기',
          content: `(${sum} × ${height}) ÷ 2 = ${sum * height} ÷ 2 = ${area}cm²`,
        },
      ],
    };
  }

  if (shape === 'rhombus') {
    const d1 = randomInt(4, 12);
    const d2 = d1 % 2 === 0 ? randomInt(3, 10) : randomInt(2, 5) * 2;
    const area = (d1 * d2) / 2;

    return {
      id,
      topicId: 'geometry',
      subtopic: '마름모의 넓이',
      difficulty,
      question: `두 대각선의 길이가 각각 ${d1}cm, ${d2}cm인 마름모의 넓이는 몇 cm²인가요?`,
      hint: `마름모를 둘러싼 직사각형 넓이의 절반이에요! 공식: (한 대각선 × 다른 대각선) ÷ 2`,
      answerType: 'number',
      correctAnswer: area,
      diagramType: 'rhombus',
      diagramData: { d1, d2 },
      explanations: [
        {
          title: '1단계: 대각선 곱하기',
          content: `${d1} × ${d2} = ${d1 * d2}`,
        },
        {
          title: '2단계: 2로 나누기',
          content: `${d1 * d2} ÷ 2 = ${area}cm²`,
        },
      ],
    };
  }

  // Circle area with pi = 3.14
  const radius = randomInt(2, 6);
  const area = Math.round(radius * radius * 3.14 * 100) / 100;

  return {
    id,
    topicId: 'geometry',
    subtopic: '원의 넓이',
    difficulty,
    question: `반지름이 ${radius}cm인 원의 넓이를 구하세요. (단, 원주율은 3.14로 계산합니다)`,
    hint: `원을 무수히 잘게 잘라 이어붙이면 직사각형이 돼요! 공식: 반지름 × 반지름 × 원주율(3.14)`,
    answerType: 'number',
    correctAnswer: area,
    diagramType: 'circle',
    diagramData: { radius },
    explanations: [
      {
        title: '1단계: 원의 넓이 공식',
        content: `원의 넓이 = 반지름 × 반지름 × 원주율`,
      },
      {
        title: '2단계: 수치 계산',
        content: `${radius} × ${radius} × 3.14 = ${radius * radius} × 3.14 = ${area}cm²`,
      },
    ],
  };
}
