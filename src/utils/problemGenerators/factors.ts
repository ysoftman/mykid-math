import type { Difficulty, Problem } from '../../types/math';
import { gcd, getFactors, lcm, pickOne, randomInt } from '../mathHelpers';

export function generateFactorProblem(difficulty: Difficulty): Problem {
  const type = pickOne(['factors_count', 'gcd', 'lcm', 'common_factors_count', 'word_problem']);
  const id = `fac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'factors_count') {
    const num =
      difficulty === 'easy'
        ? randomInt(12, 30)
        : difficulty === 'medium'
          ? randomInt(24, 60)
          : randomInt(40, 84);
    const factors = getFactors(num);

    return {
      id,
      topicId: 'factors',
      subtopic: '약수 찾기',
      difficulty,
      question: `자연수 ${num}의 약수의 개수는 모두 몇 개인가요?`,
      hint: `약수는 ${num}을 나누어 떨어지게 하는 수예요. 1부터 차례대로 짝을 지어 찾아보세요.`,
      answerType: 'number',
      correctAnswer: factors.length,
      diagramType: 'grid',
      diagramData: { number: num, factors },
      explanations: [
        {
          title: '1단계: 곱해서 나오는 짝 찾기',
          content: `${num} = 1 × ${num}, 두 수의 곱으로 표현해봅니다.`,
        },
        {
          title: '2단계: 모든 약수 나열하기',
          content: `${num}의 약수는 [ ${factors.join(', ')} ] 입니다.`,
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
          ? randomInt(5, 15)
          : randomInt(10, 30);
    const maxMultiplier = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9;
    const m1 = randomInt(2, maxMultiplier);
    let m2 = randomInt(2, maxMultiplier);
    while (gcd(m1, m2) !== 1) {
      m2 = randomInt(2, maxMultiplier);
    }
    const a = g * m1;
    const b = g * m2;
    const ans = g;

    return {
      id,
      topicId: 'factors',
      subtopic: '최대공약수 (GCD)',
      difficulty,
      question: `두 수 ${a}와 ${b}의 최대공약수를 구하세요.`,
      hint: `두 수를 모두 나눌 수 있는 공통인 약수 중에서 가장 큰 수를 찾아보세요! '거꾸로 나눗셈'을 쓰면 쉬워요.`,
      answerType: 'number',
      correctAnswer: ans,
      explanations: [
        {
          title: '1단계: 공통으로 나눌 수 있는 수 찾기',
          content: `${a}와 ${b}를 동시에 나눌 수 있는 수들을 거꾸로 나눗셈으로 나눕니다.`,
        },
        {
          title: '2단계: 공약수들의 곱',
          content: `공통으로 나눈 수들의 곱을 구하면 최대공약수는 ${ans}가 됩니다.`,
        },
      ],
    };
  }

  if (type === 'lcm') {
    const g =
      difficulty === 'easy'
        ? randomInt(2, 5)
        : difficulty === 'medium'
          ? randomInt(3, 8)
          : randomInt(6, 12);
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
      question: `두 수 ${a}와 ${b}의 최소공배수를 구하세요.`,
      hint: `두 수의 배수 중에서 가장 처음으로 같아지는(가장 작은) 공배수를 찾아보세요.`,
      answerType: 'number',
      correctAnswer: ans,
      explanations: [
        {
          title: '1단계: 최대공약수 찾기',
          content: `두 수 ${a}와 ${b}의 최대공약수는 ${g}입니다.`,
        },
        {
          title: '2단계: 몫들과 함께 곱하기',
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
          ? randomInt(6, 18)
          : randomInt(12, 30);
    const a = common * 2;
    const b = common * 3;
    const commonFactors = getFactors(gcd(a, b));

    return {
      id,
      topicId: 'factors',
      subtopic: '공약수 찾기',
      difficulty,
      question: `두 수 ${a}와 ${b}의 공약수는 모두 몇 개인가요?`,
      hint: `먼저 두 수를 모두 나누어떨어지게 하는 수를 찾고, 중복 없이 개수를 세어 보세요.`,
      answerType: 'number',
      correctAnswer: commonFactors.length,
      explanations: [
        {
          title: '1단계: 공약수 찾기',
          content: `${a}와 ${b}를 모두 나누어떨어지게 하는 수를 찾습니다.`,
        },
        {
          title: '2단계: 공약수 세기',
          content: `공약수는 ${commonFactors.join(', ')}이고, 모두 ${commonFactors.length}개입니다.`,
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
    question: `사탕 ${candies}개와 초콜릿 ${chocolates}개를 남김없이 가능한 한 많은 친구들에게 똑같이 나누어 주려고 합니다. 최대 몇 명의 친구들에게 나누어 줄 수 있을까요?`,
    hint: `남김없이 똑같이 나눌 수 있는 '가장 큰 수'는 바로 두 수의 '최대공약수'예요!`,
    answerType: 'number',
    correctAnswer: g,
    explanations: [
      {
        title: '1단계: 문제의 핵심 파악하기',
        content: `남김없이 똑같이 나누는 최대 사람 수는 ${candies}와 ${chocolates}의 최대공약수입니다.`,
      },
      {
        title: '2단계: 최대공약수 계산',
        content: `${candies}와 ${chocolates}의 최대공약수는 ${g}입니다.`,
      },
      {
        title: '3단계: 결과 확인',
        content: `최대 ${g}명의 친구들에게 1명당 사탕 ${m1}개, 초콜릿 ${m2}개씩 나누어 줄 수 있습니다!`,
      },
    ],
  };
}
