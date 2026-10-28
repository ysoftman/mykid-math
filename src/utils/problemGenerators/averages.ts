import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt, shuffle } from '../mathHelpers';
import { KID_CALL } from '../profile';

const DAYS = ['월요일', '화요일', '수요일', '목요일', '금요일'];
const COUNT_WORD = ['', '한', '두', '세', '네', '다섯'];

// data and one() take '는', meanOf() takes '은'/'이'
const SCORE_SETS = [
  {
    data: `${KID_CALL}의 수학 시험 점수`,
    unit: '점',
    labels: ['1회', '2회', '3회', '4회', '5회'],
    meanOf: (n: number) => `${KID_CALL}의 1회부터 ${n}회까지 수학 시험 점수의 평균`,
    one: (label: string) => `${label} 점수`,
  },
  {
    data: `${KID_CALL}의 과목별 점수`,
    unit: '점',
    labels: ['국어', '수학', '영어', '과학', '사회'],
    meanOf: (n: number) => `${KID_CALL}의 ${COUNT_WORD[n]} 과목 점수의 평균`,
    one: (label: string) => `${label} 점수`,
  },
  {
    data: `${KID_CALL}의 요일별 줄넘기 횟수`,
    unit: '번',
    labels: DAYS,
    meanOf: (n: number) => `${KID_CALL}가 ${n}일 동안 한 줄넘기 횟수의 평균`,
    one: (label: string) => `${label}의 줄넘기 횟수`,
  },
  {
    data: `${KID_CALL}가 요일별로 읽은 책의 쪽수`,
    unit: '쪽',
    labels: DAYS,
    meanOf: (n: number) => `${KID_CALL}가 ${n}일 동안 읽은 쪽수의 평균`,
    one: (label: string) => `${label}에 읽은 쪽수`,
  },
];

// "월요일 60쪽, 화요일 30쪽" pairs each value with its label
function listValues(set: (typeof SCORE_SETS)[number], values: number[]): string {
  return values.map((v, i) => `${set.labels[i]} ${v}${set.unit}`).join(', ');
}

// n values in [10, 100] whose average is exactly mean: deviations of ±10 or ±20 that cancel out
function valuesWithMean(n: number, mean: number): number[] {
  for (;;) {
    const deltas = Array.from({ length: n - 1 }, () => pickOne([-20, -10, 0, 10, 20]));
    const last = -deltas.reduce((a, b) => a + b, 0);
    const values = [...deltas, last].map((d) => mean + d);
    if (values.every((v) => v >= 10 && v <= 100) && new Set(values).size > 1) return values;
  }
}

// Picking the kind first keeps 0, 1/2 and 1 equally likely
const CHANCES = [
  {
    word: '불가능하다',
    reason: '어떤 경우에도 일어날 수 없는 일',
    num: 0,
    den: 1,
    events: [
      '1부터 6까지 적힌 주사위를 한 번 굴릴 때 7이 나올',
      '빨간 구슬만 5개 든 주머니에서 파란 구슬을 꺼낼',
      '전부 파란색으로 칠한 회전판에서 화살이 빨간색에 멈출',
      '흰 바둑돌만 들어 있는 통에서 검은 바둑돌을 꺼낼',
    ],
  },
  {
    word: '반반이다',
    reason: '전체 경우 중 절반에서 일어나는 일',
    num: 1,
    den: 2,
    events: [
      '동전을 한 번 던질 때 그림 면이 나올',
      '주사위를 한 번 굴릴 때 짝수가 나올',
      '주사위를 한 번 굴릴 때 3 이하의 수가 나올',
      '빨간 구슬 3개와 파란 구슬 3개가 든 주머니에서 빨간 구슬을 꺼낼',
      '똑같은 크기의 4칸 중 2칸이 노란색인 회전판에서 화살이 노란색에 멈출',
    ],
  },
  {
    word: '확실하다',
    reason: '어떤 경우에도 반드시 일어나는 일',
    num: 1,
    den: 1,
    events: [
      '빨간 구슬만 5개 든 주머니에서 빨간 구슬을 꺼낼',
      '1부터 6까지 적힌 주사위를 굴릴 때 6 이하의 수가 나올',
      '전부 파란색으로 칠한 회전판에서 화살이 파란색에 멈출',
      '흰 바둑돌만 들어 있는 통에서 흰 바둑돌을 꺼낼',
    ],
  },
];

// Chances that are only put into words, never as 0, 1/2 or 1
const LIKELY_CHANCES = [
  {
    word: '~아닐 것 같다',
    events: [
      '주사위를 한 번 굴릴 때 1이 나올',
      '빨간 구슬 1개와 파란 구슬 5개가 든 주머니에서 빨간 구슬을 꺼낼',
      '똑같은 크기의 4칸 중 1칸이 노란색인 회전판에서 화살이 노란색에 멈출',
      '1부터 10까지 적힌 카드 중 한 장을 뽑을 때 10이 나올',
    ],
  },
  {
    word: '~일 것 같다',
    events: [
      '주사위를 한 번 굴릴 때 5 이하의 수가 나올',
      '빨간 구슬 5개와 파란 구슬 1개가 든 주머니에서 빨간 구슬을 꺼낼',
      '똑같은 크기의 4칸 중 3칸이 노란색인 회전판에서 화살이 노란색에 멈출',
      '1부터 10까지 적힌 카드 중 한 장을 뽑을 때 9 이하의 수가 나올',
    ],
  },
];

// From least to most likely
const CHANCE_ORDER = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'];

// "줄넘기 기록은", "수학 점수는"; measureIs is the measure with its subject particle
const GROUP_RECORDS = [
  { thing: '줄넘기 기록은', unit: '번', measure: '기록', measureIs: '기록이' },
  { thing: '수학 점수는', unit: '점', measure: '점수', measureIs: '점수가' },
  { thing: '제기차기 기록은', unit: '개', measure: '기록', measureIs: '기록이' },
];

export function generateAveragesProblem(difficulty: Difficulty): Problem {
  const id = `avg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const type = pickOne(
    difficulty === 'easy'
      ? ['mean', 'total', 'above_mean', 'half_chance', 'chance_fraction', 'chance_word']
      : difficulty === 'medium'
        ? [
            'mean',
            'missing',
            'total',
            'compare_groups',
            'above_mean',
            'half_chance',
            'chance_fraction',
            'chance_word',
          ]
        : [
            'mean',
            'missing',
            'raise_mean',
            'compare_groups',
            'above_mean',
            'chance_fraction',
            'chance_word',
          ],
  );

  if (type === 'compare_groups') {
    // Groups of different sizes: the bigger group can have the bigger total but the smaller mean
    const record = pickOne(GROUP_RECORDS);
    const hard = difficulty === 'hard';
    const sizes = shuffle(hard ? [4, 5] : [3, 4]);
    // medium: means in tens, 10 or 20 apart; hard: means in fives, 5, 10 or 15 apart
    const highMean = hard ? randomInt(12, 17) * 5 : randomInt(6, 8) * 10;
    const gap = hard ? pickOne([5, 10, 15]) : pickOne([10, 20]);
    const lowMean = highMean - gap;
    const askGap = Math.random() < 0.5;
    const groups = shuffle([highMean, lowMean]).map((mean, i) => ({
      name: i === 0 ? '가' : '나',
      size: sizes[i],
      mean,
      values: valuesWithMean(sizes[i], mean),
    }));
    const [first, second] = groups;
    const high = first.mean === highMean ? first : second;
    const meanStep = (g: (typeof groups)[number], step: number) => ({
      title: `${step}단계: ${g.name} 모둠의 평균`,
      content: `${g.values.join(' + ')} = ${g.mean * g.size}, ${g.mean * g.size} ÷ ${g.size} = ${g.mean}`,
    });

    return {
      id,
      topicId: 'averages',
      subtopic: '두 모둠의 평균 비교',
      difficulty,
      question: `${first.name} 모둠 ${first.size}명의 ${record.thing} ${first.values.join(', ')}${record.unit}이고, ${second.name} 모둠 ${second.size}명의 ${record.thing} ${second.values.join(', ')}${record.unit}입니다. ${askGap ? `두 모둠의 평균은 몇 ${record.unit} 차이가 나나요?` : `평균이 더 높은 모둠의 평균은 몇 ${record.unit}인가요?`}`,
      hint: `인원수가 다르면 합계가 아니라 평균으로 비교해야 해요. 모둠마다 (${record.measure}의 합) ÷ (인원수)를 구해 보세요.`,
      answerType: 'number',
      correctAnswer: askGap ? gap : highMean,
      explanations: [
        meanStep(first, 1),
        meanStep(second, 2),
        askGap
          ? {
              title: '3단계: 평균의 차 구하기',
              content: `${highMean} - ${lowMean} = ${gap}이므로 두 모둠의 평균은 ${gap}${record.unit} 차이가 나요.`,
            }
          : {
              title: '3단계: 평균 비교하기',
              content: `${highMean} > ${lowMean}이므로 평균이 더 높은 모둠은 ${high.name} 모둠이고, 그 평균은 ${highMean}${record.unit}이에요.`,
            },
      ],
    };
  }

  if (type === 'above_mean') {
    // A value equal to the mean is not above it: 60, 80, 50, 90, 70 has mean 70 and two values above
    const record = pickOne(GROUP_RECORDS);
    const count = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
    const mean = difficulty === 'hard' ? randomInt(9, 16) * 5 : randomInt(4, 8) * 10;
    const values = valuesWithMean(count, mean);
    const above = values.filter((v) => v > mean);
    const sum = mean * count;

    return {
      id,
      topicId: 'averages',
      subtopic: '평균보다 높은 자료의 수',
      difficulty,
      question: `모둠 학생 ${count}명의 ${record.thing} ${values.join(', ')}${record.unit}입니다. ${record.measureIs} 평균보다 높은 학생은 몇 명인가요?`,
      hint: '먼저 평균을 구한 다음, 평균과 하나씩 비교해 보세요. 평균과 같은 값은 평균보다 높은 것이 아니에요.',
      answerType: 'number',
      correctAnswer: above.length,
      explanations: [
        {
          title: '1단계: 평균 구하기',
          content: `${values.join(' + ')} = ${sum}, ${sum} ÷ ${count} = ${mean}`,
        },
        {
          title: '2단계: 평균보다 높은 값 세기',
          content: `${values.includes(mean) ? '평균과 같은 값은 세지 않아요. ' : ''}평균 ${mean}${record.unit}보다 높은 것은 ${above.map((v) => `${v}${record.unit}`).join(', ')}이므로 모두 ${above.length}명입니다.`,
        },
      ],
    };
  }

  if (type === 'chance_word') {
    // Three events with different chances; easy keeps to 불가능하다, 반반이다, 확실하다
    const picked = shuffle(difficulty === 'easy' ? CHANCES : [...CHANCES, ...LIKELY_CHANCES]).slice(
      0,
      3,
    );
    const events = picked.map((c) => pickOne(c.events));
    // hard asks half the time for the most or least likely one instead of a named word
    const order = difficulty === 'hard' && Math.random() < 0.5 ? pickOne(['높은', '낮은']) : '';
    const ranks = picked.map((c) => CHANCE_ORDER.indexOf(c.word));
    const target = order
      ? ranks.indexOf((order === '높은' ? Math.max : Math.min)(...ranks))
      : randomInt(0, 2);
    // One choice per line; MathText turns each "\n" into a line break
    const list = events.map((e, i) => `${'①②③'[i]} ${e} 가능성`).join('\n');

    return {
      id,
      topicId: 'averages',
      subtopic: '가능성을 말로 나타내기',
      difficulty,
      question: order
        ? `다음 중 일이 일어날 가능성이 가장 ${order} 것은 몇 번인가요?\n${list}`
        : `다음 중 가능성이 '${picked[target].word}'인 것은 몇 번인가요?\n${list}`,
      hint: `가능성은 '불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'로 나타내요. 하나씩 일어날 가능성을 생각해 보세요.`,
      answerType: 'number',
      correctAnswer: target + 1,
      explanations: [
        {
          title: '가능성을 말로 나타내기',
          content: `${picked.map((c, i) => `${i + 1}번은 '${c.word}'`).join(', ')}이므로 ${order ? `가능성이 가장 ${order} 것은` : '답은'} ${target + 1}번이에요.`,
        },
      ],
    };
  }

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
      question: `${set.data}는 ${listValues(set, values)}입니다. 평균은 몇 ${set.unit}인가요?`,
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
      question: `${set.meanOf(count)}은 ${mean}${set.unit}입니다. ${listValues(set, known)}일 때 ${set.one(set.labels[count - 1])}는 몇 ${set.unit}인가요?`,
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
    // easy keeps the mean at 30 or less; otherwise the total stays within 200
    const mean = randomInt(2, difficulty === 'easy' ? 6 : Math.floor(200 / count / 5)) * 5;
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
    // Pick the needed score first so answers spread over 65..95 instead of piling up at 100.
    // Raising the mean by `rise` over count + 1 tests needs oldMean + rise × (count + 1).
    const needed = randomInt(13, 19) * 5;
    const options = [2, 3, 4].flatMap((count) =>
      [5, 10].map((rise) => ({ count, rise, oldMean: needed - rise * (count + 1) })),
    );
    const { count, rise, oldMean } = pickOne(
      options.filter((o) => o.oldMean >= 50 && o.oldMean % 10 === 0),
    );
    const newMean = oldMean + rise;
    const next = count + 1;

    return {
      id,
      topicId: 'averages',
      subtopic: '평균 올리기',
      difficulty,
      question: `${KID_CALL}는 수학 시험을 ${count}번 봤고 평균은 ${oldMean}점입니다. ${next}번째 시험에서 몇 점을 받아야 ${next}번의 시험 점수 평균이 ${newMean}점이 되나요?`,
      hint: `${next}번의 점수 합(${newMean} × ${next})에서 지금까지 ${count}번의 점수 합(${oldMean} × ${count})을 빼 보세요.`,
      answerType: 'number',
      correctAnswer: needed,
      explanations: [
        {
          title: `1단계: ${next}번의 점수 합`,
          content: `평균이 ${newMean}점이 되려면 ${newMean} × ${next} = ${newMean * next}점이어야 해요.`,
        },
        {
          title: `2단계: 지금까지 ${count}번의 점수 합`,
          content: `${oldMean} × ${count} = ${oldMean * count}점`,
        },
        {
          title: `3단계: ${next}번째 시험 점수`,
          content: `${newMean * next} - ${oldMean * count} = ${needed}점`,
        },
      ],
    };
  }

  if (type === 'half_chance') {
    // Not 4, whose answer 2 already appears in the hint
    const total = pickOne([6, 8, 10]);
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
          content: spinner
            ? `${total} ÷ 2 = ${half}이므로 빨간색이 ${half}칸이면 가능성은 반반(1/2)이에요.`
            : `${total} ÷ 2 = ${half}이므로 빨간 구슬이 ${half}개이면 가능성은 반반(1/2)이에요.`,
        },
      ],
    };
  }

  const chance = pickOne(CHANCES);
  const value = chance.den === 1 ? `${chance.num}` : `${chance.num}/${chance.den}`;

  return {
    id,
    topicId: 'averages',
    subtopic: '가능성을 수로 나타내기',
    difficulty,
    question: `${pickOne(chance.events)} 가능성을 수로 나타내면 얼마인가요?${difficulty === 'hard' ? '' : ' (불가능하면 0, 반반이면 1/2, 확실하면 1)'}`,
    hint: '일이 일어날 가능성이 확실하면 1, 반반이면 1/2, 불가능하면 0으로 나타내요.',
    answerType: 'fraction',
    correctAnswer: { num: chance.num, den: chance.den },
    explanations: [
      {
        title: '가능성 생각하기',
        content: `${chance.reason}이므로 가능성은 "${chance.word}"이고, 수로 나타내면 ${value}이에요.`,
      },
    ],
  };
}
