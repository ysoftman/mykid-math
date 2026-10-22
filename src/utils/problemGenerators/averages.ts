import type { Difficulty, Problem } from '../../types/math';
import { josa, pickOne, randomInt } from '../mathHelpers';
import { KID_CALL } from '../profile';

const SCORE_SETS = [
  { name: '수학 시험 점수', unit: '점', labels: ['1회', '2회', '3회', '4회', '5회'] },
  { name: '과목별 점수', unit: '점', labels: ['국어', '수학', '영어', '과학', '사회'] },
  { name: '줄넘기 횟수', unit: '번', labels: ['월요일', '화요일', '수요일', '목요일', '금요일'] },
  {
    name: '하루에 읽은 책의 쪽수',
    unit: '쪽',
    labels: ['월요일', '화요일', '수요일', '목요일', '금요일'],
  },
];

// n values in [10, 100] whose average is exactly mean: deviations of ±10 or ±20 that cancel out
function valuesWithMean(n: number, mean: number): number[] {
  for (;;) {
    const deltas = Array.from({ length: n - 1 }, () => pickOne([-20, -10, 0, 10, 20]));
    const last = -deltas.reduce((a, b) => a + b, 0);
    const values = [...deltas, last].map((d) => mean + d);
    if (values.every((v) => v >= 10 && v <= 100) && new Set(values).size > 1) return values;
  }
}

const CHANCES = [
  { event: '동전을 한 번 던질 때 그림 면이 나올', num: 1, den: 2 },
  { event: '주사위를 한 번 굴릴 때 짝수가 나올', num: 1, den: 2 },
  { event: '주사위를 한 번 굴릴 때 3 이하의 수가 나올', num: 1, den: 2 },
  { event: '빨간 구슬 3개와 파란 구슬 3개가 든 주머니에서 빨간 구슬을 꺼낼', num: 1, den: 2 },
  { event: '똑같은 크기의 4칸 중 2칸이 노란색인 회전판에서 화살이 노란색에 멈출', num: 1, den: 2 },
  { event: '빨간 구슬만 5개 든 주머니에서 빨간 구슬을 꺼낼', num: 1, den: 1 },
  { event: '1부터 6까지 적힌 주사위를 굴릴 때 6 이하의 수가 나올', num: 1, den: 1 },
  { event: '전부 파란색으로 칠한 회전판에서 화살이 파란색에 멈출', num: 1, den: 1 },
];

export function generateAveragesProblem(difficulty: Difficulty): Problem {
  const id = `avg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const type = pickOne(
    difficulty === 'easy'
      ? ['mean', 'mean', 'half_chance', 'chance_fraction']
      : difficulty === 'medium'
        ? ['mean', 'missing', 'total', 'half_chance', 'chance_fraction']
        : ['mean', 'missing', 'raise_mean', 'chance_fraction'],
  );

  if (type === 'mean') {
    const count = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const set = pickOne(SCORE_SETS);
    const mean = difficulty === 'hard' ? randomInt(6, 16) * 5 : randomInt(3, 8) * 10;
    const values = valuesWithMean(count, mean);
    const sum = mean * count;

    return {
      id,
      topicId: 'averages',
      subtopic: '평균 구하기',
      difficulty,
      question: `${KID_CALL}의 ${set.name}는 ${values.join(', ')}${set.unit}입니다. 평균은 몇 ${set.unit}인가요?`,
      hint: '평균은 (자료를 모두 더한 값) ÷ (자료의 수)예요. 먼저 모두 더해 보세요.',
      answerType: 'number',
      correctAnswer: mean,
      explanations: [
        { title: '1단계: 모두 더하기', content: `${values.join(' + ')} = ${sum}` },
        {
          title: '2단계: 자료의 수로 나누기',
          content: `${sum} ÷ ${count} = ${mean}이므로 평균은 ${mean}${set.unit}이에요.`,
        },
      ],
    };
  }

  if (type === 'missing') {
    const count = difficulty === 'hard' ? 5 : 4;
    const set = pickOne(SCORE_SETS);
    const mean = randomInt(4, 8) * 10;
    const values = valuesWithMean(count, mean);
    const known = values.slice(0, -1);
    const missing = values[count - 1];
    const knownSum = known.reduce((a, b) => a + b, 0);

    return {
      id,
      topicId: 'averages',
      subtopic: '평균으로 모르는 값 구하기',
      difficulty,
      question: `${KID_CALL}의 ${set.name} ${count}개의 평균은 ${mean}${set.unit}입니다. 그중 ${count - 1}개가 ${known.join(', ')}${set.unit}이면 나머지 하나는 몇 ${set.unit}인가요?`,
      hint: `평균 × 자료의 수 = 전체 합이에요. 전체 합에서 알고 있는 값을 모두 빼 보세요.`,
      answerType: 'number',
      correctAnswer: missing,
      explanations: [
        { title: '1단계: 전체 합 구하기', content: `${mean} × ${count} = ${mean * count}` },
        {
          title: '2단계: 아는 값 빼기',
          content: `${mean * count} - (${known.join(' + ')}) = ${mean * count} - ${knownSum} = ${missing}`,
        },
      ],
    };
  }

  if (type === 'total') {
    const count = randomInt(3, 5);
    const mean = randomInt(2, Math.floor(200 / count / 5)) * 5;
    const total = mean * count;

    return {
      id,
      topicId: 'averages',
      subtopic: '평균으로 전체 합 구하기',
      difficulty,
      question: `${KID_CALL}는 ${count}일 동안 하루 평균 ${mean}개씩 문제를 풀었습니다. ${count}일 동안 푼 문제는 모두 몇 개인가요?`,
      hint: '평균 × 날수 = 전체 개수예요.',
      answerType: 'number',
      correctAnswer: total,
      explanations: [{ title: '평균 × 자료의 수', content: `${mean} × ${count} = ${total}개` }],
    };
  }

  if (type === 'raise_mean') {
    const count = randomInt(2, 4);
    const oldMean = randomInt(5, 8) * 10;
    const newMean = oldMean + pickOne([5, 10]);
    const needed = newMean * (count + 1) - oldMean * count;
    if (needed > 100) return generateAveragesProblem(difficulty);

    return {
      id,
      topicId: 'averages',
      subtopic: '평균 올리기',
      difficulty,
      question: `${KID_CALL}의 수학 시험 ${count}회 평균은 ${oldMean}점입니다. ${count + 1}회까지의 평균을 ${newMean}점으로 올리려면 ${count + 1}회에 몇 점을 받아야 하나요?`,
      hint: `${count + 1}회까지의 전체 합(${newMean} × ${count + 1})에서 지금까지의 합(${oldMean} × ${count})을 빼 보세요.`,
      answerType: 'number',
      correctAnswer: needed,
      explanations: [
        {
          title: '1단계: 목표 전체 합',
          content: `${newMean} × ${count + 1} = ${newMean * (count + 1)}`,
        },
        {
          title: '2단계: 지금까지의 합',
          content: `${oldMean} × ${count} = ${oldMean * count}`,
        },
        {
          title: '3단계: 필요한 점수',
          content: `${newMean * (count + 1)} - ${oldMean * count} = ${needed}점`,
        },
      ],
    };
  }

  if (type === 'half_chance') {
    const total = pickOne([4, 6, 8, 10]);
    const half = total / 2;
    const spinner = Math.random() < 0.5;

    return {
      id,
      topicId: 'averages',
      subtopic: '가능성이 반반인 경우',
      difficulty,
      question: spinner
        ? `똑같은 크기의 ${total}칸으로 나눈 회전판이 있습니다. 화살이 빨간색에 멈출 가능성이 '반반이다'가 되려면 빨간색은 몇 칸이어야 하나요?`
        : `주머니에 구슬이 ${total}개 들어 있습니다. 빨간 구슬을 꺼낼 가능성이 '반반이다'가 되려면 빨간 구슬은 몇 개여야 하나요?`,
      hint: '반반은 전체의 절반이에요. 전체를 2로 나눠 보세요.',
      answerType: 'number',
      correctAnswer: half,
      explanations: [
        {
          title: '전체의 절반 구하기',
          content: `${total} ÷ 2 = ${half}이므로 ${josa(half, '이')} 빨간색이면 가능성은 반반(1/2)이에요.`,
        },
      ],
    };
  }

  const chance = pickOne(CHANCES);
  const certain = chance.den === 1;

  return {
    id,
    topicId: 'averages',
    subtopic: '가능성을 수로 나타내기',
    difficulty,
    question: `${chance.event} 가능성을 수로 나타내면 얼마인가요? (불가능하면 0, 반반이면 1/2, 확실하면 1)`,
    hint: '일이 일어날 가능성이 확실하면 1, 반반이면 1/2, 불가능하면 0으로 나타내요.',
    answerType: 'fraction',
    correctAnswer: { num: chance.num, den: chance.den },
    explanations: [
      {
        title: '가능성 생각하기',
        content: certain
          ? '어떤 경우에도 반드시 일어나는 일이므로 가능성은 "확실하다"이고, 수로 나타내면 1이에요.'
          : '전체 경우 중 절반에서 일어나는 일이므로 가능성은 "반반이다"이고, 수로 나타내면 1/2이에요.',
      },
    ],
  };
}
