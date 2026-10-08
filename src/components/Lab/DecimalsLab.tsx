import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { Fraction } from '../MathText';
import { LabGuide } from './LabGuide';

export const DecimalsLab: React.FC = () => {
  const [valA, setValA] = useState<number>(0.6);
  const [valB, setValB] = useState<number>(0.4);

  const cellsA = Math.round(valA * 10);
  const cellsB = Math.round(valB * 10);
  const product = Math.round(valA * valB * 100) / 100;
  const overlapCount = cellsA * cellsB;

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
            100칸 모눈종이 위에서 소수 곱셈이 왜 소수 둘째 자리가 되는지 직접 확인해요.
          </p>
        </div>
      </div>

      <LabGuide />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-800">가로 길이: {valA.toFixed(1)}</span>
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
            <span className="text-xs font-bold text-teal-800">세로 길이: {valB.toFixed(1)}</span>
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
        <div className="text-xs text-slate-200 mb-4">전체 1개 큰 정사각형 = 100칸 (1칸 = 0.01)</div>

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
            {valA.toFixed(1)} × {valB.toFixed(1)} = {product.toFixed(2)}
          </div>
          <p className="text-sm text-slate-200">
            100칸 중 <strong className="text-white">{overlapCount}칸</strong>이 겹치므로{' '}
            <strong className="text-emerald-300">
              <Fraction num={overlapCount} den={100} /> = {product.toFixed(2)}
            </strong>{' '}
            입니다!
          </p>
        </div>
      </div>
    </div>
  );
};
