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
          : randomInt(4, 9);

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
          content: `${sn * m} ÷ ${m} = ${sn}, ${sd * m} ÷ ${m} = ${sd} 이므로 ${sn}/${sd} 입니다.`,
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
        : `다음 대분수의 뺄셈을 계산하여 기약분수로 나타내세요(1보다 크면 가분수로):  ${mixed1} - ${mixed2}`,
      hint: `대분수를 가분수로 바꾼 다음 통분해서 ${isAdd ? '더해요' : '빼요'}. 예: 2와 1/3 = 7/3`,
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
          title: '3단계: 약분하기',
          content: `기약분수로 나타내면 ${simplified.num}/${simplified.den} 입니다.`,
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
    const totalText = total.den === 1 ? `${total.num}` : `${total.num}/${total.den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '분수의 나눗셈 문장제',
      difficulty,
      context: '끈 자르기',
      question: `${KID_CALL}가 길이가 ${totalText}m인 끈을 ${num}/${den}m씩 잘랐습니다. 모두 몇 도막이 되나요?`,
      hint: `전체 길이를 한 도막의 길이로 나누면 돼요. 분수의 나눗셈은 나누는 분수를 뒤집어 곱해요!`,
      answerType: 'number',
      correctAnswer: count,
      explanations: [
        {
          title: '1단계: 식 세우기',
          content: `도막 수 = ${totalText} ÷ ${num}/${den}`,
        },
        {
          title: '2단계: 역수를 곱해 계산하기',
          content: `${totalText} × ${den}/${num} = ${count}, 따라서 ${count}도막입니다.`,
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
      question: `다음 곱셈을 계산하여 기약분수로 나타내세요:  ${expr}`,
      hint: `자연수는 분자에만 곱해요. 곱하기 전에 자연수와 분모를 먼저 약분하면 계산이 쉬워요!`,
      answerType: 'fraction',
      correctAnswer: product,
      explanations: [
        {
          title: '1단계: 자연수를 분자에 곱하기',
          content: `${expr} = (${naturalFirst ? `${n} × ${num}` : `${num} × ${n}`})/${den} = ${num * n}/${den}`,
        },
        {
          title: '2단계: 약분하기',
          content:
            product.den === 1
              ? `${num * n}/${den} = ${num * n} ÷ ${den} = ${product.num} (자연수)`
              : `기약분수로 나타내면 ${product.num}/${product.den} 입니다.`,
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
      question: `다음 분수의 덧셈을 계산하여 기약분수(더 이상 약분되지 않는 분수)로 나타내세요:  ${num1}/${den1} + ${num2}/${den2}`,
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
          content: `${num1}/${den1} = ${newNum1}/${commonDen},  ${num2}/${den2} = ${newNum2}/${commonDen}`,
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
          title: '2단계: 기약분수로 약분하기',
          content:
            simplified.den === multDen
              ? `${josa(`${multNum}/${multDen}`, '은')} 더 이상 약분되지 않는 기약분수예요.`
              : `${multNum}/${multDen} = ${simplified.num}/${simplified.den}`,
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
          : randomInt(8, 20);
    const whole = den * unit;
    const answer = num * unit;

    return {
      id,
      topicId: 'fractions',
      subtopic: '어떤 수의 분수만큼 구하기',
      difficulty,
      question: `${KID_CALL}가 구운 쿠키 ${whole}개 중에서 ${num}/${den}만큼을 친구들에게 나누어 주었습니다. 나누어 준 쿠키는 몇 개인가요?`,
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
    const n1 = mode === 'sub' ? randomInt(2, den - 1) : randomInt(1, den - 1);
    const n2 = mode === 'add' ? randomInt(1, den - n1) : mode === 'sub' ? randomInt(1, n1 - 1) : 0;
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
      question: `다음을 계산하여 기약분수로 나타내세요:  ${expr}`,
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
    const den = pickOne(u.dens.filter((d) => d <= maxDen));
    const num = randomNumerator(den);
    const part = u.value / den;
    const frac = `${num}/${den}`;

    return {
      id,
      topicId: 'fractions',
      subtopic: '단위의 분수만큼 구하기',
      difficulty,
      question: `${u.whole}의 ${josa(frac, '은')} 몇 ${u.unit}인가요?`,
      hint: `먼저 ${u.subject} 몇 ${u.unit}인지 떠올린 다음, 분모만큼 똑같이 나누고 분자만큼 모아 보세요.`,
      answerType: 'number',
      correctAnswer: part * num,
      explanations: [
        {
          title: '1단계: 작은 단위로 바꾸기',
          content: `${u.whole} = ${u.value}${u.unit}입니다.`,
        },
        {
          title: '2단계: 1/분모만큼 구하기',
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

  // Division
  const divisionDenominators =
    difficulty === 'easy'
      ? [3, 4, 5]
      : difficulty === 'medium'
        ? [3, 4, 5, 6, 8]
        : [5, 6, 8, 9, 10];
  const den1 = pickOne(divisionDenominators);
  const num1 = randomNumerator(den1, 2);
  const den2 = pickOne(divisionDenominators.filter((den) => den > 2));
  const num2 = randomNumerator(den2);

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
