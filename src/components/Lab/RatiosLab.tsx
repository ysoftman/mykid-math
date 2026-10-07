import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';

export const RatiosLab: React.FC = () => {
  const [syrup, setSyrup] = useState<number>(2);
  const [water, setWater] = useState<number>(3);

  const total = syrup + water;
  const ratioVal = Math.round((syrup / total) * 100);
  // Red color opacity/intensity based on syrup ratio
  const juiceOpacity = Math.min(1, Math.max(0.15, syrup / total));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⚖️</span> 비와 비율 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            맛있는 딸기 주스를 만들며 비, 비율, 백분율(%)의 개념을 마스터해요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-rose-800">🍓 딸기 시럽 (비교하는 양)</span>
            <span className="text-xs font-black text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
              {syrup} 컵
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={syrup}
            onChange={(e) => {
              sound.playPop();
              setSyrup(Number(e.target.value));
            }}
            className="w-full accent-rose-600 cursor-pointer"
          />
        </div>

        <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-sky-800">💧 탄산수 (물)</span>
            <span className="text-xs font-black text-sky-600 bg-white px-2 py-0.5 rounded border border-sky-200">
              {water} 컵
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={water}
            onChange={(e) => {
              sound.playPop();
              setWater(Number(e.target.value));
            }}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6 text-white">
        {/* Juice Glass Visualizer */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-44 border-4 border-slate-400 border-t-0 rounded-b-3xl bg-slate-800/80 overflow-hidden flex flex-col justify-end p-1 shadow-inner">
            <div
              className="w-full rounded-b-2xl transition-all duration-300 relative flex items-center justify-center font-bold text-xs"
              style={{
                height: `${Math.min(95, (total / 12) * 100)}%`,
                backgroundColor: `rgba(244, 63, 94, ${juiceOpacity})`,
                boxShadow: '0 -4px 12px rgba(244, 63, 94, 0.4)',
              }}
            >
              <span className="bg-black/40 px-2 py-0.5 rounded text-[11px] text-white">
                농도 {ratioVal}%
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-300 mt-2 font-medium">총 {total}컵의 주스 완성!</div>
        </div>

        {/* Ratio Stats */}
        <div className="space-y-4 max-w-sm w-full">
          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-400">딸기 시럽과 탄산수의 비</div>
            <div className="text-2xl font-black text-rose-400">
              {syrup} : {water}
            </div>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-400">전체 주스에 대한 시럽의 비율</div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>
                {syrup} / {total}
              </span>
              <span className="text-xs text-slate-400">≈ {(syrup / total).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-4 rounded-xl text-white shadow-md">
            <div className="text-xs font-semibold text-rose-100">백분율 (퍼센트 %)</div>
            <div className="text-3xl font-black mt-1">{ratioVal}%</div>
            <div className="text-xs text-rose-100 mt-1">
              (비교하는 양 {syrup} ÷ 기준량 {total}) × 100 = {ratioVal}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
