import type { Difficulty, Problem } from '../../types/math';
import { lcm, pickOne, randomInt, simplifyFraction } from '../mathHelpers';

export function generateFractionProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'fraction_of_number',
  ]);
  const id = `frac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const unlikeDenominators =
    difficulty === 'easy'
      ? [2, 3, 4, 5]
      : difficulty === 'medium'
        ? [2, 3, 4, 5, 6, 8]
        : [5, 6, 7, 8, 9, 10, 12];

  if (type === 'addition') {
    // Unlike denominator addition
    const den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(unlikeDenominators);
    while (den1 === den2) den2 = pickOne(unlikeDenominators);

    const num1 = randomInt(1, den1 - 1);
    const num2 = randomInt(1, den2 - 1);

    const commonDen = lcm(den1, den2);
    const m1 = commonDen / den1;
    const m2 = commonDen / den2;
    const newNum1 = num1 * m1;
    const newNum2 = num2 * m2;
    const totalNum = newNum1 + newNum2;

    const simplified = simplifyFraction(totalNum, commonDen);

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 덧셈 (통분)',
      difficulty,
      question: `다음 분수의 덧셈을 계산하여 기약분수(더 이상 약분되지 않는 분수)로 나타내세요:  ${num1}/${den1} + ${num2}/${den2}`,
      hint: `분모가 다를 때는 최소공배수로 '통분'하여 분모를 똑같이 만들어준 뒤 분자끼리 더해요. 마지막에 약분도 잊지 마세요!`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      diagramType: 'fraction_pie',
      diagramData: { frac1: { num: num1, den: den1 }, frac2: { num: num2, den: den2 } },
      explanations: [
        {
          title: '1단계: 공통분모(통분) 구하기',
          content: `분모 ${den1}과 ${den2}의 최소공배수는 ${commonDen}입니다.`,
        },
        {
          title: '2단계: 크기가 같은 분수로 통분하기',
          content: `${num1}/${den1} = ${newNum1}/${commonDen},  ${num2}/${den2} = ${newNum2}/${commonDen}`,
        },
        {
          title: '3단계: 분자끼리 더하고 약분하기',
          content: `${newNum1}/${commonDen} + ${newNum2}/${commonDen} = ${totalNum}/${commonDen} = ${simplified.num}/${simplified.den}`,
        },
      ],
    };
  }

  if (type === 'subtraction') {
    // Make sure frac1 > frac2
    const subtractionDenominators = unlikeDenominators.filter((den) => den > 2);
    let den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(subtractionDenominators);
    while (den1 === den2) den2 = pickOne(subtractionDenominators);

    let num1 = randomInt(1, den1 - 1);
    let num2 = randomInt(1, den2 - 1);

    if (num1 / den1 <= num2 / den2) {
      // Swap or adjust
      const tempN = num1;
      const tempD = den1;
      num1 = num2;
      den1 = den2;
      num2 = tempN;
      den2 = tempD;
      if (num1 / den1 <= num2 / den2) {
        num1 = den1 - 1;
        num2 = 1;
      }
    }

    const commonDen = lcm(den1, den2);
    const m1 = commonDen / den1;
    const m2 = commonDen / den2;
    const newNum1 = num1 * m1;
    const newNum2 = num2 * m2;
    const diffNum = newNum1 - newNum2;
    const simplified = simplifyFraction(diffNum, commonDen);

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 뺄셈 (통분)',
      difficulty,
      question: `다음 분수의 뺄셈을 계산하여 기약분수로 나타내세요:  ${num1}/${den1} - ${num2}/${den2}`,
      hint: `통분하여 분모를 같게 한 후, 앞의 분자에서 뒤의 분자를 빼주세요!`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: '1단계: 통분하기',
          content: `분모 ${den1}과 ${den2}를 공통분모 ${commonDen}으로 통분합니다: ${newNum1}/${commonDen} - ${newNum2}/${commonDen}`,
        },
        {
          title: '2단계: 분자끼리 빼기',
          content: `(${newNum1} - ${newNum2}) / ${commonDen} = ${diffNum}/${commonDen}`,
        },
        {
          title: '3단계: 기약분수로 약분',
          content: `결과는 ${simplified.num}/${simplified.den} 입니다.`,
        },
      ],
    };
  }

  if (type === 'multiplication') {
    const multiplicationDenominators =
      difficulty === 'easy'
        ? [2, 3, 4, 5]
        : difficulty === 'medium'
          ? [3, 4, 5, 6, 7]
          : [5, 6, 7, 8, 9];
    const den1 = pickOne(multiplicationDenominators);
    const num1 = randomInt(1, den1 - 1);
    const den2 = pickOne(multiplicationDenominators);
    const num2 = randomInt(1, den2 - 1);

    const multNum = num1 * num2;
    const multDen = den1 * den2;
    const simplified = simplifyFraction(multNum, multDen);

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 곱셈',
      difficulty,
      question: `다음 분수의 곱셈을 계산하여 기약분수로 나타내세요:  ${num1}/${den1} × ${num2}/${den2}`,
      hint: `분수의 곱셈은 분자는 분자끼리, 분모는 분모끼리 곱해요! 곱하기 전에 미리 대각선으로 약분하면 훨씬 편해요.`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: '1단계: 분모끼리, 분자끼리 곱하기',
          content: `(${num1} × ${num2}) / (${den1} × ${den2}) = ${multNum}/${multDen}`,
        },
        {
          title: '2단계: 기약분수로 약분하기',
          content: `${multNum}/${multDen} = ${simplified.num}/${simplified.den}`,
        },
      ],
    };
  }

  if (type === 'fraction_of_number') {
    const den =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(3, 7)
          : randomInt(5, 10);
    const num = randomInt(1, den - 1);
    const unit =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(4, 12)
          : randomInt(8, 20);
    const whole = den * unit;
    const answer = num * unit;

    return {
      id,
      topicId: 'fractions',
      subtopic: '어떤 수의 분수만큼 구하기',
      difficulty,
      question: `쿠키 ${whole}개 중에서 ${num}/${den}만큼은 몇 개인가요?`,
      hint: `전체를 분모 ${den}만큼 똑같이 나눈 다음, 그중 분자 ${num}만큼을 구해요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 전체를 똑같이 나누기',
          content: `${whole} ÷ ${den} = ${unit}, 한 묶음에 ${unit}개입니다.`,
        },
        {
          title: '2단계: 필요한 묶음만큼 구하기',
          content: `${unit} × ${num} = ${answer}, 따라서 ${num}/${den}만큼은 ${answer}개입니다.`,
        },
      ],
    };
  }

  // Division
  const divisionDenominators =
    difficulty === 'easy'
      ? [3, 4, 5]
      : difficulty === 'medium'
        ? [3, 4, 5, 6, 8]
        : [5, 6, 8, 9, 10];
  const den1 = pickOne(divisionDenominators);
  const num1 = randomInt(2, den1 - 1);
  const den2 = pickOne(divisionDenominators.filter((den) => den > 2));
  const num2 = randomInt(1, den2 - 1);

  // num1/den1 ÷ num2/den2 = num1/den1 × den2/num2
  const divNum = num1 * den2;
  const divDen = den1 * num2;
  const simplified = simplifyFraction(divNum, divDen);

  return {
    id,
    topicId: 'fractions',
    subtopic: '분수의 나눗셈',
    difficulty,
    question: `다음 분수의 나눗셈을 계산하여 기약분수로 나타내세요:  ${num1}/${den1} ÷ ${num2}/${den2}`,
    hint: `나누는 분수(${num2}/${den2})의 분자와 분모를 뒤집어서 '곱하기'로 바꾸어 계산해요! (역수 곱하기)`,
    answerType: 'fraction',
    correctAnswer: { num: simplified.num, den: simplified.den },
    explanations: [
      {
        title: '1단계: 나눗셈을 곱셈으로 바꾸기',
        content: `${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2}`,
      },
      {
        title: '2단계: 곱셈 계산',
        content: `(${num1} × ${den2}) / (${den1} × ${num2}) = ${divNum}/${divDen}`,
      },
      {
        title: '3단계: 약분하여 기약분수로 만들기',
        content: `기약분수로 나타내면 ${simplified.num}/${simplified.den} 입니다.`,
      },
    ],
  };
}
