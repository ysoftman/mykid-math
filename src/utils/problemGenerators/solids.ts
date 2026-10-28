import type { Difficulty, Problem, ProblemVisual } from '../../types/math';
import { josa, pickOne, randomInt } from '../mathHelpers';

const PARTS = { 면: 6, 모서리: 12, 꼭짓점: 8 } as const;
type Part = keyof typeof PARTS;
const PART_TOPIC: Record<Part, string> = { 면: '면은', 모서리: '모서리는', 꼭짓점: '꼭짓점은' };
const PART_MEANING: Record<Part, string> = {
  면: '선분으로 둘러싸인 부분',
  모서리: '면과 면이 만나는 선분',
  꼭짓점: '모서리와 모서리가 만나는 점',
};

const PARTS_EXPLANATION = {
  title: '1단계: 직육면체와 정육면체의 구성 요소',
  content: '면은 6개(위·아래·앞·뒤·왼쪽·오른쪽), 모서리는 12개, 꼭짓점은 8개예요.',
};

export function generateSolidsProblem(difficulty: Difficulty): Problem {
  const id = `sol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const type = pickOne(
    difficulty === 'easy'
      ? [
          'parts_count',
          'cube_edge_sum',
          'cuboid_edge_sum',
          'net_squares',
          'equal_edges',
          'parallel',
          'sketch',
        ]
      : difficulty === 'medium'
        ? [
            'parts_count',
            'cube_edge_sum',
            'cuboid_edge_sum',
            'perpendicular',
            'vertex_meet',
            'parallel',
            'sketch',
          ]
        : [
            'cuboid_edge_sum',
            'cube_edge_from_sum',
            'cuboid_height_from_sum',
            'parts_total',
            'vertex_meet',
            'perpendicular',
          ],
  );
  const solid = pickOne(['정육면체', '직육면체']);
  const base = { id, topicId: 'solids' as const, difficulty, answerType: 'number' as const };
  const sketch: Extract<ProblemVisual, { kind: 'cuboid' }> = {
    kind: 'cuboid',
    size: solid === '정육면체' ? [1, 1, 1] : [5, 3, 4],
  };

  if (type === 'parts_count') {
    const part = pickOne(Object.keys(PARTS) as Part[]);
    const count = PARTS[part];
    return {
      ...base,
      subtopic: '면·모서리·꼭짓점의 수',
      question: pickOne([
        `${solid}의 ${PART_TOPIC[part]} 모두 몇 개인가요?`,
        `${solid}에서 ${part}의 수를 세어 보세요. 모두 몇 개인가요?`,
        `${solid} 모양 상자가 있어요. 이 상자의 ${PART_TOPIC[part]} 몇 개인가요?`,
      ]),
      visual: sketch,
      hint: `${PART_TOPIC[part]} ${PART_MEANING[part]}이에요. 보이지 않는 뒤쪽까지 빠짐없이 세어 보세요.`,
      correctAnswer: count,
      explanations: [
        PARTS_EXPLANATION,
        {
          title: `2단계: ${part} 세기`,
          content: `${solid}의 ${PART_TOPIC[part]} ${count}개예요. 직육면체와 정육면체는 모양만 다를 뿐 ${part}의 수는 같아요.`,
        },
      ],
    };
  }

  if (type === 'cube_edge_sum') {
    const edge = randomInt(2, difficulty === 'easy' ? 6 : 10);
    const sum = edge * 12;
    return {
      ...base,
      subtopic: '정육면체의 모서리 길이의 합',
      question: pickOne([
        `한 모서리의 길이가 ${edge}cm인 정육면체의 모든 모서리 길이의 합은 몇 cm인가요?`,
        `철사로 한 모서리가 ${edge}cm인 정육면체 모양의 뼈대를 만들려고 해요. 철사는 모두 몇 cm 필요한가요?`,
      ]),
      visual: { kind: 'cuboid', size: [1, 1, 1], labels: { width: `${edge}cm` } },
      hint: '정육면체는 길이가 같은 모서리가 12개예요. 한 모서리의 길이에 12를 곱해요.',
      correctAnswer: sum,
      explanations: [
        {
          title: '1단계: 모서리의 수',
          content: '정육면체의 모서리는 12개이고 길이가 모두 같아요.',
        },
        { title: '2단계: 합 구하기', content: `${edge} × 12 = ${sum}cm` },
      ],
    };
  }

  if (type === 'cube_edge_from_sum') {
    const edge = randomInt(2, 10);
    const sum = edge * 12;
    return {
      ...base,
      subtopic: '정육면체의 한 모서리 길이',
      question: `모든 모서리 길이의 합이 ${sum}cm인 정육면체가 있어요. 한 모서리의 길이는 몇 cm인가요?`,
      visual: { kind: 'cuboid', size: [1, 1, 1], labels: { width: '?' } },
      hint: '정육면체의 모서리는 12개이고 길이가 모두 같으니, 합을 12로 나눠요.',
      correctAnswer: edge,
      explanations: [
        {
          title: '1단계: 모서리의 수',
          content: '정육면체는 길이가 같은 모서리 12개로 이루어져 있어요.',
        },
        { title: '2단계: 나누기', content: `${sum} ÷ 12 = ${edge}cm` },
      ],
    };
  }

  if (type === 'cuboid_edge_sum' || type === 'cuboid_height_from_sum') {
    const max = difficulty === 'easy' ? 5 : 10;
    const pick = () => [randomInt(2, max), randomInt(2, max), randomInt(2, max)];
    let [a, b, c] = pick();
    // Three equal edges would make a cube
    while (a === b && b === c) [a, b, c] = pick();
    const sum = (a + b + c) * 4;
    if (type === 'cuboid_edge_sum') {
      return {
        ...base,
        subtopic: '직육면체의 모서리 길이의 합',
        question: `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 직육면체의 모든 모서리 길이의 합은 몇 cm인가요?`,
        visual: {
          kind: 'cuboid',
          size: [a, b, c],
          labels: { width: `${a}cm`, depth: `${b}cm`, height: `${c}cm` },
        },
        hint: '직육면체는 가로, 세로, 높이 모서리가 각각 4개씩 있어요. (가로 + 세로 + 높이) × 4',
        correctAnswer: sum,
        explanations: [
          {
            title: '1단계: 길이가 같은 모서리 묶기',
            content: `가로 ${a}cm 모서리 4개, 세로 ${b}cm 모서리 4개, 높이 ${c}cm 모서리 4개가 있어요.`,
          },
          {
            title: '2단계: 합 구하기',
            content: `(${a} + ${b} + ${c}) × 4 = ${a + b + c} × 4 = ${sum}cm`,
          },
        ],
      };
    }
    return {
      ...base,
      subtopic: '직육면체의 높이 구하기',
      question: `가로 ${a}cm, 세로 ${b}cm인 직육면체의 모든 모서리 길이의 합이 ${sum}cm예요. 높이는 몇 cm인가요?`,
      visual: {
        kind: 'cuboid',
        size: [a, b, c],
        labels: { width: `${a}cm`, depth: `${b}cm`, height: '?' },
      },
      hint: '모든 모서리 길이의 합을 4로 나누면 가로 + 세로 + 높이가 돼요.',
      correctAnswer: c,
      explanations: [
        {
          title: '1단계: 가로 + 세로 + 높이 구하기',
          content: `${sum} ÷ 4 = ${a + b + c}cm`,
        },
        {
          title: '2단계: 높이 구하기',
          content: `${a + b + c} - ${a} - ${b} = ${c}cm`,
        },
      ],
    };
  }

  if (type === 'net_squares') {
    return {
      ...base,
      subtopic: '정육면체의 전개도',
      question: pickOne([
        '정육면체의 전개도를 그리려면 정사각형이 모두 몇 개 필요한가요?',
        '정육면체 전개도는 크기가 같은 정사각형 몇 개로 이루어져 있나요?',
      ]),
      visual: { kind: 'cuboid', size: [1, 1, 1] },
      hint: '전개도는 입체도형을 펼쳐 놓은 그림이에요. 면의 수만큼 정사각형이 필요해요.',
      correctAnswer: 6,
      explanations: [
        {
          title: '1단계: 면의 수',
          content: '정육면체는 면이 6개이고, 모두 크기가 같은 정사각형이에요.',
        },
        {
          title: '2단계: 전개도',
          content: '전개도를 접으면 면 6개가 되므로 정사각형 6개가 필요해요.',
        },
      ],
    };
  }

  if (type === 'equal_edges') {
    return {
      ...base,
      subtopic: '길이가 같은 모서리',
      question: pickOne([
        '가로, 세로, 높이가 모두 다른 직육면체에서 길이가 같은 모서리는 몇 개씩 있나요?',
        '가로, 세로, 높이가 모두 다른 직육면체의 모서리 12개를 길이가 같은 것끼리 묶으면 한 묶음에 몇 개씩인가요?',
      ]),
      visual: {
        kind: 'cuboid',
        size: [5, 3, 4],
        labels: { width: '가로', depth: '세로', height: '높이' },
      },
      hint: '가로, 세로, 높이가 모두 다르면 모서리의 길이는 세 가지예요. 12개를 세 가지로 나눠 보세요.',
      correctAnswer: 4,
      explanations: [
        {
          title: '1단계: 모서리의 종류',
          content: '가로, 세로, 높이가 모두 다르므로 모서리는 가로, 세로, 높이 3종류로 나뉘어요.',
        },
        {
          title: '2단계: 나누기',
          content: '모서리 12개를 3종류로 나누면 12 ÷ 3 = 4이므로 4개씩 길이가 같아요.',
        },
      ],
    };
  }

  if (type === 'parallel') {
    const askPairs = Math.random() < 0.5;
    return {
      ...base,
      subtopic: '평행한 면',
      question: askPairs
        ? `${solid}에서 서로 평행한 면은 모두 몇 쌍인가요?`
        : `${solid}에서 색칠한 면과 평행한 면은 몇 개인가요?`,
      visual: askPairs ? sketch : { ...sketch, highlight: 'top' },
      hint: '마주 보는 면끼리 평행해요. 위와 아래, 앞과 뒤, 왼쪽과 오른쪽을 생각해 보세요.',
      correctAnswer: askPairs ? 3 : 1,
      explanations: [
        {
          title: '1단계: 마주 보는 면 찾기',
          content: '위·아래, 앞·뒤, 왼쪽·오른쪽처럼 마주 보는 면은 서로 평행해요.',
        },
        {
          title: '2단계: 세기',
          content: askPairs
            ? '평행한 면은 모두 3쌍이에요.'
            : '한 면과 마주 보는 면은 1개뿐이므로 평행한 면은 1개예요.',
        },
      ],
    };
  }

  if (type === 'perpendicular') {
    return {
      ...base,
      subtopic: '수직인 면',
      ...pickOne([
        {
          question: `${solid}에서 색칠한 면과 수직인 면은 모두 몇 개인가요?`,
          visual: { ...sketch, highlight: 'top' as const },
        },
        {
          question: `${solid}의 밑면(색칠한 면)과 수직으로 만나는 면은 몇 개인가요?`,
          visual: { ...sketch, highlight: 'bottom' as const },
        },
      ]),
      hint: '그 면과 마주 보는 면은 평행해요. 평행하지 않은 나머지 면은 그 면과 어떻게 만나는지 생각해 보세요.',
      correctAnswer: 4,
      explanations: [
        {
          title: '1단계: 평행한 면 빼기',
          content: '면 6개 중에서 그 면 1개와 마주 보는 평행한 면 1개를 빼면 6 - 2 = 4개가 남아요.',
        },
        { title: '2단계: 수직인 면', content: '남은 4개의 면은 모두 그 면과 수직으로 만나요.' },
      ],
    };
  }

  if (type === 'sketch') {
    const part = pickOne(Object.keys(PARTS) as Part[]);
    const visible = Math.random() < 0.5;
    // Seen from the front, a sketch shows 3 faces, 9 edges (solid lines) and 7 vertices
    const shown = { 면: 3, 모서리: 9, 꼭짓점: 7 }[part];
    const count = visible ? shown : PARTS[part] - shown;
    return {
      ...base,
      subtopic: '직육면체의 겨냥도',
      question: `${solid}의 겨냥도에서 ${visible ? '보이는' : '보이지 않는'} ${PART_TOPIC[part]} 몇 개인가요?`,
      visual: sketch,
      hint: '겨냥도는 보이는 모서리를 실선으로, 보이지 않는 모서리를 점선으로 그려요. 상자를 앞에서 비스듬히 본 모습을 떠올려 보세요.',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 겨냥도에서 보이는 부분',
          content:
            '겨냥도에서는 면 3개, 모서리 9개, 꼭짓점 7개가 보이고, 나머지는 뒤쪽에 가려져 보이지 않아요.',
        },
        {
          title: `2단계: ${part} 세기`,
          content: visible
            ? `보이는 ${PART_TOPIC[part]} ${count}개예요.`
            : `${part} ${PARTS[part]}개 중에서 보이는 ${shown}개를 빼면 ${PARTS[part]} - ${shown} = ${count}개가 보이지 않아요.`,
        },
      ],
    };
  }

  if (type === 'vertex_meet') {
    const part = pickOne<Part>(['모서리', '면']);
    return {
      ...base,
      subtopic: '한 꼭짓점에서 만나는 모서리와 면',
      question: `${solid}의 한 꼭짓점(점 찍은 곳)에서 만나는 ${PART_TOPIC[part]} 몇 개인가요?`,
      visual: { ...sketch, highlight: 'vertex' },
      hint:
        part === '면'
          ? '상자의 한 귀퉁이를 떠올려 보세요. 그 귀퉁이에 모인 면이 몇 개인지 세어요.'
          : '상자의 한 귀퉁이를 떠올려 보세요. 그 귀퉁이에서 뻗어 나가는 모서리가 몇 개인지 세어요.',
      correctAnswer: 3,
      explanations: [
        {
          title: '1단계: 꼭짓점 살펴보기',
          content:
            part === '면'
              ? '한 꼭짓점에서는 위(또는 아래) 면, 앞(또는 뒤) 면, 왼쪽(또는 오른쪽) 면이 하나씩 만나요.'
              : '한 꼭짓점에서는 가로, 세로, 높이 방향의 모서리가 하나씩 만나요.',
        },
        {
          title: '2단계: 세기',
          content: `한 꼭짓점에서 만나는 ${PART_TOPIC[part]} 3개예요.`,
        },
      ],
    };
  }

  const kind = pickOne(['all', 'faces_vertices', 'edges_minus_faces']);
  const answer = kind === 'all' ? 26 : kind === 'faces_vertices' ? 14 : 6;
  return {
    ...base,
    subtopic: '구성 요소의 수 계산',
    question:
      kind === 'all'
        ? `${solid}의 면, 모서리, 꼭짓점의 수를 모두 더하면 얼마인가요?`
        : kind === 'faces_vertices'
          ? `${solid}의 면의 수와 꼭짓점의 수를 더하면 얼마인가요?`
          : `${solid}의 모서리의 수는 면의 수보다 몇 개 더 많나요?`,
    visual: sketch,
    hint: '면 6개, 모서리 12개, 꼭짓점 8개를 떠올려 계산해요.',
    correctAnswer: answer,
    explanations: [
      PARTS_EXPLANATION,
      {
        title: '2단계: 계산하기',
        content:
          kind === 'all'
            ? `6 + 12 + 8 = ${josa(26, '이')} 돼요.`
            : kind === 'faces_vertices'
              ? `6 + 8 = ${josa(14, '이')} 돼요.`
              : `12 - 6 = ${josa(6, '이')} 돼요.`,
      },
    ],
  };
}
