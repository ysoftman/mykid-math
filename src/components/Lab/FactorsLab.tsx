import React, { useState } from 'react';
import { getFactors, gcd, lcm } from '../../utils/mathHelpers';
import { sound } from '../../utils/audio';

export const FactorsLab: React.FC = () => {
  const [tab, setTab] = useState<'rect' | 'gcd_lcm'>('rect');
  const [targetNum, setTargetNum] = useState<number>(12);
  const [numA, setNumA] = useState<number>(12);
  const [numB, setNumB] = useState<number>(18);

  const factors = getFactors(targetNum);
  // Find pairs (w, h) where w <= h and w * h = targetNum
  const pairs: [number, number][] = [];
  for (let i = 1; i * i <= targetNum; i++) {
    if (targetNum % i === 0) {
      pairs.push([i, targetNum / i]);
    }
  }

  const [selectedPair, setSelectedPair] = useState<[number, number]>(pairs[0] || [1, targetNum]);

  const handleNumChange = (val: number) => {
    sound.playPop();
    setTargetNum(val);
    const newPairs: [number, number][] = [];
    for (let i = 1; i * i <= val; i++) {
      if (val % i === 0) {
        newPairs.push([i, val / i]);
      }
    }
    setSelectedPair(newPairs[0] || [1, val]);
  };

  const calculatedGCD = gcd(numA, numB);
  const calculatedLCM = lcm(numA, numB);
  const factorsA = getFactors(numA);
  const factorsB = getFactors(numB);
  const commonFactors = factorsA.filter((f) => factorsB.includes(f));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🔍</span> 약수와 배수 시각화 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            타일을 모아 직사각형을 만들어보며 약수의 원리를 눈으로 확인해요.
          </p>
        </div>

        <div className="flex bg-amber-50 p-1 rounded-xl">
          <button
            onClick={() => { sound.playPop(); setTab('rect'); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              tab === 'rect' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🧱 직사각형 타일 약수 탐색
          </button>
          <button
            onClick={() => { sound.playPop(); setTab('gcd_lcm'); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              tab === 'gcd_lcm' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🤝 최대공약수 & 최소공배수
          </button>
        </div>
      </div>

      {tab === 'rect' ? (
        <div className="space-y-6">
          <div className="bg-amber-50/60 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-900">살펴볼 수:</span>
              <input
                type="range"
                min="4"
                max="36"
                value={targetNum}
                onChange={(e) => handleNumChange(Number(e.target.value))}
                className="w-40 sm:w-60 accent-amber-500 cursor-pointer"
              />
              <span className="text-2xl font-black text-amber-600 bg-white px-3 py-1 rounded-lg border border-amber-200">
                {targetNum}
              </span>
            </div>

            <div className="text-sm text-amber-900">
              <span className="font-semibold">{targetNum}의 약수: </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 font-bold text-amber-600">
                {factors.join(', ')}
              </span>
              <span className="ml-1 text-xs text-amber-700">({factors.length}개)</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">
              📐 만들 수 있는 직사각형 모양을 선택해보세요:
            </h4>
            <div className="flex flex-wrap gap-2">
              {pairs.map(([w, h]) => {
                const isSelected = selectedPair[0] === w && selectedPair[1] === h;
                return (
                  <button
                    key={`${w}x${h}`}
                    onClick={() => { sound.playPop(); setSelectedPair([w, h]); }}
                    className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-105'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
                    }`}
                  >
                    가로 {h} × 세로 {w}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] text-white">
            <div className="text-xs text-slate-400 mb-3">
              {targetNum}개의 타일로 만든 직사각형 (가로 {selectedPair[1]}칸 × 세로 {selectedPair[0]}칸)
            </div>
            <div
              className="grid gap-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700"
              style={{
                gridTemplateColumns: `repeat(${selectedPair[1]}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: targetNum }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded flex items-center justify-center text-[10px] font-bold text-amber-950 shadow-sm"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-amber-200">
              💡 빈틈없이 직사각형을 만들 수 있는 변의 길이(<strong>{selectedPair[0]}</strong>와 <strong>{selectedPair[1]}</strong>)가 바로 <strong>{targetNum}의 약수</strong>입니다!
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/50 p-4 rounded-xl space-y-2">
              <label className="text-sm font-bold text-amber-900 flex justify-between">
                <span>첫 번째 수 (A): {numA}</span>
                <span className="text-xs text-amber-600 font-normal">약수: {factorsA.join(', ')}</span>
              </label>
              <input
                type="range"
                min="6"
                max="36"
                value={numA}
                onChange={(e) => { sound.playPop(); setNumA(Number(e.target.value)); }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="bg-blue-50/50 p-4 rounded-xl space-y-2">
              <label className="text-sm font-bold text-blue-900 flex justify-between">
                <span>두 번째 수 (B): {numB}</span>
                <span className="text-xs text-blue-600 font-normal">약수: {factorsB.join(', ')}</span>
              </label>
              <input
                type="range"
                min="6"
                max="36"
                value={numB}
                onChange={(e) => { sound.playPop(); setNumB(Number(e.target.value)); }}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                공통인 약수 중 가장 큰 수
              </div>
              <div className="text-xl font-bold text-slate-800">최대공약수 (GCD)</div>
              <div className="text-4xl font-black text-amber-600 my-2">{calculatedGCD}</div>
              <div className="text-xs text-slate-600">
                공약수 목록: <strong className="text-amber-700">{commonFactors.join(', ')}</strong> 중 가장 큰 수는 <strong>{calculatedGCD}</strong>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                공통인 배수 중 가장 작은 수
              </div>
              <div className="text-xl font-bold text-slate-800">최소공배수 (LCM)</div>
              <div className="text-4xl font-black text-blue-600 my-2">{calculatedLCM}</div>
              <div className="text-xs text-slate-600">
                두 수가 처음으로 함께 만나는 배수는 <strong>{calculatedLCM}</strong>입니다!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
