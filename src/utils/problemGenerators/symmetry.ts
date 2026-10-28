import type {
  Difficulty,
  Problem,
  SymmetryFigureId,
  TriangleSideId,
  TriangleVertexId,
} from '../../types/math';
import { pickOne, randomInt, shuffle } from '../mathHelpers';

interface Figure {
  name: string;
  visual: SymmetryFigureId;
  lineSymmetryCount: number;
  // Which lines fold the figure onto itself
  axes: string;
  isPointSymmetric: boolean;
}

const NO_AXIS = '어떻게 접어도 양쪽이 꼭 맞게 포개지지 않아요.';

const FIGURES: Figure[] = [
  {
    name: '정사각형',
    visual: 'square',
    lineSymmetryCount: 4,
    axes: '마주 보는 변의 가운데를 잇는 선 2개와 대각선 2개예요.',
    isPointSymmetric: true,
  },
  {
    name: '정사각형이 아닌 직사각형',
    visual: 'rectangle',
    lineSymmetryCount: 2,
    axes: '마주 보는 변의 가운데를 잇는 선 2개예요. 대각선으로 접으면 포개지지 않아요.',
    isPointSymmetric: true,
  },
  {
    name: '정삼각형',
    visual: 'equilateral-triangle',
    lineSymmetryCount: 3,
    axes: '각 꼭짓점에서 마주 보는 변의 가운데로 그은 선 3개예요.',
    isPointSymmetric: false,
  },
  {
    name: '이등변삼각형',
    visual: 'isosceles-triangle',
    lineSymmetryCount: 1,
    axes: '길이가 같은 두 변이 만나는 꼭짓점에서 마주 보는 변의 가운데로 그은 선 1개예요.',
    isPointSymmetric: false,
  },
  {
    name: '정사각형이 아닌 마름모',
    visual: 'rhombus',
    lineSymmetryCount: 2,
    axes: '두 대각선이 대칭축이에요. 변의 가운데를 잇는 선으로 접으면 포개지지 않아요.',
    isPointSymmetric: true,
  },
  {
    name: '평행사변형',
    visual: 'parallelogram',
    lineSymmetryCount: 0,
    axes: NO_AXIS,
    isPointSymmetric: true,
  },
  {
    name: '정육각형',
    visual: 'hexagon',
    lineSymmetryCount: 6,
    axes: '마주 보는 꼭짓점을 잇는 선 3개와 마주 보는 변의 가운데를 잇는 선 3개예요.',
    isPointSymmetric: true,
  },
  {
    name: '일반적인 사다리꼴',
    visual: 'trapezoid',
    lineSymmetryCount: 0,
    axes: NO_AXIS,
    isPointSymmetric: false,
  },
];
const SIDES = ['AB', 'BC', 'CA'] as const;
const SIDE_PAIRS = { AB: 'DE', BC: 'EF', CA: 'FD' } as const;

// Sides AB, BC, CA that are all different and not too flat, so the drawing to scale reads clearly
function randomTriangle(max: number): [number, number, number] {
  for (;;) {
    const sides: [number, number, number] = [
      randomInt(3, max),
      randomInt(3, max),
      randomInt(3, max),
    ];
    const [a, b, c] = [...sides].sort((x, y) => x - y);
    // largest angle under about 110°, smallest angle over about 25°
    if (
      a < b &&
      b < c &&
      c * c < a * a + b * b + 0.7 * a * b &&
      b * b + c * c - a * a < 1.8 * b * c
    )
      return sides;
  }
}

export function generateSymmetryProblem(difficulty: Difficulty): Problem {
  const id = `sym_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const problemType = pickOne(
    difficulty === 'easy'
      ? ['line_symmetry', 'matching_side', 'line_property', 'line_perimeter']
      : difficulty === 'medium'
        ? [
            'line_symmetry',
            'point_symmetry',
            'matching_side',
            'matching_angle',
            'line_property',
            'point_property',
            'line_perimeter',
          ]
        : [
            'point_symmetry',
            'triangle_perimeter',
            'line_symmetry',
            'matching_side',
            'matching_angle',
            'point_property',
          ],
  );

  if (problemType === 'matching_angle') {
    // Angles A, B, C in steps of 5° between 30° and 90°, all different so the drawing is clear
    let angles: [number, number, number] = [0, 0, 0];
    while (angles[2] < 30 || angles[2] > 90 || new Set(angles).size < 3) {
      angles = [randomInt(6, 18) * 5, randomInt(6, 18) * 5, 0];
      angles[2] = 180 - angles[0] - angles[1];
    }
    const index = randomInt(0, 2);
    const [other1, other2] = [0, 1, 2].filter((i) => i !== index);
    const vertex = 'ABC'[index];
    const matchingVertex = 'DEF'[index];
    const answer = angles[index];
    // From hard on, the matching angle is missing and has to come from the angle sum of 180°
    const useSum = difficulty === 'hard';
    const shownIndexes = useSum ? [other1, other2] : [0, 1, 2];
    const given = shownIndexes.map((i) => `각 ${'ABC'[i]}가 ${angles[i]}°`).join(', ');
    const firstAngles: Partial<Record<TriangleVertexId, string>> = Object.fromEntries(
      shownIndexes.map((i) => ['ABC'[i], `${angles[i]}°`]),
    );
    // Side lengths from the angles (law of sines) so the triangles are drawn with these angles
    const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
    const lengths: [number, number, number] = [
      Math.round(sin(angles[2]) * 1200) / 100,
      Math.round(sin(angles[0]) * 1200) / 100,
      Math.round(sin(angles[1]) * 1200) / 100,
    ];
    const sum = angles[other1] + angles[other2];

    return {
      id,
      topicId: 'symmetry',
      subtopic: '합동인 도형의 대응각',
      difficulty,
      question: `삼각형 ABC와 삼각형 DEF는 서로 합동입니다. ${given}일 때, 각 ${matchingVertex}의 크기는 몇 도인가요?`,
      visual: {
        kind: 'congruent-triangles',
        lengths,
        firstSides: {},
        firstAngles,
        secondAngles: { [matchingVertex]: '?' },
      },
      hint: `합동인 도형에서 서로 대응하는 각의 크기는 같아요. 각 ${matchingVertex}와 대응하는 각은 삼각형 ABC의 어느 각일까요?${useSum ? ' 삼각형의 세 각의 크기의 합은 180°예요.' : ''}`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 대응하는 꼭짓점 찾기',
          content: `삼각형 DEF를 뒤집어 포개면 꼭짓점 A와 D, B와 E, C와 F가 서로 만나요. 그래서 각 ${matchingVertex}의 대응각은 각 ${vertex}예요.`,
        },
        ...(useSum
          ? [
              {
                title: `2단계: 각 ${vertex}의 크기 구하기`,
                content: `삼각형의 세 각의 크기의 합은 180°예요. ${angles[other1]} + ${angles[other2]} = ${sum}이므로 각 ${vertex} = 180 - ${sum} = ${answer}°`,
              },
            ]
          : []),
        {
          title: `${useSum ? 3 : 2}단계: 대응각의 크기 알기`,
          content: `대응각의 크기는 같으므로 각 ${matchingVertex} = 각 ${vertex} = ${answer}°`,
        },
      ],
    };
  }

  if (problemType === 'line_property') {
    const half = randomInt(2, difficulty === 'easy' ? 12 : 20);
    // The right angle is always 90°, so easy asks it only now and then
    const kind = pickOne(difficulty === 'easy' ? ['angle', 'half', 'double'] : ['half', 'double']);
    const answer = kind === 'angle' ? 90 : kind === 'half' ? half : half * 2;

    return {
      id,
      topicId: 'symmetry',
      subtopic: '선대칭 도형의 성질',
      difficulty,
      question:
        kind === 'angle'
          ? '선대칭 도형에서 점 A의 대응점은 점 B입니다. 선분 AB와 대칭축이 만나서 이루는 각의 크기는 몇 도인가요?'
          : kind === 'half'
            ? `선대칭 도형에서 점 A의 대응점은 점 B이고, 선분 AB는 대칭축과 점 M에서 만납니다. 선분 AB의 길이가 ${half * 2}cm일 때, 선분 AM의 길이는 몇 cm인가요?`
            : `선대칭 도형에서 점 A의 대응점은 점 B이고, 선분 AB는 대칭축과 점 M에서 만납니다. 선분 AM의 길이가 ${half}cm일 때, 선분 AB의 길이는 몇 cm인가요?`,
      hint:
        kind === 'angle'
          ? '선대칭 도형을 대칭축을 따라 접으면 대응점끼리 꼭 맞게 포개져요. 대응점을 이은 선분과 대칭축은 어떤 각으로 만날까요?'
          : '대칭축은 대응점끼리 이은 선분을 둘로 똑같이 나눠요. 그래서 선분 AM과 선분 BM의 길이가 같아요.',
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 선대칭 도형의 성질',
          content:
            '선대칭 도형에서 대응점끼리 이은 선분은 대칭축과 수직으로 만나고, 대칭축은 그 선분을 둘로 똑같이 나눠요.',
        },
        {
          title: kind === 'angle' ? '2단계: 각의 크기' : '2단계: 길이 구하기',
          content:
            kind === 'angle'
              ? '수직으로 만나므로 선분 AB와 대칭축이 이루는 각의 크기는 90°예요.'
              : kind === 'half'
                ? `선분 AM은 선분 AB의 절반이므로 ${half * 2} ÷ 2 = ${half}cm`
                : `선분 AB는 선분 AM의 2배이므로 ${half} × 2 = ${half * 2}cm`,
        },
      ],
    };
  }

  if (problemType === 'line_perimeter') {
    // Cutting folded paper from the fold back to the fold gives a figure whose axis is the fold
    const cut = randomInt(4, difficulty === 'easy' ? 15 : 20);
    const askCut = difficulty === 'medium' && Math.random() < 0.5;
    const intro =
      '종이를 반으로 접은 다음, 접은 선에서 시작해 접은 선까지 한 번에 오려 내고 펼쳤더니 선대칭 도형이 되었어요.';

    return {
      id,
      topicId: 'symmetry',
      subtopic: '선대칭 도형의 둘레',
      difficulty,
      question: askCut
        ? `${intro} 펼친 도형의 둘레가 ${cut * 2}cm일 때, 오려 낸 선의 길이는 몇 cm인가요?`
        : `${intro} 오려 낸 선의 길이가 ${cut}cm일 때, 펼친 도형의 둘레는 몇 cm인가요?`,
      hint: '접은 선이 대칭축이 돼요. 펼치면 오려 낸 선과 똑같은 선이 대칭축의 반대쪽에도 생겨요.',
      answerType: 'number',
      correctAnswer: askCut ? cut : cut * 2,
      explanations: [
        {
          title: '1단계: 대칭축 양쪽 살펴보기',
          content:
            '접은 선이 대칭축이고, 대칭축 양쪽은 접으면 꼭 맞게 포개져요. 그래서 둘레는 오려 낸 선 2개로 이루어지고 두 선의 길이는 같아요.',
        },
        {
          title: '2단계: 길이 구하기',
          content: askCut
            ? `오려 낸 선은 둘레의 절반이므로 ${cut * 2} ÷ 2 = ${cut}cm`
            : `둘레는 오려 낸 선의 2배이므로 ${cut} × 2 = ${cut * 2}cm`,
        },
      ],
    };
  }

  if (problemType === 'point_property') {
    const half = randomInt(2, difficulty === 'medium' ? 12 : 20);
    const askHalf = Math.random() < 0.5;

    return {
      id,
      topicId: 'symmetry',
      subtopic: '점대칭 도형의 성질',
      difficulty,
      question: askHalf
        ? `점대칭 도형에서 점 A의 대응점은 점 B이고, 대칭의 중심은 점 O입니다. 선분 AB의 길이가 ${half * 2}cm일 때, 선분 AO의 길이는 몇 cm인가요?`
        : `점대칭 도형에서 점 A의 대응점은 점 B이고, 대칭의 중심은 점 O입니다. 선분 AO의 길이가 ${half}cm일 때, 선분 AB의 길이는 몇 cm인가요?`,
      hint: '대응점끼리 이은 선분은 대칭의 중심을 지나고, 대칭의 중심은 그 선분을 둘로 똑같이 나눠요.',
      answerType: 'number',
      correctAnswer: askHalf ? half : half * 2,
      explanations: [
        {
          title: '1단계: 점대칭 도형의 성질',
          content:
            '점대칭 도형에서 대응점끼리 이은 선분은 대칭의 중심을 지나고, 대칭의 중심에서 두 대응점까지의 거리는 같아요. 그래서 선분 AO와 선분 BO의 길이가 같아요.',
        },
        {
          title: '2단계: 길이 구하기',
          content: askHalf
            ? `선분 AO는 선분 AB의 절반이므로 ${half * 2} ÷ 2 = ${half}cm`
            : `선분 AB는 선분 AO의 2배이므로 ${half} × 2 = ${half * 2}cm`,
        },
      ],
    };
  }

  if (problemType === 'matching_side') {
    const lengths = randomTriangle(difficulty === 'easy' ? 12 : 30);
    const index = randomInt(0, 2);
    const side = SIDES[index];
    const matchingSide = SIDE_PAIRS[side];
    const length = lengths[index];
    // From medium on, every side of ABC is shown and the child has to pick the matching one
    const showAll = difficulty !== 'easy';
    const firstSides: Partial<Record<TriangleSideId, string>> = showAll
      ? Object.fromEntries(SIDES.map((s, i) => [s, `${lengths[i]}cm`]))
      : { [side]: `${length}cm` };

    return {
      id,
      topicId: 'symmetry',
      subtopic: '합동인 도형의 대응변',
      difficulty,
      question: showAll
        ? `삼각형 ABC와 삼각형 DEF는 서로 합동입니다. ${SIDES.map((s, i) => `변 ${s}가 ${lengths[i]}cm`).join(', ')}일 때, 변 ${matchingSide}의 길이는 몇 cm인가요?`
        : `삼각형 ABC와 삼각형 DEF는 서로 합동입니다. 변 ${side}의 길이가 ${length}cm일 때, 변 ${matchingSide}의 길이는 몇 cm인가요?`,
      visual: {
        kind: 'congruent-triangles',
        lengths,
        firstSides,
        secondSides: { [matchingSide]: '?' },
      },
      hint: '합동인 도형에서 서로 대응하는 변의 길이는 같아요. 꼭짓점의 순서대로 대응하는 점을 찾아보세요.',
      answerType: 'number',
      correctAnswer: length,
      explanations: [
        {
          title: '1단계: 대응하는 꼭짓점 찾기',
          content: '삼각형 DEF를 뒤집어 포개면 꼭짓점 A와 D, B와 E, C와 F가 서로 만나요.',
        },
        {
          title: '2단계: 대응변의 길이 알기',
          content: `변 ${side}와 변 ${matchingSide}는 서로 대응하는 변이라 길이가 같아요. 변 ${matchingSide} = ${length}cm`,
        },
      ],
    };
  }

  if (problemType === 'triangle_perimeter') {
    const lengths = randomTriangle(12);
    const [ab, bc, ca] = lengths;
    const perimeter = ab + bc + ca;

    return {
      id,
      topicId: 'symmetry',
      subtopic: '합동인 도형의 둘레',
      difficulty,
      question: `삼각형 ABC와 삼각형 DEF는 서로 합동입니다. 삼각형 ABC의 세 변의 길이가 각각 ${ab}cm, ${bc}cm, ${ca}cm일 때, 삼각형 DEF의 둘레는 몇 cm인가요?`,
      visual: {
        kind: 'congruent-triangles',
        lengths,
        firstSides: { AB: `${ab}cm`, BC: `${bc}cm`, CA: `${ca}cm` },
      },
      hint: '합동인 도형은 대응하는 변의 길이가 모두 같아요. 먼저 삼각형 ABC의 둘레를 구해 보세요.',
      answerType: 'number',
      correctAnswer: perimeter,
      explanations: [
        {
          title: '1단계: 삼각형 ABC의 둘레 구하기',
          content: `${ab} + ${bc} + ${ca} = ${perimeter}cm`,
        },
        {
          title: '2단계: 합동인 도형의 둘레',
          content: `대응하는 변의 길이가 모두 같으니 둘레도 같아요. 삼각형 DEF의 둘레도 ${perimeter}cm예요.`,
        },
      ],
    };
  }

  if (problemType === 'point_symmetry') {
    const selection = shuffle(FIGURES).slice(0, difficulty === 'hard' ? 5 : 4);
    const count = selection.filter((figure) => figure.isPointSymmetric).length;
    const names = selection.map((figure) => figure.name).join(', ');

    return {
      id,
      topicId: 'symmetry',
      subtopic: '점대칭 도형',
      difficulty,
      question: `${names} 중에서 점대칭 도형은 모두 몇 개인가요?`,
      visual: {
        kind: 'shape-set',
        shapes: selection.map((figure, index) => ({
          figure: figure.visual,
          label: `${String.fromCharCode(65 + index)} · ${figure.name}`,
        })),
      },
      hint: '각 도형을 한 점을 중심으로 180° 돌렸을 때 처음 모양과 포개지는지 생각해 보세요.',
      answerType: 'number',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 점대칭의 뜻 떠올리기',
          content: '한 점을 중심으로 180° 돌렸을 때 처음 도형과 포개지면 점대칭 도형이에요.',
        },
        {
          title: '2단계: 도형 확인하기',
          content: `180° 돌렸을 때 처음 모양과 포개지는 도형은 ${selection
            .filter((figure) => figure.isPointSymmetric)
            .map((figure) => figure.name)
            .join(', ')}, 이렇게 모두 ${count}개예요.${
            selection.some((figure) => !figure.isPointSymmetric)
              ? ` ${selection
                  .filter((figure) => !figure.isPointSymmetric)
                  .map((figure) => figure.name)
                  .join(', ')}은 180° 돌리면 처음 모양과 포개지지 않아요.`
              : ''
          }`,
        },
      ],
    };
  }

  const figure = pickOne(
    difficulty === 'easy'
      ? FIGURES.slice(0, 4)
      : difficulty === 'medium'
        ? FIGURES.slice(0, 7)
        : FIGURES,
  );

  return {
    id,
    topicId: 'symmetry',
    subtopic: '선대칭 도형',
    difficulty,
    question: pickOne([
      `${figure.name}에는 대칭축이 몇 개 있나요?`,
      `${figure.name}의 대칭축은 모두 몇 개인가요?`,
      `한 직선을 따라 접었을 때 완전히 겹치는 도형을 선대칭 도형이라고 해요. ${figure.name}에서 이런 직선은 모두 몇 개인가요?`,
    ]),
    visual: { kind: 'shape-set', shapes: [{ figure: figure.visual, label: figure.name }] },
    hint: '대칭축은 도형을 접었을 때 양쪽이 꼭 맞게 포개지는 선이에요.',
    answerType: 'number',
    correctAnswer: figure.lineSymmetryCount,
    explanations: [
      {
        title: '1단계: 대칭축 찾기',
        content: '도형을 접어 양쪽이 꼭 맞게 포개지는 선을 하나씩 세어요.',
      },
      {
        title: '2단계: 대칭축의 개수',
        content: `${figure.name}의 대칭축은 ${figure.lineSymmetryCount}개예요. ${figure.axes}`,
      },
    ],
  };
}
