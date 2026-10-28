import type { Difficulty, Problem } from '../../types/math';
import { gcd, josa, pickOne, randomInt, shuffle, simplifyFraction } from '../mathHelpers';
import { KID_CALL } from '../profile';

// Random integer in [min, max] whose last digit is not 0, so n / 10^k shows every decimal place (no 2.0 or 1.10)
function randomScaled(min: number, max: number): number {
  let n = randomInt(min, max);
  while (n % 10 === 0) n = randomInt(min, max);
  return n;
}

// scaled / 10^places written with every place first, then without its trailing 0s:
// "0.150이고, 소수 끝자리 0을 생략하면 0.15입니다." or just "0.15입니다."
export function decimalResultText(scaled: number, places: number): string {
  const value = scaled / 10 ** places;
  const full = value.toFixed(places);
  return String(value) === full
    ? `${full}입니다.`
    : `${full}이고, 소수 끝자리 0을 생략하면 ${value}입니다.`;
}

const REMAINDER_STORIES = [
  {
    context: '끈 자르기',
    unit: 'm',
    question: (total: number, each: number) =>
      `끈 ${total}m를 ${each}m씩 자르려고 합니다. 최대한 많이 자르면 남는 끈은 몇 m인가요?`,
    shared: (each: number, count: number) => `${each}m씩 ${count}도막을 자를 수 있어요.`,
  },
  {
    context: '쌀 나누어 담기',
    unit: 'kg',
    question: (total: number, each: number) =>
      `쌀 ${total}kg을 한 봉지에 ${each}kg씩 나누어 담으려고 합니다. 최대한 많은 봉지에 담으면 남는 쌀은 몇 kg인가요?`,
    shared: (_each: number, count: number) => `${count}봉지에 담을 수 있어요.`,
  },
  {
    context: '물 나누어 담기',
    unit: 'L',
    question: (total: number, each: number) =>
      `물 ${total}L를 한 통에 ${each}L씩 나누어 담으려고 합니다. 최대한 많은 통에 담으면 남는 물은 몇 L인가요?`,
    shared: (_each: number, count: number) => `${count}통에 담을 수 있어요.`,
  },
];

const WORD_STORIES = [
  {
    context: '리본 끈 이어 붙이기',
    unit: 'm',
    question: (amount: number, count: number) =>
      `${KID_CALL}에게 길이가 ${amount}m인 리본 끈이 ${count}개 있습니다. ${KID_CALL}가 이 리본 끈들을 겹치지 않게 모두 이어 붙이면 총 몇 m가 될까요?`,
    hint: '한 개의 길이 × 개수로 식을 세워보세요!',
  },
  {
    context: '주스 병 모으기',
    unit: 'L',
    question: (amount: number, count: number) =>
      `한 병에 주스가 ${amount}L씩 들어 있습니다. 똑같은 주스 ${count}병에 들어 있는 주스는 모두 몇 L인가요?`,
    hint: '한 병의 양 × 병의 수로 식을 세워보세요!',
  },
];

// 이상 and 이하 include the bound, 초과 and 미만 leave it out; topic is the word with its particle
const RANGE_WORDS: Record<string, { topic: string; meaning: (n: number) => string }> = {
  이상: { topic: '이상은', meaning: (n) => `${josa(n, '과')} 같거나 큰 수` },
  이하: { topic: '이하는', meaning: (n) => `${josa(n, '과')} 같거나 작은 수` },
  초과: { topic: '초과는', meaning: (n) => `${n}보다 큰 수` },
  미만: { topic: '미만은', meaning: (n) => `${n}보다 작은 수` },
};
const PLACE_COUNT = ['', '한', '두', '세'];

const PLACE_NAMES: Record<number, string> = { 10: '십', 100: '백', 1000: '천', 10000: '만' };

export function generateDecimalProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'compare',
    'division',
    'nat_div_dec',
    'nat_div_nat',
    'fraction_to_decimal',
    'number_range',
    'addition_subtraction',
    'word_problem',
    'place_shift',
    'to_fraction',
    'rounding',
    'decimal_div_natural',
    'quotient_rounding',
    'decimal_remainder',
    'round_up_down',
    'unit_conversion',
    'decimal_units_count',
    'make_whole',
  ]);
  const id = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'place_shift') {
    const op = pickOne(
      difficulty === 'easy'
        ? ['× 10', '× 100', '÷ 10']
        : difficulty === 'medium'
          ? ['× 10', '× 100', '× 1000', '÷ 10', '÷ 100']
          : ['× 100', '× 1000', '÷ 100', '÷ 1000'],
    );
    const factor = Number(op.slice(2));
    // ×: results stay below 1000; ÷10: one decimal place, ÷100 and ÷1000: whole number, so answers have at most 3 decimals
    const valueText =
      op[0] === '×'
        ? String(randomScaled(11, 999) / (factor === 1000 ? 1000 : 100))
        : factor === 10
          ? String(randomInt(11, 999) / 10)
          : String(randomInt(12, 999));
    const value = Number(valueText);
    const answer = Number((op[0] === '×' ? value * factor : value / factor).toFixed(4));
    const shift = String(factor).length - 1;

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수점의 이동',
      difficulty,
      question: `다음을 계산하세요:  ${valueText} ${op}`,
      hint: `10, 100, 1000을 곱하면 소수점이 오른쪽으로, 나누면 왼쪽으로 0의 개수만큼 이동해요!`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 소수점이 움직이는 방향',
          content: `${op[0] === '×' ? '곱하기' : '나누기'} ${factor}이므로 소수점이 ${op[0] === '×' ? '오른쪽' : '왼쪽'}으로 ${shift}칸 이동합니다.`,
        },
        {
          title: '2단계: 결과',
          content: `${valueText} ${op} = ${answer}`,
        },
      ],
    };
  }

  if (type === 'to_fraction') {
    // easy: tenths; medium: hundredths; hard: hundredths that reduce, or eighths such as 0.375
    const eighths = difficulty === 'hard' && Math.random() < 0.5;
    const den = difficulty === 'easy' ? 10 : eighths ? 1000 : 100;
    let num = eighths ? pickOne([125, 375, 625, 875]) : randomInt(1, den - 1);
    while (den === 100 && (num % 10 === 0 || (difficulty === 'hard' && gcd(num, den) === 1))) {
      num = randomInt(1, den - 1);
    }
    const simplified = simplifyFraction(num, den);
    const common = gcd(num, den);
    const places = String(den).length - 1;
    const decimalText = (num / den).toFixed(places);

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수를 분수로',
      difficulty,
      question: `${josa(decimalText, '을')} 기약분수로 나타내세요.`,
      hint: `소수 ${PLACE_COUNT[places]} 자리 수는 분모가 ${den}인 분수로 나타낼 수 있어요. 그다음 약분할 수 있으면 약분해요!`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: `1단계: 분모가 ${den}인 분수로 바꾸기`,
          content: `${decimalText} = ${num}/${den}`,
        },
        common === 1
          ? {
              title: '2단계: 기약분수인지 확인하기',
              content: `${josa(num, '과')} ${den}의 공약수는 1뿐이므로 ${josa(`${num}/${den}`, '은')} 이미 기약분수입니다.`,
            }
          : {
              title: '2단계: 약분하기',
              content: `분모와 분자를 최대공약수 ${josa(common, '으로')} 나누면 ${num}/${den} = ${simplified.num}/${simplified.den}입니다.`,
            },
      ],
    };
  }

  if (type === 'rounding') {
    const places = difficulty === 'easy' ? 1 : 2;
    // The number is n / 1000; a nonzero last digit means it really needs rounding (not 28.650 to two places)
    let n = randomScaled(1001, 99999);
    // hard: half the time the kept place is 9 and rounds up, so the 1 carries over (43.597 → 43.60)
    if (difficulty === 'hard' && Math.random() < 0.5)
      n = Math.floor(n / 100) * 100 + 90 + randomInt(5, 9);
    // n / 10 and n / 100 are exact at .5, so Math.round rounds halves up (n / 1000 * 100 can land just below)
    const answer = Math.round(n / 10 ** (3 - places)) / 10 ** places;
    const rawText = (n / 1000).toFixed(3);
    const placeName = places === 1 ? '첫째' : '둘째';
    const nextName = places === 1 ? '둘째' : '셋째';
    const digit = Number(rawText[rawText.indexOf('.') + places + 1]);

    return {
      id,
      topicId: 'decimals',
      subtopic: '어림하기 (반올림)',
      difficulty,
      question: `${josa(rawText, '을')} 반올림하여 소수 ${placeName} 자리까지 나타내세요.`,
      hint: `소수 ${nextName} 자리 숫자가 5 이상이면 올리고, 4 이하이면 버려요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 바로 아래 자리 숫자 확인',
          content: `소수 ${nextName} 자리 숫자는 ${digit}입니다.`,
        },
        {
          title: '2단계: 올림 또는 버림',
          content: `${digit >= 5 ? '5 이상이므로 올려서' : '4 이하이므로 버려서'} ${answer.toFixed(places)}입니다.`,
        },
      ],
    };
  }

  if (type === 'compare') {
    // A tenths number against hundredths numbers close to it, such as 0.8 and 0.75; hard compares three
    const whole = difficulty === 'easy' ? 0 : randomInt(1, 9);
    const tenth = randomInt(1, 9);
    const scaled = new Set<number>([whole * 100 + tenth * 10]);
    while (scaled.size < (difficulty === 'hard' ? 3 : 2)) {
      scaled.add(whole * 100 + randomScaled(Math.max(1, tenth * 10 - 9), tenth * 10 + 9));
    }
    const values = shuffle([...scaled].map((v) => v / 100));
    const bigger = Math.random() < 0.5;
    const answer = bigger ? Math.max(...values) : Math.min(...values);
    const ordered = [...values].sort((a, b) => (bigger ? b - a : a - b));
    const tenthText = String((whole * 100 + tenth * 10) / 100);
    const most = values.length === 3 ? '가장' : '더';
    const askWord = bigger ? '큰' : '작은';

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수의 크기 비교',
      difficulty,
      question:
        values.length === 3
          ? `${values.join(', ')} 중에서 가장 ${askWord} 수는 얼마인가요?`
          : `${josa(values[0], '과')} ${values[1]} 중에서 더 ${askWord} 수는 얼마인가요?`,
      hint: `소수점 아래 자리 수가 다르면 끝자리에 0을 붙여 자리 수를 같게 한 다음, 높은 자리부터 차례로 비교해요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 소수점 아래 자리 수 같게 하기',
          content: `${josa(tenthText, '은')} ${josa(Number(tenthText).toFixed(2), '으로')} 생각하면 모두 소수 두 자리가 돼요.`,
        },
        {
          title: '2단계: 높은 자리부터 비교하기',
          content: `${ordered.map((v) => v.toFixed(2)).join(bigger ? ' > ' : ' < ')}이므로 ${most} ${askWord} 수는 ${answer}입니다.`,
        },
      ],
    };
  }

  if (type === 'nat_div_nat' || type === 'fraction_to_decimal') {
    // The divisor divides 10, 100 or 1000, so the quotient ends: 3 ÷ 4 = 3/4 = 75/100 = 0.75
    const fraction = type === 'fraction_to_decimal';
    // Fractions below hard also use 20, 25 and 50, which reach 100 by multiplying by 5, 4 or 2
    const dens =
      fraction && difficulty !== 'hard'
        ? difficulty === 'easy'
          ? [2, 4, 5, 20, 25, 50]
          : [4, 5, 20, 25, 50]
        : difficulty === 'easy'
          ? [2, 4, 5]
          : difficulty === 'medium'
            ? [2, 4, 5, 20, 25]
            : [8, 25, 40, 50];
    // A fraction to convert stays below 1, as in 3/4 or 7/20
    const maxA = (den: number) =>
      Math.min(difficulty === 'easy' || den === 8 ? 9 : 19, fraction ? den - 1 : 99);
    // Every pair is equally likely, so 1/2 does not come up as often as 7/20
    const [a, b] = pickOne(
      dens.flatMap((den) =>
        Array.from({ length: maxA(den) }, (_, i): [number, number] => [i + 1, den]).filter(
          ([n]) => gcd(n, den) === 1,
        ),
      ),
    );
    const den = b === 2 || b === 5 ? 10 : b === 8 || b === 40 ? 1000 : 100;
    const factor = den / b;
    const num = a * factor;
    const quotient = num / den;
    const steps = [
      {
        title: `분모를 ${josa(den, '으로')} 만들기`,
        content: `분모와 분자에 똑같이 ${josa(factor, '을')} 곱하면 ${a}/${b} = ${num}/${den}입니다.`,
      },
      {
        title: '소수로 나타내기',
        content: `${num}/${den} = ${quotient}`,
      },
    ];
    if (!fraction) steps.unshift({ title: '분수로 나타내기', content: `${a} ÷ ${b} = ${a}/${b}` });

    return {
      id,
      topicId: 'decimals',
      subtopic: fraction ? '분수를 소수로' : '몫을 소수로 나타내기',
      difficulty,
      question: fraction
        ? `${josa(`${a}/${b}`, '을')} 소수로 나타내세요.`
        : `${a} ÷ ${b}의 몫을 소수로 나타내세요.`,
      hint: fraction
        ? '분모가 10, 100, 1000 중 하나가 되도록 분모와 분자에 같은 수를 곱해 보세요.'
        : `${a} ÷ ${josa(b, '을')} 분수 ${josa(`${a}/${b}`, '으로')} 나타낸 다음, 분모가 10, 100, 1000인 분수로 바꾸어 보세요.`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: steps.map((s, i) => ({ ...s, title: `${i + 1}단계: ${s.title}` })),
    };
  }

  if (type === 'number_range') {
    // easy: 이상 with 이하 or 미만; medium: any pair; hard: a decimal bound, as in 2.5 초과 7 이하
    const lowWord = difficulty === 'easy' ? '이상' : pickOne(['이상', '초과']);
    const highWord = pickOne(['이하', '미만']);
    let low: number;
    let high: number;
    if (difficulty === 'hard') {
      low = randomScaled(11, 99) / 10;
      // A whole upper bound keeps 이하 and 미만 apart; a decimal one is 2.1 to 7.9 above the first natural number
      const start = Math.ceil(low);
      high =
        Math.random() < 0.5
          ? start + randomInt(3, 7)
          : randomScaled(10 * start + 21, 10 * start + 79) / 10;
    } else {
      low = randomInt(10, difficulty === 'easy' ? 40 : 80);
      high = low + randomInt(difficulty === 'easy' ? 3 : 4, difficulty === 'easy' ? 7 : 9);
    }
    const first = lowWord === '이상' ? Math.ceil(low) : Math.floor(low) + 1;
    const last = highWord === '이하' ? Math.floor(high) : Math.ceil(high) - 1;
    const inside = Array.from({ length: last - first + 1 }, (_, i) => first + i);

    return {
      id,
      topicId: 'decimals',
      subtopic: '수의 범위',
      difficulty,
      question: `${low} ${lowWord} ${high} ${highWord}인 자연수는 모두 몇 개인가요?`,
      hint: '이상과 이하는 그 수를 포함하고, 초과와 미만은 그 수를 포함하지 않아요. 범위에 드는 자연수를 차례로 써 보세요.',
      answerType: 'number',
      correctAnswer: inside.length,
      explanations: [
        {
          title: '1단계: 범위의 뜻 알기',
          content: `${low} ${RANGE_WORDS[lowWord].topic} ${RANGE_WORDS[lowWord].meaning(low)}, ${high} ${RANGE_WORDS[highWord].topic} ${RANGE_WORDS[highWord].meaning(high)}예요.`,
        },
        {
          title: '2단계: 범위에 드는 자연수 세기',
          content: `범위에 드는 자연수는 ${inside.join(', ')}이므로 모두 ${inside.length}개입니다.`,
        },
      ],
    };
  }

  if (type === 'division') {
    if (difficulty === 'hard') {
      // Different place counts with a decimal quotient: 1.56 ÷ 1.2 becomes 15.6 ÷ 12 = 1.3
      let divisorInt = randomScaled(11, 29);
      let quotientInt = randomScaled(11, 29);
      while ((divisorInt * quotientInt) % 10 === 0) {
        divisorInt = randomScaled(11, 29);
        quotientInt = randomScaled(11, 29);
      }
      const dividendInt = divisorInt * quotientInt; // in hundredths
      const divisor = divisorInt / 10;
      const quotient = quotientInt / 10;
      const shifted = dividendInt / 10;

      return {
        id,
        topicId: 'decimals',
        subtopic: '소수의 나눗셈',
        difficulty,
        question: `다음 나눗셈을 계산하세요:  ${dividendInt / 100} ÷ ${divisor}`,
        hint: `나누는 수가 자연수가 되도록 두 수에 똑같이 10을 곱한 다음, (소수) ÷ (자연수)로 계산해 보세요.`,
        answerType: 'number',
        correctAnswer: quotient,
        explanations: [
          {
            title: '1단계: 소수점 이동하기 (10배)',
            content: `나누는 수 ${josa(divisor, '이')} 자연수가 되도록 두 수에 똑같이 10을 곱합니다: ${shifted} ÷ ${divisorInt}`,
          },
          {
            title: '2단계: 소수를 자연수로 나누기',
            content: `${dividendInt} ÷ ${divisorInt} = ${quotientInt}이고, ${josa(shifted, '은')} ${dividendInt}의 1/10이므로 몫은 ${quotient}입니다.`,
          },
        ],
      };
    }

    // easy: tenths; medium: tenths or hundredths. A natural dividend would be the 자연수 ÷ 소수 type.
    const places = difficulty === 'medium' && Math.random() < 0.5 ? 2 : 1;
    const scale = 10 ** places;
    const pick = (): [number, number] => [
      places === 2 ? randomScaled(11, 25) : randomInt(2, difficulty === 'easy' ? 6 : 9),
      difficulty === 'easy' ? randomInt(2, 8) : randomInt(3, 12),
    ];
    let [divisorInt, quotient] = pick();
    while ((divisorInt * quotient) % scale === 0) [divisorInt, quotient] = pick();
    const dividendInt = divisorInt * quotient;

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수의 나눗셈',
      difficulty,
      question: `다음 나눗셈을 계산하세요:  ${dividendInt / scale} ÷ ${divisorInt / scale}`,
      hint: `나누는 수가 자연수가 되도록 나누는 수와 나누어지는 수에 똑같이 ${josa(scale, '을')} 곱해서 자연수의 나눗셈으로 바꾸어 풀어보세요!`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: [
        {
          title: `1단계: 소수점 이동하기 (${scale}배)`,
          content: `나누는 수와 나누어지는 수에 똑같이 ${josa(scale, '을')} 곱합니다: ${dividendInt} ÷ ${divisorInt}`,
        },
        {
          title: '2단계: 자연수의 나눗셈 계산',
          content: `${dividendInt} ÷ ${divisorInt} = ${quotient}`,
        },
      ],
    };
  }

  if (type === 'nat_div_dec') {
    // (자연수) ÷ (소수) where divisor × quotient is a natural number: 6 ÷ 1.5 = 4, 3 ÷ 0.12 = 25
    const scale = difficulty === 'hard' ? 100 : 10;
    const [divisorInt, quotient] = pickOne<[number, number]>(
      difficulty === 'hard'
        ? [
            [pickOne([25, 75, 125, 175]), pickOne([4, 8, 12])],
            [pickOne([4, 8, 12, 16, 24, 36]), 25],
            [pickOne([15, 35, 45, 65]), 20],
          ]
        : difficulty === 'medium'
          ? [
              [pickOne([5, 15, 25, 35, 45]), pickOne([2, 4, 6, 8, 12])],
              [pickOne([2, 4, 6, 8, 12, 14, 16, 18]), pickOne([5, 15, 25])],
            ]
          : [
              [pickOne([5, 15, 25]), pickOne([2, 4, 6, 8])],
              [pickOne([2, 4, 6, 8]), pickOne([5, 15])],
            ],
    );
    const dividend = (divisorInt * quotient) / scale;
    const divisor = divisorInt / scale;

    return {
      id,
      topicId: 'decimals',
      subtopic: '자연수 ÷ 소수',
      difficulty,
      question: `다음 나눗셈을 계산하세요:  ${dividend} ÷ ${divisor}`,
      hint: `나누는 수가 자연수가 되도록 두 수에 똑같이 ${josa(scale, '을')} 곱해요. 자연수 ${dividend}에도 똑같이 곱하는 것을 잊지 마세요!`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: [
        {
          title: `1단계: 소수점 이동하기 (${scale}배)`,
          content: `나누는 수 ${josa(divisor, '이')} 자연수가 되도록 두 수에 똑같이 ${josa(scale, '을')} 곱합니다: ${dividend * scale} ÷ ${divisorInt}`,
        },
        {
          title: '2단계: 자연수의 나눗셈 계산',
          content: `${dividend * scale} ÷ ${divisorInt} = ${quotient}`,
        },
      ],
    };
  }

  if (type === 'decimal_div_natural') {
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const n = randomInt(2, difficulty === 'easy' ? 5 : 9);
    // easy: quotient 1.1~5.9; medium: also quotients below 1; hard: hundredths, including 1.5 ÷ 6 = 0.25 and 4.1 ÷ 2 = 2.05
    const [minQ, maxQ] =
      difficulty === 'easy' ? [11, 59] : difficulty === 'medium' ? [2, 99] : [11, 399];
    let q = randomScaled(minQ, maxQ);
    // Keep the dividend a decimal (e.g. not 2.5 × 4 = 10)
    while ((q * n) % scale === 0) q = randomScaled(minQ, maxQ);
    const dividendInt = q * n;
    const dividend = dividendInt / scale;
    const quotient = q / scale;
    // 1.5 ÷ 6 is worked as 1.50 ÷ 6, bringing a 0 down
    const padded = dividend.toFixed(places);

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수 ÷ 자연수',
      difficulty,
      question: `다음 나눗셈을 계산하세요:  ${dividend} ÷ ${n}`,
      hint: `자연수의 나눗셈처럼 계산한 다음, 나누어지는 수의 소수점 위치에 맞추어 몫에 소수점을 찍어요.`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 자연수의 나눗셈으로 계산하기',
          content:
            String(dividend) === padded
              ? `${dividendInt} ÷ ${n} = ${q}`
              : `나누어떨어지도록 ${josa(dividend, '을')} ${josa(padded, '으로')} 생각하고 계산합니다: ${dividendInt} ÷ ${n} = ${q}`,
        },
        {
          title: '2단계: 몫에 소수점 찍기',
          content: `${josa(padded, '은')} ${dividendInt}의 1/${scale}이므로, 몫도 ${q}의 1/${scale}인 ${quotient}입니다.`,
        },
      ],
    };
  }

  if (type === 'quotient_rounding') {
    const places = difficulty === 'hard' ? 2 : 1;
    const b = pickOne(difficulty === 'easy' ? [3, 6, 7, 9] : [3, 6, 7, 9, 11, 12]);
    const maxA = difficulty === 'easy' ? 30 : 60;
    let a = randomInt(b + 1, maxA);
    // The quotient must go past the asked place, or there is nothing to round
    while ((a * 10 ** places) % b === 0) a = randomInt(b + 1, maxA);
    const scaled = a * 10 ** (places + 1);
    const digits = (scaled - (scaled % b)) / b; // quotient cut after places + 1 decimals, as an integer
    const lastDigit = digits % 10;
    // digits / 10 is exact at .5, so Math.round rounds halves up
    const answer = Math.round(digits / 10) / 10 ** places;
    const placeName = places === 1 ? '첫째' : '둘째';
    const nextName = places === 1 ? '둘째' : '셋째';

    return {
      id,
      topicId: 'decimals',
      subtopic: '몫을 반올림하여 나타내기',
      difficulty,
      question: `${a} ÷ ${b}의 몫을 반올림하여 소수 ${placeName} 자리까지 나타내세요.`,
      hint: `몫을 소수 ${nextName} 자리까지 구한 다음, 소수 ${nextName} 자리에서 반올림해요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: `1단계: 몫을 소수 ${nextName} 자리까지 구하기`,
          content: `${a} ÷ ${b} = ${(digits / 10 ** (places + 1)).toFixed(places + 1)}${scaled % b ? '...' : ''}`,
        },
        {
          title: '2단계: 반올림하기',
          content: `소수 ${nextName} 자리 숫자가 ${lastDigit}이므로 ${lastDigit >= 5 ? '올려서' : '버려서'} ${answer.toFixed(places)}입니다.`,
        },
      ],
    };
  }

  if (type === 'decimal_remainder') {
    const each = randomInt(2, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9);
    const groups = randomInt(3, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12);
    const restInt = randomScaled(1, each * 10 - 1); // in tenths, less than one share
    const total = (each * 10 * groups + restInt) / 10;
    const rest = restInt / 10;
    const story = pickOne(REMAINDER_STORIES);

    return {
      id,
      topicId: 'decimals',
      subtopic: '나누어 주고 남는 양',
      difficulty,
      context: story.context,
      question: story.question(total, each),
      hint: `${total} ÷ ${each}의 몫을 자연수까지만 구한 다음, ${josa(each, '과')} 몫의 곱을 전체에서 빼 보세요.`,
      answerType: 'number',
      correctAnswer: rest,
      explanations: [
        {
          title: '1단계: 몫을 자연수까지 구하기',
          content: `${total} ÷ ${each}의 몫을 자연수까지 구하면 ${groups}이므로 ${story.shared(each, groups)}`,
        },
        {
          title: '2단계: 남는 양 구하기',
          content: `${total} - ${each} × ${groups} = ${total} - ${each * groups} = ${rest}${story.unit}`,
        },
      ],
    };
  }

  if (type === 'round_up_down') {
    const up = Math.random() < 0.5;
    if (difficulty === 'hard') {
      // A decimal rounded up or down to the tenths: 3.42 → 3.5 (올림) or 3.4 (버림)
      const n = randomScaled(101, 999);
      const answer = (up ? Math.ceil(n / 10) : Math.floor(n / 10)) / 10;
      const below = (n % 10) / 100; // the part below the tenths, such as 0.02 in 3.42

      return {
        id,
        topicId: 'decimals',
        subtopic: up ? '어림하기 (올림)' : '어림하기 (버림)',
        difficulty,
        question: `${josa(n / 100, '을')} ${up ? '올림' : '버림'}하여 소수 첫째 자리까지 나타내세요.`,
        hint: `${up ? '올림은 구하려는 자리 아래 수를 올려서' : '버림은 구하려는 자리 아래 수를 버려서'} 나타내는 방법이에요. 소수 첫째 자리 아래에 어떤 수가 있는지 살펴보세요.`,
        answerType: 'number',
        correctAnswer: answer,
        explanations: [
          {
            title: '1단계: 구하려는 자리 아래 수 확인',
            content: `${n / 100}에서 소수 첫째 자리 아래 수는 ${below}입니다.`,
          },
          {
            title: up ? '2단계: 올림하기' : '2단계: 버림하기',
            content: up
              ? `${josa(below, '을')} 0.1로 보고 올리면 ${answer.toFixed(1)}입니다.`
              : `${josa(below, '을')} 0으로 보고 버리면 ${answer.toFixed(1)}입니다.`,
          },
        ],
      };
    }

    if (up) {
      // 올림: leftover marbles still need one more box
      const unit = 10;
      const maxCount = unit * (difficulty === 'easy' ? 9 : 20);
      let n = randomInt(unit * 2, maxCount);
      while (n % unit === 0) n = randomInt(unit * 2, maxCount);
      const boxes = Math.ceil(n / unit);

      return {
        id,
        topicId: 'decimals',
        subtopic: '어림하기 (올림)',
        difficulty,
        context: '구슬 포장하기',
        question: `구슬 ${n}개를 한 상자에 ${unit}개씩 모두 담으려고 합니다. 상자는 적어도 몇 개 필요한가요?`,
        hint: `${unit}개를 채우지 못한 나머지 구슬도 담으려면 상자가 하나 더 필요해요. 올림을 떠올려 보세요!`,
        answerType: 'number',
        correctAnswer: boxes,
        explanations: [
          {
            title: '1단계: 남는 구슬 확인하기',
            content: `${unit}개씩 ${boxes - 1}상자에 담으면 ${n % unit}개가 남아요. 남은 구슬도 담아야 하므로 상자가 1개 더 필요해요.`,
          },
          {
            title: '2단계: 올림하기',
            content: `${josa(n, '을')} 올림하여 ${PLACE_NAMES[unit]}의 자리까지 나타내면 ${boxes * unit}이므로 상자는 적어도 ${boxes}개입니다.`,
          },
        ],
      };
    }

    // 버림: coins below one bill cannot be exchanged
    const unit = 1000;
    const maxTens = (unit / 10) * (difficulty === 'easy' ? 5 : 10);
    let tens = randomInt(unit / 5, maxTens);
    while (tens % (unit / 10) === 0) tens = randomInt(unit / 5, maxTens);
    const money = tens * 10;
    const exchanged = Math.floor(money / unit) * unit;

    return {
      id,
      topicId: 'decimals',
      subtopic: '어림하기 (버림)',
      difficulty,
      context: '저금통 동전 바꾸기',
      question: `저금통에 모은 동전 ${money}원을 ${unit}원짜리 지폐로 바꾸려고 합니다. 지폐로 최대 몇 원까지 바꿀 수 있나요?`,
      hint: `${unit}원이 안 되는 나머지 돈은 지폐로 바꿀 수 없어요. 버림을 떠올려 보세요!`,
      answerType: 'number',
      correctAnswer: exchanged,
      explanations: [
        {
          title: '1단계: 바꿀 수 없는 돈 확인하기',
          content: `${money}원 중 ${unit}원이 안 되는 ${money % unit}원은 지폐로 바꿀 수 없어요.`,
        },
        {
          title: '2단계: 버림하기',
          content: `${josa(money, '을')} 버림하여 ${PLACE_NAMES[unit]}의 자리까지 나타내면 ${exchanged}이므로 최대 ${exchanged}원까지 바꿀 수 있어요.`,
        },
      ],
    };
  }

  if (type === 'addition_subtraction') {
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const maxValue = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 20 : 10;
    let a = randomScaled(scale, maxValue * scale);
    // hard mixes in a one-place number half the time, as in 3.47 + 1.6
    const bScale = difficulty === 'hard' && Math.random() < 0.5 ? 10 : scale;
    let b = randomScaled(bScale, maxValue * bScale) * (scale / bScale);
    while (a === b) b = randomScaled(bScale, maxValue * bScale) * (scale / bScale);
    const operation = pickOne(['+', '-']);

    if (operation === '-' && a < b) [a, b] = [b, a];

    const answerScaled = operation === '+' ? a + b : a - b;
    const answer = answerScaled / scale;
    const first = String(a / scale);
    const second = String(b / scale);
    const shorter = [a, b].find((v) => v % 10 === 0);
    const alignNote =
      shorter === undefined
        ? ''
        : ` ${josa(shorter / scale, '은')} ${josa((shorter / scale).toFixed(places), '으로')} 생각하고 계산해요.`;

    return {
      id,
      topicId: 'decimals',
      subtopic: operation === '+' ? '소수의 덧셈' : '소수의 뺄셈',
      difficulty,
      question: `다음 소수의 ${operation === '+' ? '덧셈' : '뺄셈'}을 계산하세요: ${first} ${operation} ${second}`,
      hint: `소수점을 세로로 맞추어 쓰고, 같은 자리끼리 계산해 보세요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 소수점 자리 맞추기',
          content: `${josa(first, '과')} ${second}의 소수점을 같은 위치에 맞춥니다.${alignNote}`,
        },
        {
          title: '2단계: 같은 자리끼리 계산하기',
          content: `${first} ${operation} ${second} = ${decimalResultText(answerScaled, places)}`,
        },
      ],
    };
  }

  if (type === 'unit_conversion') {
    // small: value in the smaller unit; values stay in the hundreds so both answers are easy to read
    const conversions = [
      {
        big: 'm',
        bigSubject: '는',
        small: 'cm',
        smallSubject: '는',
        factor: 100,
        min: 10,
        max: 390,
      },
      {
        big: 'cm',
        bigSubject: '는',
        small: 'mm',
        smallSubject: '는',
        factor: 10,
        min: 12,
        max: 99,
      },
      {
        big: 'kg',
        bigSubject: '은',
        small: 'g',
        smallSubject: '은',
        factor: 1000,
        min: 100,
        max: 900,
      },
      {
        big: 'L',
        bigSubject: '는',
        small: 'mL',
        smallSubject: '는',
        factor: 1000,
        min: 100,
        max: 900,
      },
    ];
    // easy stays with length (× 10, × 100); medium adds kg and L (× 1000)
    const c = pickOne(
      difficulty === 'easy' ? conversions.filter((x) => x.factor <= 100) : conversions,
    );
    // Keep the big-unit value a decimal: one decimal place, or two on hard (2.35m, 0.25kg)
    const step = c.factor === 10 ? 1 : difficulty === 'hard' ? c.factor / 100 : c.factor / 10;
    let smallValue = randomInt(c.min / step, c.max / step) * step;
    while (smallValue % c.factor === 0) {
      smallValue = randomInt(c.min / step, c.max / step) * step;
    }
    const bigValue = smallValue / c.factor;
    const toSmall = Math.random() < 0.5;

    return {
      id,
      topicId: 'decimals',
      subtopic: '길이·무게·들이 단위 바꾸기',
      difficulty,
      question: toSmall
        ? `${bigValue}${c.big}${c.bigSubject} 몇 ${c.small}인가요?`
        : `${smallValue}${c.small}${c.smallSubject} 몇 ${c.big}인가요?`,
      hint: `1${c.big} = ${c.factor}${c.small}입니다. ${toSmall ? `${josa(c.factor, '을')} 곱해요.` : `${josa(c.factor, '으로')} 나눠요.`}`,
      answerType: 'number',
      correctAnswer: toSmall ? smallValue : bigValue,
      explanations: [
        {
          title: '1단계: 단위 사이의 관계',
          content: `1${c.big} = ${c.factor}${c.small}입니다.`,
        },
        {
          title: '2단계: 소수점 옮기기',
          content: toSmall
            ? `${bigValue} × ${c.factor} = ${smallValue}이므로 ${smallValue}${c.small}입니다.`
            : `${smallValue} ÷ ${c.factor} = ${bigValue}이므로 ${bigValue}${c.big}입니다.`,
        },
      ],
    };
  }

  if (type === 'decimal_units_count') {
    const hundredths = difficulty === 'hard';
    const unitText = hundredths ? '0.01' : '0.1';
    const scale = hundredths ? 100 : 10;
    const count = hundredths
      ? randomScaled(101, 399)
      : randomScaled(11, difficulty === 'easy' ? 49 : 99);
    const value = count / scale;
    const askValue = Math.random() < 0.5;

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수의 크기 (0.1, 0.01의 개수)',
      difficulty,
      question: askValue
        ? `${unitText}이 ${count}개인 수는 얼마인가요?`
        : `${josa(value, '은')} ${unitText}이 몇 개인 수인가요?`,
      hint: `${unitText}이 ${scale}개이면 1이에요.`,
      answerType: 'number',
      correctAnswer: askValue ? value : count,
      explanations: [
        {
          title: '1단계: 1을 만드는 개수',
          content: `${unitText}이 ${scale}개이면 1입니다.`,
        },
        {
          title: '2단계: 개수와 소수 연결하기',
          content: `${unitText}이 ${count}개이면 ${value}이고, 거꾸로 ${value}에는 ${unitText}이 ${count}개 들어 있어요.`,
        },
      ],
    };
  }

  if (type === 'make_whole') {
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const unitText = places === 2 ? '0.01' : '0.1';
    const target = difficulty === 'easy' ? 1 : randomInt(1, difficulty === 'medium' ? 3 : 5);
    let aInt = randomScaled(1, target * scale - 1);
    // Not the half, where the answer just repeats the given number (0.5 + □ = 1)
    while (aInt * 2 === target * scale) aInt = randomScaled(1, target * scale - 1);
    const a = aInt / scale;
    const answer = (target * scale - aInt) / scale;

    return {
      id,
      topicId: 'decimals',
      subtopic: '더해서 자연수 만들기',
      difficulty,
      question: `□에 알맞은 소수를 구하세요:  ${a} + □ = ${target}`,
      hint: `${target}에서 ${josa(a, '을')} 빼면 돼요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: `1단계: ${unitText}의 개수로 생각하기`,
          content: `${josa(target, '은')} ${unitText}이 ${target * scale}개, ${josa(a, '은')} ${unitText}이 ${aInt}개입니다.`,
        },
        {
          title: '2단계: 모자란 만큼 구하기',
          content: `${target * scale} - ${aInt} = ${target * scale - aInt}이므로 □는 ${unitText}이 ${target * scale - aInt}개인 ${answer}입니다.`,
        },
      ],
    };
  }

  // Word Problem: (소수) × (자연수) in a story
  const places = difficulty === 'hard' ? 2 : 1;
  const scale = 10 ** places;
  const maxAmount = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 40 : 250;
  const minAmount = difficulty === 'hard' ? 101 : 12;
  const amountInt = randomScaled(minAmount, maxAmount);
  const amount = amountInt / scale;
  const count =
    difficulty === 'easy'
      ? randomInt(2, 4)
      : difficulty === 'medium'
        ? randomInt(3, 6)
        : randomInt(4, 8);
  const product = amountInt * count;
  const story = pickOne(WORD_STORIES);

  return {
    id,
    topicId: 'decimals',
    subtopic: '소수 실생활 문제',
    difficulty,
    context: story.context,
    question: story.question(amount, count),
    hint: story.hint,
    answerType: 'number',
    correctAnswer: product / scale,
    explanations: [
      {
        title: '1단계: 식 세우기',
        content: `${amount} × ${count}`,
      },
      {
        title: '2단계: 자연수처럼 곱하기',
        content: `${amountInt} × ${count} = ${product}`,
      },
      {
        title: '3단계: 소수점 찍기',
        content: `${josa(amount, '은')} 소수 ${PLACE_COUNT[places]} 자리이므로 ${product}에서 소수점을 왼쪽으로 ${places}칸 옮기면 ${decimalResultText(product, places)}`,
      },
      { title: '답', content: `${product / scale}${story.unit}` },
    ],
  };
}
