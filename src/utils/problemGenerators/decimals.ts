import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt } from '../mathHelpers';

export function generateDecimalProblem(difficulty: Difficulty): Problem {
  const type = pickOne(['multiplication', 'division', 'addition_subtraction', 'word_problem']);
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
      // Multiply decimals, using hundredths for the hardest level.
      const aPlaces = difficulty === 'hard' ? 2 : 1;
      const aScale = 10 ** aPlaces;
      const a = randomInt(aScale + 1, 9 * aScale) / aScale;
      const b = randomInt(2, 9) / 10;
      const ans = Math.round(a * b * 10 ** (aPlaces + 1)) / 10 ** (aPlaces + 1);

      return {
        id,
        topicId: 'decimals',
        subtopic: '소수 × 소수',
        difficulty,
        question: `다음 식을 계산하세요:  ${a.toFixed(aPlaces)} × ${b.toFixed(1)}`,
        hint: `두 소수의 소수점 아래 자릿수를 합치면 총 몇 자리인가요? 자연수 곱셈 결과에서 그만큼 왼쪽으로 점을 옮겨요!`,
        answerType: 'number',
        correctAnswer: ans,
        explanations: [
          {
            title: '1단계: 자연수의 곱 구하기',
            content: `${Math.round(a * aScale)} × ${Math.round(b * 10)} = ${Math.round(a * aScale) * Math.round(b * 10)}`,
          },
          {
            title: '2단계: 소수점 자릿수 합산',
            content: `소수점 아래 자릿수를 합쳐 결과에 점을 찍으면 ${ans}가 됩니다.`,
          },
        ],
      };
    }
  }

  if (type === 'division') {
    // Division: Choose clean quotient
    const quotient =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(3, 12)
          : randomInt(5, 20);
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const maxDivisor = places === 2 ? 55 : difficulty === 'easy' ? 6 : 8;
    const divisor = randomInt(places === 2 ? 12 : 2, maxDivisor) / scale;
    const dividend = Math.round(divisor * quotient * scale) / scale;

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수의 나눗셈',
      difficulty,
      question: `다음 나눗셈을 계산하세요:  ${dividend.toFixed(places)} ÷ ${divisor.toFixed(places)}`,
      hint: `나누는 수와 나누어지는 수에 똑같이 10을 곱해서 자연수의 나눗셈으로 바꾸어 풀어보세요!`,
      answerType: 'number',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 소수점 이동하기 (10배)',
          content: `나누는 수와 나누어지는 수에 똑같이 ${scale}을 곱합니다: ${Math.round(dividend * scale)} ÷ ${Math.round(divisor * scale)}`,
        },
        {
          title: '2단계: 자연수의 나눗셈 계산',
          content: `${Math.round(dividend * scale)} ÷ ${Math.round(divisor * scale)} = ${quotient}`,
        },
      ],
    };
  }

  if (type === 'addition_subtraction') {
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const maxValue = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 20 : 100;
    let a = randomInt(scale, maxValue * scale);
    let b = randomInt(scale, maxValue * scale);
    const operation = pickOne(['+', '-']);

    if (operation === '-' && a < b) [a, b] = [b, a];

    const answerScaled = operation === '+' ? a + b : a - b;
    const answer = answerScaled / scale;
    const first = (a / scale).toFixed(places);
    const second = (b / scale).toFixed(places);

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
          content: `${first}와 ${second}의 소수점을 같은 위치에 맞춥니다.`,
        },
        {
          title: '2단계: 같은 자리끼리 계산하기',
          content: `${first} ${operation} ${second} = ${answer.toFixed(places)}`,
        },
      ],
    };
  }

  // Word Problem
  const lengthPlaces = difficulty === 'hard' ? 2 : 1;
  const lengthScale = 10 ** lengthPlaces;
  const maxLength = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 40 : 250;
  const minLength = difficulty === 'hard' ? 101 : 12;
  const length = (randomInt(minLength, maxLength) / lengthScale).toFixed(lengthPlaces);
  const count =
    difficulty === 'easy'
      ? randomInt(2, 4)
      : difficulty === 'medium'
        ? randomInt(3, 6)
        : randomInt(4, 8);
  const total = Math.round(parseFloat(length) * count * lengthScale) / lengthScale;

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
