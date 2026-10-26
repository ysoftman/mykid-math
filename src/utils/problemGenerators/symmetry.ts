import type { Difficulty, Problem, SymmetryFigureId, TriangleSideId } from '../../types/math';
import { pickOne, randomInt, shuffle } from '../mathHelpers';

interface Figure {
  name: string;
  visual: SymmetryFigureId;
  lineSymmetryCount: number;
  isPointSymmetric: boolean;
}

const FIGURES: Figure[] = [
  { name: '정사각형', visual: 'square', lineSymmetryCount: 4, isPointSymmetric: true },
  {
    name: '정사각형이 아닌 직사각형',
    visual: 'rectangle',
    lineSymmetryCount: 2,
    isPointSymmetric: true,
  },
  {
    name: '정삼각형',
    visual: 'equilateral-triangle',
    lineSymmetryCount: 3,
    isPointSymmetric: false,
  },
  {
    name: '이등변삼각형',
    visual: 'isosceles-triangle',
    lineSymmetryCount: 1,
    isPointSymmetric: false,
  },
  {
    name: '정사각형이 아닌 마름모',
    visual: 'rhombus',
    lineSymmetryCount: 2,
    isPointSymmetric: true,
  },
  {
    name: '평행사변형',
    visual: 'parallelogram',
    lineSymmetryCount: 0,
    isPointSymmetric: true,
  },
  { name: '정육각형', visual: 'hexagon', lineSymmetryCount: 6, isPointSymmetric: true },
  {
    name: '일반적인 사다리꼴',
    visual: 'trapezoid',
    lineSymmetryCount: 0,
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
      ? ['line_symmetry', 'matching_side']
      : difficulty === 'medium'
        ? ['line_symmetry', 'point_symmetry', 'matching_side']
        : ['point_symmetry', 'triangle_perimeter', 'line_symmetry', 'matching_side'],
  );

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
        ? `삼각형 ABC와 삼각형 DEF는 서로 합동입니다. 변 ${matchingSide}의 길이는 몇 cm인가요?`
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
      question: '아래 도형 중 점대칭 도형은 몇 개인가요?',
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
          content: `${names} 가운데 점대칭인 도형은 ${selection
            .filter((figure) => figure.isPointSymmetric)
            .map((figure) => figure.name)
            .join(', ')}이에요. 모두 ${count}개예요.`,
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
    question: `${figure.name}에는 대칭축이 몇 개 있나요?`,
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
        content: `${figure.name}의 대칭축은 ${figure.lineSymmetryCount}개예요.`,
      },
    ],
  };
}
