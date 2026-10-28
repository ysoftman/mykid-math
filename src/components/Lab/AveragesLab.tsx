import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { GameIcon } from '../GameIcon';

const SUBJECTS = ['국어', '수학', '영어', '과학'];
const SECTIONS = 8;
// Bars use 85% of the chart height so the score label above a 100-point bar stays inside
const BAR_SCALE = 0.85;

const chanceWord = (red: number) =>
  red === 0
    ? '불가능하다'
    : red === SECTIONS
      ? '확실하다'
      : red === SECTIONS / 2
        ? '반반이다'
        : red < SECTIONS / 2
          ? '~아닐 것 같다'
          : '~일 것 같다';

// The textbook puts only 0, 1/2 and 1 into numbers; the chances between are placed on that line
const chanceNumber = (red: number) =>
  red === 0
    ? '0'
    : red === SECTIONS
      ? '1'
      : red === SECTIONS / 2
        ? '1/2'
        : red < SECTIONS / 2
          ? '0과 1/2 사이'
          : '1/2과 1 사이';

export const AveragesLab: React.FC = () => {
  const [scores, setScores] = useState([80, 90, 70, 100]);
  const [red, setRed] = useState(4);

  const sum = scores.reduce((a, b) => a + b, 0);
  const mean = sum / scores.length;
  const meanText = Number.isInteger(mean) ? String(mean) : mean.toFixed(1);
  const above = scores.filter((s) => s > mean).length;

  const changeScore = (index: number, delta: number) => {
    sound.playPop();
    setScores((prev) =>
      prev.map((s, i) => (i === index ? Math.min(100, Math.max(0, s + delta)) : s)),
    );
  };

  return (
    <section className="space-y-5 rounded-2xl border border-lime-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <img
            src={GAME_ASSETS.topicAverages}
            alt=""
            className="h-9 w-9 object-contain"
            draggable={false}
          />
          평균과 가능성 실험실
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          점수를 바꾸며 평균이 어떻게 움직이는지, 회전판을 칠하며 가능성이 어떻게 변하는지 봐요.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-lime-100 bg-lime-50 p-4">
          <GameIcon name="avMean" className="h-12 w-12 shrink-0" />
          <div>
            <h4 className="font-extrabold text-lime-950">평균 = 자료 값의 합 ÷ 자료의 수</h4>
            <p className="mt-1 text-sm leading-relaxed text-lime-900">
              자료를 모두 더한 뒤 자료의 수로 나누면 자료를 고르게 했을 때의 값, 평균이 돼요.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-4 sm:p-6">
          {/* A legend instead of a label on the line, which would sit on a bar or its score */}
          <p className="mb-2 flex items-center justify-end gap-2 text-xs font-bold text-amber-300">
            <span className="w-6 border-t-2 border-dashed border-amber-300" />
            평균 {meanText}
          </p>
          <div className="relative flex h-48 items-end justify-around gap-2">
            <div
              className="absolute inset-x-0 border-t-2 border-dashed border-amber-300"
              style={{ bottom: `${mean * BAR_SCALE}%` }}
            />
            {scores.map((score, index) => (
              <div key={SUBJECTS[index]} className="flex h-full w-16 flex-col justify-end">
                <span className="mb-1 text-center text-xs font-bold text-white">{score}</span>
                <div
                  className="w-full rounded-t-lg bg-lime-400 transition-all"
                  style={{ height: `${score * BAR_SCALE}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around gap-2">
            {scores.map((_, index) => (
              <div key={SUBJECTS[index]} className="flex w-16 flex-col items-center gap-1">
                <span className="text-xs font-bold text-slate-200">{SUBJECTS[index]}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`${SUBJECTS[index]} 10점 내리기`}
                    onClick={() => changeScore(index, -10)}
                    className="h-7 w-7 rounded-lg bg-slate-700 text-sm font-bold text-white hover:bg-slate-600"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    aria-label={`${SUBJECTS[index]} 10점 올리기`}
                    onClick={() => changeScore(index, 10)}
                    className="h-7 w-7 rounded-lg bg-lime-600 text-sm font-bold text-white hover:bg-lime-500"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-lg font-black text-lime-300">
            <span className="whitespace-nowrap">
              ({scores.join(' + ')}) ÷ {scores.length}
            </span>{' '}
            <span className="whitespace-nowrap">
              = {sum} ÷ {scores.length} = {meanText}
            </span>
          </p>
          <p className="mt-1 text-center text-sm text-slate-300">
            평균보다 점수가 높은 과목은 {above}과목이에요. 평균과 같은 점수는 평균보다 높지 않아요.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4">
          <GameIcon name="avSpinner" className="h-12 w-12 shrink-0" />
          <div>
            <h4 className="font-extrabold text-rose-950">가능성은 말과 수로 나타내요</h4>
            <p className="mt-1 text-sm leading-relaxed text-rose-900">
              불가능하다(0) → ~아닐 것 같다 → 반반이다(1/2) → ~일 것 같다 → 확실하다(1)
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-900 p-4 sm:flex-row sm:justify-around sm:p-6">
          <div className="relative">
            <div
              role="img"
              aria-label={`${SECTIONS}칸 중 ${red}칸이 빨간색인 회전판`}
              className="h-40 w-40 rounded-full border-4 border-white shadow-lg"
              style={{
                background: `conic-gradient(#f43f5e 0 ${(red / SECTIONS) * 100}%, #38bdf8 0)`,
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
          </div>
          <div className="w-full max-w-xs space-y-3 text-center">
            <label className="block text-sm font-bold text-slate-200">
              빨간 칸: {red}칸 / {SECTIONS}칸
              <input
                type="range"
                min="0"
                max={SECTIONS}
                value={red}
                onChange={(e) => {
                  sound.playPop();
                  setRed(Number(e.target.value));
                }}
                className="mt-2 w-full cursor-pointer accent-rose-500"
              />
            </label>
            <p className="text-sm text-slate-300">화살이 빨간색에 멈출 가능성은</p>
            <p className="text-2xl font-black text-rose-300">{chanceWord(red)}</p>
            <p className="text-lg font-bold text-amber-300">수로 나타내면 {chanceNumber(red)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <GameIcon name="avDice" className="h-8 w-8 shrink-0" />
        <p>
          <strong>기억해요:</strong> 주사위에서 짝수가 나올 가능성처럼 전체의 절반이면
          '반반이다'(1/2), 반드시 일어나면 '확실하다'(1), 절대 일어나지 않으면 '불가능하다'(0)예요.
        </p>
      </div>
    </section>
  );
};
