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
const SIDE_PAIRS = { AB: 'DE', BC: 'EF', CA: 'FD' } as const;

export function generateSymmetryProblem(difficulty: Difficulty): Problem {
  const id = `sym_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const problemType = pickOne(
    difficulty === 'easy'
      ? ['line_symmetry', 'matching_side']
      : difficulty === 'medium'
        ? ['line_symmetry', 'point_symmetry', 'matching_side']
        : ['point_symmetry', 'triangle_perimeter', 'line_symmetry'],
  );

  if (problemType === 'matching_side') {
    const side = pickOne(Object.keys(SIDE_PAIRS) as Array<keyof typeof SIDE_PAIRS>);
    const matchingSide = SIDE_PAIRS[side];
    const length = randomInt(3, difficulty === 'easy' ? 12 : 30);
    const firstSides: Partial<Record<TriangleSideId, string>> = { [side]: `${length}cm` };
    const secondSides: Partial<Record<TriangleSideId, string>> = { [matchingSide]: '?' };

    return {
      id,
      topicId: 'symmetry',
      subtopic: '합동인 도형의 대응변',
      difficulty,
      question: `△ABC와 △DEF는 합동이고, ${side}의 길이가 ${length}cm입니다. ${matchingSide}의 길이는 몇 cm인가요?`,
      visual: {
        kind: 'congruent-triangles',
        firstSides,
        secondSides,
        dottedArcs: [side],
      },
      hint: '합동인 도형에서 서로 대응하는 변의 길이는 같아요. 꼭짓점의 순서대로 대응하는 점을 찾아보세요.',
      answerType: 'number',
      correctAnswer: length,
      explanations: [
        {
          title: '1단계: 대응하는 꼭짓점 찾기',
          content: '△ABC≡△DEF에서 A와 D, B와 E, C와 F가 서로 대응해요.',
        },
        {
          title: '2단계: 대응변 길이 확인하기',
          content: `${side}와 ${matchingSide}는 대응하는 변이므로 길이가 같아요. ${matchingSide} = ${length}cm`,
        },
      ],
    };
  }

  if (problemType === 'triangle_perimeter') {
    const ab = randomInt(3, 12);
    const bc = randomInt(3, 12);
    const minCa = Math.abs(ab - bc) + 1;
    const maxCa = Math.min(ab + bc - 1, 12);
    const ca = randomInt(minCa, maxCa);
    const perimeter = ab + bc + ca;
    const firstSides = { AB: `${ab}cm`, BC: `${bc}cm`, CA: `${ca}cm` };

    return {
      id,
      topicId: 'symmetry',
      subtopic: '합동인 도형의 둘레',
      difficulty,
      question: `△ABC와 △DEF는 합동입니다. △ABC의 세 변이 ${ab}cm, ${bc}cm, ${ca}cm일 때 △DEF의 둘레는 몇 cm인가요?`,
      visual: { kind: 'congruent-triangles', firstSides },
      hint: '합동인 도형은 대응하는 변의 길이가 모두 같아요. 먼저 △ABC의 둘레를 구해 보세요.',
      answerType: 'number',
      correctAnswer: perimeter,
      explanations: [
        {
          title: '1단계: △ABC의 둘레 구하기',
          content: `${ab} + ${bc} + ${ca} = ${perimeter}cm`,
        },
        {
          title: '2단계: 합동인 도형의 둘레',
          content: `합동인 도형은 크기가 같아서 둘레도 같아요. △DEF의 둘레도 ${perimeter}cm예요.`,
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
