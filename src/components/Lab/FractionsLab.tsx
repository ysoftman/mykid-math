import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { josa, lcm, simplifyFraction } from '../../utils/mathHelpers';
import { GameIcon } from '../GameIcon';
import { Fraction } from '../MathText';
import { LabGuide } from './LabGuide';

export const FractionsLab: React.FC = () => {
  const [mode, setMode] = useState<'addition' | 'multiplication'>('addition');

  // Addition mode state
  const [den1, setDen1] = useState<number>(2);
  const [num1, setNum1] = useState<number>(1);
  const [den2, setDen2] = useState<number>(3);
  const [num2, setNum2] = useState<number>(1);
  const [isUnified, setIsUnified] = useState<boolean>(false);

  // Multiplication mode state
  const [mDen1, setMDen1] = useState<number>(3);
  const [mNum1, setMNum1] = useState<number>(2);
  const [mDen2, setMDen2] = useState<number>(4);
  const [mNum2, setMNum2] = useState<number>(3);

  // Addition calculations
  const commonDen = lcm(den1, den2);
  const unifiedNum1 = num1 * (commonDen / den1);
  const unifiedNum2 = num2 * (commonDen / den2);
  const totalNum = unifiedNum1 + unifiedNum2;
  const simplifiedSum = simplifyFraction(totalNum, commonDen);

  // Multiplication calculations
  const productNum = mNum1 * mNum2;
  const productDen = mDen1 * mDen2;
  const simplifiedProduct = simplifyFraction(productNum, productDen);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <img
              src={GAME_ASSETS.topicFractions}
              alt=""
              className="h-9 w-9 object-contain"
              draggable={false}
            />{' '}
            분수 시각화 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            분수를 눈으로 쪼개고 맞춰보며 통분과 곱셈의 원리를 발견해요.
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setMode('addition');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'addition'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="labFractionAdd" />
            통분과 덧셈
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setMode('multiplication');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              mode === 'multiplication'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GameIcon name="labFractionMul" />
            곱셈 (면적 모델)
          </button>
        </div>
      </div>

      <LabGuide />

      {mode === 'addition' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fraction 1 Controls */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-800">
                첫 번째 분수: <Fraction num={num1} den={den1} />
              </span>
              <div className="mt-2 flex gap-4 items-center">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분모: {den1}</div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={den1}
                    aria-label="첫 번째 분수의 분모"
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setDen1(d);
                      if (num1 >= d) setNum1(d - 1);
                      setIsUnified(false);
                      sound.playPop();
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분자: {num1}</div>
                  <input
                    type="range"
                    min="1"
                    max={den1 - 1}
                    value={num1}
                    aria-label="첫 번째 분수의 분자"
                    onChange={(e) => {
                      setNum1(Number(e.target.value));
                      setIsUnified(false);
                      sound.playPop();
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Fraction 2 Controls */}
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-800">
                두 번째 분수: <Fraction num={num2} den={den2} />
              </span>
              <div className="mt-2 flex gap-4 items-center">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분모: {den2}</div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={den2}
                    aria-label="두 번째 분수의 분모"
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setDen2(d);
                      if (num2 >= d) setNum2(d - 1);
                      setIsUnified(false);
                      sound.playPop();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분자: {num2}</div>
                  <input
                    type="range"
                    min="1"
                    max={den2 - 1}
                    value={num2}
                    aria-label="두 번째 분수의 분자"
                    onChange={(e) => {
                      setNum2(Number(e.target.value));
                      setIsUnified(false);
                      sound.playPop();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fraction Bars */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>
                  첫 번째 막대:{' '}
                  <Fraction
                    num={isUnified ? unifiedNum1 : num1}
                    den={isUnified ? commonDen : den1}
                  />
                </span>
              </div>
              <div className="h-9 w-full bg-slate-200 rounded-lg overflow-hidden flex border border-slate-300">
                {Array.from({ length: isUnified ? commonDen : den1 }).map((_, idx) => {
                  const isFilled = idx < (isUnified ? unifiedNum1 : num1);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 border-r border-slate-300 last:border-r-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isFilled ? 'bg-blue-700 text-white shadow-inner' : 'bg-white text-slate-500'
                      }`}
                    >
                      <Fraction num={1} den={isUnified ? commonDen : den1} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>
                  두 번째 막대:{' '}
                  <Fraction
                    num={isUnified ? unifiedNum2 : num2}
                    den={isUnified ? commonDen : den2}
                  />
                </span>
              </div>
              <div className="h-9 w-full bg-slate-200 rounded-lg overflow-hidden flex border border-slate-300">
                {Array.from({ length: isUnified ? commonDen : den2 }).map((_, idx) => {
                  const isFilled = idx < (isUnified ? unifiedNum2 : num2);
                  return (
                    <div
                      key={idx}
                      className={`flex-1 border-r border-slate-300 last:border-r-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isFilled
                          ? 'bg-indigo-600 text-white shadow-inner'
                          : 'bg-white text-slate-500'
                      }`}
                    >
                      <Fraction num={1} den={isUnified ? commonDen : den2} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  sound.playPop();
                  setIsUnified(!isUnified);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all"
              >
                {isUnified
                  ? '↩️ 원래 분수로 보기'
                  : `✨ 공통분모 ${josa(commonDen, '으로')} 통분하기!`}
              </button>

              <div className="text-sm font-bold text-slate-800 bg-white px-4 py-2 rounded-xl border border-slate-200">
                합계:{' '}
                <span className="text-blue-700">
                  <Fraction num={num1} den={den1} /> + <Fraction num={num2} den={den2} /> ={' '}
                </span>
                <span className="text-indigo-700 font-extrabold text-base">
                  {simplifiedSum.den === 1 ? (
                    simplifiedSum.num
                  ) : (
                    <Fraction num={simplifiedSum.num} den={simplifiedSum.den} />
                  )}
                </span>
                {simplifiedSum.den > 1 && simplifiedSum.num > simplifiedSum.den && (
                  <span className="text-xs text-slate-500 ml-1">
                    (대분수: {Math.floor(simplifiedSum.num / simplifiedSum.den)}
                    <Fraction num={simplifiedSum.num % simplifiedSum.den} den={simplifiedSum.den} />
                    )
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Multiplication Mode */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-800">
                가로 분수: <Fraction num={mNum1} den={mDen1} />
              </span>
              <div className="mt-2 flex gap-4">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분모: {mDen1}</div>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={mDen1}
                    aria-label="가로 분수의 분모"
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setMDen1(d);
                      if (mNum1 >= d) setMNum1(d - 1);
                      sound.playPop();
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분자: {mNum1}</div>
                  <input
                    type="range"
                    min="1"
                    max={mDen1 - 1}
                    value={mNum1}
                    aria-label="가로 분수의 분자"
                    onChange={(e) => {
                      setMNum1(Number(e.target.value));
                      sound.playPop();
                    }}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-800">
                세로 분수: <Fraction num={mNum2} den={mDen2} />
              </span>
              <div className="mt-2 flex gap-4">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분모: {mDen2}</div>
                  <input
                    type="range"
                    min="2"
                    max="5"
                    value={mDen2}
                    aria-label="세로 분수의 분모"
                    onChange={(e) => {
                      const d = Number(e.target.value);
                      setMDen2(d);
                      if (mNum2 >= d) setMNum2(d - 1);
                      sound.playPop();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">분자: {mNum2}</div>
                  <input
                    type="range"
                    min="1"
                    max={mDen2 - 1}
                    value={mNum2}
                    aria-label="세로 분수의 분자"
                    onChange={(e) => {
                      setMNum2(Number(e.target.value));
                      sound.playPop();
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl text-white">
            <div className="text-xs text-slate-200 mb-3">
              전체 사각형을 가로 {mDen1}등분 × 세로 {mDen2}등분 = 총 <strong>{productDen}</strong>
              칸으로 나눕니다.
            </div>

            <div
              className="grid max-w-full gap-1 overflow-hidden bg-slate-800 p-2 rounded-xl border-2 border-slate-300"
              style={{
                gridTemplateColumns: `repeat(${mDen1}, minmax(0, 56px))`,
                gridTemplateRows: `repeat(${mDen2}, minmax(40px, 56px))`,
              }}
            >
              {Array.from({ length: mDen2 }).map((_, r) =>
                Array.from({ length: mDen1 }).map((_, c) => {
                  const isHoriz = c < mNum1;
                  const isVert = r < mNum2;
                  const isOverlap = isHoriz && isVert;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-full h-full rounded border flex items-center justify-center text-xs font-bold transition-all ${
                        isOverlap
                          ? 'bg-amber-400 border-amber-300 text-amber-950 shadow-md ring-2 ring-amber-300'
                          : isHoriz
                            ? 'bg-sky-400/60 border-sky-200'
                            : isVert
                              ? 'bg-violet-400/60 border-violet-200'
                              : 'bg-white/10 border-white/40'
                      }`}
                    >
                      {isOverlap ? '★' : ''}
                    </div>
                  );
                }),
              )}
            </div>

            <div className="mt-5 text-center space-y-1">
              <div className="text-lg font-black text-amber-300">
                <Fraction num={mNum1} den={mDen1} /> × <Fraction num={mNum2} den={mDen2} /> ={' '}
                <Fraction num={`${mNum1}×${mNum2}`} den={`${mDen1}×${mDen2}`} /> ={' '}
                <Fraction num={productNum} den={productDen} />
              </div>
              <div className="text-xs text-slate-200">
                노란색 겹치는 영역 {productNum}칸 / 전체 {productDen}칸 = 약분하면{' '}
                <strong className="text-white text-sm">
                  <Fraction num={simplifiedProduct.num} den={simplifiedProduct.den} />
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
