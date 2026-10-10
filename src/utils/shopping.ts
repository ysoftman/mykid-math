import type { Difficulty, Problem, StepExplanation } from '../types/math';
import { gcd, josa, pickOne, randomInt, shuffle } from './mathHelpers';

export interface Goods {
  id: string; // also the image file name: src/assets/shop/<id>.webp
  name: string;
  emoji: string; // placeholder until the image exists
  price: number;
}

export interface Store {
  id: string;
  name: string;
  emoji: string;
  goods: Goods[];
}

const g = (id: string, name: string, emoji: string, price: number): Goods => ({
  id,
  name,
  emoji,
  price,
});

// Prices are multiples of 100 with many divisors so most items can take a fraction discount.
export const STORES: Store[] = [
  {
    id: 'store-mart',
    name: '동네 마트',
    emoji: '🛒',
    goods: [
      g('apple', '사과', '🍎', 1200),
      g('banana', '바나나', '🍌', 3000),
      g('strawberry', '딸기', '🍓', 8000),
      g('watermelon', '수박', '🍉', 16000),
      g('grapes', '포도', '🍇', 6000),
      g('milk', '우유', '🥛', 2400),
      g('eggs', '달걀 한 판', '🥚', 7200),
      g('carrot', '당근', '🥕', 1500),
      g('corn', '옥수수', '🌽', 2000),
      g('cheese', '치즈', '🧀', 4800),
      g('fish', '고등어', '🐟', 9000),
      g('ramen', '라면 묶음', '🍜', 4000),
    ],
  },
  {
    id: 'store-bakery',
    name: '빵집',
    emoji: '🥐',
    goods: [
      g('bread', '식빵', '🍞', 3600),
      g('croissant', '크루아상', '🥐', 2000),
      g('cake', '케이크', '🎂', 24000),
      g('donut', '도넛', '🍩', 1500),
      g('cookie', '쿠키', '🍪', 1200),
      g('icecream', '아이스크림', '🍦', 1000),
      g('juice', '주스', '🧃', 1800),
      g('chocolate', '초콜릿', '🍫', 2000),
      g('candy', '사탕', '🍬', 500),
      g('pretzel', '프레첼', '🥨', 2400),
      g('pie', '사과파이', '🥧', 4000),
    ],
  },
  {
    id: 'store-stationery',
    name: '문구점',
    emoji: '✏️',
    goods: [
      g('pencil', '연필', '✏️', 600),
      g('notebook', '공책', '📒', 1200),
      g('crayon', '크레파스', '🖍️', 6000),
      g('scissors', '가위', '✂️', 2400),
      g('ruler', '자', '📏', 1000),
      g('pen', '볼펜', '🖊️', 800),
      g('sketchbook', '스케치북', '🎨', 3000),
      g('storybook', '동화책', '📚', 12000),
      g('backpack', '책가방', '🎒', 40000),
      g('globe', '지구본', '🌏', 20000),
    ],
  },
  {
    id: 'store-toy',
    name: '장난감 가게',
    emoji: '🧸',
    goods: [
      g('teddy', '곰 인형', '🧸', 18000),
      g('soccer-ball', '축구공', '⚽', 20000),
      g('robot', '로봇', '🤖', 32000),
      g('blocks', '블록 세트', '🧱', 24000),
      g('kite', '연', '🪁', 8000),
      g('yoyo', '요요', '🪀', 4000),
      g('puzzle', '퍼즐', '🧩', 12000),
      g('toy-car', '장난감 자동차', '🚗', 10000),
      g('cards', '카드 게임', '🃏', 6000),
      g('balloon', '풍선', '🎈', 1000),
    ],
  },
  {
    id: 'store-clothes',
    name: '옷 가게',
    emoji: '👕',
    goods: [
      g('tshirt', '티셔츠', '👕', 12000),
      g('jeans', '청바지', '👖', 30000),
      g('cap', '모자', '🧢', 10000),
      g('socks', '양말', '🧦', 2000),
      g('sneakers', '운동화', '👟', 40000),
      g('umbrella', '우산', '☂️', 8000),
      g('gloves', '장갑', '🧤', 6000),
      g('scarf', '목도리', '🧣', 15000),
      g('dress', '원피스', '👗', 36000),
    ],
  },
];

export const BILL_NAMES: Record<number, string> = { 5000: '5천원', 10000: '1만원', 50000: '5만원' };
const PAY_OPTIONS = [5000, 10000, 20000, 30000, 50000];

type Frac = [num: number, den: number];

const LEVELS: Record<
  Difficulty,
  { items: Frac; sales: Frac; maxQty: number; fracs: Frac[]; limit: number; percent: boolean }
> = {
  easy: {
    items: [1, 2],
    sales: [1, 1],
    maxQty: 1,
    fracs: [
      [1, 2],
      [1, 4],
      [1, 10],
    ],
    limit: 10000,
    percent: false,
  },
  medium: {
    items: [2, 3],
    sales: [1, 2],
    maxQty: 2,
    fracs: [
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 10],
    ],
    limit: 30000,
    percent: false,
  },
  hard: {
    items: [3, 4],
    sales: [1, 3],
    maxQty: 3,
    fracs: [
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [1, 10],
      [3, 10],
    ],
    limit: 50000,
    percent: true,
  },
};

export interface Discount {
  num: number;
  den: number;
  percent: boolean; // shown as "25%" instead of "1/4"
}

export interface CartLine {
  goods: Goods;
  qty: number;
  discount?: Discount;
}

export type RoundType = 'pay' | 'change' | 'rate';

export interface ShoppingRound {
  type: RoundType;
  store: Store;
  lines: CartLine[];
  paid: number; // money handed over, change rounds only
  problem: Problem;
}

export const ROUND_TYPES: RoundType[] = ['pay', 'pay', 'change', 'rate', 'pay', 'change'];

const num = (n: number) => n.toLocaleString('ko-KR');
export const won = (n: number) => `${num(n)}원`;
const fracText = (d: Discount) => `${d.num}/${d.den}`;
export const discountLabel = (d: Discount) =>
  d.percent ? `${(100 * d.num) / d.den}%` : fracText(d);
const discountAmount = (price: number, d: Discount) => (price / d.den) * d.num;
export const salePrice = (price: number, d?: Discount) =>
  d ? price - discountAmount(price, d) : price;
export const lineTotal = (l: CartLine) => salePrice(l.goods.price, l.discount) * l.qty;

// Paid with one kind of bill: 20000 -> 1만원 × 2장
export function billsFor(paid: number): { value: number; count: number } {
  const value = paid >= 50000 ? 50000 : paid >= 10000 ? 10000 : 5000;
  return { value, count: paid / value };
}

// Discount must leave a multiple of 100 so it stays mental-math friendly.
function pickDiscount(price: number, difficulty: Difficulty): Discount | undefined {
  const level = LEVELS[difficulty];
  const valid = level.fracs.filter(([, den]) => (price / 100) % den === 0);
  if (valid.length === 0) return undefined;
  const [n, d] = pickOne(valid);
  return { num: n, den: d, percent: level.percent && 100 % d === 0 && Math.random() < 0.5 };
}

function makeCart(difficulty: Difficulty): { store: Store; lines: CartLine[]; total: number } {
  const level = LEVELS[difficulty];
  for (;;) {
    const store = pickOne(STORES);
    const lines: CartLine[] = shuffle(store.goods)
      .slice(0, randomInt(...level.items))
      .map((goods) => ({ goods, qty: goods.price <= 3000 ? randomInt(1, level.maxQty) : 1 }));
    let sales = randomInt(...level.sales);
    for (const line of lines) {
      if (sales === 0) break;
      line.discount = pickDiscount(line.goods.price, difficulty);
      if (line.discount) sales -= 1;
    }
    const total = lines.reduce((sum, l) => sum + lineTotal(l), 0);
    if (lines.some((l) => l.discount) && total < level.limit) return { store, lines, total };
  }
}

function discountSteps(lines: CartLine[]): string {
  return lines
    .flatMap(({ goods, discount: d }) => {
      if (!d) return [];
      const off = discountAmount(goods.price, d);
      const pct = d.percent
        ? `(${discountLabel(d)} = ${(100 * d.num) / d.den}/100 = ${fracText(d)}) `
        : '';
      const calc =
        d.num === 1
          ? `${num(goods.price)} ÷ ${d.den}`
          : `${num(goods.price)} ÷ ${d.den} × ${d.num}`;
      return `${goods.name}: ${pct}할인 금액 = ${won(goods.price)}의 ${fracText(d)} = ${calc} = ${won(off)}\n→ 내는 돈 ${num(goods.price)} − ${num(off)} = ${won(goods.price - off)}`;
    })
    .join('\n');
}

function cartSteps(lines: CartLine[], total: number): StepExplanation[] {
  const steps = [{ title: '할인 가격 구하기', content: discountSteps(lines) }];
  const multi = lines.filter((l) => l.qty > 1);
  if (multi.length > 0) {
    steps.push({
      title: '개수만큼 곱하기',
      content: multi
        .map(
          (l) =>
            `${l.goods.name}: ${won(salePrice(l.goods.price, l.discount))} × ${l.qty}개 = ${won(lineTotal(l))}`,
        )
        .join('\n'),
    });
  }
  steps.push({
    title: '모두 더하기',
    content:
      lines.length > 1
        ? `${lines.map((l) => num(lineTotal(l))).join(' + ')} = ${won(total)}`
        : `내야 할 돈은 ${won(total)}이에요.`,
  });
  return steps;
}

const numbered = (steps: StepExplanation[]) =>
  steps.map((s, i) => ({ ...s, title: `${i + 1}단계: ${s.title}` }));

export function makeShoppingRound(type: RoundType, difficulty: Difficulty): ShoppingRound {
  const id = `shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const base = { id, topicId: 'fractions' as const, subtopic: '장보기', difficulty };

  if (type === 'rate') {
    for (;;) {
      const store = pickOne(STORES);
      const goods = pickOne(store.goods);
      const d = pickDiscount(goods.price, difficulty);
      if (!d) continue;
      d.percent = false;
      const off = discountAmount(goods.price, d);
      const sale = goods.price - off;
      const hundreds = `${off / 100}/${goods.price / 100}`;
      const reduced = gcd(off / 100, goods.price / 100) > 1 ? ` = ${fracText(d)}` : '';
      return {
        type,
        store,
        lines: [{ goods, qty: 1, discount: d }],
        paid: 0,
        problem: {
          ...base,
          question: `정가 ${won(goods.price)}짜리 ${goods.name}, ${won(sale)}에 샀어요! 정가의 몇 분의 몇만큼 할인받았을까요?`,
          hint: '할인받은 금액이 정가의 몇 분의 몇인지 분수로 나타내 보세요.',
          answerType: 'fraction',
          correctAnswer: { num: d.num, den: d.den },
          explanations: numbered([
            {
              title: '할인 금액 구하기',
              content: `${num(goods.price)} − ${num(sale)} = ${won(off)} 할인받았어요.`,
            },
            {
              title: '정가와 비교하기',
              content: `할인 금액 ÷ 정가 = ${off}/${goods.price} = ${hundreds}${reduced}`,
            },
            {
              title: '확인하기',
              content: `${won(goods.price)}의 ${josa(fracText(d), '은')} ${won(off)}이니까 맞아요!`,
            },
          ]),
        },
      };
    }
  }

  const { store, lines, total } = makeCart(difficulty);
  if (type === 'pay') {
    return {
      type,
      store,
      lines,
      paid: 0,
      problem: {
        ...base,
        question: '장바구니 물건을 모두 사려면 얼마를 내야 할까요?',
        hint: '할인하는 물건은 정가에서 할인 금액(정가 ÷ 분모 × 분자)을 빼요.',
        answerType: 'number',
        correctAnswer: total,
        explanations: numbered(cartSteps(lines, total)),
      },
    };
  }

  const options = PAY_OPTIONS.filter((p) => p > total);
  const paid = difficulty === 'easy' ? options[0] : pickOne(options.slice(0, 2));
  return {
    type,
    store,
    lines,
    paid,
    problem: {
      ...base,
      question: `${won(paid)}을 냈어요. 거스름돈은 얼마일까요?`,
      hint: '먼저 내야 할 돈을 구한 뒤, 낸 돈에서 빼요.',
      answerType: 'number',
      correctAnswer: paid - total,
      explanations: numbered([
        ...cartSteps(lines, total),
        {
          title: '거스름돈 구하기',
          content: `${num(paid)} − ${num(total)} = ${won(paid - total)}`,
        },
      ]),
    },
  };
}

export const makeShoppingRounds = (difficulty: Difficulty) =>
  ROUND_TYPES.map((type) => makeShoppingRound(type, difficulty));
