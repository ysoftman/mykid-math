import type { Difficulty, Problem } from '../../types/math';
import { gcd, getFactors, josa, lcm, pickOne, randomInt } from '../mathHelpers';
import { KID_CALL } from '../profile';

// Two different numbers in [2, max] where neither divides the other, so the LCM is a new number
// (at most maxLcm, which keeps answers small)
function pickLcmPair(max: number, maxLcm = Number.POSITIVE_INFINITY): [number, number] {
  let a = randomInt(2, max);
  let b = randomInt(2, max);
  while (a === b || lcm(a, b) === Math.max(a, b) || lcm(a, b) > maxLcm) {
    a = randomInt(2, max);
    b = randomInt(2, max);
  }
  return [a, b];
}

// 거꾸로 나눗셈: divide both numbers by a common prime until no common factor but 1 is left
function commonDivisions(a: number, b: number) {
  const steps: string[] = [];
  const divisors: number[] = [];
  for (let p = 2; p <= Math.min(a, b); ) {
    if (a % p === 0 && b % p === 0) {
      a /= p;
      b /= p;
      divisors.push(p);
      steps.push(`${josa(p, '으로')} 나누면 ${a}, ${b}`);
    } else {
      p++;
    }
  }
  return { steps, divisors };
}

export function generateFactorProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'factors_count',
    'gcd',
    'lcm',
    'common_factors_count',
    'word_problem',
    'multiples_count',
    'lcm_word',
    'smallest_3digit_common_multiple',
    'square_tiles',
    'square_from_cards',
    'common_multiples_count',
  ]);
  const id = `fac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'multiples_count') {
    const k =
      difficulty === 'easy'
        ? randomInt(2, 5)
        : difficulty === 'medium'
          ? randomInt(4, 9)
          : randomInt(6, 12);
    const limit =
      difficulty === 'easy'
        ? randomInt(20, 50)
        : difficulty === 'medium'
          ? randomInt(50, 100)
          : randomInt(80, 150);
    const count = Math.floor(limit / k);
    const rest = limit % k;

    return {
      id,
      topicId: 'factors',
      subtopic: '배수의 개수',
      difficulty,
      question: `1부터 ${limit}까지의 자연수 중에서 ${k}의 배수는 모두 몇 개인가요?`,
      hint: `${k}의 배수는 ${k}, ${k * 2}, ${k * 3}, ... 이에요. ${limit} 안에 ${josa(k, '이')} 몇 번 들어가는지 생각해 보세요.`,
      answerType: 'number',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 배수의 규칙 찾기',
          content: `${k}의 배수는 ${k} × 1, ${k} × 2, ${k} × 3, ... 처럼 ${k}에 자연수를 곱한 수예요.`,
        },
        {
          title: '2단계: 나눗셈으로 개수 세기',
          content: `${limit} ÷ ${k} = ${count}${rest ? ` ... ${rest}` : ''}이므로 ${k} × ${count} = ${k * count}까지 모두 ${count}개입니다.`,
        },
      ],
    };
  }

  if (type === 'common_multiples_count') {
    const maxLimit = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 100 : 150;
    const [a, b] = pickLcmPair(
      difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10,
      maxLimit / 2,
    );
    const l = lcm(a, b);
    const limit = randomInt(l * 2, maxLimit);
    const count = Math.floor(limit / l);
    const rest = limit % l;

    return {
      id,
      topicId: 'factors',
      subtopic: '공배수의 개수',
      difficulty,
      question: `1부터 ${limit}까지의 자연수 중에서 ${josa(a, '과')} ${b}의 공배수는 모두 몇 개인가요?`,
      hint: `두 수의 공배수는 최소공배수의 배수와 같아요. 최소공배수를 먼저 구해 보세요!`,
      answerType: 'number',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 최소공배수 구하기',
          content: `${josa(a, '과')} ${b}의 최소공배수는 ${l}이므로 공배수는 ${l}, ${l * 2}, ${l * 3}, ... 입니다.`,
        },
        {
          title: '2단계: 나눗셈으로 개수 세기',
          content: `${limit} ÷ ${l} = ${count}${rest ? ` ... ${rest}` : ''}이므로 ${l} × ${count} = ${l * count}까지 모두 ${count}개입니다.`,
        },
      ],
    };
  }

  if (type === 'lcm_word') {
    const [a, b] = pickLcmPair(difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15, 120);
    const both = lcm(a, b);

    return {
      id,
      topicId: 'factors',
      subtopic: '최소공배수 문장제',
      difficulty,
      context: '버스 동시 출발',
      question: `A 버스는 ${a}분마다, B 버스는 ${b}분마다 출발합니다. 두 버스가 동시에 출발했다면, 다음에 처음으로 다시 동시에 출발하는 것은 몇 분 후인가요?`,
      hint: `두 버스가 함께 출발하는 시각은 ${a}의 배수이면서 ${b}의 배수예요. 그중 가장 작은 수를 찾아보세요!`,
      answerType: 'number',
      correctAnswer: both,
      explanations: [
        {
          title: '1단계: 공배수 찾기',
          content: `A 버스는 ${a}, ${a * 2}, ${a * 3}, ...분 후에, B 버스는 ${b}, ${b * 2}, ${b * 3}, ...분 후에 출발해요.`,
        },
        {
          title: '2단계: 최소공배수 구하기',
          content: `${josa(a, '과')} ${b}의 최소공배수는 ${both}이므로 ${both}분 후에 다시 동시에 출발합니다.`,
        },
      ],
    };
  }

  if (type === 'square_tiles') {
    const g =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(3, 9)
          : randomInt(4, 12);
    const m1 = randomInt(2, 4);
    let m2 = randomInt(m1 + 1, 6);
    while (gcd(m1, m2) !== 1) m2 = randomInt(m1 + 1, 6);
    const width = g * m2;
    const height = g * m1;
    const askCount = difficulty !== 'easy';

    return {
      id,
      topicId: 'factors',
      subtopic: '최대공약수 활용',
      difficulty,
      context: '종이 자르기',
      question: `가로 ${width}cm, 세로 ${height}cm인 직사각형 모양의 종이를 남는 부분 없이 크기가 같은 정사각형 여러 장으로 자르려고 합니다. 가장 큰 정사각형으로 자르면 ${askCount ? '정사각형은 모두 몇 장이 되나요?' : '정사각형의 한 변은 몇 cm인가요?'}`,
      hint: `정사각형의 한 변의 길이로 가로와 세로가 모두 나누어떨어져야 해요(공약수). 가장 큰 정사각형이니 최대공약수!`,
      answerType: 'number',
      correctAnswer: askCount ? m1 * m2 : g,
      explanations: [
        {
          title: '1단계: 정사각형의 한 변 구하기',
          content: `한 변은 ${josa(width, '과')} ${height}의 공약수여야 하고, 가장 큰 정사각형이므로 최대공약수인 ${g}cm입니다.`,
        },
        {
          title: '2단계: 정사각형의 수 세기',
          content: `가로로 ${width} ÷ ${g} = ${m2}장, 세로로 ${height} ÷ ${g} = ${m1}장이므로 모두 ${m2} × ${m1} = ${m1 * m2}장입니다.`,
        },
      ],
    };
  }

  if (type === 'square_from_cards') {
    const [a, b] = pickLcmPair(difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10, 60);
    const side = lcm(a, b);
    const count = (side / a) * (side / b);
    const askCount = difficulty === 'hard';

    return {
      id,
      topicId: 'factors',
      subtopic: '최소공배수 활용',
      difficulty,
      context: '카드로 정사각형 만들기',
      question: `가로 ${a}cm, 세로 ${b}cm인 직사각형 모양의 카드를 같은 방향으로 겹치지 않게 빈틈없이 늘어놓아 가장 작은 정사각형을 만들려고 합니다. ${askCount ? '카드는 모두 몇 장 필요한가요?' : '정사각형의 한 변은 몇 cm인가요?'}`,
      hint: `정사각형의 한 변은 ${a}의 배수이면서 ${b}의 배수여야 해요(공배수). 가장 작은 정사각형이니 최소공배수!`,
      answerType: 'number',
      correctAnswer: askCount ? count : side,
      explanations: [
        {
          title: '1단계: 정사각형의 한 변 구하기',
          content: `한 변은 ${josa(a, '과')} ${b}의 공배수여야 하고, 가장 작은 정사각형이므로 최소공배수인 ${side}cm입니다.`,
        },
        {
          title: '2단계: 필요한 카드 수 세기',
          content: `가로로 ${side} ÷ ${a} = ${side / a}장, 세로로 ${side} ÷ ${b} = ${side / b}장이므로 모두 ${side / a} × ${side / b} = ${count}장입니다.`,
        },
      ],
    };
  }

  if (type === 'smallest_3digit_common_multiple') {
    const max = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15;
    let a = randomInt(2, max);
    let b = randomInt(2, max);
    while (a === b || lcm(a, b) >= 100) {
      a = randomInt(2, max);
      b = randomInt(2, max);
    }
    const l = lcm(a, b);
    const answer = Math.ceil(100 / l) * l;

    return {
      id,
      topicId: 'factors',
      subtopic: '공배수 활용',
      difficulty,
      question: `${josa(a, '과')} ${b}의 공배수 중에서 가장 작은 세 자리 수를 구하세요.`,
      hint: `두 수의 공배수는 최소공배수의 배수예요. 최소공배수를 먼저 구한 뒤 100 이상인 첫 배수를 찾아보세요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 최소공배수 구하기',
          content: `${josa(a, '과')} ${b}의 최소공배수는 ${l}입니다. 공배수는 ${l}, ${l * 2}, ${l * 3}, ... 이에요.`,
        },
        {
          title: '2단계: 처음으로 세 자리가 되는 배수 찾기',
          content: `${l} × ${answer / l - 1} = ${answer - l}, ${l} × ${answer / l} = ${answer} 이므로 가장 작은 세 자리 수는 ${answer}입니다.`,
        },
      ],
    };
  }

  if (type === 'factors_count') {
    const num =
      difficulty === 'easy'
        ? randomInt(12, 30)
        : difficulty === 'medium'
          ? randomInt(24, 60)
          : randomInt(40, 84);
    const factors = getFactors(num);
    const pairs = factors.filter((f) => f * f <= num).map((f) => `${f} × ${num / f}`);

    return {
      id,
      topicId: 'factors',
      subtopic: '약수 찾기',
      difficulty,
      question: `자연수 ${num}의 약수의 개수는 모두 몇 개인가요?`,
      hint: `약수는 ${josa(num, '을')} 나누어떨어지게 하는 수예요. 1부터 차례대로 곱해서 ${josa(num, '이')} 되는 짝을 찾아보세요.`,
      answerType: 'number',
      correctAnswer: factors.length,
      explanations: [
        {
          title: '1단계: 곱해서 나오는 짝 찾기',
          content: `${num} = ${pairs.join(' = ')}`,
        },
        {
          title: '2단계: 모든 약수 나열하기',
          content: `짝을 이루는 수를 모두 모으면 ${num}의 약수는 [ ${factors.join(', ')} ] 입니다.`,
        },
        {
          title: '3단계: 개수 세기',
          content: `약수의 개수는 총 ${factors.length}개입니다.`,
        },
      ],
    };
  }

  if (type === 'gcd') {
    const g =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(4, 12)
          : randomInt(6, 15);
    const maxMultiplier = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 7;
    const m1 = randomInt(2, maxMultiplier);
    let m2 = randomInt(2, maxMultiplier);
    while (gcd(m1, m2) !== 1) {
      m2 = randomInt(2, maxMultiplier);
    }
    const a = g * m1;
    const b = g * m2;
    const { steps, divisors } = commonDivisions(a, b);

    return {
      id,
      topicId: 'factors',
      subtopic: '최대공약수 (GCD)',
      difficulty,
      question: `두 수 ${josa(a, '과')} ${b}의 최대공약수를 구하세요.`,
      hint: `두 수를 모두 나눌 수 있는 공통인 약수 중에서 가장 큰 수를 찾아보세요! '거꾸로 나눗셈'을 쓰면 쉬워요.`,
      answerType: 'number',
      correctAnswer: g,
      explanations: [
        {
          title: '1단계: 공약수로 계속 나누기 (거꾸로 나눗셈)',
          content: `${josa(a, '과')} ${josa(b, '을')} 1 말고 다른 공약수가 없을 때까지 나눕니다: ${steps.join(' → ')}`,
        },
        {
          title: '2단계: 나눈 수들의 곱',
          content:
            divisors.length > 1
              ? `나눈 수를 모두 곱하면 ${divisors.join(' × ')} = ${g}이므로 최대공약수는 ${g}입니다.`
              : `나눈 수가 ${g} 하나뿐이므로 최대공약수는 ${g}입니다.`,
        },
      ],
    };
  }

  if (type === 'lcm') {
    const g =
      difficulty === 'easy'
        ? randomInt(2, 5)
        : difficulty === 'medium'
          ? randomInt(3, 6)
          : randomInt(4, 8);
    const m1 = pickOne([2, 3, 4]);
    const m2 = m1 === 2 ? pickOne([3, 5]) : m1 === 3 ? pickOne([2, 4, 5]) : pickOne([3, 5]);
    const a = g * m1;
    const b = g * m2;
    const ans = lcm(a, b);

    return {
      id,
      topicId: 'factors',
      subtopic: '최소공배수 (LCM)',
      difficulty,
      question: `두 수 ${josa(a, '과')} ${b}의 최소공배수를 구하세요.`,
      hint: `두 수의 배수 중에서 가장 처음으로 같아지는(가장 작은) 공배수를 찾아보세요.`,
      answerType: 'number',
      correctAnswer: ans,
      explanations: [
        {
          title: '1단계: 최대공약수 찾기',
          content: `두 수 ${josa(a, '과')} ${b}의 최대공약수는 ${g}입니다. ${a} = ${g} × ${m1}, ${b} = ${g} × ${m2}`,
        },
        {
          title: '2단계: 최대공약수와 남은 몫 곱하기',
          content: `${g} × ${m1} × ${m2} = ${ans} 입니다. 따라서 최소공배수는 ${ans}입니다.`,
        },
      ],
    };
  }

  if (type === 'common_factors_count') {
    const common =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(4, 12)
          : randomInt(10, 18);
    const [m1, m2] = pickOne([
      [2, 3],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
    ]);
    const a = common * m1;
    const b = common * m2;
    const commonFactors = getFactors(common);

    return {
      id,
      topicId: 'factors',
      subtopic: '공약수 찾기',
      difficulty,
      question: `두 수 ${josa(a, '과')} ${b}의 공약수는 모두 몇 개인가요?`,
      hint: `두 수의 공약수는 최대공약수의 약수와 같아요. 최대공약수를 먼저 구해 보세요!`,
      answerType: 'number',
      correctAnswer: commonFactors.length,
      explanations: [
        {
          title: '1단계: 최대공약수 구하기',
          content: `${josa(a, '과')} ${b}의 최대공약수는 ${common}입니다. 두 수의 공약수는 최대공약수의 약수와 같아요.`,
        },
        {
          title: '2단계: 공약수 세기',
          content: `${common}의 약수는 ${commonFactors.join(', ')}이므로 공약수는 모두 ${commonFactors.length}개입니다.`,
        },
      ],
    };
  }

  // Word Problem
  const g =
    difficulty === 'easy'
      ? randomInt(2, 6)
      : difficulty === 'medium'
        ? randomInt(4, 10)
        : randomInt(8, 18);
  const m1 = randomInt(2, difficulty === 'hard' ? 7 : 4);
  let m2 = randomInt(3, difficulty === 'hard' ? 8 : 5);
  while (gcd(m1, m2) !== 1) {
    m2 = randomInt(3, difficulty === 'hard' ? 8 : 5);
  }
  const candies = g * m1;
  const chocolates = g * m2;
  return {
    id,
    topicId: 'factors',
    subtopic: '실생활 활용 (문장제)',
    difficulty,
    context: '사이좋은 간식 나누기',
    question: `${KID_CALL}가 사탕 ${candies}개와 초콜릿 ${chocolates}개를 남김없이 가능한 한 많은 친구들에게 똑같이 나누어 주려고 합니다. 최대 몇 명의 친구들에게 나누어 줄 수 있을까요?`,
    hint: `남김없이 똑같이 나눌 수 있는 '가장 큰 수'는 바로 두 수의 '최대공약수'예요!`,
    answerType: 'number',
    correctAnswer: g,
    explanations: [
      {
        title: '1단계: 문제의 핵심 파악하기',
        content: `남김없이 똑같이 나누는 최대 사람 수는 ${josa(candies, '과')} ${chocolates}의 최대공약수입니다.`,
      },
      {
        title: '2단계: 최대공약수 계산',
        content: `${josa(candies, '과')} ${chocolates}의 최대공약수는 ${g}입니다.`,
      },
      {
        title: '3단계: 결과 확인',
        content: `최대 ${g}명의 친구들에게 1명당 사탕 ${m1}개, 초콜릿 ${m2}개씩 나누어 줄 수 있습니다!`,
      },
    ],
  };
}
