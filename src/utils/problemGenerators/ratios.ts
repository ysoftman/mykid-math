import type { Difficulty, Problem } from '../../types/math';
import { gcd, josa, lcm, pickOne, randomInt, randomNumerator } from '../mathHelpers';
import { KID_CALL } from '../profile';

export function generateRatioProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'percentage',
    'proportion_equation',
    'proportional_distribution',
    'unit_price',
    'discount',
    'ratio_as_fraction',
    'speed',
    'simplest_ratio',
    'proportion_word',
    'concentration',
    'percent_of_number',
    'ratio_to_percent',
    'percent_remaining',
  ]);
  const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'discount') {
    const price = randomInt(2, 10) * 1000;
    const rate = pickOne(difficulty === 'easy' ? [10, 20, 50] : [10, 15, 20, 25, 30, 40]);
    const discount = (price * rate) / 100;
    const sale = price - discount;

    return {
      id,
      topicId: 'ratios',
      subtopic: '할인율',
      difficulty,
      context: '할인 쇼핑',
      question: `${KID_CALL}가 갖고 싶은 ${price}원짜리 장난감을 ${rate}% 할인하여 팔고 있습니다. 할인된 가격은 얼마인가요?`,
      hint: `먼저 할인 금액(정가 × ${rate}/100)을 구한 다음 정가에서 빼 보세요.`,
      answerType: 'number',
      correctAnswer: sale,
      explanations: [
        {
          title: '1단계: 할인 금액 구하기',
          content: `${price} × ${rate}/100 = ${discount}원`,
        },
        {
          title: '2단계: 판매 가격 구하기',
          content: `${price} - ${discount} = ${sale}원`,
        },
      ],
    };
  }

  if (type === 'ratio_as_fraction') {
    const max = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15;
    const sb = randomInt(3, max);
    let sa = randomInt(1, sb - 1);
    while (gcd(sa, sb) !== 1) sa = randomInt(1, sb - 1);
    const m = difficulty === 'easy' ? randomInt(1, 3) : randomInt(2, 6);

    return {
      id,
      topicId: 'ratios',
      subtopic: '비율을 분수로',
      difficulty,
      question: `비 ${sa * m} : ${sb * m}의 비율을 기약분수로 나타내세요.`,
      hint: `비 A : B의 비율은 A/B (비교하는 양 ÷ 기준량)이에요. 약분도 잊지 마세요!`,
      answerType: 'fraction',
      correctAnswer: { num: sa, den: sb },
      explanations: [
        {
          title: '1단계: 비율을 분수로 쓰기',
          content: `비교하는 양 ${sa * m}, 기준량 ${sb * m}이므로 비율은 ${sa * m}/${sb * m} 입니다.`,
        },
        {
          title: '2단계: 약분하기',
          content: `${sa * m}/${sb * m} = ${sa}/${sb}`,
        },
      ],
    };
  }

  if (type === 'simplest_ratio') {
    // Easy shows natural numbers, medium tenths, hard fractions; all become the natural-number ratio `whole` first
    let shown: [string, string];
    let whole: [number, number];
    let toWhole = '';
    if (difficulty === 'hard') {
      const b = randomInt(2, 9);
      let d = randomInt(2, 9);
      while (d === b) d = randomInt(2, 9);
      const a = randomNumerator(b);
      const c = randomNumerator(d);
      const l = lcm(b, d);
      whole = [a * (l / b), c * (l / d)];
      shown = [`${a}/${b}`, `${c}/${d}`];
      toWhole = `두 분모 ${josa(b, '과')} ${d}의 최소공배수 ${josa(l, '을')} 전항과 후항에 곱하면 ${whole[0]} : ${whole[1]}입니다.`;
    } else {
      let x = randomInt(1, 9);
      let y = randomInt(2, 9);
      while (x === y || gcd(x, y) !== 1) {
        x = randomInt(1, 9);
        y = randomInt(2, 9);
      }
      let k = randomInt(difficulty === 'easy' ? 2 : 1, 9);
      // Medium shows tenths, so neither term may be a whole number
      while (difficulty === 'medium' && ((x * k) % 10 === 0 || (y * k) % 10 === 0)) {
        k = randomInt(1, 9);
      }
      whole = [x * k, y * k];
      const scale = difficulty === 'easy' ? 1 : 10;
      shown = [`${(x * k) / scale}`, `${(y * k) / scale}`];
      if (difficulty === 'medium') {
        toWhole = `전항과 후항에 10을 곱하면 ${whole[0]} : ${whole[1]}입니다.`;
      }
    }
    const g = gcd(whole[0], whole[1]);
    const p = whole[0] / g;
    const q = whole[1] / g;
    const divide =
      g > 1
        ? `${josa(whole[0], '과')} ${whole[1]}의 최대공약수 ${josa(g, '으로')} 전항과 후항을 나누면 ${p} : ${q}입니다.`
        : `${whole[0]} : ${josa(whole[1], '은')} 1 말고는 공약수가 없으므로 이미 가장 간단한 자연수의 비입니다.`;

    return {
      id,
      topicId: 'ratios',
      subtopic: '간단한 자연수의 비',
      difficulty,
      question: `${shown[0]} : ${josa(shown[1], '을')} 가장 간단한 자연수의 비로 나타내면 ${p} : □입니다. □에 알맞은 수를 구하세요.`,
      hint: `비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 나누어도 비율은 같아요. 자연수의 비로 만든 다음 최대공약수로 나누어 보세요.`,
      answerType: 'number',
      correctAnswer: q,
      explanations: toWhole
        ? [
            { title: '1단계: 자연수의 비로 만들기', content: toWhole },
            { title: '2단계: 최대공약수로 나누기', content: divide },
          ]
        : [{ title: '1단계: 최대공약수로 나누기', content: divide }],
    };
  }

  if (type === 'proportion_word') {
    let a: number;
    let b: number;
    let c: number;
    let question: string;
    if (Math.random() < 0.5) {
      // a cookies need b grams of flour, so c cookies need c × (grams per cookie)
      a = randomInt(2, difficulty === 'easy' ? 4 : 6);
      const perCookie = randomInt(1, 4) * 5;
      const maxCookies = 10;
      c = randomInt(2, maxCookies);
      while (c === a) c = randomInt(2, maxCookies);
      b = a * perCookie;
      question = `쿠키 ${a}개를 만드는 데 밀가루 ${b}g이 필요합니다. 같은 비율로 쿠키 ${c}개를 만들려면 밀가루는 몇 g 필요한가요?`;
    } else {
      a = randomInt(1, difficulty === 'easy' ? 4 : 9);
      b = randomInt(2, difficulty === 'easy' ? 5 : 9);
      while (a === b || gcd(a, b) !== 1) {
        a = randomInt(1, difficulty === 'easy' ? 4 : 9);
        b = randomInt(2, difficulty === 'easy' ? 5 : 9);
      }
      c = a * randomInt(2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20);
      question = `빨간 물감과 노란 물감을 ${a} : ${b}의 비로 섞어 주황색 물감을 만들려고 합니다. 빨간 물감을 ${c}mL 넣었다면 노란 물감은 몇 mL 넣어야 하나요?`;
    }
    const x = (b * c) / a;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례식 활용',
      difficulty,
      question,
      hint: `구하려는 양을 □로 놓고 ${a} : ${b} = ${c} : □처럼 비례식을 세워 보세요.`,
      answerType: 'number',
      correctAnswer: x,
      explanations: [
        {
          title: '1단계: 비례식 세우기',
          content: `${a} : ${b} = ${c} : □`,
        },
        {
          title: '2단계: 외항의 곱 = 내항의 곱',
          content: `${a} × □ = ${b} × ${c} = ${b * c}, □ = ${b * c} ÷ ${a} = ${x}`,
        },
      ],
    };
  }

  if (type === 'concentration') {
    const total = pickOne(
      difficulty === 'easy' ? [100] : difficulty === 'medium' ? [100, 200] : [150, 200],
    );
    let percent = randomInt(1, 12) * 5;
    while ((total * percent) % 100 !== 0) percent = randomInt(1, 12) * 5;
    const syrup = (total * percent) / 100;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비율 활용 (진하기)',
      difficulty,
      context: '딸기 주스 만들기',
      question: `딸기 시럽 ${syrup}mL와 탄산수 ${total - syrup}mL를 섞어 딸기 주스를 만들었습니다. 주스 양에 대한 딸기 시럽 양의 비율은 몇 %인가요?`,
      hint: `기준량은 탄산수가 아니라 주스 전체의 양(시럽 + 탄산수)이에요!`,
      answerType: 'number',
      correctAnswer: percent,
      explanations: [
        {
          title: '1단계: 기준량(주스 양) 구하기',
          content: `${syrup} + ${total - syrup} = ${total}mL`,
        },
        {
          title: '2단계: 백분율로 나타내기',
          content: `(${syrup} ÷ ${total}) × 100 = ${percent}%`,
        },
      ],
    };
  }

  if (type === 'speed') {
    // Distance stays within 200km: easy uses tens, others multiples of 5
    let hours = randomInt(2, difficulty === 'easy' ? 3 : 4);
    let speed = difficulty === 'easy' ? randomInt(3, 6) * 10 : randomInt(6, 18) * 5;
    while (speed * hours > 200) {
      hours = randomInt(2, 4);
      speed = randomInt(6, 18) * 5;
    }
    const distance = speed * hours;

    return {
      id,
      topicId: 'ratios',
      subtopic: '걸린 시간에 대한 거리의 비율 (속력)',
      difficulty,
      context: '자동차 여행',
      question: `자동차가 ${hours}시간 동안 ${distance}km를 달렸습니다. 걸린 시간에 대한 달린 거리의 비율은 얼마인가요? (1시간 동안 달린 거리)`,
      hint: `걸린 시간이 기준량, 달린 거리가 비교하는 양이에요. 거리 ÷ 시간을 계산해요.`,
      answerType: 'number',
      correctAnswer: speed,
      explanations: [
        {
          title: '1단계: 기준량과 비교하는 양',
          content: `기준량은 걸린 시간 ${hours}시간, 비교하는 양은 거리 ${distance}km입니다.`,
        },
        {
          title: '2단계: 비율 구하기',
          content: `${distance} ÷ ${hours} = ${speed}, 1시간에 ${speed}km를 달린 셈입니다.`,
        },
      ],
    };
  }

  if (type === 'percentage') {
    const total =
      difficulty === 'easy'
        ? 100
        : difficulty === 'medium'
          ? pickOne([20, 25, 40, 50])
          : pickOne([30, 60, 80, 120]);
    // Only parts that give a whole-number percent, e.g. multiples of 3 out of 30
    const step = total / gcd(total, 100);
    const part =
      difficulty === 'easy' ? randomInt(1, 9) * 10 : randomInt(1, total / step - 1) * step;
    const percent = (part * 100) / total;

    return {
      id,
      topicId: 'ratios',
      subtopic: '백분율 (%)',
      difficulty,
      question: `전체 ${total}명 중 안경을 쓴 학생이 ${part}명입니다. 안경을 쓴 학생의 비율을 백분율(%)로 나타내면 몇 %인가요?`,
      hint: `백분율은 (비교하는 양 ÷ 기준량) × 100 이에요!`,
      answerType: 'number',
      correctAnswer: percent,
      explanations: [
        {
          title: '1단계: 비율 구하기',
          content: `기준량은 ${total}, 비교하는 양은 ${part}이므로 비율은 ${part}/${total} 입니다.`,
        },
        {
          title: '2단계: 백분율로 환산 (× 100)',
          content: `(${part} / ${total}) × 100 = ${percent}% 입니다.`,
        },
      ],
    };
  }

  if (type === 'proportion_equation') {
    // a : b = c : x (x = b * c / a)
    const a =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(2, 6)
          : randomInt(5, 12);
    const b =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(3, 8)
          : randomInt(6, 15);
    const multiplier =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(2, 6)
          : randomInt(4, 9);
    const c = a * multiplier;
    const x = b * multiplier;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례식의 성질',
      difficulty,
      question: `다음 비례식에서 빈칸 □에 들어갈 알맞은 수를 구하세요:  ${a} : ${b} = ${c} : □`,
      hint: `비례식에서는 '외항의 곱 = 내항의 곱'이 성립해요! 또는 앞의 비의 전항(${a})이 몇 배 커졌는지(${multiplier}배) 살펴보세요.`,
      answerType: 'number',
      correctAnswer: x,
      explanations: [
        {
          title: '방법 1: 전항과 후항의 배수 관계',
          content: `${josa(a, '이')} ${multiplier}배 되어 ${josa(c, '이')} 되었으므로, ${b}도 똑같이 ${multiplier}배 되어야 합니다: ${b} × ${multiplier} = ${x}`,
        },
        {
          title: '방법 2: 외항의 곱 = 내항의 곱',
          content: `${a} × □ = ${b} × ${c} (${b * c})  ➡️  □ = ${b * c} ÷ ${a} = ${x}`,
        },
      ],
    };
  }

  if (type === 'unit_price') {
    const unitPrice = randomInt(2, difficulty === 'easy' ? 8 : 15) * 100;
    const unitCount = randomInt(2, difficulty === 'hard' ? 6 : 5);
    const totalPrice = unitPrice * unitCount;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례 관계와 가격',
      difficulty,
      context: '문구점에서 연필 사기',
      question: `${KID_CALL}가 문구점에서 연필 ${unitCount}자루를 ${totalPrice}원에 샀습니다. 연필 1자루의 값은 얼마인가요?`,
      hint: `전체 가격을 연필 개수로 나누면 한 자루의 값을 알 수 있어요.`,
      answerType: 'number',
      correctAnswer: unitPrice,
      explanations: [
        {
          title: '1단계: 한 자루의 값 구하기',
          content: `${totalPrice}원을 ${unitCount}자루로 똑같이 나누어요.`,
        },
        {
          title: '2단계: 나누어 계산하기',
          content: `${totalPrice} ÷ ${unitCount} = ${unitPrice}원`,
        },
      ],
    };
  }

  if (type === 'percent_of_number') {
    const percent = pickOne(
      difficulty === 'easy'
        ? [10, 50]
        : difficulty === 'medium'
          ? [10, 20, 25, 50, 75]
          : [5, 15, 30, 40, 60, 80],
    );
    const step = 100 / gcd(percent, 100); // smallest total that gives a whole-number answer
    const maxTotal = difficulty === 'hard' ? 200 : 100;
    const total = step * randomInt(Math.ceil(10 / step), Math.floor(maxTotal / step));
    const answer = (total * percent) / 100;
    const g = gcd(percent, 100); // 75% = 3/4, so divide by 4 and multiply by 3
    const story = difficulty !== 'easy' && Math.random() < 0.5;

    return {
      id,
      topicId: 'ratios',
      subtopic: '백분율만큼 구하기',
      difficulty,
      question: story
        ? `사탕 ${total}개 중 ${percent}%를 친구에게 나누어 주었습니다. 친구에게 준 사탕은 몇 개인가요?`
        : `${total}의 ${percent}%는 얼마인가요?`,
      hint: `${percent}%는 ${josa(`${percent}/100`, '과')} 같아요. 전체에 곱해 보세요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '1단계: 백분율을 기약분수로',
          content: `${percent}% = ${percent}/100${g > 1 ? ` = ${percent / g}/${100 / g}` : ''}`,
        },
        {
          title: '2단계: 나누고 곱하기',
          content:
            percent === g
              ? `${total} ÷ ${100 / g} = ${answer}`
              : `${total} ÷ ${100 / g} × ${percent / g} = ${total / (100 / g)} × ${percent / g} = ${answer}`,
        },
      ],
    };
  }

  if (type === 'ratio_to_percent') {
    const den = pickOne(
      difficulty === 'easy'
        ? [2, 4, 5, 10]
        : difficulty === 'medium'
          ? [4, 5, 10, 20, 25]
          : [20, 25, 50],
    );
    const num = randomNumerator(den);
    const percent = (num * 100) / den;
    const asDecimal = difficulty !== 'easy' && Math.random() < 0.4;
    const shown = asDecimal ? `${percent / 100}` : `${num}/${den}`;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비율을 백분율로',
      difficulty,
      question: `비율 ${josa(shown, '을')} 백분율로 나타내면 몇 %인가요?`,
      hint: asDecimal
        ? `소수로 나타낸 비율에 100을 곱하면 백분율이에요.`
        : `분모가 100인 분수로 바꾸면 분자가 바로 백분율이에요.`,
      answerType: 'number',
      correctAnswer: percent,
      explanations: asDecimal
        ? [
            { title: '1단계: 100 곱하기', content: `${shown} × 100 = ${percent}` },
            { title: '2단계: % 붙이기', content: `따라서 ${percent}%입니다.` },
          ]
        : [
            {
              title: '1단계: 분모를 100으로 만들기',
              content: `분모 ${den}에 ${josa(100 / den, '을')} 곱하면 100이 되므로 분자에도 곱해요: ${num}/${den} = ${percent}/100`,
            },
            { title: '2단계: % 붙이기', content: `${percent}/100 = ${percent}%` },
          ],
    };
  }

  if (type === 'percent_remaining') {
    const unit = difficulty === 'easy' ? 10 : 5;
    const two = difficulty === 'hard';
    const p1 = randomInt(1, two ? 9 : 100 / unit - 1) * unit;
    const p2 = two ? randomInt(1, (90 - p1) / 5) * 5 : 0;
    const rest = 100 - p1 - p2;

    return {
      id,
      topicId: 'ratios',
      subtopic: '남은 비율 (백분율)',
      difficulty,
      question: two
        ? `${KID_CALL}가 공부한 시간 중 ${p1}%는 수학, ${p2}%는 국어였습니다. 나머지 과목을 공부한 시간은 전체의 몇 %인가요?`
        : `피자 한 판의 ${p1}%를 먹었습니다. 남은 피자는 전체의 몇 %인가요?`,
      hint: `전체는 100%예요.`,
      answerType: 'number',
      correctAnswer: rest,
      explanations: [
        { title: '1단계: 전체는 100%', content: `전체를 100%로 생각해요.` },
        {
          title: '2단계: 빼기',
          content: two
            ? `100 - ${p1} - ${p2} = ${rest}이므로 ${rest}%입니다.`
            : `100 - ${p1} = ${rest}이므로 ${rest}%입니다.`,
        },
      ],
    };
  }

  // Proportional distribution
  const maxRatio = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 6;
  const r1 = randomInt(1, maxRatio);
  const r2 = randomInt(2, maxRatio);
  const unit =
    difficulty === 'easy'
      ? randomInt(2, 6)
      : difficulty === 'medium'
        ? randomInt(3, 8)
        : randomInt(4, 10);
  const total = (r1 + r2) * unit;
  // Names in their particle-ready form (서연 → 서연이) so '가/와/의' reads naturally
  const friend = pickOne(['민수', '지우', '태호', '서연이']);
  const isFirst = Math.random() > 0.5;
  const targetName = isFirst ? KID_CALL : friend;
  const targetAns = isFirst ? r1 * unit : r2 * unit;

  return {
    id,
    topicId: 'ratios',
    subtopic: '비례배분',
    difficulty,
    context: '스티커 나누기',
    question: `스티커 ${total}장을 ${KID_CALL}와 ${friend}가 ${r1} : ${r2}의 비로 나누어 가지려고 합니다. ${targetName}가 갖게 될 스티커는 몇 장일까요?`,
    hint: `전체를 총 (${r1} + ${r2} = ${r1 + r2})조각으로 나눈 다음, 그중 ${isFirst ? r1 : r2}조각의 양을 구하면 돼요!`,
    answerType: 'number',
    correctAnswer: targetAns,
    explanations: [
      {
        title: '1단계: 비의 합 구하기',
        content: `전체 비의 합 = ${r1} + ${r2} = ${r1 + r2} 묶음`,
      },
      {
        title: '2단계: 1묶음의 크기 구하기',
        content: `${total} ÷ ${r1 + r2} = 1묶음당 ${unit}장`,
      },
      {
        title: '3단계: 배분하기',
        content: `${targetName}의 몫 = ${unit} × ${isFirst ? r1 : r2} = ${targetAns}장`,
      },
    ],
  };
}
