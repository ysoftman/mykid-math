import type React from 'react';
import type { ProblemVisual, SymmetryFigureId, TriangleSideId } from '../../types/math';

const SHAPE_POINTS: Record<SymmetryFigureId, string> = {
  square: '42,30 158,30 158,146 42,146',
  rectangle: '25,55 175,55 175,125 25,125',
  'equilateral-triangle': '100,24 168,146 32,146',
  'isosceles-triangle': '100,24 150,146 50,146',
  rhombus: '100,35 175,90 100,145 25,90',
  parallelogram: '52,35 172,35 148,145 28,145',
  hexagon: '100,22 160,55 160,125 100,158 40,125 40,55',
  trapezoid: '62,35 140,35 174,145 30,145',
};

const TRIANGLE_LABELS: {
  side: TriangleSideId;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  sideX1: number;
  sideY1: number;
  sideX2: number;
  sideY2: number;
}[] = [
  {
    side: 'AB',
    x: 82,
    y: 114,
    anchor: 'end',
    sideX1: 60,
    sideY1: 190,
    sideX2: 150,
    sideY2: 45,
  },
  {
    side: 'BC',
    x: 218,
    y: 114,
    anchor: 'start',
    sideX1: 150,
    sideY1: 45,
    sideX2: 240,
    sideY2: 190,
  },
  {
    side: 'CA',
    x: 150,
    y: 215,
    anchor: 'middle',
    sideX1: 240,
    sideY1: 190,
    sideX2: 60,
    sideY2: 190,
  },
  {
    side: 'DE',
    x: 382,
    y: 114,
    anchor: 'end',
    sideX1: 360,
    sideY1: 190,
    sideX2: 450,
    sideY2: 45,
  },
  {
    side: 'EF',
    x: 518,
    y: 114,
    anchor: 'start',
    sideX1: 450,
    sideY1: 45,
    sideX2: 540,
    sideY2: 190,
  },
  {
    side: 'FD',
    x: 450,
    y: 215,
    anchor: 'middle',
    sideX1: 540,
    sideY1: 190,
    sideX2: 360,
    sideY2: 190,
  },
];

const ShapeCard: React.FC<{ figure: SymmetryFigureId; label: string }> = ({ figure, label }) => (
  <figure className="flex min-w-0 flex-col items-center rounded-xl border border-slate-200 bg-white px-2 py-3">
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label={`${label} 그림`}
      className="h-28 w-full max-w-44"
    >
      <polygon
        points={SHAPE_POINTS[figure]}
        fill="#cffafe"
        stroke="#0891b2"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
    <figcaption className="mt-1 text-center text-xs font-bold leading-snug text-slate-700">
      {label}
    </figcaption>
  </figure>
);

const ShapeSetDiagram: React.FC<Extract<ProblemVisual, { kind: 'shape-set' }>> = ({ shapes }) => (
  <div
    aria-label="문제에 나온 도형 그림"
    className={`mx-auto grid w-full gap-3 ${
      shapes.length === 1 ? 'max-w-xs grid-cols-1' : 'max-w-3xl grid-cols-2 sm:grid-cols-3'
    }`}
  >
    {shapes.map((shape) => (
      <ShapeCard key={`${shape.figure}-${shape.label}`} figure={shape.figure} label={shape.label} />
    ))}
  </div>
);

const CongruentTrianglesDiagram: React.FC<
  Extract<ProblemVisual, { kind: 'congruent-triangles' }>
> = ({ firstSides, secondSides = {}, dottedArcs = [] }) => {
  const sideValues = { ...firstSides, ...secondSides };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 sm:p-4">
      <svg
        viewBox="0 0 600 260"
        role="img"
        aria-label="서로 합동인 삼각형 ABC와 DEF 및 대응변의 길이"
        className="mx-auto h-48 min-w-[460px] max-w-3xl sm:h-56"
      >
        <path d="M 60 190 L 150 45 L 240 190 Z" fill="#cffafe" stroke="#0891b2" strokeWidth="4" />
        <path d="M 360 190 L 450 45 L 540 190 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />
        {TRIANGLE_LABELS.map(({ side, sideX1, sideY1, sideX2, sideY2 }) => {
          if (!dottedArcs.includes(side)) return null;
          const isFirstTriangle = side === 'AB' || side === 'BC' || side === 'CA';
          const color = isFirstTriangle ? '#0891b2' : '#d97706';
          const dx = sideX2 - sideX1;
          const dy = sideY2 - sideY1;
          const length = Math.hypot(dx, dy);
          let normalX = -dy / length;
          let normalY = dx / length;
          const middleX = (sideX1 + sideX2) / 2;
          const middleY = (sideY1 + sideY2) / 2;
          const triangleCenterX = isFirstTriangle ? 150 : 450;
          const triangleCenterY = 425 / 3;
          const outwardDot =
            normalX * (middleX - triangleCenterX) + normalY * (middleY - triangleCenterY);
          if (outwardDot < 0) {
            normalX *= -1;
            normalY *= -1;
          }
          const controlX = middleX + normalX * 32;
          const controlY = middleY + normalY * 32;
          const labelX = middleX + normalX * 16;
          const labelY = middleY + normalY * 16;
          const value = sideValues[side];

          return (
            <g key={side}>
              <path
                d={`M ${sideX1} ${sideY1} Q ${controlX} ${controlY} ${sideX2} ${sideY2}`}
                fill="none"
                stroke={color}
                strokeDasharray="2 5"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <text
                x={labelX}
                y={labelY}
                fill="#0f172a"
                fontSize="14"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                paintOrder="stroke"
                stroke="white"
                strokeLinejoin="round"
                strokeWidth="5"
              >
                {value}
              </text>
            </g>
          );
        })}
        <g fill="#0f172a" fontSize="17" fontWeight="700" textAnchor="middle">
          <text x="49" y="202">
            A
          </text>
          <text x="150" y="35">
            B
          </text>
          <text x="251" y="202">
            C
          </text>
          <text x="349" y="202">
            D
          </text>
          <text x="450" y="35">
            E
          </text>
          <text x="551" y="202">
            F
          </text>
        </g>
        {TRIANGLE_LABELS.map(({ side, x, y, anchor }) => {
          if (dottedArcs.includes(side)) return null;
          const value = sideValues[side];
          if (!value) return null;

          return (
            <text
              key={side}
              x={x}
              y={y}
              fill="#0f172a"
              fontSize="14"
              fontWeight="700"
              textAnchor={anchor}
              paintOrder="stroke"
              stroke="white"
              strokeLinejoin="round"
              strokeWidth="5"
            >
              {side} {value}
            </text>
          );
        })}
        <text x="300" y="120" fill="#4f46e5" fontSize="21" fontWeight="700" textAnchor="middle">
          ≡
        </text>
        <g fill="#475569" fontSize="15" fontWeight="700" textAnchor="middle">
          <text x="150" y="250">
            △ABC
          </text>
          <text x="450" y="250">
            △DEF
          </text>
        </g>
      </svg>
    </div>
  );
};

export const ProblemDiagram: React.FC<{ visual: ProblemVisual }> = ({ visual }) => {
  if (visual.kind === 'shape-set') return <ShapeSetDiagram {...visual} />;
  return <CongruentTrianglesDiagram {...visual} />;
};
