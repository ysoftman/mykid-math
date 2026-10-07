import type React from 'react';

export const LabGuide: React.FC = () => (
  <ol aria-label="실험 순서" className="flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
    <li className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
        1
      </span>
      값을 바꿔요
    </li>
    <li className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
        2
      </span>
      그림을 살펴봐요
    </li>
    <li className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-sm text-white">
        3
      </span>
      결과를 확인해요
    </li>
  </ol>
);
