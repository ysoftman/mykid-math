import type { Difficulty, Problem } from '../../types/math';
import { gcd, pickOne, randomInt } from '../mathHelpers';

export function generateRatioProblem(difficulty: Difficulty): Problem {
  const type = pickOne([
    'percentage',
    'proportion_equation',
    'proportional_distribution',
    'unit_price',
    'discount',
    'ratio_as_fraction',
    'speed',
  ]);
  const id = `rat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  if (type === 'discount') {
    const price = (difficulty === 'easy' ? randomInt(2, 10) : randomInt(5, 50)) * 1000;
    const rate = pickOne(difficulty === 'easy' ? [10, 20, 50] : [10, 15, 20, 25, 30, 40]);
    const discount = (price * rate) / 100;
    const sale = price - discount;

    return {
      id,
      topicId: 'ratios',
      subtopic: '할인율',
      difficulty,
      context: '할인 쇼핑',
      question: `${price}원짜리 장난감을 ${rate}% 할인하여 팔고 있습니다. 할인된 가격은 얼마인가요?`,
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

  if (type === 'speed') {
    const hours = randomInt(2, difficulty === 'hard' ? 8 : 5);
    const speed = difficulty === 'easy' ? randomInt(3, 9) * 10 : randomInt(30, 120);
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
    const part = difficulty === 'easy' ? randomInt(1, 9) * 10 : randomInt(3, total - 2);
    const percent = Math.round((part / total) * 100);

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
          content: `${a}가 ${multiplier}배 되어 ${c}이 되었으므로, ${b}도 똑같이 ${multiplier}배 되어야 합니다: ${b} × ${multiplier} = ${x}`,
        },
        {
          title: '방법 2: 외항의 곱 = 내항의 곱',
          content: `${a} × □ = ${b} × ${c} (${b * c})  ➡️  □ = ${b * c} ÷ ${a} = ${x}`,
        },
      ],
    };
  }

  if (type === 'unit_price') {
    const unitPrice = difficulty === 'easy' ? randomInt(2, 8) * 100 : randomInt(5, 30) * 100;
    const unitCount = difficulty === 'hard' ? randomInt(4, 12) : randomInt(2, 8);
    const totalPrice = unitPrice * unitCount;

    return {
      id,
      topicId: 'ratios',
      subtopic: '비례 관계와 가격',
      difficulty,
      context: '문구점에서 연필 사기',
      question: `연필 ${unitCount}자루의 값이 ${totalPrice}원입니다. 연필 1자루의 값은 얼마인가요?`,
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

  // Proportional distribution
  const maxRatio = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 9;
  const r1 = randomInt(1, maxRatio);
  const r2 = randomInt(2, maxRatio);
  const unit =
    difficulty === 'easy'
      ? randomInt(2, 6)
      : difficulty === 'medium'
        ? randomInt(3, 10)
        : randomInt(8, 20);
  const total = (r1 + r2) * unit;
  const person = pickOne(['민수', '지우', '태호', '서연']);
  const isFirst = Math.random() > 0.5;
  const targetName = isFirst ? `${person}` : '친구';
  const targetAns = isFirst ? r1 * unit : r2 * unit;

  return {
    id,
    topicId: 'ratios',
    subtopic: '비례배분',
    difficulty,
    context: '스티커 나누기',
    question: `스티커 ${total}장을 ${person}와 친구가 ${r1} : ${r2}의 비로 나누어 가지려고 합니다. ${targetName}가 갖게 될 스티커는 몇 장일까요?`,
    hint: `전체를 총 (${r1} + ${r2} = ${r1 + r2})조각으로 나눈 다음, 그 중 ${isFirst ? r1 : r2}조각의 양을 구하면 돼요!`,
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
