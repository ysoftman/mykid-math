import type React from 'react';
import { useState } from 'react';
import type { Difficulty } from '../../types/math';
import { formatAnswer } from '../../utils/answer';
import { sound } from '../../utils/audio';
import confetti from '../../utils/confetti';
import { GAME_ASSETS } from '../../utils/gameAssets';
import {
  BILL_NAMES,
  billsFor,
  type CartLine,
  discountLabel,
  makeShoppingRounds,
  type ShoppingRound,
  salePrice,
  won,
} from '../../utils/shopping';
import { type RewardResult, recordShopping, SHOPPING_STARS } from '../../utils/storage';
import { GameIcon } from '../GameIcon';
import { MathText } from '../MathText';
import { GameProblem } from './GameProblem';

// Every shopping picture is an emoji until src/assets/shop/<id>.webp exists; dropping the file in replaces it.
const IMAGES = import.meta.glob<string>('../../assets/shop/*.webp', {
  eager: true,
  import: 'default',
});
const shopImageUrl = (id: string): string | undefined => IMAGES[`../../assets/shop/${id}.webp`];

export const SHOPPING_GAME_IMAGE = shopImageUrl('game-shopping') ?? GAME_ASSETS.coinChest;

const ShopImage: React.FC<{ id: string; emoji: string; className: string }> = ({
  id,
  emoji,
  className,
}) => {
  const src = shopImageUrl(id);
  return src ? (
    <img
      src={src}
      alt=""
      className={`inline-block object-contain ${className}`}
      draggable={false}
    />
  ) : (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center leading-none ${className}`}
    >
      {emoji}
    </span>
  );
};

const LEVELS: { id: Difficulty; label: string; desc: string }[] = [
  { id: 'easy', label: '하', desc: '물건 1~2개 · 1만원 안쪽' },
  { id: 'medium', label: '중', desc: '물건 2~3개 · 할인 여러 개' },
  { id: 'hard', label: '상', desc: '물건 3~4개 · % 할인도' },
];

const CartCard: React.FC<{ line: CartLine; hideRate: boolean }> = ({ line, hideRate }) => {
  const { goods, qty, discount } = line;
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm">
      {discount && (
        <span className="absolute -top-2 -right-2 rounded-full bg-rose-500 px-2 py-1 text-xs font-black text-white shadow">
          {hideRate ? '할인 ?' : <MathText text={`${discountLabel(discount)} 할인`} />}
        </span>
      )}
      <ShopImage id={goods.id} emoji={goods.emoji} className="h-14 w-14 text-5xl" />
      <div className="mt-1 font-bold text-slate-800">{goods.name}</div>
      <div
        className={
          discount ? 'text-sm text-slate-400 line-through' : 'text-sm font-bold text-slate-700'
        }
      >
        {won(goods.price)}
      </div>
      {hideRate && (
        <div className="text-sm font-black text-rose-600">
          {won(salePrice(goods.price, discount))}에 샀어요
        </div>
      )}
      {qty > 1 && (
        <div className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-black text-indigo-700">
          × {qty}개
        </div>
      )}
    </div>
  );
};

const Wallet: React.FC<{ paid: number }> = ({ paid }) => {
  const { value, count } = billsFor(paid);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 font-bold text-emerald-900">
      <span>👛 낸 돈</span>
      {Array.from({ length: count }, (_, i) => (
        <ShopImage key={i} id={`bill-${value}`} emoji="💵" className="h-10 w-16 text-4xl" />
      ))}
      <span>
        {BILL_NAMES[value]} × {count}장 = {won(paid)}
      </span>
    </div>
  );
};

const answerText = (round: ShoppingRound) =>
  round.type === 'rate' ? formatAnswer(round.problem) : won(Number(round.problem.correctAnswer));

type Phase = 'ready' | 'playing' | 'done';

export const ShoppingGame: React.FC<{ onReward: (r: RewardResult) => void }> = ({ onReward }) => {
  const [phase, setPhase] = useState<Phase>('ready');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [rounds, setRounds] = useState<ShoppingRound[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null); // null until the round is answered

  const start = () => {
    sound.playPop();
    setRounds(makeShoppingRounds(difficulty));
    setIndex(0);
    setCorrectCount(0);
    setAnswered(null);
    setPhase('playing');
  };

  const handleAnswered = (correct: boolean) => {
    if (correct) {
      sound.playCorrect();
      setCorrectCount((c) => c + 1);
    } else {
      sound.playWrong();
    }
    setAnswered(correct);
  };

  const next = () => {
    setAnswered(null);
    if (index + 1 < rounds.length) {
      sound.playPop();
      setIndex(index + 1);
      return;
    }
    setPhase('done');
    onReward(recordShopping(correctCount));
    if (correctCount === rounds.length) {
      sound.playFanfare();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  if (phase === 'ready') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-5">
        <img
          src={SHOPPING_GAME_IMAGE}
          alt=""
          className="mx-auto h-24 w-24 object-contain"
          draggable={false}
        />
        <h3 className="text-2xl font-black text-slate-800">알뜰 장보기</h3>
        <p className="text-sm text-slate-600">
          장바구니 물건값을 계산해요. 할인 딱지는 할인율만 알려 줘요!
          <br />
          맞힌 문제 하나마다 ⭐ {SHOPPING_STARS}개를 받아요.
        </p>
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-900">
          <MathText text="💡 1/4 할인은 가격을 4묶음으로 나눈 것 중 1묶음만큼 깎아 줘요. 25% 할인 = 25/100 = 1/4 할인!" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                sound.playPop();
                setDifficulty(l.id);
              }}
              aria-pressed={difficulty === l.id}
              className={`rounded-xl border px-2 py-2 text-sm font-bold transition-all ${
                difficulty === l.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="block text-lg font-black">{l.label}</span>
              <span className="block text-xs">{l.desc}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={start}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-sm active:scale-95 transition-all"
        >
          장보러 가기! 🛒
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <img
          src={SHOPPING_GAME_IMAGE}
          alt=""
          className="mx-auto h-28 w-28 object-contain"
          draggable={false}
        />
        <h3 className="text-2xl font-black text-slate-800">장보기 끝!</h3>
        {correctCount === rounds.length && (
          <div className="text-xl font-black text-rose-700">🎉 계산 척척 알뜰왕!</div>
        )}
        <p className="text-lg text-slate-700">
          {rounds.length}문제 중 <strong className="text-indigo-600">{correctCount}문제</strong>{' '}
          맞혔어요!
        </p>
        <p className="text-sm text-slate-600">받은 별: ⭐ {correctCount * SHOPPING_STARS}</p>
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setPhase('ready');
          }}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-xl shadow-sm active:scale-95 transition-all"
        >
          다시 장보기 🔄
        </button>
      </div>
    );
  }

  const round = rounds[index];
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
        <span className="text-slate-700">
          🧾 {index + 1} / {rounds.length}
        </span>
        <span className="text-indigo-600">
          <GameIcon name="iconCorrect" /> {correctCount}문제
        </span>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-4">
        <div className="flex items-center gap-2 text-lg font-black text-amber-900">
          <ShopImage id={round.store.id} emoji={round.store.emoji} className="h-9 w-9 text-3xl" />
          {round.store.name}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {round.lines.map((line) => (
            <CartCard key={line.goods.id} line={line} hideRate={round.type === 'rate'} />
          ))}
        </div>
      </div>

      {round.type === 'change' && <Wallet paid={round.paid} />}

      <GameProblem
        key={round.problem.id}
        problem={round.problem}
        onAnswered={handleAnswered}
        disabled={answered !== null}
      />

      {answered !== null && (
        <div
          className={`p-4 rounded-2xl space-y-3 border ${
            answered
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="font-extrabold">
            <MathText
              text={
                answered
                  ? `🎉 정답! ${answerText(round)}`
                  : `💡 아쉬워요! 정답은 ${answerText(round)}`
              }
            />
          </div>
          <ol className="space-y-2 text-sm text-slate-700">
            {round.problem.explanations.map((e) => (
              <li key={e.title}>
                <div className="font-bold">{e.title}</div>
                <div className="whitespace-pre-line leading-relaxed">
                  <MathText text={e.content} />
                </div>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={next}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all"
          >
            {index + 1 < rounds.length ? '다음 장보기 ➡️' : '결과 보기 🏁'}
          </button>
        </div>
      )}
    </div>
  );
};
