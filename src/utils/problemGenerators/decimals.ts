import type { Difficulty, Problem } from '../../types/math';
import { josa, pickOne, randomInt, simplifyFraction } from '../mathHelpers';
import { KID_CALL } from '../profile';

// Random integer in [min, max] whose last digit is not 0, so n / 10^k shows every decimal place (no 2.0 or 1.10)
function randomScaled(min: number, max: number): number {
  let n = randomInt(min, max);
  while (n % 10 === 0) n = randomInt(min, max);
  return n;
}

const PLACE_NAMES: Record<number, string> = { 10: '십', 100: '백', 1000: '천', 10000: '만' };

export function generateDecimalProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'multiplication',
    'division',
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
        : ['× 10', '× 100', '× 1000', '÷ 10', '÷ 100'],
    );
    const factor = Number(op.slice(2));
    // ×: results stay below 1000; ÷10: one decimal place, ÷100: whole number, so answers have at most 2 decimals
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
      question: `${josa(decimalText, '을')} 기약분수로 나타내세요.`,
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
    const n = randomInt(1001, 99999); // the number is n / 1000
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

  if (type === 'multiplication') {
    if (difficulty === 'easy') {
      // Decimal x Integer
      const decInt = randomScaled(11, 49);
      const dec = decInt / 10;
      const intVal = randomInt(2, 6);
      const product = decInt * intVal;
      const ans = product / 10;

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
            content: `${decInt} × ${intVal} = ${product}`,
          },
          {
            title: '2단계: 소수점 위치 맞추기',
            content: `${josa(dec, '은')} 소수점 아래 한 자리이므로, ${product}에서 소수점을 왼쪽으로 한 칸 옮기면 ${ans}입니다.`,
          },
        ],
      };
    }

    // Multiply decimals, using hundredths for the hardest level.
    const aPlaces = difficulty === 'hard' ? 2 : 1;
    const aScale = 10 ** aPlaces;
    const aInt = randomScaled(aScale + 1, 9 * aScale);
    const bInt = randomInt(2, 9);
    const product = aInt * bInt;
    const ans = product / 10 ** (aPlaces + 1);

    return {
      id,
      topicId: 'decimals',
      subtopic: '소수 × 소수',
      difficulty,
      question: `다음 식을 계산하세요:  ${aInt / aScale} × ${bInt / 10}`,
      hint: `두 소수의 소수점 아래 자릿수를 합치면 총 몇 자리인가요? 자연수 곱셈 결과에서 그만큼 왼쪽으로 점을 옮겨요!`,
      answerType: 'number',
      correctAnswer: ans,
      explanations: [
        {
          title: '1단계: 자연수의 곱 구하기',
          content: `${aInt} × ${bInt} = ${product}`,
        },
        {
          title: '2단계: 소수점 자릿수 합산',
          content: `소수점 아래 자릿수가 ${aPlaces} + 1 = ${aPlaces + 1}자리이므로, ${product}에서 소수점을 왼쪽으로 ${aPlaces + 1}칸 옮기면 ${ans}입니다.`,
        },
      ],
    };
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
    const divisorInt =
      places === 2 ? randomScaled(12, 55) : randomInt(2, difficulty === 'easy' ? 6 : 8);
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

  if (type === 'decimal_div_natural') {
    const places = difficulty === 'hard' ? 2 : 1;
    const scale = 10 ** places;
    const n = randomInt(2, difficulty === 'easy' ? 5 : 9);
    const maxQuotient = (difficulty === 'easy' ? 5 : 9) * scale;
    let q = randomScaled(scale + 1, maxQuotient);
    // Keep the dividend a decimal as well (e.g. not 2.5 × 4 = 10)
    while ((q * n) % 10 === 0) q = randomScaled(scale + 1, maxQuotient);
    const dividendInt = q * n;
    const dividend = dividendInt / scale;
    const quotient = q / scale;

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
          content: `${dividendInt} ÷ ${n} = ${q}`,
        },
        {
          title: '2단계: 몫에 소수점 찍기',
          content: `${josa(dividend, '은')} ${dividendInt}의 1/${scale}이므로, 몫도 ${q}의 1/${scale}인 ${quotient}입니다.`,
        },
      ],
    };
  }

  if (type === 'quotient_rounding') {
    const places = difficulty === 'hard' ? 2 : 1;
    const b = pickOne([3, 6, 7, 9, 11, 12]);
    const maxA = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 100;
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

    return {
      id,
      topicId: 'decimals',
      subtopic: '나누어 주고 남는 양',
      difficulty,
      context: '주스 나누기',
      question: `주스 ${total}L를 한 모둠에 ${each}L씩 나누어 주려고 합니다. 최대한 많은 모둠에 나누어 주면 남는 주스는 몇 L인가요?`,
      hint: `${total} ÷ ${each}의 몫을 자연수까지만 구한 다음, 나누어 준 양을 전체에서 빼 보세요.`,
      answerType: 'number',
      correctAnswer: rest,
      explanations: [
        {
          title: '1단계: 나누어 줄 수 있는 모둠 수',
          content: `${total} ÷ ${each}의 몫을 자연수까지 구하면 ${groups}이므로 ${groups}모둠에 나누어 줄 수 있어요.`,
        },
        {
          title: '2단계: 남는 양 구하기',
          content: `${total} - ${each} × ${groups} = ${total} - ${each * groups} = ${rest}L`,
        },
      ],
    };
  }

  if (type === 'round_up_down') {
    if (Math.random() < 0.5) {
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
          content: `${josa(first, '과')} ${second}의 소수점을 같은 위치에 맞춥니다.`,
        },
        {
          title: '2단계: 같은 자리끼리 계산하기',
          content: `${first} ${operation} ${second} = ${answer.toFixed(places)}`,
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
    const c = pickOne(conversions);
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
    const aInt = randomScaled(1, target * scale - 1);
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

  // Word Problem
  const lengthPlaces = difficulty === 'hard' ? 2 : 1;
  const lengthScale = 10 ** lengthPlaces;
  const maxLength = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 40 : 250;
  const minLength = difficulty === 'hard' ? 101 : 12;
  const lengthInt = randomScaled(minLength, maxLength);
  const length = lengthInt / lengthScale;
  const count =
    difficulty === 'easy'
      ? randomInt(2, 4)
      : difficulty === 'medium'
        ? randomInt(3, 6)
        : randomInt(4, 8);
  const total = (lengthInt * count) / lengthScale;

  return {
    id,
    topicId: 'decimals',
    subtopic: '소수 실생활 문제',
    difficulty,
    context: '리본 끈 이어 붙이기',
    question: `${KID_CALL}에게 길이가 ${length}m인 리본 끈이 ${count}개 있습니다. ${KID_CALL}가 이 리본 끈들을 겹치지 않게 모두 이어 붙이면 총 몇 m가 될까요?`,
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
