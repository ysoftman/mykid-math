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
    'cuboid_surface_area',
    'regular_polygon_perimeter',
    'prism_parts',
    'diameter_from_circumference',
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
    const max = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    const pick = () => [randomInt(2, max), randomInt(2, max), randomInt(2, max)];
    let [a, b, c] = pick();
    while (a * b * c > 200) [a, b, c] = pick();
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
        ? randomInt(2, 3)
        : difficulty === 'medium'
          ? randomInt(2, 4)
          : randomInt(3, 5);
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

  if (shape === 'cuboid_surface_area') {
    const max = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    const pick = () => [randomInt(2, max), randomInt(2, max), randomInt(2, max)];
    let [a, b, c] = pick();
    while (2 * (a * b + b * c + a * c) > 200) [a, b, c] = pick();
    const faces = a * b + b * c + a * c;

    return {
      id,
      topicId: 'geometry',
      subtopic: '직육면체의 겉넓이',
      difficulty,
      question: `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 겉넓이는 몇 cm²인가요?`,
      hint: `직육면체는 마주 보는 두 면의 모양과 크기가 같아요. 서로 다른 세 면의 넓이를 더한 뒤 2배 해요!`,
      answerType: 'number',
      correctAnswer: faces * 2,
      explanations: [
        {
          title: '1단계: 서로 다른 세 면의 넓이',
          content: `${a} × ${b} = ${a * b}cm², ${b} × ${c} = ${b * c}cm², ${a} × ${c} = ${a * c}cm²`,
        },
        {
          title: '2단계: 세 면의 넓이의 합 × 2',
          content: `(${a * b} + ${b * c} + ${a * c}) × 2 = ${faces} × 2 = ${faces * 2}cm²`,
        },
      ],
    };
  }

  if (shape === 'regular_polygon_perimeter') {
    const polygons: [number, string][] = [
      [3, '정삼각형'],
      [4, '정사각형'],
      [5, '정오각형'],
      [6, '정육각형'],
      [8, '정팔각형'],
      [10, '정십각형'],
    ];
    const [sides, name] = pickOne(difficulty === 'easy' ? polygons.slice(0, 3) : polygons);
    const side = randomInt(2, difficulty === 'easy' ? 9 : difficulty === 'medium' ? 12 : 15);
    const perimeter = sides * side;
    const askSide = difficulty !== 'easy' && Math.random() < 0.5;

    return {
      id,
      topicId: 'geometry',
      subtopic: '정다각형의 둘레',
      difficulty,
      question: askSide
        ? `둘레가 ${perimeter}cm인 ${name}의 한 변은 몇 cm인가요?`
        : `한 변이 ${side}cm인 ${name}의 둘레는 몇 cm인가요?`,
      hint: `정다각형은 변의 길이가 모두 같아요. ${name}의 변은 몇 개인지 세어 보세요!`,
      answerType: 'number',
      correctAnswer: askSide ? side : perimeter,
      explanations: [
        {
          title: '1단계: 변의 수 세기',
          content: `${name}은 길이가 같은 변 ${sides}개로 이루어져 있어요.`,
        },
        {
          title: askSide ? '2단계: 둘레를 변의 수로 나누기' : '2단계: 한 변에 변의 수 곱하기',
          content: askSide
            ? `한 변 = 둘레 ÷ 변의 수 = ${perimeter} ÷ ${sides} = ${side}cm`
            : `둘레 = 한 변 × 변의 수 = ${side} × ${sides} = ${perimeter}cm`,
        },
      ],
    };
  }

  if (shape === 'prism_parts') {
    const KOREAN_COUNT = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
    const n = randomInt(3, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10);
    const isPrism = Math.random() < 0.5;
    const part = pickOne(['면', '모서리', '꼭짓점'] as const);
    const solid = `${KOREAN_COUNT[n]}각${isPrism ? '기둥' : '뿔'}`;
    const counts = isPrism
      ? { 면: n + 2, 모서리: n * 3, 꼭짓점: n * 2 }
      : { 면: n + 1, 모서리: n * 2, 꼭짓점: n + 1 };
    const reasons = isPrism
      ? {
          면: `밑면 2개 + 옆면 ${n}개 = ${n + 2}개`,
          모서리: `두 밑면의 모서리 ${n}개씩 + 옆면끼리 만나는 모서리 ${n}개 = ${n * 3}개`,
          꼭짓점: `두 밑면에 꼭짓점이 ${n}개씩이므로 ${n} × 2 = ${n * 2}개`,
        }
      : {
          면: `밑면 1개 + 옆면 ${n}개 = ${n + 1}개`,
          모서리: `밑면의 모서리 ${n}개 + 옆면끼리 만나는 모서리 ${n}개 = ${n * 2}개`,
          꼭짓점: `밑면의 꼭짓점 ${n}개 + 각뿔의 꼭짓점 1개 = ${n + 1}개`,
        };

    return {
      id,
      topicId: 'geometry',
      subtopic: isPrism ? '각기둥의 구성 요소' : '각뿔의 구성 요소',
      difficulty,
      question: `${solid}의 ${part === '모서리' ? '모서리는' : `${part}은`} 모두 몇 개인가요?`,
      hint: isPrism
        ? `각기둥은 서로 평행한 밑면이 2개이고, 옆면은 밑면의 변의 수만큼 있어요.`
        : `각뿔은 밑면이 1개이고, 삼각형 모양의 옆면이 밑면의 변의 수만큼 있어요.`,
      answerType: 'number',
      correctAnswer: counts[part],
      explanations: [
        {
          title: '1단계: 밑면 모양 살펴보기',
          content: `${solid}의 밑면은 ${KOREAN_COUNT[n]}각형이므로 밑면 하나의 변과 꼭짓점이 각각 ${n}개입니다.`,
        },
        {
          title: `2단계: ${part}의 수 세기`,
          content: reasons[part],
        },
      ],
    };
  }

  if (shape === 'diameter_from_circumference') {
    const askRadius = difficulty === 'hard';
    const diameter =
      difficulty === 'easy'
        ? randomInt(2, 10)
        : difficulty === 'medium'
          ? randomInt(5, 20)
          : randomInt(3, 15) * 2;
    const circumference = Math.round(diameter * 314) / 100;

    return {
      id,
      topicId: 'geometry',
      subtopic: '원주로 지름 구하기',
      difficulty,
      question: `원주가 ${circumference}cm인 원의 ${askRadius ? '반지름' : '지름'}은 몇 cm인가요? (단, 원주율은 3.14로 계산합니다)`,
      hint: `원주 = 지름 × 원주율이므로 지름 = 원주 ÷ 원주율이에요!${askRadius ? ' 반지름은 지름의 절반이에요.' : ''}`,
      answerType: 'number',
      correctAnswer: askRadius ? diameter / 2 : diameter,
      explanations: [
        {
          title: '1단계: 원주와 지름의 관계',
          content: `원주 = 지름 × 원주율이므로 지름 = 원주 ÷ 원주율입니다.`,
        },
        {
          title: '2단계: 지름 구하기',
          content: `${circumference} ÷ 3.14 = ${diameter}cm`,
        },
        ...(askRadius
          ? [{ title: '3단계: 반지름 구하기', content: `${diameter} ÷ 2 = ${diameter / 2}cm` }]
          : []),
      ],
    };
  }

  if (shape === 'triangle') {
    const base =
      difficulty === 'easy'
        ? randomInt(3, 8)
        : difficulty === 'medium'
          ? randomInt(5, 14)
          : randomInt(6, 16);
    // Make either base or height even so area is integer
    const heightMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 14;
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
          : randomInt(6, 14);
    const height =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(3, 12)
          : randomInt(5, 12);
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
          : randomInt(4, 10);
    const bottom =
      difficulty === 'easy'
        ? randomInt(top + 1, 9)
        : difficulty === 'medium'
          ? randomInt(top + 1, 12)
          : randomInt(top + 1, 16);
    // Make sum or height even
    const sum = top + bottom;
    const heightMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
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
    const dMax = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
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
          : randomInt(6, 12);
    const height = difficulty === 'hard' ? randomInt(5, 12) : randomInt(3, 12);
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
        : randomInt(4, 8);
  const area = Math.round(radius * radius * 3.14 * 100) / 100;

  return {
    id,
    topicId: 'geometry',
    subtopic: '원의 넓이',
    difficulty,
    question: `반지름이 ${radius}cm인 원의 넓이는 몇 cm²인가요? (단, 원주율은 3.14로 계산합니다)`,
    hint: `원을 아주 잘게 잘라 엇갈려 이어 붙이면 직사각형에 가까워져요! 공식: 반지름 × 반지름 × 원주율(3.14)`,
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
