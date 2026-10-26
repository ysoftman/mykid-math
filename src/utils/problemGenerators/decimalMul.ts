import type { Difficulty, Problem, StepExplanation } from '../../types/math';
import { josa, pickOne, randomInt } from '../mathHelpers';
import { decimalResultText } from './decimals';

// A factor kept as its digits and decimal places so products use integer arithmetic: 0.3 -> { digits: 3, places: 1 }
interface Factor {
  text: string;
  digits: number;
  places: number;
}

const PLACE_WORD = ['', '한', '두', '세'];
const HUNDREDTHS = [12, 15, 24, 25, 35, 45];

const factor = (digits: number, places: number): Factor => ({
  text: String(digits / 10 ** places),
  digits,
  places,
});
const tenths = (min = 2, max = 9) => factor(randomInt(min, max), 1);
const hundredths = () => factor(pickOne(HUNDREDTHS), 2);
const natural = () => factor(randomInt(2, 9), 0);
const placesText = (f: Factor) => (f.places ? `소수 ${PLACE_WORD[f.places]} 자리` : '자연수');

// Numbers the steps in order, so trimmed or combined explanations still read 1단계, 2단계, ...
const numbered = (steps: StepExplanation[]) =>
  steps.map((s, i) => ({ ...s, title: `${i + 1}단계: ${s.title}` }));

const calcHint = (a: Factor, b: Factor) =>
  a.places && b.places
    ? '자연수처럼 곱한 다음, 두 소수의 소수점 아래 자리 수를 더한 만큼 소수점을 왼쪽으로 옮겨요.'
    : '자연수처럼 곱한 다음, 소수의 소수점 아래 자리 수만큼 소수점을 왼쪽으로 옮겨요.';

function multiply(a: Factor, b: Factor) {
  const product = a.digits * b.digits;
  const places = a.places + b.places;
  const answer = product / 10 ** places;
  const steps: StepExplanation[] = [
    { title: '자연수처럼 곱하기', content: `${a.digits} × ${b.digits} = ${product}` },
    {
      title: '소수점 아래 자리 수 세기',
      content: `${josa(a.text, '은')} ${placesText(a)}, ${josa(b.text, '은')} ${placesText(b)}이므로 곱은 소수 ${PLACE_WORD[places]} 자리예요.`,
    },
    {
      title: '소수점 찍기',
      content: `${product}에서 소수점을 왼쪽으로 ${places}칸 옮기면 ${decimalResultText(product, places)}`,
    },
  ];
  return { product, places, answer, steps };
}

const WORD_PROBLEMS: ((a: string, b: string) => [string, string])[] = [
  (a, b) => [`1m의 무게가 ${a}kg인 철근이 있습니다. 이 철근 ${b}m의 무게는 몇 kg인가요?`, 'kg'],
  (a, b) => [
    `1분에 물이 ${a}L씩 나오는 수도꼭지가 있습니다. 이 수도꼭지로 ${b}분 동안 받은 물은 모두 몇 L인가요?`,
    'L',
  ],
  (a, b) => [
    `한 시간에 ${a}km를 걷는 거북이가 있습니다. ${b}시간 동안 걷는 거리는 몇 km인가요?`,
    'km',
  ],
];

export function generateDecimalMulProblem(difficulty: Difficulty): Problem {
  const id = `dmul_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const type = pickOne(
    difficulty === 'easy'
      ? ['nat_times_dec', 'use_nat_product']
      : difficulty === 'medium'
        ? ['dec_times_dec', 'mixed_times_dec', 'use_nat_product', 'places_count']
        : ['hundredths', 'mixed_times_dec', 'places_count', 'word_problem', 'square'],
  );
  const base = { id, topicId: 'decimalMul' as const, difficulty, answerType: 'number' as const };

  if (type === 'places_count') {
    // One pair per answer (1, 2, 3 places); hard uses decimals above 1 and hundredths
    const hard = difficulty === 'hard';
    const pair = pickOne<() => [Factor, Factor]>([
      () => [hard ? tenths(11, 49) : tenths(), natural()],
      () => (hard ? [hundredths(), natural()] : [tenths(), tenths()]),
      () => [hard ? tenths(11, 19) : tenths(), hundredths()],
    ]);
    let [a, b] = pair();
    // A product ending in 0 would drop a place (0.5 × 0.4 = 0.2), so keep the count unambiguous
    while ((a.digits * b.digits) % 10 === 0) [a, b] = pair();
    if (Math.random() < 0.5) [a, b] = [b, a];
    const { answer, places, steps } = multiply(a, b);
    return {
      ...base,
      subtopic: '곱의 소수점 아래 자리 수',
      question: `${a.text} × ${b.text}의 곱은 소수점 아래 몇째 자리까지 있는 수인가요? (숫자만 쓰세요)`,
      hint:
        a.places && b.places
          ? '두 소수의 소수점 아래 자리 수를 더하면 곱의 소수점 아래 자리 수가 돼요.'
          : '자연수는 소수점 아래 자리가 없으니, 소수의 소수점 아래 자리 수가 곧 곱의 소수점 아래 자리 수예요.',
      correctAnswer: places,
      explanations: numbered([
        steps[1],
        { title: '계산해서 확인하기', content: `${a.text} × ${b.text} = ${answer}` },
      ]),
    };
  }

  if (type === 'use_nat_product') {
    const x = randomInt(2, 9);
    const y = randomInt(2, 9);
    const a = factor(x, 1);
    const b = factor(y, difficulty === 'easy' ? 1 : pickOne([1, 2]));
    const { answer, steps } = multiply(a, b);
    return {
      ...base,
      subtopic: '자연수의 곱을 이용하기',
      question: `${x} × ${y} = ${x * y}임을 이용하여 ${a.text} × ${josa(b.text, '을')} 구하세요.`,
      hint: '자연수의 곱은 그대로이고, 소수점 아래 자리 수만큼 소수점을 왼쪽으로 옮기면 돼요.',
      correctAnswer: answer,
      explanations: numbered(steps.slice(1)),
    };
  }

  if (type === 'word_problem' || type === 'square') {
    const a = tenths();
    const b = type === 'square' ? a : factor(pickOne([15, 25, 35, 45]), 1);
    const { answer, steps } = multiply(a, b);
    const [question, unit] =
      type === 'square'
        ? [`한 변의 길이가 ${a.text}m인 정사각형 모양 천의 넓이는 몇 m²인가요?`, 'm²']
        : pickOne(WORD_PROBLEMS)(a.text, b.text);
    return {
      ...base,
      subtopic: '소수의 곱 문장제',
      question,
      hint: `${a.text} × ${josa(b.text, '을')} 계산하면 돼요. ${calcHint(a, b)}`,
      correctAnswer: answer,
      explanations: [
        ...numbered([{ title: '식 세우기', content: `${a.text} × ${b.text}` }, ...steps]),
        { title: '답', content: `${answer}${unit}` },
      ],
    };
  }

  const [a, b, subtopic] =
    type === 'nat_times_dec'
      ? [natural(), tenths(), '자연수와 소수의 곱']
      : type === 'dec_times_dec'
        ? [tenths(), tenths(), '소수 한 자리끼리의 곱']
        : type === 'mixed_times_dec'
          ? [tenths(11, 19), tenths(), '1보다 큰 소수의 곱']
          : [hundredths(), tenths(2, 8), '소수 두 자리와 소수 한 자리의 곱'];
  const [left, right] = Math.random() < 0.5 ? [a, b] : [b, a];
  const { answer, steps } = multiply(left, right);
  return {
    ...base,
    subtopic,
    question: `다음을 계산하세요:  ${left.text} × ${right.text}`,
    hint: calcHint(left, right),
    correctAnswer: answer,
    explanations: numbered(steps),
  };
}
