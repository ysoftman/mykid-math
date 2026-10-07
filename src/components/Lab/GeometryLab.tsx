import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { LabGuide } from './LabGuide';

export const GeometryLab: React.FC = () => {
  const [shape, setShape] = useState<'triangle' | 'trapezoid' | 'circle'>('triangle');

  // Triangle state
  const [base, setBase] = useState<number>(8);
  const [height, setHeight] = useState<number>(6);
  const [showTriTwin, setShowTriTwin] = useState<boolean>(false);

  // Trapezoid state
  const [topBase, setTopBase] = useState<number>(4);
  const [bottomBase, setBottomBase] = useState<number>(8);
  const [trapHeight, setTrapHeight] = useState<number>(5);
  const [showTrapTwin, setShowTrapTwin] = useState<boolean>(false);

  // Circle state
  const [radius, setRadius] = useState<number>(4);
  const [slices, setSlices] = useState<number>(8); // 8, 16, 32

  const triArea = (base * height) / 2;
  const trapArea = ((topBase + bottomBase) * trapHeight) / 2;
  const circleArea = Math.round(radius * radius * 3.14 * 100) / 100;
  const circumference = Math.round(2 * radius * 3.14 * 100) / 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📐</span> 도형과 원의 넓이 실험실
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            도형을 자르고 이어붙여 왜 이런 넓이 공식이 나왔는지 직접 체험해요.
          </p>
        </div>

        <div className="flex flex-wrap bg-purple-50 p-1 rounded-xl gap-1">
          <button
            onClick={() => {
              sound.playPop();
              setShape('triangle');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              shape === 'triangle'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-800 hover:bg-purple-100'
            }`}
          >
            🔺 삼각형
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setShape('trapezoid');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              shape === 'trapezoid'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-800 hover:bg-purple-100'
            }`}
          >
            ⏢ 사다리꼴
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setShape('circle');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              shape === 'circle'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-800 hover:bg-purple-100'
            }`}
          >
            ⭕ 원의 변형
          </button>
        </div>
      </div>

      <LabGuide />

      {shape === 'triangle' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                밑변: {base} cm
              </label>
              <input
                type="range"
                min="4"
                max="12"
                value={base}
                onChange={(e) => {
                  sound.playPop();
                  setBase(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                높이: {height} cm
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={height}
                onChange={(e) => {
                  sound.playPop();
                  setHeight(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-white">
            <svg viewBox="0 0 320 180" className="w-full max-w-sm h-48">
              {/* Grid background */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="320" height="180" fill="url(#grid)" />

              {/* Original Triangle */}
              <polygon
                points={`40,${150} ${40 + base * 15},${150} ${40 + (base * 15) / 2},${150 - height * 12}`}
                fill="#a855f7"
                fillOpacity="0.8"
                stroke="#d8b4fe"
                strokeWidth="2"
              />

              {/* Twin Triangle to form parallelogram */}
              {showTriTwin && (
                <polygon
                  points={`${40 + (base * 15) / 2},${150 - height * 12} ${40 + base * 15},${150} ${40 + base * 15 + (base * 15) / 2},${150 - height * 12}`}
                  fill="#ec4899"
                  fillOpacity="0.7"
                  stroke="#fbcfe8"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              )}

              {/* Labels */}
              <text
                x={40 + (base * 15) / 2}
                y="165"
                fill="#f8fafc"
                fontSize="16"
                textAnchor="middle"
                fontWeight="bold"
              >
                밑변 {base}cm
              </text>
              <line
                x1={40 + (base * 15) / 2}
                y1={150 - height * 12}
                x2={40 + (base * 15) / 2}
                y2={150}
                stroke="#fbbf24"
                strokeWidth="1.5"
                strokeDasharray="3"
              />
              <text
                x={45 + (base * 15) / 2}
                y={150 - (height * 12) / 2}
                fill="#fbbf24"
                fontSize="15"
                fontWeight="bold"
              >
                높이 {height}cm
              </text>
            </svg>

            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  sound.playPop();
                  setShowTriTwin(!showTriTwin);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xs sm:text-sm font-bold shadow hover:brightness-110 transition-all"
              >
                {showTriTwin
                  ? '↩️ 원래 삼각형만 보기'
                  : '✨ 똑같은 삼각형 1개 더 붙여보기 (평행사변형 완성!)'}
              </button>

              <div className="text-center">
                <div className="text-lg font-bold text-purple-300">
                  넓이 = ({base} × {height}) ÷ 2 ={' '}
                  <span className="text-white font-extrabold">{triArea}</span> cm²
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  💡 똑같은 삼각형 2개를 붙이면 평행사변형(밑변×높이)이 되기 때문에{' '}
                  <strong>반으로 나누는(÷2)</strong> 것입니다!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shape === 'trapezoid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                윗변: {topBase} cm
              </label>
              <input
                type="range"
                min="2"
                max="8"
                value={topBase}
                onChange={(e) => {
                  sound.playPop();
                  setTopBase(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                아랫변: {bottomBase} cm
              </label>
              <input
                type="range"
                min="5"
                max="12"
                value={bottomBase}
                onChange={(e) => {
                  sound.playPop();
                  setBottomBase(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                높이: {trapHeight} cm
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={trapHeight}
                onChange={(e) => {
                  sound.playPop();
                  setTrapHeight(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-white">
            <svg viewBox="0 0 340 180" className="w-full max-w-sm h-48">
              <defs>
                <pattern id="trapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="340" height="180" fill="url(#trapGrid)" />

              {/* Main Trapezoid */}
              <polygon
                points={`50,150 ${50 + bottomBase * 12},150 ${50 + topBase * 12 + 20},${150 - trapHeight * 12} ${50 + 20},${150 - trapHeight * 12}`}
                fill="#9333ea"
                fillOpacity="0.8"
                stroke="#c084fc"
                strokeWidth="2"
              />

              {showTrapTwin && (
                <polygon
                  points={`${50 + bottomBase * 12},150 ${50 + (bottomBase + topBase) * 12},150 ${50 + (bottomBase + topBase) * 12 - 20},${150 - trapHeight * 12} ${50 + bottomBase * 12 - 20 + topBase * 12},${150 - trapHeight * 12}`}
                  fill="#f43f5e"
                  fillOpacity="0.7"
                  stroke="#fda4af"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              )}

              {/* Labels */}
              <text
                x={50 + 20 + (topBase * 12) / 2}
                y={140 - trapHeight * 12}
                fill="#e2e8f0"
                fontSize="15"
                textAnchor="middle"
              >
                윗변 {topBase}cm
              </text>
              <text
                x={50 + (bottomBase * 12) / 2}
                y="165"
                fill="#e2e8f0"
                fontSize="15"
                textAnchor="middle"
              >
                아랫변 {bottomBase}cm
              </text>
            </svg>

            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  sound.playPop();
                  setShowTrapTwin(!showTrapTwin);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-xs sm:text-sm font-bold shadow hover:brightness-110 transition-all"
              >
                {showTrapTwin ? '↩️ 원래 사다리꼴만 보기' : '✨ 똑같은 사다리꼴 거꾸로 이어붙이기!'}
              </button>

              <div className="text-center">
                <div className="text-lg font-bold text-purple-300">
                  넓이 = ({topBase} + {bottomBase}) × {trapHeight} ÷ 2 ={' '}
                  <span className="text-white font-extrabold">{trapArea}</span> cm²
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  💡 사다리꼴 2개를 거꾸로 붙이면 밑변이 (윗변+아랫변)인 거대한 평행사변형이
                  완성됩니다!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shape === 'circle' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                반지름: {radius} cm
              </label>
              <input
                type="range"
                min="2"
                max="6"
                value={radius}
                onChange={(e) => {
                  sound.playPop();
                  setRadius(Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
              <label className="text-xs font-bold text-purple-900 block mb-1">
                자르는 조각 수 (잘게 쪼갤수록 직사각형에 가까워져요!): {slices}등분
              </label>
              <div className="flex gap-2 mt-2">
                {[8, 16, 32].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      sound.playPop();
                      setSlices(s);
                    }}
                    className={`flex-1 py-1 rounded text-xs font-bold ${
                      slices === s ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                    }`}
                  >
                    {s}등분
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center text-white">
            <div className="flex flex-col sm:flex-row items-center justify-around w-full gap-6">
              {/* Circle representation */}
              <div className="flex flex-col items-center">
                <svg width="150" height="150" viewBox="-75 -75 150 150">
                  <circle
                    cx="0"
                    cy="0"
                    r={radius * 10}
                    fill="#a855f7"
                    stroke="#e9d5ff"
                    strokeWidth="2"
                  />
                  {/* Slices lines */}
                  {Array.from({ length: slices / 2 }).map((_, i) => {
                    const angle = (i * 360) / slices;
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={-Math.cos(rad) * radius * 10}
                        y1={-Math.sin(rad) * radius * 10}
                        x2={Math.cos(rad) * radius * 10}
                        y2={Math.sin(rad) * radius * 10}
                        stroke="#ffffff"
                        strokeWidth="1"
                        strokeOpacity="0.6"
                      />
                    );
                  })}
                  {/* Radius line */}
                  <line x1="0" y1="0" x2={radius * 10} y2="0" stroke="#facc15" strokeWidth="2" />
                  <text
                    x={radius * 5}
                    y="-5"
                    fill="#facc15"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    반지름 {radius}
                  </text>
                </svg>
                <div className="text-xs text-slate-300 mt-2">원 (피자 모양 조각내기)</div>
              </div>

              <div className="text-2xl text-purple-400">➡️</div>

              {/* Unfolded teeth representation */}
              <div className="flex flex-col items-center">
                <div
                  className="h-16 flex items-center bg-purple-950/60 p-2 rounded-xl border border-purple-800"
                  style={{ width: `${Math.min(240, slices * 8)}px` }}
                >
                  <div className="w-full flex justify-between h-full relative">
                    {Array.from({ length: slices }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-full rounded-t-sm transition-all duration-300 ${
                          i % 2 === 0 ? 'bg-purple-500' : 'bg-pink-500 transform rotate-180'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-300 mt-2">
                  엇갈려 이어붙인 모습 (가로 = 원주의 1/2, 세로 = 반지름)
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-1">
              <div className="text-lg font-bold text-purple-300">
                원의 넓이 = 반지름({radius}) × 반지름({radius}) × 3.14 ={' '}
                <span className="text-white font-extrabold">{circleArea}</span> cm²
              </div>
              <p className="text-xs text-slate-300">
                (원주 = 2 × {radius} × 3.14 = {circumference}cm, 직사각형 가로 = {circumference / 2}
                cm, 세로 = {radius}cm)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
