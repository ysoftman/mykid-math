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
    'ratio_as_decimal',
    'ratio_reading',
    'ratio_property',
    'speed',
    'simplest_ratio',
    'proportion_word',
    'concentration',
    'percent_of_number',
    'ratio_to_percent',
    'percent_remaining',
    'times_compare',
    'compared_amount',
    'population_density',
    'distribution_total',
  ]);
  const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'discount') {
    const price = randomInt(2, 10) * 1000;
    const rate = pickOne(difficulty === 'easy' ? [10, 20, 50] : [10, 15, 20, 25, 30, 40, 50]);
    const discount = (price * rate) / 100;
    const sale = price - discount;

    if (difficulty === 'hard') {
      // The sale price is given and the rate is asked for
      const g = gcd(discount, price);
      return {
        id,
        topicId: 'ratios',
        subtopic: '할인율',
        difficulty,
        context: '할인 쇼핑',
        question: `정가가 ${price}원인 장난감을 ${sale}원에 할인하여 팔고 있습니다. 이 장난감의 할인율은 몇 %인가요?`,
        hint: `먼저 할인 금액(정가 - 판매 가격)을 구한 다음, 정가에 대한 할인 금액의 비율을 백분율로 나타내요.`,
        answerType: 'number',
        correctAnswer: rate,
        explanations: [
          { title: '1단계: 할인 금액 구하기', content: `${price} - ${sale} = ${discount}원` },
          {
            title: '2단계: 할인율 구하기',
            content: `정가에 대한 할인 금액의 비율은 ${discount}/${price} = ${discount / g}/${price / g} = ${rate}/100이므로 할인율은 ${rate}%입니다.`,
          },
        ],
      };
    }

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
    // m >= 2 so there is always something to reduce; m is then the gcd of the two terms
    const m = difficulty === 'easy' ? randomInt(2, 3) : randomInt(2, 6);

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
          content: `비교하는 양 ${sa * m}, 기준량 ${sb * m}이므로 비율은 ${sa * m}/${sb * m}입니다.`,
        },
        {
          title: '2단계: 약분하기',
          content: `분자와 분모를 최대공약수 ${josa(m, '으로')} 나누면 ${sa * m}/${sb * m} = ${sa}/${sb}입니다.`,
        },
      ],
    };
  }

  if (type === 'ratio_as_decimal') {
    // Denominators that divide 10 or 100, so the decimal has at most two places
    const den = pickOne(
      difficulty === 'easy'
        ? [2, 4, 5, 10]
        : difficulty === 'medium'
          ? [4, 5, 10, 20, 25]
          : [20, 25, 50],
    );
    const num = randomNumerator(den);
    const scale = 10 % den === 0 ? 10 : 100;
    const scaled = num * (scale / den);
    const value = scaled / scale;
    const batting = difficulty !== 'easy' && den >= 10 && Math.random() < 0.5;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비율을 소수로',
      difficulty,
      question: batting
        ? `${KID_CALL}가 야구 경기에서 ${den}타수 중 안타를 ${num}개 쳤습니다. 전체 타수에 대한 안타 수의 비율(타율)을 소수로 나타내세요.`
        : `비 ${num} : ${den}의 비율을 소수로 나타내세요.`,
      hint: batting
        ? `타수가 기준량, 안타 수가 비교하는 양이에요. 분수로 나타낸 다음 분모를 10이나 100으로 만들어 보세요.`
        : `비율은 (비교하는 양) ÷ (기준량)이에요. 분수로 나타낸 다음 분모를 10이나 100으로 만들어 보세요.`,
      answerType: 'number',
      correctAnswer: value,
      explanations: [
        {
          title: '1단계: 비율을 분수로 나타내기',
          content: `비교하는 양 ${num}, 기준량 ${den}이므로 비율은 ${num}/${den}입니다.`,
        },
        {
          title: '2단계: 소수로 나타내기',
          content:
            scale === den
              ? `분모가 ${den}이므로 ${num}/${den} = ${value}입니다.`
              : `분모를 ${josa(scale, '으로')} 만들면 ${num}/${den} = ${scaled}/${scale} = ${value}입니다.`,
        },
      ],
    };
  }

  if (type === 'ratio_reading') {
    let a = randomInt(1, 9);
    let b = randomInt(2, 9);
    while (a === b) {
      a = randomInt(1, 9);
      b = randomInt(2, 9);
    }
    // The textbook reads a : b four ways; the two with '에 대한' name the base explicitly
    const read =
      difficulty === 'easy'
        ? pickOne([`${a} 대 ${b}`, `${josa(a, '과')} ${b}의 비`])
        : difficulty === 'medium'
          ? `${b}에 대한 ${a}의 비`
          : `${a}의 ${b}에 대한 비`;
    const eul = josa(read, '을').slice(read.length);
    const blankFirst = Math.random() < 0.5;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비로 나타내기',
      difficulty,
      question: `'${read}'${eul} 비로 나타내면 ${blankFirst ? '□' : a} : ${blankFirst ? b : '□'}입니다. □에 알맞은 수를 구하세요.`,
      hint: `비 ○ : △는 '△에 대한 ○의 비'라고 읽어요. 기준량(△)이 뒤에 와요.`,
      answerType: 'number',
      correctAnswer: blankFirst ? a : b,
      explanations: [
        {
          title: '1단계: 기준량과 비교하는 양 찾기',
          content:
            difficulty === 'easy'
              ? `'${read}'에서 ${josa(a, '을')} ${josa(b, '과')} 비교하므로 비교하는 양은 ${a}, 기준량은 ${b}입니다.`
              : `'에 대한' 앞의 수가 기준량이므로 '${read}'에서 기준량은 ${b}, 비교하는 양은 ${a}입니다.`,
        },
        {
          title: '2단계: 비로 나타내기',
          content: `(비교하는 양) : (기준량)으로 쓰면 ${a} : ${b}입니다.`,
        },
      ],
    };
  }

  if (type === 'ratio_property') {
    // Hard keeps 1 out of the first term, since 1 × k makes the multiplier obvious
    const aMin = difficulty === 'hard' ? 2 : 1;
    let a = randomInt(aMin, 9);
    let b = randomInt(2, 9);
    while (a === b || gcd(a, b) !== 1) {
      a = randomInt(aMin, 9);
      b = randomInt(2, 9);
    }
    const k = randomInt(2, 9);
    const blankFirst = Math.random() < 0.5;
    const shown = (x: number, y: number) =>
      `${blankFirst ? '□' : x} : ${blankFirst ? y : '□'}입니다. □에 알맞은 수를 구하세요.`;
    let question: string;
    let answer: number;
    let explanations: Problem['explanations'];
    if (difficulty === 'easy') {
      question = `비 ${a} : ${b}의 전항과 후항에 ${josa(k, '을')} 곱하면 ${shown(a * k, b * k)}`;
      answer = blankFirst ? a * k : b * k;
      explanations = [
        {
          title: '1단계: 비의 성질',
          content: `비의 전항과 후항에 0이 아닌 같은 수를 곱하여도 비율은 같습니다.`,
        },
        {
          title: '2단계: 같은 수 곱하기',
          content: `${a} × ${k} = ${a * k}, ${b} × ${k} = ${b * k}이므로 ${a * k} : ${b * k}입니다.`,
        },
      ];
    } else if (difficulty === 'medium') {
      question = `비 ${a * k} : ${b * k}의 전항과 후항을 ${josa(k, '으로')} 나누면 ${shown(a, b)}`;
      answer = blankFirst ? a : b;
      explanations = [
        {
          title: '1단계: 비의 성질',
          content: `비의 전항과 후항을 0이 아닌 같은 수로 나누어도 비율은 같습니다.`,
        },
        {
          title: '2단계: 같은 수로 나누기',
          content: `${a * k} ÷ ${k} = ${a}, ${b * k} ÷ ${k} = ${b}이므로 ${a} : ${b}입니다.`,
        },
      ];
    } else {
      // One term of the equal ratio is given, so the multiplier has to be found first
      const [from, to, other] = blankFirst ? [b, b * k, a] : [a, a * k, b];
      question = blankFirst
        ? `${a} : ${josa(b, '과')} 비율이 같은 비 중에서 후항이 ${b * k}인 비는 □ : ${b * k}입니다. □에 알맞은 수를 구하세요.`
        : `${a} : ${josa(b, '과')} 비율이 같은 비 중에서 전항이 ${a * k}인 비는 ${a * k} : □입니다. □에 알맞은 수를 구하세요.`;
      answer = blankFirst ? a * k : b * k;
      explanations = [
        {
          title: '1단계: 몇 배인지 알아보기',
          content: `${josa(from, '이')} ${josa(to, '이')} 되려면 ${to} ÷ ${from} = ${k}이므로 ${k}배 해야 합니다.`,
        },
        {
          title: '2단계: 다른 항에도 같은 수 곱하기',
          content: `비의 성질에 따라 ${other}에도 ${josa(k, '을')} 곱하면 ${other} × ${k} = ${other * k}이므로 ${a * k} : ${b * k}입니다.`,
        },
      ];
    }

    return {
      id,
      topicId: 'ratios',
      subtopic: '비의 성질',
      difficulty,
      question,
      hint: `비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 나누어도 비율은 같아요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations,
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
    const blankFirst = Math.random() < 0.5;
    const divide =
      g > 1
        ? `${josa(whole[0], '과')} ${whole[1]}의 최대공약수 ${josa(g, '으로')} 전항과 후항을 나누면 ${p} : ${q}입니다.`
        : `${whole[0]} : ${josa(whole[1], '은')} 1 말고는 공약수가 없으므로 이미 가장 간단한 자연수의 비입니다.`;

    return {
      id,
      topicId: 'ratios',
      subtopic: '간단한 자연수의 비',
      difficulty,
      question: `${shown[0]} : ${josa(shown[1], '을')} 가장 간단한 자연수의 비로 나타내면 ${blankFirst ? '□' : p} : ${blankFirst ? q : '□'}입니다. □에 알맞은 수를 구하세요.`,
      hint: `비의 전항과 후항에 0이 아닌 같은 수를 곱하거나 나누어도 비율은 같아요. 자연수의 비로 만든 다음 최대공약수로 나누어 보세요.`,
      answerType: 'number',
      correctAnswer: blankFirst ? p : q,
      explanations: toWhole
        ? [
            { title: '1단계: 자연수의 비로 만들기', content: toWhole },
            { title: '2단계: 최대공약수로 나누기', content: divide },
          ]
        : [{ title: '1단계: 최대공약수로 나누기', content: divide }],
    };
  }

  if (type === 'proportion_word') {
    // Hard sometimes gives the second quantity and asks for the first: a : b = □ : known
    const reversed = difficulty === 'hard' && Math.random() < 0.5;
    let a: number;
    let b: number;
    let known: number;
    let x: number;
    let question: string;
    if (Math.random() < 0.5) {
      // a cookies need b grams of flour, so c cookies need c × (grams per cookie)
      a = randomInt(2, difficulty === 'easy' ? 4 : 6);
      const perCookie = randomInt(1, 4) * 5;
      const maxCookies = 10;
      let c = randomInt(2, maxCookies);
      while (c === a) c = randomInt(2, maxCookies);
      b = a * perCookie;
      [known, x] = reversed ? [c * perCookie, c] : [c, c * perCookie];
      question = reversed
        ? `쿠키 ${a}개를 만드는 데 밀가루 ${b}g이 필요합니다. 같은 비율로 밀가루 ${known}g을 모두 사용하면 쿠키를 몇 개 만들 수 있나요?`
        : `쿠키 ${a}개를 만드는 데 밀가루 ${b}g이 필요합니다. 같은 비율로 쿠키 ${known}개를 만들려면 밀가루는 몇 g 필요한가요?`;
    } else {
      a = randomInt(1, difficulty === 'easy' ? 4 : 9);
      b = randomInt(2, difficulty === 'easy' ? 5 : 9);
      while (a === b || gcd(a, b) !== 1) {
        a = randomInt(1, difficulty === 'easy' ? 4 : 9);
        b = randomInt(2, difficulty === 'easy' ? 5 : 9);
      }
      const m = randomInt(2, difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20);
      [known, x] = reversed ? [b * m, a * m] : [a * m, b * m];
      question = reversed
        ? `빨간 물감과 노란 물감을 ${a} : ${b}의 비로 섞어 주황색 물감을 만들려고 합니다. 노란 물감을 ${known}mL 넣었다면 빨간 물감은 몇 mL 넣어야 하나요?`
        : `빨간 물감과 노란 물감을 ${a} : ${b}의 비로 섞어 주황색 물감을 만들려고 합니다. 빨간 물감을 ${known}mL 넣었다면 노란 물감은 몇 mL 넣어야 하나요?`;
    }
    const equation = reversed ? `${a} : ${b} = □ : ${known}` : `${a} : ${b} = ${known} : □`;
    // 외항의 곱 = 내항의 곱, written with the blank's partner on the left
    const [partner, p, q] = reversed ? [b, a, known] : [a, b, known];

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례식 활용',
      difficulty,
      question,
      hint: `구하려는 양을 □로 놓고 ${equation}처럼 비례식을 세워 보세요.`,
      answerType: 'number',
      correctAnswer: x,
      explanations: [
        {
          title: '1단계: 비례식 세우기',
          content: equation,
        },
        {
          title: '2단계: 외항의 곱 = 내항의 곱',
          content: `${partner} × □ = ${p} × ${q} = ${p * q}, □ = ${p * q} ÷ ${partner} = ${x}`,
        },
      ],
    };
  }

  if (type === 'concentration') {
    const total = pickOne(
      difficulty === 'easy'
        ? [100]
        : difficulty === 'medium'
          ? [100, 200]
          : [120, 150, 160, 180, 200],
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
    const trip = (): [number, number] => {
      let hours = randomInt(2, difficulty === 'easy' ? 3 : 4);
      let speed = difficulty === 'easy' ? randomInt(3, 6) * 10 : randomInt(6, 18) * 5;
      while (speed * hours > 200) {
        hours = randomInt(2, 4);
        speed = randomInt(6, 18) * 5;
      }
      return [hours, speed];
    };
    const [hours, speed] = trip();
    const distance = speed * hours;

    if (difficulty === 'hard') {
      // Two vehicles with different ratios, so the faster one is well defined
      let [hours2, speed2] = trip();
      while (speed2 === speed) [hours2, speed2] = trip();
      const best = Math.max(speed, speed2);

      return {
        id,
        topicId: 'ratios',
        subtopic: '걸린 시간에 대한 거리의 비율 (속력)',
        difficulty,
        context: '누가 더 빠를까',
        question: `자동차는 ${hours}시간 동안 ${distance}km를, 버스는 ${hours2}시간 동안 ${speed2 * hours2}km를 달렸습니다. 둘 중 더 빠른 것은 1시간 동안 몇 km를 달린 셈인가요?`,
        hint: `걸린 시간에 대한 달린 거리의 비율(거리 ÷ 시간)이 클수록 빨라요. 자동차와 버스의 비율을 각각 구해 비교해요.`,
        answerType: 'number',
        correctAnswer: best,
        explanations: [
          { title: '1단계: 자동차의 비율 구하기', content: `${distance} ÷ ${hours} = ${speed}` },
          {
            title: '2단계: 버스의 비율 구하기',
            content: `${speed2 * hours2} ÷ ${hours2} = ${speed2}`,
          },
          {
            title: '3단계: 비교하기',
            content: `${best} > ${Math.min(speed, speed2)}이므로 ${speed > speed2 ? '자동차' : '버스'}가 더 빠르고, 1시간 동안 ${best}km를 달린 셈입니다.`,
          },
        ],
      };
    }

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
        ? pickOne([10, 100])
        : difficulty === 'medium'
          ? pickOne([20, 25, 40, 50])
          : pickOne([30, 60, 80, 120]);
    // Only parts that give a whole-number percent, e.g. multiples of 3 out of 30
    const step = total / gcd(total, 100);
    const part =
      difficulty === 'easy'
        ? randomInt(1, 9) * (total / 10)
        : randomInt(1, total / step - 1) * step;
    const percent = (part * 100) / total;
    const g = gcd(part, total);
    // 52/80 = 13/20 = 65/100; a denominator that divides 100 goes straight to hundredths
    const chain =
      100 % total === 0
        ? [`${part}/${total}`, `${percent}/100`]
        : [`${part}/${total}`, `${part / g}/${total / g}`, `${percent}/100`];

    return {
      id,
      topicId: 'ratios',
      subtopic: '백분율 (%)',
      difficulty,
      question: pickOne([
        `전체 ${total}명 중 안경을 쓴 학생이 ${part}명입니다. 안경을 쓴 학생의 비율을 백분율로 나타내면 몇 %인가요?`,
        `반장 선거에서 전체 ${total}표 중 ${KID_CALL}가 ${part}표를 얻었습니다. ${KID_CALL}의 득표율은 몇 %인가요?`,
        `${KID_CALL}가 농구 자유투를 ${total}번 던져 ${part}번 성공했습니다. 자유투 성공률은 몇 %인가요?`,
      ]),
      hint: `백분율은 기준량을 100으로 할 때의 비율이에요. 비율에 100을 곱하거나 분모를 100으로 만들어 보세요.`,
      answerType: 'number',
      correctAnswer: percent,
      explanations: [
        {
          title: '1단계: 비율 구하기',
          content: `기준량은 ${total}, 비교하는 양은 ${part}이므로 비율은 ${part}/${total}입니다.`,
        },
        {
          title: '2단계: 백분율로 나타내기',
          content:
            total === 100
              ? `분모가 이미 100이므로 ${part}/100 = ${percent}%입니다.`
              : `${chain.join(' = ')}이므로 백분율은 ${percent}%입니다.`,
        },
      ],
    };
  }

  if (type === 'proportion_equation') {
    // a : b = c : x with c = a × m and x = b × m
    const a =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(2, 6)
          : randomInt(5, 12);
    const [bMin, bMax] =
      difficulty === 'easy' ? [2, 6] : difficulty === 'medium' ? [3, 8] : [6, 15];
    // An n : n ratio makes the blank trivially equal to c
    let b = randomInt(bMin, bMax);
    while (b === a) b = randomInt(bMin, bMax);
    const multiplier =
      difficulty === 'easy'
        ? randomInt(2, 4)
        : difficulty === 'medium'
          ? randomInt(2, 6)
          : randomInt(4, 9);
    const c = a * multiplier;
    const x = b * multiplier;
    const terms = [a, b, c, x];
    // Easy always blanks the last term; harder levels move the blank around
    const blank =
      difficulty === 'easy' ? 3 : difficulty === 'medium' ? pickOne([2, 3]) : randomInt(0, 3);
    const shown = terms.map((t, i) => (i === blank ? '□' : `${t}`));
    const answer = terms[blank];
    // The blank's partner in its pair (외항 or 내항) and the other pair, whose product is known
    const partner = terms[3 - blank];
    const [p, q] = blank % 3 === 0 ? [b, c] : [a, x];
    // Which term of the other ratio sits in the same place, and which term grew m times
    const [from, to] = blank % 2 === 0 ? [b, x] : [a, c];
    const same = blank < 2 ? terms[blank + 2] : terms[blank - 2];
    const scaling =
      blank >= 2
        ? `${josa(from, '이')} ${multiplier}배 되어 ${josa(to, '이')} 되었으므로 ${same}도 똑같이 ${multiplier}배 되어야 합니다: ${same} × ${multiplier} = ${answer}`
        : `${josa(from, '이')} ${multiplier}배 되어 ${josa(to, '이')} 되었으므로 □도 ${multiplier}배 되어 ${josa(same, '이')} 되어야 합니다: ${same} ÷ ${multiplier} = ${answer}`;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례식의 성질',
      difficulty,
      question: `다음 비례식에서 □에 알맞은 수를 구하세요: ${shown[0]} : ${shown[1]} = ${shown[2]} : ${shown[3]}`,
      hint: `비례식에서는 '외항의 곱 = 내항의 곱'이 성립해요! 또는 두 비에서 같은 자리의 항끼리 몇 배인지 살펴보세요.`,
      answerType: 'number',
      correctAnswer: answer,
      explanations: [
        {
          title: '방법 1: 전항과 후항의 배수 관계',
          content: scaling,
        },
        {
          title: '방법 2: 외항의 곱 = 내항의 곱',
          content: `${partner} × □ = ${p} × ${q} = ${p * q}이므로 □ = ${p * q} ÷ ${partner} = ${answer}`,
        },
      ],
    };
  }

  if (type === 'unit_price') {
    const unitPrice = randomInt(2, difficulty === 'easy' ? 8 : 15) * 100;
    const unitCount = randomInt(2, difficulty === 'hard' ? 6 : 5);
    const totalPrice = unitPrice * unitCount;

    if (difficulty !== 'easy') {
      // The price of another number of pencils at the same rate
      let want = randomInt(2, 6);
      while (want === unitCount) want = randomInt(2, 6);

      return {
        id,
        topicId: 'ratios',
        subtopic: '비례 관계와 가격',
        difficulty,
        context: '문구점에서 연필 사기',
        question: `${KID_CALL}가 문구점에서 연필 ${unitCount}자루를 ${totalPrice}원에 샀습니다. 같은 연필 ${want}자루를 사려면 얼마가 필요한가요?`,
        hint: `연필 1자루의 값을 먼저 구하거나, ${unitCount} : ${totalPrice} = ${want} : □ 비례식을 세워 보세요.`,
        answerType: 'number',
        correctAnswer: unitPrice * want,
        explanations: [
          {
            title: '1단계: 한 자루의 값 구하기',
            content: `${totalPrice} ÷ ${unitCount} = ${unitPrice}원`,
          },
          {
            title: `2단계: ${want}자루의 값 구하기`,
            content: `${unitPrice} × ${want} = ${unitPrice * want}원`,
          },
        ],
      };
    }

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

  if (type === 'times_compare') {
    // The textbook compares two amounts by subtraction and by division before introducing 비
    const [big, small, unit, unitSubject] = pickOne([
      ['사과', '귤', '개', '개가'],
      ['남학생', '여학생', '명', '명이'],
      ['닭', '오리', '마리', '마리가'],
      ['빨간 구슬', '파란 구슬', '개', '개가'],
    ]);

    if (difficulty === 'hard') {
      // The smaller amount divided by the larger one is a fraction, e.g. 4 ÷ 12 = 1/3배
      const q = randomInt(2, 6);
      const p = randomNumerator(q);
      const m = randomInt(2, 6);

      return {
        id,
        topicId: 'ratios',
        subtopic: '두 수 비교하기 (몇 배)',
        difficulty,
        question: `${big} ${q * m}${unit}, ${small} ${p * m}${unitSubject} 있습니다. ${small} 수는 ${big} 수의 몇 배인지 기약분수로 나타내세요.`,
        hint: `${small} 수를 ${big} 수로 나누어 보세요. 나눗셈의 몫은 분수로 나타낼 수 있어요.`,
        answerType: 'fraction',
        correctAnswer: { num: p, den: q },
        explanations: [
          {
            title: '1단계: 나눗셈으로 비교하기',
            content: `${small} 수를 ${big} 수로 나누면 ${p * m} ÷ ${q * m} = ${p * m}/${q * m}입니다.`,
          },
          {
            title: '2단계: 약분하기',
            content: `분자와 분모를 최대공약수 ${josa(m, '으로')} 나누면 ${p * m}/${q * m} = ${p}/${q}이므로 ${small} 수는 ${big} 수의 ${p}/${q}배입니다.`,
          },
        ],
      };
    }

    const b = difficulty === 'easy' ? randomInt(2, 5) : randomInt(3, 9);
    const k = difficulty === 'easy' ? randomInt(2, 5) : randomInt(3, 9);
    const a = b * k;

    return {
      id,
      topicId: 'ratios',
      subtopic: '두 수 비교하기 (몇 배)',
      difficulty,
      question: `${big} ${a}${unit}, ${small} ${b}${unitSubject} 있습니다. ${big} 수는 ${small} 수의 몇 배인가요?`,
      hint: `몇 배인지는 나눗셈으로 비교해요. (${big} 수) ÷ (${small} 수)를 계산해 보세요.`,
      answerType: 'number',
      correctAnswer: k,
      explanations: [
        {
          title: '1단계: 뺄셈으로 비교하기',
          content: `${a} - ${b} = ${a - b}이므로 ${big} 수가 ${small} 수보다 ${a - b}${unit} 더 많습니다.`,
        },
        {
          title: '2단계: 나눗셈으로 비교하기',
          content: `${a} ÷ ${b} = ${k}이므로 ${big} 수는 ${small} 수의 ${k}배입니다.`,
        },
      ],
    };
  }

  if (type === 'compared_amount') {
    if (difficulty === 'hard') {
      // The base is asked: a ratio of 0.3 = 3/10 makes the compared amount 3 of the base's 10 equal parts
      const d = randomInt(2, 9);
      const m = randomInt(2, 9);
      const rate = d / 10;
      const compared = d * m;
      const base = 10 * m;

      return {
        id,
        topicId: 'ratios',
        subtopic: '기준량 구하기',
        difficulty,
        question: `비교하는 양이 ${compared}이고 비율이 ${rate}일 때 기준량은 얼마인가요?`,
        hint: `비율 ${josa(rate, '은')} ${d}/10이에요. 기준량을 10묶음으로 나누면 그중 ${d}묶음이 비교하는 양이에요.`,
        answerType: 'number',
        correctAnswer: base,
        explanations: [
          {
            title: '1단계: 비율을 분수로 나타내기',
            content: `비율 ${josa(rate, '은')} ${d}/10이므로 기준량을 10묶음으로 똑같이 나눈 것 중 ${d}묶음이 비교하는 양 ${compared}입니다.`,
          },
          {
            title: '2단계: 1묶음의 크기 구하기',
            content: `${compared} ÷ ${d} = ${m}`,
          },
          {
            title: '3단계: 기준량 구하기',
            content: `기준량은 10묶음이므로 ${m} × 10 = ${base}입니다. (확인: ${base} × ${rate} = ${compared})`,
          },
        ],
      };
    }

    // Easy gives the ratio as a decimal, medium as a fraction; both make a whole-number answer
    const den = difficulty === 'easy' ? 10 : randomInt(2, 9);
    const num = difficulty === 'easy' ? randomInt(1, 9) : randomNumerator(den);
    const base = den * randomInt(difficulty === 'easy' ? 1 : 2, difficulty === 'easy' ? 5 : 9);
    const compared = (base / den) * num;
    const rate = difficulty === 'easy' ? `${num / 10}` : `${num}/${den}`;
    const story = difficulty === 'medium' && Math.random() < 0.5;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비교하는 양 구하기',
      difficulty,
      question: story
        ? `${KID_CALL}네 학년 학생 ${base}명 중 안경을 쓴 학생의 비율은 ${rate}입니다. 안경을 쓴 학생은 몇 명인가요?`
        : `기준량이 ${base}이고 비율이 ${rate}일 때 비교하는 양은 얼마인가요?`,
      hint: `비율은 (비교하는 양) ÷ (기준량)이므로 (비교하는 양) = (기준량) × (비율)이에요.`,
      answerType: 'number',
      correctAnswer: compared,
      explanations: [
        {
          title: '1단계: 비교하는 양을 구하는 식',
          content: story
            ? `전체 학생 수 ${base}명이 기준량이므로 (안경을 쓴 학생 수) = ${base} × ${rate}입니다.`
            : `(비교하는 양) = (기준량) × (비율) = ${base} × ${rate}입니다.`,
        },
        {
          title: '2단계: 계산하기',
          content: `${difficulty === 'easy' ? `${rate} = ${num}/10이므로 ` : ''}${base} × ${rate} = ${base} ÷ ${den}${num === 1 ? '' : ` × ${num} = ${base / den} × ${num}`} = ${compared}`,
        },
      ],
    };
  }

  if (type === 'population_density') {
    // Population stays within 200: easy uses tens, others multiples of 5
    const town = (): [number, number] => {
      let area = randomInt(2, difficulty === 'easy' ? 4 : 6);
      let density = difficulty === 'easy' ? randomInt(1, 5) * 10 : randomInt(2, 10) * 5;
      while (area * density > 200) {
        area = randomInt(2, 6);
        density = randomInt(2, 10) * 5;
      }
      return [area, density];
    };
    const [area, density] = town();
    const people = area * density;

    if (difficulty === 'hard') {
      // Two towns with different ratios, so the more crowded one is well defined
      let [area2, density2] = town();
      while (density2 === density) [area2, density2] = town();
      const best = Math.max(density, density2);

      return {
        id,
        topicId: 'ratios',
        subtopic: '넓이에 대한 인구의 비율 (인구 밀도)',
        difficulty,
        context: '어느 마을이 더 붐빌까',
        question: `넓이가 ${area}km²인 푸른 마을에는 ${people}명이 살고, 넓이가 ${area2}km²인 햇살 마을에는 ${area2 * density2}명이 삽니다. 인구가 더 밀집한 마을은 1km²에 몇 명이 사는 셈인가요?`,
        hint: `넓이에 대한 인구의 비율(인구 ÷ 넓이)이 클수록 인구가 더 밀집해요. 두 마을의 비율을 각각 구해 비교해요.`,
        answerType: 'number',
        correctAnswer: best,
        explanations: [
          { title: '1단계: 푸른 마을의 비율 구하기', content: `${people} ÷ ${area} = ${density}` },
          {
            title: '2단계: 햇살 마을의 비율 구하기',
            content: `${area2 * density2} ÷ ${area2} = ${density2}`,
          },
          {
            title: '3단계: 비교하기',
            content: `${best} > ${Math.min(density, density2)}이므로 ${density > density2 ? '푸른' : '햇살'} 마을이 더 밀집하고, 1km²에 ${best}명이 사는 셈입니다.`,
          },
        ],
      };
    }

    return {
      id,
      topicId: 'ratios',
      subtopic: '넓이에 대한 인구의 비율 (인구 밀도)',
      difficulty,
      context: '마을 인구',
      question: `넓이가 ${area}km²인 마을에 ${people}명이 살고 있습니다. 넓이에 대한 인구의 비율은 얼마인가요? (1km²에 사는 인구)`,
      hint: `넓이가 기준량, 인구가 비교하는 양이에요. 인구 ÷ 넓이를 계산해요.`,
      answerType: 'number',
      correctAnswer: density,
      explanations: [
        {
          title: '1단계: 기준량과 비교하는 양',
          content: `기준량은 넓이 ${area}km², 비교하는 양은 인구 ${people}명입니다.`,
        },
        {
          title: '2단계: 비율 구하기',
          content: `${people} ÷ ${area} = ${density}, 1km²에 ${density}명이 사는 셈입니다.`,
        },
      ],
    };
  }

  if (type === 'distribution_total') {
    // 비례배분 in reverse: one share (hard: sometimes the gap between shares) is given, the whole is asked
    const maxRatio = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 6;
    let r1 = randomInt(1, maxRatio);
    let r2 = randomInt(2, maxRatio);
    while (r1 === r2 || gcd(r1, r2) !== 1) {
      r1 = randomInt(1, maxRatio);
      r2 = randomInt(2, maxRatio);
    }
    const unit =
      difficulty === 'easy'
        ? randomInt(2, 6)
        : difficulty === 'medium'
          ? randomInt(3, 8)
          : randomInt(4, 10);
    const total = (r1 + r2) * unit;
    const friend = pickOne(['민수', '지우', '태호', '서연이']);
    const gap = difficulty === 'hard' && Math.random() < 0.4;
    const [hi, lo] = [Math.max(r1, r2), Math.min(r1, r2)];
    const [name, bundles] = Math.random() < 0.5 ? [KID_CALL, r1] : [friend, r2];
    const given = (gap ? hi - lo : bundles) * unit;
    const setup = `${KID_CALL}와 ${friend}가 스티커를 ${r1} : ${r2}의 비로 나누어 가졌더니`;
    // 1 bundle needs no division
    const perBundle = (n: number) => (n === 1 ? `${unit}장` : `${given} ÷ ${n} = ${unit}장`);

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례배분으로 전체 구하기',
      difficulty,
      context: '스티커 나누기',
      question: gap
        ? `${setup} ${r1 > r2 ? KID_CALL : friend}가 ${r1 > r2 ? friend : KID_CALL}보다 ${given}장 더 많이 가졌습니다. 처음에 있던 스티커는 모두 몇 장일까요?`
        : `${setup} ${name}가 ${given}장을 가졌습니다. 처음에 있던 스티커는 모두 몇 장일까요?`,
      hint: gap
        ? `두 사람의 몫은 (${hi} - ${lo} = ${hi - lo})묶음만큼 차이가 나요. 1묶음이 몇 장인지 먼저 구해 보세요!`
        : `${name}의 몫은 전체 (${r1} + ${r2} = ${r1 + r2})묶음 중 ${bundles}묶음이에요. 1묶음이 몇 장인지 먼저 구해 보세요!`,
      answerType: 'number',
      correctAnswer: total,
      explanations: [
        {
          title: '1단계: 비의 합 구하기',
          content: `비의 합은 ${r1} + ${r2} = ${r1 + r2}이므로 전체는 ${r1 + r2}묶음이에요.`,
        },
        {
          title: '2단계: 1묶음의 크기 구하기',
          content: gap
            ? `두 사람의 몫의 차는 ${hi} - ${lo} = ${hi - lo}묶음이고 이것이 ${given}장이므로 1묶음은 ${perBundle(hi - lo)}이에요.`
            : `${name}의 몫 ${bundles}묶음이 ${given}장이므로 1묶음은 ${perBundle(bundles)}이에요.`,
        },
        {
          title: '3단계: 전체 구하기',
          content: `전체는 ${r1 + r2}묶음이므로 ${unit} × ${r1 + r2} = ${total}장이에요.`,
        },
      ],
    };
  }

  // Proportional distribution
  const maxRatio = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 6;
  // Distinct terms already in simplest form, so no 3 : 3 or 4 : 6
  let r1 = randomInt(1, maxRatio);
  let r2 = randomInt(2, maxRatio);
  while (r1 === r2 || gcd(r1, r2) !== 1) {
    r1 = randomInt(1, maxRatio);
    r2 = randomInt(2, maxRatio);
  }
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
  const targetRatio = isFirst ? r1 : r2;
  const targetAns = targetRatio * unit;
  // Hard sometimes asks how many more the larger share gets
  const gap = difficulty === 'hard' && Math.random() < 0.4;
  const gapRatio = Math.abs(r1 - r2);
  const setup = `스티커 ${total}장을 ${KID_CALL}와 ${friend}가 ${r1} : ${r2}의 비로 나누어 가지려고 합니다.`;

  return {
    id,
    topicId: 'ratios',
    subtopic: '비례배분',
    difficulty,
    context: '스티커 나누기',
    question: gap
      ? `${setup} 두 사람이 갖게 될 스티커 수의 차는 몇 장일까요?`
      : `${setup} ${targetName}가 갖게 될 스티커는 몇 장일까요?`,
    hint: gap
      ? `전체를 (${r1} + ${r2} = ${r1 + r2})묶음으로 똑같이 나눈 다음, 두 사람의 묶음 수의 차가 몇 장인지 구하면 돼요!`
      : `전체를 (${r1} + ${r2} = ${r1 + r2})묶음으로 똑같이 나눈 다음, 그중 ${targetRatio}묶음이 몇 장인지 구하면 돼요!`,
    answerType: 'number',
    correctAnswer: gap ? gapRatio * unit : targetAns,
    explanations: [
      {
        title: '1단계: 비의 합 구하기',
        content: `비의 합은 ${r1} + ${r2} = ${r1 + r2}이므로 전체를 ${r1 + r2}묶음으로 똑같이 나눠요.`,
      },
      {
        title: '2단계: 1묶음의 크기 구하기',
        content: `${total} ÷ ${r1 + r2} = ${unit}이므로 1묶음은 ${unit}장이에요.`,
      },
      {
        title: '3단계: 배분하기',
        content: gap
          ? `두 사람의 몫은 ${r1}묶음과 ${r2}묶음이므로 차는 ${gapRatio}묶음, ${unit} × ${gapRatio} = ${gapRatio * unit}장이에요.`
          : `${targetName}의 몫은 전체 ${r1 + r2}묶음 중 ${targetRatio}묶음이므로 ${total} × ${targetRatio}/${r1 + r2} = ${unit} × ${targetRatio} = ${targetAns}장이에요.`,
      },
    ],
  };
}
