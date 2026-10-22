import type React from 'react';
import { useState } from 'react';
import { sound } from '../../utils/audio';
import { GAME_ASSETS } from '../../utils/gameAssets';
import { GameIcon } from '../GameIcon';

type Solid = 'cuboid' | 'cube';

const PARTS = [
  { name: '면', count: 6, note: '평평한 부분' },
  { name: '모서리', count: 12, note: '면과 면이 만나는 선분' },
  { name: '꼭짓점', count: 8, note: '모서리끼리 만나는 점' },
];

export const SolidsLab: React.FC = () => {
  const [solid, setSolid] = useState<Solid>('cuboid');
  const [edges, setEdges] = useState({ a: 5, b: 3, c: 4 });
  const isCube = solid === 'cube';
  const edgeSum = isCube ? edges.a * 12 : (edges.a + edges.b + edges.c) * 4;

  const slider = (key: keyof typeof edges, label: string) => (
    <label key={key} className="block rounded-xl border border-violet-100 bg-violet-50/60 p-3">
      <span className="flex justify-between text-xs font-bold text-violet-900">
        {label}
        <span>{edges[key]}cm</span>
      </span>
      <input
        type="range"
        min="1"
        max="10"
        value={edges[key]}
        onChange={(e) => {
          sound.playPop();
          setEdges({ ...edges, [key]: Number(e.target.value) });
        }}
        className="mt-1 w-full cursor-pointer accent-violet-600"
      />
    </label>
  );

  return (
    <section className="space-y-5 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <img
              src={GAME_ASSETS.topicSolids}
              alt=""
              className="h-9 w-9 object-contain"
              draggable={false}
            />
            직육면체와 정육면체 연구실
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            상자 모양을 살펴보며 면, 모서리, 꼭짓점을 세고 모서리 길이의 합을 구해 봐요.
          </p>
        </div>
        <div
          role="group"
          aria-label="도형 선택"
          className="flex gap-1 rounded-2xl bg-slate-100 p-1"
        >
          {(
            [
              ['cuboid', '직육면체', 'soPrism'],
              ['cube', '정육면체', 'soCube'],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                sound.playPop();
                setSolid(id);
              }}
              aria-pressed={solid === id}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                solid === id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <GameIcon name={icon} className="h-6 w-6" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-violet-100 bg-violet-50 p-4 sm:flex-row">
        <GameIcon name="soLabeled" className="h-28 w-32" />
        <div className="flex-1 space-y-2">
          <h4 className="font-extrabold text-violet-950">
            {isCube
              ? '정육면체는 정사각형 6개로 둘러싸인 도형이에요'
              : '직육면체는 직사각형 6개로 둘러싸인 도형이에요'}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {PARTS.map((part) => (
              <div key={part.name} className="rounded-lg bg-white p-2 text-center shadow-sm">
                <div className="text-2xl font-black text-violet-700">{part.count}</div>
                <div className="text-xs font-bold text-slate-700">{part.name}</div>
                <div className="text-[11px] text-slate-500">{part.note}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-violet-900">
            한 꼭짓점에서는 모서리 3개와 면 3개가 만나고, 마주 보는 면끼리는 평행해요.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <GameIcon name="soWire" className="h-7 w-7" />
          모서리 길이를 바꿔 보세요
        </p>
        <div className={`grid gap-3 ${isCube ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {isCube
            ? slider('a', '한 모서리')
            : [slider('a', '가로'), slider('b', '세로'), slider('c', '높이')]}
        </div>
        <div className="rounded-2xl bg-slate-900 p-5 text-center text-white">
          <div className="text-xs text-slate-300">
            {isCube ? '길이가 같은 모서리 12개' : '가로·세로·높이 모서리가 4개씩'}
          </div>
          <div className="mt-1 text-xl font-black text-violet-300 sm:text-2xl">
            {isCube
              ? `${edges.a} × 12 = ${edgeSum}cm`
              : `(${edges.a} + ${edges.b} + ${edges.c}) × 4 = ${edgeSum}cm`}
          </div>
          <div className="text-sm text-slate-200">모든 모서리 길이의 합</div>
        </div>
      </div>

      <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
        <h4 className="font-extrabold text-violet-950">전개도는 상자를 펼친 그림이에요</h4>
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <GameIcon name="soNet" className="h-24 w-24" />
          <GameIcon name="soNetAlt" className="h-24 w-24" />
          <p className="flex-1 text-sm leading-relaxed text-violet-900">
            정육면체의 전개도는 정사각형 6개로 되어 있고, 모양은 모두 11가지예요. 전개도를 접으면 한
            칸 건너뛴 면끼리 마주 보며 평행한 면이 되고, 이웃한 면은 수직으로 만나요.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <GameIcon name="uiBulb" className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          <strong>기억해요:</strong> 직육면체와 정육면체는 모두 면 6개, 모서리 12개, 꼭짓점 8개예요.
          정육면체는 모든 모서리의 길이가 같아요.
        </p>
      </div>
    </section>
  );
};
