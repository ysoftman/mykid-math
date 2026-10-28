import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { gcd, josa } from '../../utils/mathHelpers';
import { GameIcon } from '../GameIcon';
import { Fraction } from '../MathText';
import { LabGuide } from './LabGuide';

export const RatiosLab: React.FC = () => {
  const [syrup, setSyrup] = useState<number>(2);
  const [water, setWater] = useState<number>(3);

  const total = syrup + water;
  const ratioVal = Math.round((syrup / total) * 100);
  // 2 ÷ 7 × 100 = 28.57…, so show ≈ instead of = when the percent is not a whole number
  const approx = (syrup * 100) % total === 0 ? '=' : '≈';
  const g = gcd(syrup, water);
  // A big batch of at least 30 cups that the ratio's total divides, so each share is a whole number
  const batch = Math.ceil(30 / total) * total;
  const unit = batch / total;
  // Red color opacity/intensity based on syrup ratio
  const juiceOpacity = Math.min(1, Math.max(0.15, syrup / total));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <img
              src={GAME_ASSETS.topicRatios}
              alt=""
              className="h-9 w-9 object-contain"
              draggable={false}
            />{' '}
            비와 비율 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            맛있는 딸기 주스를 만들며 비, 비율, 백분율(%), 비례식의 개념을 마스터해요.
          </p>
        </div>
      </div>

      <LabGuide />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
          <div className="flex justify-between items-center mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800">
              <GameIcon name="iconSyrup" /> 딸기 시럽 (비교하는 양)
            </span>
            <span className="text-xs font-black text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
              {syrup}컵
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={syrup}
            aria-label="딸기 시럽 컵 수"
            onChange={(e) => {
              sound.playPop();
              setSyrup(Number(e.target.value));
            }}
            className="w-full accent-rose-600 cursor-pointer"
          />
        </div>

        <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
          <div className="flex justify-between items-center mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-800">
              <GameIcon name="iconWater" /> 탄산수 (물)
            </span>
            <span className="text-xs font-black text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-200">
              {water}컵
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={water}
            aria-label="탄산수 컵 수"
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
          <div className="relative w-28 h-44 border-4 border-slate-400 border-t-0 rounded-b-2xl bg-slate-800/80 overflow-hidden flex flex-col justify-end p-1 shadow-inner">
            <div
              className="w-full rounded-b-xl transition-all duration-300 relative flex items-center justify-center font-bold text-xs"
              style={{
                height: `${Math.min(95, (total / 12) * 100)}%`,
                backgroundColor: `rgba(244, 63, 94, ${juiceOpacity})`,
                boxShadow: '0 -4px 12px rgba(244, 63, 94, 0.4)',
              }}
            >
              <span className="bg-black/40 px-2 py-0.5 rounded-full text-xs text-white">
                진하기 {approx === '≈' && '약 '}
                {ratioVal}%
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-200 mt-2 font-medium">총 {total}컵의 주스 완성!</div>
        </div>

        {/* Ratio Stats */}
        <div className="space-y-4 max-w-sm w-full">
          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-200">딸기 시럽과 탄산수의 비</div>
            <div className="text-2xl font-black text-rose-400">
              {syrup} : {water}
            </div>
            <div className="text-xs text-slate-200">
              {`'${syrup} 대 ${water}' 또는 '${water}에 대한 ${syrup}의 비'라고 읽어요. (전항 ${syrup}, 후항 ${water})`}
            </div>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-200">
              같은 맛 주스를 2배로 만들기 (비의 성질 · 비례식)
            </div>
            <div className="text-xl font-bold text-white">
              {syrup} : {water} = {syrup * 2} : {water * 2}
            </div>
            <div className="text-xs text-slate-200">
              {`전항과 후항에 2를 곱해도 비율은 같아요. 비례식에서 외항의 곱과 내항의 곱은 같아요: ${syrup} × ${water * 2} = ${water} × ${syrup * 2} = ${syrup * water * 2}`}
            </div>
            <div className="text-xs text-slate-200">
              {g > 1
                ? `전항과 후항을 최대공약수 ${josa(g, '으로')} 나누면 가장 간단한 자연수의 비 ${josa(`${syrup / g} : ${water / g}`, '이')} 돼요.`
                : `${syrup} : ${josa(water, '은')} 1 말고는 공약수가 없어 이미 가장 간단한 자연수의 비예요.`}
            </div>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-200">
              {`주스 ${batch}컵을 시럽과 탄산수 ${josa(`${syrup} : ${water}`, '으로')} 비례배분하기`}
            </div>
            <div className="text-xs text-slate-200">
              {`비의 합은 ${syrup} + ${water} = ${total}이므로 ${batch} ÷ ${total} = ${unit}, 1묶음은 ${unit}컵이에요.`}
            </div>
            <div className="text-sm font-bold text-white">
              {`시럽: ${batch} × ${syrup}/${total} = ${unit} × ${syrup} = ${unit * syrup}컵`}
            </div>
            <div className="text-sm font-bold text-white">
              {`탄산수: ${batch} × ${water}/${total} = ${unit} × ${water} = ${unit * water}컵`}
            </div>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs text-slate-200">
              전체 주스에 대한 시럽의 비율 (시럽 : 전체 = {syrup} : {total})
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <Fraction num={syrup} den={total} />
              <span className="text-xs text-slate-200">
                {approx} {Number((syrup / total).toFixed(2))}
              </span>
            </div>
          </div>

          <div className="bg-rose-600 p-4 rounded-xl text-white shadow-md">
            <div className="text-xs font-semibold text-rose-100">백분율 (퍼센트 %)</div>
            <div className="text-3xl font-black mt-1">
              {approx === '≈' && '약 '}
              {ratioVal}%
            </div>
            <div className="text-xs text-rose-100 mt-1">
              (비교하는 양 {syrup} ÷ 기준량 {total}) × 100 {approx} {ratioVal}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
