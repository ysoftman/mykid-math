import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt } from '../mathHelpers';
import { KID_CALL } from '../profile';

export function generateGeometryProblem(difficulty: Difficulty): Problem {
  const shape = pickOne([
    'triangle',
    'parallelogram',
    'trapezoid',
    'rhombus',
    'missing_height',
    'circle',
    'rectangle_perimeter',
    'circumference',
    'cuboid_volume',
    'cube_surface_area',
  ]);
  const id = `geo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (shape === 'rectangle_perimeter') {
    const max = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 20 : 40;
    const width = randomInt(2, max);
    const height = randomInt(2, max);
    const perimeter = (width + height) * 2;

    return {
      id,
      topicId: 'geometry',
      subtopic: '직사각형의 둘레',
      difficulty,
      question: `가로가 ${width}cm, 세로가 ${height}cm인 직사각형의 둘레는 몇 cm인가요?`,
      hint: `직사각형은 마주 보는 변의 길이가 같아요. 공식: (가로 + 세로) × 2`,
      answerType: 'number',
      correctAnswer: perimeter,
      explanations: [
        {
          title: '1단계: 둘레 공식',
          content: `직사각형의 둘레 = (가로 + 세로) × 2`,
        },
        {
          title: '2단계: 계산하기',
          content: `(${width} + ${height}) × 2 = ${width + height} × 2 = ${perimeter}cm`,
        },
      ],
    };
  }

  if (shape === 'circumference') {
    const useRadius = difficulty === 'hard';
    const value = difficulty === 'easy' ? randomInt(2, 10) : randomInt(5, 20);
    const diameter = useRadius ? value * 2 : value;
    const answer = Math.round(diameter * 314) / 100;

    return {
      id,
      topicId: 'geometry',
      subtopic: '원주',
      difficulty,
      question: `${useRadius ? '반지름' : '지름'}이 ${value}cm인 원의 원주(둘레)는 몇 cm인가요? (단, 원주율은 3.14로 계산합니다)`,
      hint: `원주 = 지름 × 원주율(3.14)${useRadius ? '. 지름은 반지름의 2배예요!' : ''}`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 지름 확인하기',
          content: useRadius
            ? `지름 = 반지름 × 2 = ${value} × 2 = ${diameter}cm`
            : `지름은 ${diameter}cm입니다.`,
        },
        {
          title: '2단계: 원주 계산하기',
          content: `${diameter} × 3.14 = ${answer}cm`,
        },
      ],
    };
  }

  if (shape === 'cuboid_volume') {
    const max = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
    const a = randomInt(2, max);
    const b = randomInt(2, max);
    const c = randomInt(2, max);
    const volume = a * b * c;

    return {
      id,
      topicId: 'geometry',
      subtopic: '직육면체의 부피',
      difficulty,
      context: '보물 상자',
      question: `${KID_CALL}의 보물 상자는 가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체 모양입니다. 이 상자의 부피는 몇 cm³인가요?`,
      hint: `부피는 1cm³ 쌓기나무가 몇 개 들어가는지와 같아요. 공식: 가로 × 세로 × 높이`,
      answerType: 'number',
      correctAnswer: volume,
      explanations: [
        {
          title: '1단계: 밑면에 놓이는 쌓기나무 수',
          content: `${a} × ${b} = ${a * b}개`,
        },
        {
          title: '2단계: 높이만큼 쌓기',
          content: `${a * b} × ${c} = ${volume}cm³`,
        },
      ],
    };
  }

  if (shape === 'cube_surface_area') {
    const edge =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(4, 10)
          : randomInt(8, 15);
    const area = 6 * edge * edge;

    return {
      id,
      topicId: 'geometry',
      subtopic: '정육면체의 겉넓이',
      difficulty,
      question: `한 모서리의 길이가 ${edge}cm인 정육면체의 겉넓이는 몇 cm²인가요?`,
      hint: `정육면체는 크기가 같은 정사각형 면 6개로 이루어져 있어요!`,
      answerType: 'number',
      correctAnswer: area,
      explanations: [
        {
          title: '1단계: 한 면의 넓이',
          content: `${edge} × ${edge} = ${edge * edge}cm²`,
        },
        {
          title: '2단계: 면 6개의 넓이 더하기',
          content: `${edge * edge} × 6 = ${area}cm²`,
        },
      ],
    };
  }

  if (shape === 'triangle') {
    const base =
      difficulty === 'easy'
        ? randomInt(3, 8)
        : difficulty === 'medium'
          ? randomInt(5, 14)
          : randomInt(10, 24);
    // Make either base or height even so area is integer
    const heightMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 20;
    const height =
      base % 2 === 0 ? randomInt(3, heightMax) : randomInt(2, Math.floor(heightMax / 2)) * 2;
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
    const base =
      difficulty === 'easy'
        ? randomInt(3, 8)
        : difficulty === 'medium'
          ? randomInt(5, 15)
          : randomInt(10, 24);
    const height =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(3, 12)
          : randomInt(8, 20);
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
    const top =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(3, 8)
          : randomInt(6, 14);
    const bottom =
      difficulty === 'easy'
        ? randomInt(top + 1, 9)
        : difficulty === 'medium'
          ? randomInt(top + 1, 12)
          : randomInt(top + 1, 20);
    // Make sum or height even
    const sum = top + bottom;
    const heightMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 18;
    const height =
      sum % 2 === 0 ? randomInt(2, heightMax) : randomInt(1, Math.floor(heightMax / 2)) * 2;
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
    const dMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 24;
    const d1 = randomInt(4, dMax);
    const d2 = d1 % 2 === 0 ? randomInt(3, dMax) : randomInt(2, Math.floor(dMax / 2)) * 2;
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

  if (shape === 'missing_height') {
    const base =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(4, 12)
          : randomInt(6, 18);
    const height = difficulty === 'hard' ? randomInt(7, 20) : randomInt(3, 12);
    const area = base * height;

    return {
      id,
      topicId: 'geometry',
      subtopic: '넓이로 높이 구하기',
      difficulty,
      question: `밑변이 ${base}cm인 평행사변형의 넓이가 ${area}cm²입니다. 높이는 몇 cm인가요?`,
      hint: `평행사변형의 넓이는 밑변 × 높이예요. 넓이를 밑변으로 나누어 보세요.`,
      answerType: 'number',
      correctAnswer: height,
      explanations: [
        {
          title: '1단계: 넓이 공식 확인하기',
          content: `넓이 = 밑변 × 높이이므로 ${area} = ${base} × □ 입니다.`,
        },
        {
          title: '2단계: 높이 구하기',
          content: `${area} ÷ ${base} = ${height}, 따라서 높이는 ${height}cm입니다.`,
        },
      ],
    };
  }

  // Circle area with pi = 3.14
  const radius =
    difficulty === 'easy'
      ? randomInt(2, 4)
      : difficulty === 'medium'
        ? randomInt(3, 7)
        : randomInt(6, 12);
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
