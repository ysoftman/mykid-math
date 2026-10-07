import type { Difficulty, Problem } from '../../types/math';
import { pickOne, randomInt, simplifyFraction } from '../mathHelpers';
import { KID_CALL } from '../profile';

export function generateDecimalProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'multiplication',
    'division',
    'addition_subtraction',
    'word_problem',
    'place_shift',
    'to_fraction',
    'rounding',
  ]);
  const id = `dec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'place_shift') {
    const op = pickOne(
      difficulty === 'easy'
        ? ['× 10', '× 100', '÷ 10']
        : ['× 10', '× 100', '× 1000', '÷ 10', '÷ 100'],
    );
    const factor = Number(op.slice(2));
    // ×: two decimal places, ÷10: one decimal place, ÷100: whole number, so the answer has at most 2 decimals
    const valueText =
      op[0] === '×'
        ? String(randomInt(101, 9999) / 100)
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
    const den = difficulty === 'easy' ? 10 : 100;
    let num = randomInt(1, den - 1);
    while (num % 10 === 0 && den === 100) num = randomInt(1, den - 1);
    const simplified = simplifyFraction(num, den);
    const decimalText = (num / den).toFixed(den === 10 ? 1 : 2);

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수를 분수로',
      difficulty,
      question: `${decimalText}을(를) 기약분수로 나타내세요.`,
      hint: `소수 첫째 자리는 분모가 10, 소수 둘째 자리는 분모가 100인 분수예요. 그다음 약분해요!`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: '1단계: 분모가 10 또는 100인 분수로 바꾸기',
          content: `${decimalText} = ${num}/${den}`,
        },
        {
          title: '2단계: 약분하기',
          content: `${num}/${den} = ${simplified.num}/${simplified.den}`,
        },
      ],
    };
  }

  if (type === 'rounding') {
    const places = difficulty === 'easy' ? 1 : 2;
    const raw = randomInt(1001, 99999) / 1000;
    const scale = 10 ** places;
    const answer = Math.round(raw * scale) / scale;
    const rawText = raw.toFixed(3);
    const placeName = places === 1 ? '첫째' : '둘째';

    return {
      id,
      topicId: 'decimals',
      subtopic: '어림하기 (반올림)',
      difficulty,
      question: `${rawText}을(를) 반올림하여 소수 ${placeName} 자리까지 나타내세요.`,
      hint: `소수 ${places === 1 ? '둘째' : '셋째'} 자리 숫자가 5 이상이면 올리고, 4 이하이면 버려요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 바로 아래 자리 숫자 확인',
          content: `소수 ${places === 1 ? '둘째' : '셋째'} 자리 숫자는 ${rawText[rawText.indexOf('.') + places + 1]}입니다.`,
        },
        {
          title: '2단계: 올림 또는 버림',
          content: `반올림하면 ${answer.toFixed(places)} 입니다.`,
        },
      ],
    };
  }

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
    while (a === b) b = randomInt(scale, maxValue * scale);
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
    question: `${KID_CALL}에게 길이가 ${length}m인 리본 끈이 ${count}개 있습니다. ${KID_CALL}가 이 리본 끈들을 모두 이어 붙이면 총 몇 m가 될까요?`,
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
