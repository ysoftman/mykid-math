import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { GameIcon } from '../GameIcon';

type LabMode = 'congruence' | 'line' | 'point';
type ShapePose = 'move' | 'flip' | 'turn';

const CONGRUENT_POINTS = '-65,-39 -4,-54 58,-24 38,35 -30,52 -63,8';
const SYMMETRY_POINTS = [
  [-150, -66],
  [-78, -88],
  [-34, -35],
  [-53, 24],
  [-121, 48],
  [-157, 5],
];
const POINT_SYMMETRY_POINTS = [
  [-138, -70],
  [-65, -88],
  [-29, -31],
  [-61, 35],
  [-137, 16],
];

const polygonPoints = (points: number[][]) => points.map(([x, y]) => `${x},${y}`).join(' ');

export const SymmetryLab: React.FC = () => {
  const [mode, setMode] = useState<LabMode>('congruence');
  const [pose, setPose] = useState<ShapePose>('turn');
  const [lineFolded, setLineFolded] = useState(false);
  const [pointFolded, setPointFolded] = useState(false);

  const selectMode = (nextMode: LabMode) => {
    sound.playPop();
    setMode(nextMode);
  };

  const setShapePose = (nextPose: ShapePose) => {
    sound.playPop();
    setPose(nextPose);
  };

  const modeButton = (id: LabMode, title: string) => (
    <button
      key={id}
      type="button"
      onClick={() => selectMode(id)}
      aria-pressed={mode === id}
      className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
        mode === id
          ? 'bg-cyan-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-white hover:text-slate-900'
      }`}
    >
      {title}
    </button>
  );

  return (
    <section className="space-y-5 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <img
              src={GAME_ASSETS.labTiles}
              alt=""
              className="h-9 w-9 object-contain"
              draggable={false}
            />
            합동과 대칭 모양 연구실
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            도형을 옮기고, 뒤집고, 돌려서 어떤 점이 같은지 찾아봐요.
          </p>
        </div>
        <div
          role="group"
          aria-label="개념 선택"
          className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1"
        >
          {modeButton('congruence', '합동')}
          {modeButton('line', '선대칭')}
          {modeButton('point', '점대칭')}
        </div>
      </div>

      {mode === 'congruence' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <h4 className="font-extrabold text-cyan-950">모양과 크기가 같으면 합동이에요</h4>
            <p className="mt-1 text-sm leading-relaxed text-cyan-900">
              두 도형은 방향이 달라도 옮기거나 뒤집거나 돌려서 완전히 포개지면 합동이에요. 대응하는
              변과 각의 크기도 각각 같아요.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-700">오른쪽 도형을 어떻게 놓아 볼까요?</p>
              <div role="group" aria-label="도형 놓는 방법" className="flex flex-wrap gap-2">
                {(
                  [
                    ['move', '옮기기'],
                    ['flip', '뒤집기'],
                    ['turn', '180° 돌리기'],
                  ] as [ShapePose, string][]
                ).map(([nextPose, label]) => (
                  <button
                    key={nextPose}
                    type="button"
                    onClick={() => setShapePose(nextPose)}
                    aria-pressed={pose === nextPose}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                      pose === nextPose
                        ? 'border-cyan-300 bg-cyan-100 text-cyan-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-slate-900 p-3 sm:p-5">
              <svg
                viewBox="0 0 560 280"
                role="img"
                aria-label="방향은 달라도 같은 모양과 크기인 두 도형"
                className="h-56 w-full sm:h-64"
              >
                <path d="M 280 28 V 252" stroke="#334155" strokeDasharray="5 7" />
                <text x="132" y="238" fill="#e2e8f0" fontSize="16" textAnchor="middle">
                  도형 A
                </text>
                <text x="410" y="238" fill="#e2e8f0" fontSize="16" textAnchor="middle">
                  도형 B
                </text>
                <g transform="translate(132 133)">
                  <polygon
                    points={CONGRUENT_POINTS}
                    fill="#06b6d4"
                    fillOpacity="0.8"
                    stroke="#a5f3fc"
                    strokeWidth="3"
                  />
                </g>
                <g
                  transform={`translate(410 133) ${
                    pose === 'flip' ? 'scale(-1 1)' : pose === 'turn' ? 'rotate(180)' : ''
                  }`}
                >
                  <polygon
                    points={CONGRUENT_POINTS}
                    fill="#fb7185"
                    fillOpacity="0.8"
                    stroke="#ffe4e6"
                    strokeWidth="3"
                  />
                </g>
                <text x="280" y="137" fill="#fbbf24" fontSize="24" textAnchor="middle">
                  ≡
                </text>
              </svg>
            </div>
            <p className="text-center text-sm font-semibold text-slate-600">
              방향이 바뀌어도 변의 길이와 도형의 크기는 그대로예요.
            </p>
          </div>
        </div>
      )}

      {mode === 'line' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <h4 className="font-extrabold text-cyan-950">선대칭은 선을 따라 접으면 포개져요</h4>
            <p className="mt-1 text-sm leading-relaxed text-cyan-900">
              노란 선이 대칭축이에요. 축에서 같은 만큼 떨어진 점끼리 서로 짝이 돼요.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-slate-900 p-3 sm:p-5">
            <svg
              viewBox="0 0 560 300"
              role="img"
              aria-label="대칭축을 기준으로 좌우가 서로 거울처럼 대응하는 도형"
              className="h-60 w-full sm:h-72"
            >
              {!lineFolded &&
                SYMMETRY_POINTS.map(([x, y], index) => (
                  <line
                    key={index}
                    x1={280 + x}
                    y1={150 + y}
                    x2={280 - x}
                    y2={150 + y}
                    stroke="#94a3b8"
                    strokeDasharray="4 5"
                    strokeWidth="1.5"
                  />
                ))}
              <line x1="280" y1="24" x2="280" y2="276" stroke="#fbbf24" strokeWidth="3" />
              <text x="280" y="20" fill="#fde68a" fontSize="14" textAnchor="middle">
                대칭축
              </text>
              <g transform="translate(280 150)">
                <polygon
                  points={polygonPoints(SYMMETRY_POINTS)}
                  fill="#06b6d4"
                  fillOpacity="0.84"
                  stroke="#a5f3fc"
                  strokeWidth="3"
                />
              </g>
              <g transform={`translate(280 150) ${lineFolded ? '' : 'scale(-1 1)'}`}>
                <polygon
                  points={polygonPoints(SYMMETRY_POINTS)}
                  fill="#fb7185"
                  fillOpacity="0.75"
                  stroke="#ffe4e6"
                  strokeWidth="3"
                />
              </g>
            </svg>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              {lineFolded
                ? '양쪽 도형이 포개졌어요. 이 선이 대칭축이라는 뜻이에요.'
                : '점선은 대칭축에서 같은 거리에 있는 점을 이어요.'}
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setLineFolded((folded) => !folded);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-700 active:scale-95"
            >
              <GameIcon name="uiUndo" />
              {lineFolded ? '다시 펼치기' : '축을 따라 접어 보기'}
            </button>
          </div>
        </div>
      )}

      {mode === 'point' && (
        <div className="space-y-5">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <h4 className="font-extrabold text-cyan-950">점대칭은 한 점을 중심으로 180° 돌려요</h4>
            <p className="mt-1 text-sm leading-relaxed text-cyan-900">
              가운데 점을 기준으로 마주 보는 점을 이었을 때, 중심은 두 점의 한가운데에 있어요.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-slate-900 p-3 sm:p-5">
            <svg
              viewBox="0 0 560 300"
              role="img"
              aria-label="중심을 기준으로 180도 돌리면 포개지는 점대칭 도형"
              className="h-60 w-full sm:h-72"
            >
              {!pointFolded &&
                POINT_SYMMETRY_POINTS.map(([x, y], index) => (
                  <line
                    key={index}
                    x1={280 + x}
                    y1={150 + y}
                    x2={280 - x}
                    y2={150 - y}
                    stroke="#94a3b8"
                    strokeDasharray="4 5"
                    strokeWidth="1.5"
                  />
                ))}
              <circle cx="280" cy="150" r="7" fill="#fbbf24" />
              <circle cx="280" cy="150" r="18" fill="none" stroke="#fbbf24" strokeDasharray="3 4" />
              <text x="280" y="28" fill="#fde68a" fontSize="14" textAnchor="middle">
                대칭의 중심
              </text>
              <g transform="translate(280 150)">
                <polygon
                  points={polygonPoints(POINT_SYMMETRY_POINTS)}
                  fill="#06b6d4"
                  fillOpacity="0.84"
                  stroke="#a5f3fc"
                  strokeWidth="3"
                />
              </g>
              <g transform={`translate(280 150) ${pointFolded ? '' : 'rotate(180)'}`}>
                <polygon
                  points={polygonPoints(POINT_SYMMETRY_POINTS)}
                  fill="#fbbf24"
                  fillOpacity="0.72"
                  stroke="#fef3c7"
                  strokeWidth="3"
                />
              </g>
            </svg>
          </div>

          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              {pointFolded
                ? '두 도형이 포개졌어요. 이 점을 중심으로 180° 돌렸어요.'
                : '점선은 대칭의 중심을 지나며 서로 짝인 점을 이어요.'}
            </p>
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setPointFolded((folded) => !folded);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-700 active:scale-95"
            >
              <GameIcon name="uiUndo" />
              {pointFolded ? '다시 돌려 보기' : '180° 돌려 포개기'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <GameIcon name="uiBulb" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>기억해요:</strong> 선대칭은 대칭축을 따라 접고, 점대칭은 대칭의 중심을 기준으로
          180° 돌려서 확인해요. 두 경우 모두 도형끼리 합동이에요.
        </p>
      </div>
    </section>
  );
};
