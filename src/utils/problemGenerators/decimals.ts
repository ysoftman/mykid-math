import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt } from '../mathHelpers';

export function generateDecimalProblem(difficulty: Difficulty): Problem {
  const type = pickOne(['multiplication', 'division', 'word_problem']);
  const id = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'multiplication') {
    const isDoubleDecimal = difficulty !== 'easy';
    if (!isDoubleDecimal) {
      // Decimal x Integer
      const dec = (randomInt(11, 49) / 10).toFixed(1);
      const intVal = randomInt(2, 6);
      const ans = Math.round(parseFloat(dec) * intVal * 10) / 10;

      return {
        id,
        topicId: 'decimals',
        subtopic: '소수 × 자연수',
        difficulty,
        question: `다음 식을 계산하세요:  ${dec} × ${intVal}`,
        hint: `먼저 자연수 곱셈처럼 계산한 다음, 소수의 소수점 아래 자릿수만큼 결과에 점을 찍어주세요.`,
        answerType: 'number',
        correctAnswer: ans,
        explanations: [
          {
            title: '1단계: 자연수처럼 곱하기',
            content: `${Math.round(parseFloat(dec) * 10)} × ${intVal} = ${Math.round(parseFloat(dec) * 10) * intVal}`,
          },
          {
            title: '2단계: 소수점 위치 맞추기',
            content: `${dec}은 소수점 아래 한 자리이므로, 결과도 소수점 아래 한 자리가 되도록 점을 찍습니다: ${ans}`,
          },
        ],
      };
    } else {
      // Decimal x Decimal
      const a = randomInt(2, 9) / 10;
      const b = randomInt(3, 8) / 10;
      const ans = Math.round(a * b * 100) / 100;

      return {
        id,
        topicId: 'decimals',
        subtopic: '소수 × 소수',
        difficulty,
        question: `다음 식을 계산하세요:  ${a.toFixed(1)} × ${b.toFixed(1)}`,
        hint: `두 소수의 소수점 아래 자릿수를 합치면 총 몇 자리인가요? 자연수 곱셈 결과에서 그만큼 왼쪽으로 점을 옮겨요!`,
        answerType: 'number',
        correctAnswer: ans,
        explanations: [
          {
            title: '1단계: 자연수의 곱 구하기',
            content: `${Math.round(a * 10)} × ${Math.round(b * 10)} = ${Math.round(a * 10) * Math.round(b * 10)}`,
          },
          {
            title: '2단계: 소수점 자릿수 합산',
            content: `0.1 × 0.1 = 0.01이므로, 소수 둘째 자리가 되도록 점을 찍어 ${ans}가 됩니다.`,
          },
        ],
      };
    }
  }

  if (type === 'division') {
    // Division: Choose clean quotient
    const quotient = randomInt(2, 8);
    const divisor = randomInt(2, 6) / 10;
    const dividend = Math.round(divisor * quotient * 10) / 10;

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수의 나눗셈',
      difficulty,
      question: `다음 나눗셈을 계산하세요:  ${dividend.toFixed(1)} ÷ ${divisor.toFixed(1)}`,
      hint: `나누는 수와 나누어지는 수에 똑같이 10을 곱해서 자연수의 나눗셈으로 바꾸어 풀어보세요!`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 소수점 이동하기 (10배)',
          content: `나누는 수와 나누어지는 수를 똑같이 10배 합니다: ${Math.round(dividend * 10)} ÷ ${Math.round(divisor * 10)}`,
        },
        {
          title: '2단계: 자연수의 나눗셈 계산',
          content: `${Math.round(dividend * 10)} ÷ ${Math.round(divisor * 10)} = ${quotient}`,
        },
      ],
    };
  }

  // Word Problem
  const length = (randomInt(12, 25) / 10).toFixed(1);
  const count = randomInt(3, 5);
  const total = Math.round(parseFloat(length) * count * 10) / 10;

  return {
    id,
    topicId: 'decimals',
    subtopic: '소수 실생활 문제',
    difficulty,
    context: '리본 끈 자르기',
    question: `길이가 ${length}m인 리본 끈이 ${count}개 있습니다. 이 리본 끈들을 모두 이어 붙이면 총 몇 m가 될까요?`,
    hint: `한 개의 길이 × 개수로 식을 세워보세요!`,
    answerType: 'number',
    correctAnswer: total,
    explanations: [
      {
        title: '1단계: 식 세우기',
        content: `총 길이 = ${length} × ${count}`,
      },
      {
        title: '2단계: 소수 곱셈 계산',
        content: `${length} × ${count} = ${total}m 입니다.`,
      },
    ],
  };
}
