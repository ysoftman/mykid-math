import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { josa } from '../../utils/mathHelpers';
import { Fraction } from '../MathText';
import { LabGuide } from './LabGuide';

export const DecimalsLab: React.FC = () => {
  const [valA, setValA] = useState<number>(0.6);
  const [valB, setValB] = useState<number>(0.4);

  const cellsA = Math.round(valA * 10);
  const cellsB = Math.round(valB * 10);
  const overlapCount = cellsA * cellsB;
  // Counting 0.01 cells keeps the product exact; 0.40 is written 0.4 once its last 0 is dropped
  const product = overlapCount / 100;
  const productFull = product.toFixed(2);
  const productText = String(product);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <img
              src={GAME_ASSETS.topicDecimals}
              alt=""
              className="h-9 w-9 object-contain"
              draggable={false}
            />{' '}
            소수 격자 & 자릿수 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            0.1 × 0.1 = 0.01이라서 소수 한 자리 수끼리 곱하면 소수 두 자리 수가 되는 까닭을 100칸
            모눈종이에서 직접 확인해요.
          </p>
        </div>
      </div>

      <LabGuide />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-800">가로 길이: {valA}</span>
            <span className="text-xs text-emerald-800 font-semibold">{cellsA}칸 / 10칸</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={cellsA}
            aria-label="가로 길이"
            onChange={(e) => {
              setValA(Number(e.target.value) / 10);
              sound.playPop();
            }}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-teal-800">세로 길이: {valB}</span>
            <span className="text-xs text-teal-800 font-semibold">{cellsB}칸 / 10칸</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={cellsB}
            aria-label="세로 길이"
            onChange={(e) => {
              setValB(Number(e.target.value) / 10);
              sound.playPop();
            }}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* 10x10 Grid View */}
      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-white">
        <div className="text-xs text-slate-200 mb-4">큰 정사각형 = 1, 작은 칸 한 개 = 0.01</div>

        <div className="grid grid-cols-10 gap-0.5 sm:gap-1 bg-slate-800 p-1.5 sm:p-2 rounded-xl border-2 border-slate-300">
          {Array.from({ length: 10 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => {
              const inRow = r < cellsB;
              const inCol = c < cellsA;
              const isOverlap = inRow && inCol;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-5 h-5 sm:w-8 sm:h-8 rounded transition-all duration-200 border flex items-center justify-center ${
                    isOverlap
                      ? 'bg-emerald-400 border-emerald-300 text-emerald-950 font-bold shadow'
                      : inCol
                        ? 'bg-emerald-400/50 border-emerald-200/70'
                        : inRow
                          ? 'bg-sky-400/50 border-sky-200/70'
                          : 'bg-white/10 border-white/40'
                  }`}
                >
                  {isOverlap ? '•' : ''}
                </div>
              );
            }),
          )}
        </div>

        <div className="mt-6 text-center space-y-1">
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {valA} × {valB} = {productText}
          </div>
          <p className="text-sm text-slate-200">
            100칸 중 <strong className="text-white">{overlapCount}칸</strong>이 겹치므로{' '}
            <span className="whitespace-nowrap">
              <strong className="text-emerald-300">
                <Fraction num={overlapCount} den={100} /> = {productFull}
                {productFull !== productText && ` = ${productText}`}
              </strong>
              입니다!
            </span>
          </p>
          <p className="text-sm text-slate-300">
            나눗셈으로 바꾸어 보면, 겹친 {overlapCount}칸을 {cellsB}줄로 똑같이 나눌 때 한 줄에{' '}
            {cellsA}칸이므로{' '}
            <span className="whitespace-nowrap">
              {productText} ÷ {valB} = {josa(valA, '이')}
            </span>{' '}
            돼요.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>기억해요:</strong> 10, 100을 곱하면 소수점이 오른쪽으로 0의 개수만큼 옮겨져요.{' '}
        <span className="whitespace-nowrap">
          {productText} × 10 = {overlapCount / 10},
        </span>{' '}
        <span className="whitespace-nowrap">
          {productText} × 100 = {overlapCount}이고,
        </span>{' '}
        10이나 100으로 나누면 소수점이 왼쪽으로 옮겨져요.
      </div>
    </div>
  );
};
