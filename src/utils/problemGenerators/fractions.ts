import type { Difficulty, Problem } from '../../types/math';
import {
  gcd,
  josa,
  lcm,
  pickOne,
  randomInt,
  randomNumerator,
  simplifyFraction,
} from '../mathHelpers';
import { KID_CALL } from '../profile';

// Last explanation step: reduce num/den, show it as a whole number, or say it is already in lowest terms
function lowestTermsStep(num: number, den: number): string {
  const simplified = simplifyFraction(num, den);
  const frac = `${num}/${den}`;
  if (simplified.den === den) return `${josa(frac, '은')} 더 이상 약분되지 않는 기약분수예요.`;
  if (simplified.den === 1) return `${frac} = ${num} ÷ ${den} = ${simplified.num} (자연수)`;
  return `${josa(frac, '을')} 약분하면 ${simplified.num}/${simplified.den}입니다.`;
}

// Added to a question whose answer may pass 1, since the answer box takes no mixed number
const OVER_ONE = '(1보다 크면 가분수로)';

// Shows how a mixed number becomes an improper fraction, with another example when 7/3 is the answer itself
function mixedNumberExample(answer: { num: number; den: number }): string {
  return answer.num === 7 && answer.den === 3 ? '예: 1과 1/2 = 3/2' : '예: 2와 1/3 = 7/3';
}

// A proper fraction [num, den] in lowest terms with one of the given denominators
function randomProperFraction(dens: number[]): [number, number] {
  const den = pickOne(dens);
  return [randomNumerator(den), den];
}

// a/b ÷ c/d as a multiplication. Dividing by 1/d is multiplying by d, which textbooks do not write as d/1.
function divideAsMultiplication(a: number, b: number, c: number, d: number) {
  return c === 1
    ? { multiplied: `${a}/${b} × ${d}`, product: `(${a} × ${d})/${b} = ${a * d}/${b}` }
    : {
        multiplied: `${a}/${b} × ${d}/${c}`,
        product: `(${a} × ${d}) / (${b} × ${c}) = ${a * d}/${b * c}`,
      };
}

export function generateFractionProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'addition',
    'subtraction',
    'multiplication',
    'division',
    'fraction_of_number',
    'simplify',
    'mixed_addition',
    'division_word',
    'mixed_subtraction',
    'fraction_times_natural',
    'fraction_div_natural',
    'whole_from_part',
    'equivalent_fraction',
    'same_den_add_sub',
    'fraction_of_unit',
    'mixed_improper',
    'compare',
    'common_denominator',
    'same_den_division',
    'natural_div_natural',
    'three_fraction_product',
    'mixed_div_fraction',
    'fraction_decimal_compare',
  ]);
  const id = `frac_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const unlikeDenominators =
    difficulty === 'easy'
      ? [2, 3, 4, 5]
      : difficulty === 'medium'
        ? [2, 3, 4, 5, 6, 8]
        : [5, 6, 7, 8, 9, 10, 12];

  if (type === 'simplify') {
    const dens =
      difficulty === 'easy'
        ? [3, 4, 5]
        : difficulty === 'medium'
          ? [4, 5, 6, 7, 8]
          : [7, 8, 9, 11, 12];
    const sd = pickOne(dens);
    let sn = randomInt(1, sd - 1);
    while (gcd(sn, sd) !== 1) sn = randomInt(1, sd - 1);
    const m =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(3, 6)
          : randomInt(4, 8);

    return {
      id,
      topicId: 'fractions',
      subtopic: '약분',
      difficulty,
      question: `${josa(`${sn * m}/${sd * m}`, '을')} 기약분수로 나타내세요.`,
      hint: `분자와 분모의 최대공약수로 분자와 분모를 똑같이 나누어 보세요.`,
      answerType: 'fraction',
      correctAnswer: { num: sn, den: sd },
      explanations: [
        {
          title: '1단계: 최대공약수 구하기',
          content: `${josa(sn * m, '과')} ${sd * m}의 최대공약수는 ${m}입니다.`,
        },
        {
          title: '2단계: 분자와 분모를 나누기',
          content: `${sn * m} ÷ ${m} = ${sn}, ${sd * m} ÷ ${m} = ${sd}이므로 ${sn}/${sd}입니다.`,
        },
      ],
    };
  }

  if (type === 'mixed_addition' || type === 'mixed_subtraction') {
    const isAdd = type === 'mixed_addition';
    // A small common denominator keeps the improper fractions (and the answer) small
    const maxCommon = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 20 : 24;
    let den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(unlikeDenominators);
    while (den1 === den2 || lcm(den1, den2) > maxCommon) {
      den1 = pickOne(unlikeDenominators);
      den2 = pickOne(unlikeDenominators);
    }
    const maxWhole = 3;
    // For subtraction w1 > w2 keeps the result positive (fractional parts are below 1)
    const w1 = isAdd ? randomInt(1, maxWhole) : randomInt(2, maxWhole + 1);
    const w2 = randomInt(1, isAdd ? maxWhole : w1 - 1);
    const num1 = randomNumerator(den1);
    const num2 = randomNumerator(den2);
    const commonDen = lcm(den1, den2);
    const improper1 = (w1 * den1 + num1) * (commonDen / den1);
    const improper2 = (w2 * den2 + num2) * (commonDen / den2);
    const resultNum = isAdd ? improper1 + improper2 : improper1 - improper2;
    const simplified = simplifyFraction(resultNum, commonDen);
    const mixed1 = `${josa(w1, '과')} ${num1}/${den1}`;
    const mixed2 = `${josa(w2, '과')} ${num2}/${den2}`;
    const op = isAdd ? '+' : '-';

    return {
      id,
      topicId: 'fractions',
      subtopic: isAdd ? '대분수의 덧셈' : '대분수의 뺄셈',
      difficulty,
      question: isAdd
        ? `다음 대분수의 덧셈을 계산하여 기약분수인 가분수로 나타내세요:  ${mixed1} + ${mixed2}`
        : `다음 대분수의 뺄셈을 계산하여 기약분수로 나타내세요${OVER_ONE}:  ${mixed1} - ${mixed2}`,
      hint: `대분수를 가분수로 바꾼 다음 통분해서 ${isAdd ? '더해요' : '빼요'}. ${mixedNumberExample(simplified)}`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: '1단계: 가분수로 바꾸기',
          content: `${mixed1} = ${w1 * den1 + num1}/${den1},  ${mixed2} = ${w2 * den2 + num2}/${den2}`,
        },
        {
          title: `2단계: 통분하여 ${isAdd ? '더하기' : '빼기'}`,
          content: `${improper1}/${commonDen} ${op} ${improper2}/${commonDen} = ${resultNum}/${commonDen}`,
        },
        {
          title: '3단계: 기약분수로 나타내기',
          content: lowestTermsStep(resultNum, commonDen),
        },
      ],
    };
  }

  if (type === 'division_word') {
    const dens =
      difficulty === 'easy'
        ? [2, 3, 4, 5]
        : difficulty === 'medium'
          ? [3, 4, 5, 6, 8]
          : [5, 6, 7, 8, 9];
    const den = pickOne(dens);
    const num = randomNumerator(den);
    const count = difficulty === 'easy' ? randomInt(2, 6) : randomInt(4, 12);
    const total = simplifyFraction(num * count, den);
    const totalFrac = total.den === 1 ? `${total.num}` : `${total.num}/${total.den}`;
    // A length over 1 reads as a mixed number, e.g. "3과 3/4"
    const isMixed = total.den > 1 && total.num > total.den;
    const totalText = isMixed
      ? `${josa(Math.floor(total.num / total.den), '과')} ${total.num % total.den}/${total.den}`
      : totalFrac;

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 나눗셈 문장제',
      difficulty,
      context: '끈 자르기',
      question: `${KID_CALL}는 길이가 ${totalText}m인 끈을 ${num}/${den}m씩 잘랐습니다. 모두 몇 도막이 되나요?`,
      hint: `전체 길이를 한 도막의 길이로 나누면 돼요. ${isMixed ? '대분수를 가분수로 바꾼 다음, ' : '분수의 나눗셈은 '}나누는 분수의 분모와 분자를 바꾸어 곱해요!`,
      answerType: 'number',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 식 세우기',
          content: `도막 수 = ${totalText} ÷ ${num}/${den}${isMixed ? ` = ${totalFrac} ÷ ${num}/${den}` : ''}`,
        },
        {
          title: '2단계: 곱셈으로 바꾸어 계산하기',
          // Dividing by 1/5 is multiplying by 5, written without a "/1"
          content: `${totalFrac} × ${num === 1 ? den : `${den}/${num}`} = ${count}, 따라서 ${count}도막입니다.`,
        },
      ],
    };
  }

  if (type === 'fraction_times_natural') {
    const den = pickOne(unlikeDenominators);
    const num = randomNumerator(den);
    const n = randomInt(2, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15);
    const naturalFirst = Math.random() < 0.5;
    const expr = naturalFirst ? `${n} × ${num}/${den}` : `${num}/${den} × ${n}`;
    const product = simplifyFraction(num * n, den);

    return {
      id,
      topicId: 'fractions',
      subtopic: naturalFirst ? '자연수 × 분수' : '분수 × 자연수',
      difficulty,
      question: `다음 곱셈을 계산하여 기약분수로 나타내세요${OVER_ONE}:  ${expr}`,
      hint: `자연수는 분자에만 곱해요. 곱하기 전에 자연수와 분모를 먼저 약분하면 계산이 쉬워요!`,
      answerType: 'fraction',
      correctAnswer: product,
      explanations: [
        {
          title: '1단계: 자연수를 분자에 곱하기',
          content: `${expr} = (${naturalFirst ? `${n} × ${num}` : `${num} × ${n}`})/${den} = ${num * n}/${den}`,
        },
        {
          title: '2단계: 기약분수로 나타내기',
          content: lowestTermsStep(num * n, den),
        },
      ],
    };
  }

  if (type === 'fraction_div_natural') {
    const den = pickOne(unlikeDenominators);
    const num = randomNumerator(den);
    const n = randomInt(2, difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 9);
    const quotient = simplifyFraction(num, den * n);

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수 ÷ 자연수',
      difficulty,
      question: `다음 나눗셈을 계산하여 기약분수로 나타내세요:  ${num}/${den} ÷ ${n}`,
      hint: `÷ ${josa(n, '은')} × 1/${n}과 같아요. 분모에 자연수를 곱해 보세요!`,
      answerType: 'fraction',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 곱셈으로 바꾸기',
          content: `${num}/${den} ÷ ${n} = ${num}/${den} × 1/${n}`,
        },
        {
          title: '2단계: 계산하기',
          content: `${num}/${den} × 1/${n} = ${num}/${den * n}${quotient.den === den * n ? '' : ` = ${quotient.num}/${quotient.den}`}`,
        },
      ],
    };
  }

  if (type === 'whole_from_part') {
    const den = pickOne(
      difficulty === 'easy'
        ? [3, 4, 5]
        : difficulty === 'medium'
          ? [3, 4, 5, 6, 8]
          : [5, 6, 7, 8, 9, 10],
    );
    const num = randomNumerator(den, 2);
    const unit = randomInt(2, difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15);
    const part = num * unit;
    const whole = den * unit;
    const frac = `${num}/${den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '어떤 수 구하기',
      difficulty,
      question: `어떤 수의 ${josa(frac, '은')} ${part}입니다. 어떤 수는 얼마인가요?`,
      hint: `${josa(frac, '이')} ${part}이면 1/${den}은 얼마일지 먼저 생각해 보세요!`,
      answerType: 'number',
      correctAnswer: whole,
      explanations: [
        {
          title: '1단계: 단위분수만큼의 크기 구하기',
          content: `${josa(frac, '이')} ${part}이므로 1/${den}은 ${part} ÷ ${num} = ${unit}입니다.`,
        },
        {
          title: '2단계: 전체 구하기',
          content: `어떤 수는 1/${den}의 ${den}배이므로 ${unit} × ${den} = ${whole}입니다.`,
        },
        {
          title: '다른 방법: 분수의 나눗셈',
          content: `어떤 수 = ${part} ÷ ${frac} = ${part} × ${den}/${num} = ${whole}`,
        },
      ],
    };
  }

  if (type === 'addition') {
    // Unlike denominator addition
    const den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(unlikeDenominators);
    while (den1 === den2) den2 = pickOne(unlikeDenominators);

    const num1 = randomNumerator(den1);
    const num2 = randomNumerator(den2);

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
      question: `다음 분수의 덧셈을 계산하여 기약분수(더 이상 약분되지 않는 분수)로 나타내세요${OVER_ONE}:  ${num1}/${den1} + ${num2}/${den2}`,
      hint: `분모가 다를 때는 최소공배수로 '통분'하여 분모를 똑같이 만들어준 뒤 분자끼리 더해요. 마지막에 약분도 잊지 마세요!`,
      answerType: 'fraction',
      correctAnswer: { num: simplified.num, den: simplified.den },
      explanations: [
        {
          title: '1단계: 공통분모(통분) 구하기',
          content: `분모 ${josa(den1, '과')} ${den2}의 최소공배수는 ${commonDen}입니다.`,
        },
        {
          title: '2단계: 크기가 같은 분수로 통분하기',
          // A fraction whose denominator is already the common one stays as it is
          content: [
            m1 > 1 && `${num1}/${den1} = ${newNum1}/${commonDen}`,
            m2 > 1 && `${num2}/${den2} = ${newNum2}/${commonDen}`,
          ]
            .filter(Boolean)
            .join(',  '),
        },
        {
          title: '3단계: 분자끼리 더하고 약분하기',
          content: `${newNum1}/${commonDen} + ${newNum2}/${commonDen} = ${totalNum}/${commonDen}${simplified.den === commonDen ? '' : ` = ${simplified.num}/${simplified.den}`}`,
        },
      ],
    };
  }

  if (type === 'subtraction') {
    const subtractionDenominators = unlikeDenominators.filter((den) => den > 2);
    let den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(subtractionDenominators);
    while (den1 === den2) den2 = pickOne(subtractionDenominators);

    let num1 = randomNumerator(den1);
    let num2 = randomNumerator(den2);

    // Put the larger fraction first; two reduced fractions with different denominators are never equal
    if (num1 / den1 < num2 / den2) {
      [num1, den1, num2, den2] = [num2, den2, num1, den1];
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
          content: `분모 ${josa(den1, '과')} ${josa(den2, '을')} 공통분모 ${josa(commonDen, '으로')} 통분합니다: ${newNum1}/${commonDen} - ${newNum2}/${commonDen}`,
        },
        {
          title: '2단계: 분자끼리 빼기',
          content: `(${newNum1} - ${newNum2}) / ${commonDen} = ${diffNum}/${commonDen}`,
        },
        {
          title: '3단계: 기약분수로 나타내기',
          content: lowestTermsStep(diffNum, commonDen),
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
    const num1 = randomNumerator(den1);
    const den2 = pickOne(multiplicationDenominators);
    const num2 = randomNumerator(den2);

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
          title: '2단계: 기약분수로 나타내기',
          content: lowestTermsStep(multNum, multDen),
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
    const num = randomNumerator(den);
    const unit =
      difficulty === 'easy'
        ? randomInt(2, 8)
        : difficulty === 'medium'
          ? randomInt(4, 12)
          : randomInt(6, 12);
    const whole = den * unit;
    const answer = num * unit;

    return {
      id,
      topicId: 'fractions',
      subtopic: '어떤 수의 분수만큼 구하기',
      difficulty,
      question: `${KID_CALL}가 구운 쿠키 ${whole}개 중에서 ${num}/${den}만큼을 친구들에게 나누어 주었습니다. 나누어 준 쿠키는 몇 개인가요?`,
      hint: `쿠키 ${whole}개를 똑같이 ${den}묶음으로 나누고, 그중 ${num}묶음만큼을 구해요.`,
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

  if (type === 'equivalent_fraction') {
    const den = pickOne(
      difficulty === 'easy'
        ? [2, 3, 4, 5]
        : difficulty === 'medium'
          ? [3, 4, 5, 6, 8]
          : [4, 5, 6, 7, 8, 9],
    );
    const num = randomNumerator(den);
    const k = randomInt(2, difficulty === 'hard' ? 6 : 4);
    const askNum = Math.random() < 0.5;
    // Easy only multiplies up; the others also divide a bigger fraction down
    const divide = difficulty !== 'easy' && Math.random() < 0.5;

    if (divide) {
      return {
        id,
        topicId: 'fractions',
        subtopic: '크기가 같은 분수',
        difficulty,
        question: `□에 알맞은 수를 구하세요:  ${num * k}/${den * k} = ${askNum ? `□/${den}` : `${num}/□`}`,
        hint: `분모와 분자를 0이 아닌 같은 수로 나누어도 크기가 같은 분수가 돼요.`,
        answerType: 'number',
        correctAnswer: askNum ? num : den,
        explanations: [
          {
            title: '1단계: 몇으로 나누었는지 찾기',
            content: askNum
              ? `분모 ${josa(den * k, '을')} ${josa(k, '으로')} 나누어서 ${josa(den, '이')} 되었어요.`
              : `분자 ${josa(num * k, '을')} ${josa(k, '으로')} 나누어서 ${josa(num, '이')} 되었어요.`,
          },
          {
            title: '2단계: 똑같이 나누기',
            content: askNum
              ? `분자도 ${josa(k, '으로')} 나누면 ${num * k} ÷ ${k} = ${num}입니다.`
              : `분모도 ${josa(k, '으로')} 나누면 ${den * k} ÷ ${k} = ${den}입니다.`,
          },
        ],
      };
    }

    return {
      id,
      topicId: 'fractions',
      subtopic: '크기가 같은 분수',
      difficulty,
      question: `□에 알맞은 수를 구하세요:  ${num}/${den} = ${askNum ? `□/${den * k}` : `${num * k}/□`}`,
      hint: `분모와 분자에 0이 아닌 같은 수를 곱하면 크기가 같은 분수가 돼요.`,
      answerType: 'number',
      correctAnswer: askNum ? num * k : den * k,
      explanations: [
        {
          title: '1단계: 몇 배 했는지 찾기',
          content: askNum
            ? `분모 ${den}에 ${josa(k, '을')} 곱해서 ${josa(den * k, '이')} 되었어요.`
            : `분자 ${num}에 ${josa(k, '을')} 곱해서 ${josa(num * k, '이')} 되었어요.`,
        },
        {
          title: '2단계: 똑같이 곱하기',
          content: askNum
            ? `분자에도 ${josa(k, '을')} 곱하면 ${num} × ${k} = ${num * k}입니다.`
            : `분모에도 ${josa(k, '을')} 곱하면 ${den} × ${k} = ${den * k}입니다.`,
        },
      ],
    };
  }

  if (type === 'same_den_add_sub') {
    const den = randomInt(
      difficulty === 'easy' ? 3 : 4,
      difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12,
    );
    const mode = pickOne(['add', 'sub', 'one'] as const);
    // Both given fractions are in lowest terms, as in the textbook; a sum may pass 1
    const n1 = mode === 'sub' ? randomNumerator(den, 2) : randomNumerator(den);
    let n2 = mode === 'add' ? randomNumerator(den) : mode === 'sub' ? randomInt(1, n1 - 1) : 0;
    while (n2 > 1 && gcd(n2, den) !== 1) n2 = randomInt(1, n2 - 1);
    const resultNum = mode === 'add' ? n1 + n2 : mode === 'sub' ? n1 - n2 : den - n1;
    const result = simplifyFraction(resultNum, den);
    const resultText = result.den === 1 ? `${result.num}` : `${result.num}/${result.den}`;
    const expr =
      mode === 'one'
        ? `1 - ${n1}/${den}`
        : `${n1}/${den} ${mode === 'add' ? '+' : '-'} ${n2}/${den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '분모가 같은 분수의 계산',
      difficulty,
      // Only a sum can pass 1
      question: `다음을 계산하여 기약분수로 나타내세요${mode === 'add' ? OVER_ONE : ''}:  ${expr}`,
      hint:
        mode === 'one'
          ? `1을 분모가 ${den}인 분수로 바꾸면 ${den}/${den}입니다.`
          : `분모가 같으면 분모는 그대로 두고 분자끼리 계산해요.`,
      answerType: 'fraction',
      correctAnswer: result,
      explanations: [
        {
          title: '1단계: 분자끼리 계산하기',
          content:
            mode === 'one'
              ? `1 = ${den}/${den}이므로 ${den}/${den} - ${n1}/${den} = ${resultNum}/${den}`
              : `(${n1} ${mode === 'add' ? '+' : '-'} ${n2})/${den} = ${resultNum}/${den}`,
        },
        {
          title: '2단계: 기약분수로 나타내기',
          content:
            result.den === den
              ? `${josa(`${resultNum}/${den}`, '은')} 더 이상 약분되지 않아요.`
              : `${resultNum}/${den} = ${resultText}`,
        },
      ],
    };
  }

  if (type === 'fraction_of_unit') {
    const units = [
      { whole: '1시간', subject: '1시간이', value: 60, unit: '분', dens: [2, 3, 4, 5, 6, 10, 12] },
      { whole: '1m', subject: '1m가', value: 100, unit: 'cm', dens: [2, 4, 5, 10, 20, 25] },
      { whole: '하루', subject: '하루가', value: 24, unit: '시간', dens: [2, 3, 4, 6, 8, 12] },
      { whole: '1년', subject: '1년이', value: 12, unit: '개월', dens: [2, 3, 4, 6] },
    ];
    const u = pickOne(units);
    const maxDen = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 25;
    // Hard needs a numerator above 1, so a halving is not enough
    const den = pickOne(u.dens.filter((d) => d <= maxDen && (difficulty !== 'hard' || d > 2)));
    const num = randomNumerator(den, difficulty === 'hard' ? 2 : 1);
    const part = u.value / den;
    const frac = `${num}/${den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '단위의 분수만큼 구하기',
      difficulty,
      question: `${u.whole}의 ${josa(frac, '은')} 몇 ${u.unit}인가요?`,
      hint: `먼저 ${u.subject} 몇 ${u.unit}인지 떠올린 다음, 똑같이 ${josa(den, '으로')} 나눈 것 중의 ${num}만큼을 구해 보세요.`,
      answerType: 'number',
      correctAnswer: part * num,
      explanations: [
        {
          title: '1단계: 작은 단위로 바꾸기',
          content: `${u.whole} = ${u.value}${u.unit}입니다.`,
        },
        {
          title: '2단계: 단위분수만큼 구하기',
          content: `${u.value}${u.unit}의 1/${den}은 ${u.value} ÷ ${den} = ${part}${u.unit}입니다.`,
        },
        ...(num > 1
          ? [
              {
                title: '3단계: 분자만큼 모으기',
                content: `${josa(frac, '은')} 그 ${num}배이므로 ${part} × ${num} = ${part * num}${u.unit}입니다.`,
              },
            ]
          : []),
      ],
    };
  }

  if (type === 'mixed_improper') {
    const den = randomInt(2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 9);
    const num = randomNumerator(den);
    const whole = randomInt(1, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 9);
    const improper = whole * den + num;
    const toImproper = Math.random() < 0.5;
    const mixed = `${josa(whole, '과')} ${num}/${den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: toImproper ? '대분수를 가분수로' : '가분수를 대분수로',
      difficulty,
      question: toImproper
        ? `${josa(whole, '과')} ${josa(`${num}/${den}`, '을')} 가분수로 나타내세요.`
        : `${josa(`${improper}/${den}`, '을')} 대분수로 나타내면 □와 ${num}/${den}입니다. □에 알맞은 수를 구하세요.`,
      hint: toImproper
        ? `자연수 ${josa(whole, '을')} 분모가 ${den}인 분수로 바꾸면 ${whole * den}/${den}입니다.`
        : `${improper} 안에 ${josa(den, '이')} 몇 번 들어가는지 생각해 보세요.`,
      answerType: toImproper ? 'fraction' : 'number',
      correctAnswer: toImproper ? { num: improper, den } : whole,
      explanations: toImproper
        ? [
            {
              title: '1단계: 자연수를 분수로 바꾸기',
              content: `${whole} = ${whole * den}/${den}`,
            },
            {
              title: '2단계: 분수 부분과 더하기',
              content: `${whole * den}/${den} + ${num}/${den} = ${improper}/${den}`,
            },
          ]
        : [
            {
              title: '1단계: 분자를 분모로 나누기',
              content: `${improper} ÷ ${den} = ${whole} ... ${num}`,
            },
            {
              title: '2단계: 몫은 자연수, 나머지는 분자',
              content: `몫 ${josa(whole, '은')} 자연수 부분, 나머지 ${josa(num, '은')} 분자가 되어 ${mixed}입니다.`,
            },
          ],
    };
  }

  // A small common denominator keeps the comparison and the common denominator in mental-math range
  const maxCommon = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 24 : 40;

  if (type === 'compare') {
    // Equal numerators compare by denominator alone, which only easy practises; a denominator
    // above 2 leaves another numerator to pick
    const dens =
      difficulty === 'easy' ? unlikeDenominators : unlikeDenominators.filter((d) => d > 2);
    const den1 = pickOne(dens);
    let den2 = pickOne(dens);
    while (den2 === den1 || lcm(den1, den2) > maxCommon) den2 = pickOne(dens);
    const num1 = randomNumerator(den1);
    let num2 = randomNumerator(den2);
    while (difficulty !== 'easy' && num2 === num1) num2 = randomNumerator(den2);
    const commonDen = lcm(den1, den2);
    const newNum1 = num1 * (commonDen / den1);
    const newNum2 = num2 * (commonDen / den2);
    const askBigger = Math.random() < 0.5;
    const firstWins = askBigger ? newNum1 > newNum2 : newNum1 < newNum2;
    const answer = firstWins ? { num: num1, den: den1 } : { num: num2, den: den2 };
    const frac1 = `${num1}/${den1}`;
    const frac2 = `${num2}/${den2}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 크기 비교',
      difficulty,
      question: `두 분수 ${josa(frac1, '과')} ${frac2} 중에서 더 ${askBigger ? '큰' : '작은'} 분수를 쓰세요.`,
      hint: `분모가 다르면 바로 비교할 수 없어요. 통분하여 분모를 같게 만든 다음 분자의 크기를 비교해 보세요.`,
      answerType: 'fraction',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 통분하기',
          content: `분모 ${josa(den1, '과')} ${den2}의 최소공배수 ${josa(commonDen, '으로')} 통분하면 ${[
            commonDen > den1 && `${frac1} = ${newNum1}/${commonDen}`,
            commonDen > den2 && `${frac2} = ${newNum2}/${commonDen}`,
          ]
            .filter(Boolean)
            .join(', ')}입니다.`,
        },
        {
          title: '2단계: 분자 비교하기',
          content: `${newNum1} ${newNum1 > newNum2 ? '>' : '<'} ${newNum2}이므로 더 ${askBigger ? '큰' : '작은'} 분수는 ${firstWins ? frac1 : frac2}입니다.`,
        },
      ],
    };
  }

  if (type === 'common_denominator') {
    const den1 = pickOne(unlikeDenominators);
    let den2 = pickOne(unlikeDenominators);
    // A denominator that divides the other makes the bigger one the answer at a glance
    while (den2 === den1 || den1 % den2 === 0 || den2 % den1 === 0 || lcm(den1, den2) > maxCommon) {
      den2 = pickOne(unlikeDenominators);
    }
    const num1 = randomNumerator(den1);
    const num2 = randomNumerator(den2);
    const commonDen = lcm(den1, den2);
    const frac1 = `${num1}/${den1}`;
    const frac2 = `${num2}/${den2}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '통분',
      difficulty,
      question: `두 분수 ${josa(frac1, '과')} ${josa(frac2, '을')} 통분하려고 합니다. 공통분모가 될 수 있는 수 중에서 가장 작은 수는 얼마인가요?`,
      hint: `공통분모는 두 분모의 공배수예요. 그중 가장 작은 수는 두 분모의 최소공배수!`,
      answerType: 'number',
      correctAnswer: commonDen,
      explanations: [
        {
          title: '1단계: 두 분모의 공배수 찾기',
          content: `공통분모는 분모 ${josa(den1, '과')} ${den2}의 공배수인 ${commonDen}, ${commonDen * 2}, ${commonDen * 3}, ... 중 하나예요.`,
        },
        {
          title: '2단계: 최소공배수로 통분하기',
          content: `가장 작은 공통분모는 최소공배수 ${commonDen}이고, ${josa(commonDen, '으로')} 통분하면 ${frac1} = ${num1 * (commonDen / den1)}/${commonDen}, ${frac2} = ${num2 * (commonDen / den2)}/${commonDen}입니다.`,
        },
      ],
    };
  }

  if (type === 'same_den_division') {
    // Easy divides evenly to a whole number, hard never does, medium mixes both.
    // Both fractions stay in lowest terms, and every denominator here has such a pair.
    const wantWhole = difficulty === 'easy' || (difficulty === 'medium' && Math.random() < 0.5);
    const den = pickOne(
      difficulty === 'easy'
        ? [5, 7, 9]
        : difficulty === 'medium'
          ? [7, 9, 10, 11]
          : [8, 9, 10, 11, 12],
    );
    let num1 = randomNumerator(den, 2);
    let num2 = randomNumerator(den, 2);
    while (num2 >= num1 || (num1 % num2 === 0) !== wantWhole) {
      num1 = randomNumerator(den, 2);
      num2 = randomNumerator(den, 2);
    }
    const quotient = simplifyFraction(num1, num2);
    const quotientText = quotient.den === 1 ? `${quotient.num}` : `${quotient.num}/${quotient.den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '분모가 같은 분수의 나눗셈',
      difficulty,
      // The quotient is always more than 1, and on easy always a whole number
      question: `다음 분수의 나눗셈을 계산하여 기약분수로 나타내세요${difficulty === 'easy' ? '' : OVER_ONE}:  ${num1}/${den} ÷ ${num2}/${den}`,
      hint: `분모가 같으면 분자끼리 나누면 돼요. ${josa(`${num1}/${den}`, '은')} 1/${den}이 ${num1}개, ${josa(`${num2}/${den}`, '은')} 1/${den}이 ${num2}개예요.`,
      answerType: 'fraction',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 분자끼리 나누기',
          content: `분모가 같으므로 ${num1}/${den} ÷ ${num2}/${den} = ${num1} ÷ ${num2}입니다.`,
        },
        {
          title: '2단계: 계산하기',
          content:
            quotient.den === 1
              ? `${num1} ÷ ${num2} = ${quotientText}`
              : `${num1} ÷ ${num2} = ${num1}/${num2}${quotient.den === num2 ? '' : ` = ${quotientText}`}`,
        },
      ],
    };
  }

  if (type === 'natural_div_natural') {
    // Easy stays below 1, medium passes 1, hard needs reducing; a quotient is never a whole number
    let a: number;
    let b: number;
    if (difficulty === 'hard') {
      b = pickOne([4, 6, 8, 9, 10, 12]);
      a = randomInt(2, b * 2 - 1);
      while (gcd(a, b) === 1 || a % b === 0) a = randomInt(2, b * 2 - 1);
    } else {
      // "1 ÷ 3" is just the unit fraction, so easy starts at a numerator of 2
      b = randomInt(3, difficulty === 'easy' ? 7 : 9);
      a = difficulty === 'easy' ? randomNumerator(b, 2) : b + randomNumerator(b);
    }
    const unit = `1/${b}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '자연수 ÷ 자연수',
      difficulty,
      question: `다음 나눗셈의 몫을 기약분수로 나타내세요${difficulty === 'easy' ? '' : OVER_ONE}:  ${a} ÷ ${b}`,
      hint: `1 ÷ ${b} = ${unit}이에요. ${a} ÷ ${josa(b, '은')} ${josa(unit, '이')} 몇 개일까요?`,
      answerType: 'fraction',
      correctAnswer: simplifyFraction(a, b),
      explanations: [
        {
          title: '1단계: 몫을 분수로 나타내기',
          content: `1 ÷ ${b} = ${unit}이므로 ${a} ÷ ${josa(b, '은')} ${josa(unit, '이')} ${a}개인 ${a}/${b}입니다.`,
        },
        {
          title: '2단계: 기약분수로 나타내기',
          content: lowestTermsStep(a, b),
        },
      ],
    };
  }

  if (type === 'three_fraction_product') {
    // As in 1/2 × 2/3 × 3/4, some numerator and denominator always cancel
    const dens =
      difficulty === 'easy'
        ? [2, 3, 4, 5]
        : difficulty === 'medium'
          ? [2, 3, 4, 5, 6]
          : [3, 4, 5, 6, 7, 8];
    const maxDen = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 90 : 160;
    let fs: [number, number][] = [];
    let productNum = 1;
    let productDen = 1;
    while (gcd(productNum, productDen) === 1 || productDen > maxDen) {
      fs = [randomProperFraction(dens), randomProperFraction(dens), randomProperFraction(dens)];
      productNum = fs.reduce((p, [n]) => p * n, 1);
      productDen = fs.reduce((p, [, d]) => p * d, 1);
    }
    const expr = fs.map(([n, d]) => `${n}/${d}`).join(' × ');

    return {
      id,
      topicId: 'fractions',
      subtopic: '세 분수의 곱셈',
      difficulty,
      question: `다음 곱셈을 계산하여 기약분수로 나타내세요:  ${expr}`,
      hint: `세 분수의 곱셈도 분자는 분자끼리, 분모는 분모끼리 곱해요. 약분할 수 있는 수끼리 먼저 약분하면 계산이 쉬워요!`,
      answerType: 'fraction',
      correctAnswer: simplifyFraction(productNum, productDen),
      explanations: [
        {
          title: '1단계: 분자끼리, 분모끼리 곱하기',
          content: `분자끼리 곱하면 ${fs.map(([n]) => n).join(' × ')} = ${productNum}, 분모끼리 곱하면 ${fs.map(([, d]) => d).join(' × ')} = ${productDen}이므로 ${productNum}/${productDen}입니다.`,
        },
        {
          title: '2단계: 기약분수로 나타내기',
          content: lowestTermsStep(productNum, productDen),
        },
      ],
    };
  }

  if (type === 'mixed_div_fraction') {
    // A mixed number over 1 divided by a fraction below 1 is always more than 1
    const dens =
      difficulty === 'easy'
        ? [2, 3, 4]
        : difficulty === 'medium'
          ? [2, 3, 4, 5, 6]
          : [3, 4, 5, 6, 8];
    const maxWhole = difficulty === 'hard' ? 3 : 2;
    // The product of the numerators stays small enough to work out in your head
    const maxNum = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 100;
    let whole = randomInt(1, maxWhole);
    let [num1, den1] = randomProperFraction(dens);
    let [num2, den2] = randomProperFraction(dens);
    while ((whole * den1 + num1) * den2 > maxNum) {
      whole = randomInt(1, maxWhole);
      [num1, den1] = randomProperFraction(dens);
      [num2, den2] = randomProperFraction(dens);
    }
    const improper = whole * den1 + num1;
    const mixed = `${josa(whole, '과')} ${num1}/${den1}`;
    const { multiplied, product } = divideAsMultiplication(improper, den1, num2, den2);
    const quotient = simplifyFraction(improper * den2, den1 * num2);

    return {
      id,
      topicId: 'fractions',
      subtopic: '대분수 ÷ 분수',
      difficulty,
      question: `다음 나눗셈을 계산하여 기약분수로 나타내세요${OVER_ONE}:  ${mixed} ÷ ${num2}/${den2}`,
      hint: `대분수를 가분수로 바꾼 다음, 나누는 분수의 분모와 분자를 바꾸어 곱해요. ${mixedNumberExample(quotient)}`,
      answerType: 'fraction',
      correctAnswer: quotient,
      explanations: [
        {
          title: '1단계: 대분수를 가분수로 바꾸기',
          content: `${mixed} = ${improper}/${den1}`,
        },
        {
          title: '2단계: 곱셈으로 바꾸어 계산하기',
          content: `${improper}/${den1} ÷ ${num2}/${den2} = ${multiplied} = ${product}`,
        },
        {
          title: '3단계: 기약분수로 나타내기',
          content: lowestTermsStep(improper * den2, den1 * num2),
        },
      ],
    };
  }

  if (type === 'fraction_decimal_compare') {
    // Denominators that turn into 10 or 100, as in 3/4 = 75/100 = 0.75
    const den = pickOne(
      difficulty === 'easy'
        ? [2, 5]
        : difficulty === 'medium'
          ? [2, 4, 5, 20, 25]
          : [4, 20, 25, 50],
    );
    const num = randomNumerator(den);
    const to = 10 % den === 0 ? 10 : 100;
    const value = (num * 100) / den; // in hundredths
    // Easy compares tenths only; the closer the decimal, the harder
    const spread = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 9;
    const randomOther = () => (difficulty === 'easy' ? randomInt(1, 9) * 10 : randomInt(1, 99));
    let other = randomOther();
    while (other === value || Math.abs(other - value) > spread) other = randomOther();
    const frac = `${num}/${den}`;
    const fracDecimal = value / 100;
    const decimal = other / 100;
    const fracFirst = Math.random() < 0.5;
    const askBigger = Math.random() < 0.5;
    const word = askBigger ? '큰' : '작은';
    const fracWins = askBigger === value > other;
    const [left, right] = fracFirst ? [fracDecimal, decimal] : [decimal, fracDecimal];

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수와 소수의 크기 비교',
      difficulty,
      question: `두 수 ${fracFirst ? `${josa(frac, '과')} ${decimal}` : `${josa(decimal, '과')} ${frac}`} 중에서 더 ${word} 수를 소수로 쓰세요.`,
      hint: `분모를 10이나 100으로 만들면 분수를 소수로 나타낼 수 있어요. 그다음 소수끼리 비교해 보세요.`,
      answerType: 'number',
      correctAnswer: fracWins ? fracDecimal : decimal,
      explanations: [
        {
          title: '1단계: 분수를 소수로 나타내기',
          content: `분모와 분자에 똑같이 ${josa(to / den, '을')} 곱하면 ${frac} = ${(num * to) / den}/${to} = ${fracDecimal}입니다.`,
        },
        {
          title: '2단계: 소수끼리 비교하기',
          content: `${left} ${left > right ? '>' : '<'} ${right}이므로 더 ${word} 수는 ${fracWins ? `${frac}, 소수로 쓰면 ${fracDecimal}` : decimal}입니다.`,
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
  const num1 = randomNumerator(den1, 2);
  // Equal denominators belong to '분모가 같은 분수의 나눗셈', where the numerators are simply divided
  let den2 = pickOne(divisionDenominators);
  while (den2 === den1) den2 = pickOne(divisionDenominators);
  const num2 = randomNumerator(den2);

  // num1/den1 ÷ num2/den2 = num1/den1 × den2/num2
  const divNum = num1 * den2;
  const divDen = den1 * num2;
  const simplified = simplifyFraction(divNum, divDen);
  const { multiplied, product } = divideAsMultiplication(num1, den1, num2, den2);

  return {
    id,
    topicId: 'fractions',
    subtopic: '분수의 나눗셈',
    difficulty,
    question: `다음 분수의 나눗셈을 계산하여 기약분수로 나타내세요${OVER_ONE}:  ${num1}/${den1} ÷ ${num2}/${den2}`,
    hint:
      num2 === 1
        ? `÷ ${josa(`1/${den2}`, '은')} × ${josa(den2, '과')} 같아요. 나눗셈을 곱셈으로 바꾸어 계산해 보세요!`
        : `나눗셈을 곱셈으로 바꾸고, 나누는 분수 ${num2}/${den2}의 분모와 분자를 바꾸어 곱해요!`,
    answerType: 'fraction',
    correctAnswer: { num: simplified.num, den: simplified.den },
    explanations: [
      {
        title: '1단계: 나눗셈을 곱셈으로 바꾸기',
        content: `${num1}/${den1} ÷ ${num2}/${den2} = ${multiplied}`,
      },
      {
        title: '2단계: 곱셈 계산',
        content: product,
      },
      {
        title: '3단계: 기약분수로 나타내기',
        content: lowestTermsStep(divNum, divDen),
      },
    ],
  };
}
