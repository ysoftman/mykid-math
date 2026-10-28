import type React from 'react';
import type {
  ProblemVisual,
  SymmetryFigureId,
  TriangleSideId,
  TriangleVertexId,
} from '../../types/math';

const SHAPE_POINTS: Record<SymmetryFigureId, string> = {
  square: '42,30 158,30 158,146 42,146',
  rectangle: '25,55 175,55 175,125 25,125',
  'equilateral-triangle': '100,24 168,146 32,146',
  'isosceles-triangle': '100,24 150,146 50,146',
  rhombus: '100,35 175,90 100,145 25,90',
  parallelogram: '52,35 172,35 148,145 28,145',
  hexagon: '100,22 160,55 160,125 100,158 40,125 40,55',
  trapezoid: '42,35 122,35 174,145 30,145',
};

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

// Old wrong notes saved before lengths existed fall back to this shape
const DEFAULT_LENGTHS: [number, number, number] = [5, 6, 7];

type Point = { x: number; y: number };

// A, B, C of a triangle with sides AB, BC, CA drawn to scale inside a 200×150 box, its base centered on origin
function trianglePoints(
  [ab, bc, ca]: [number, number, number],
  origin: Point,
  mirror: boolean,
): Point[] {
  const bx = (ab * ab - bc * bc + ca * ca) / (2 * ca);
  const raw = [
    { x: 0, y: 0 },
    { x: bx, y: -Math.sqrt(ab * ab - bx * bx) },
    { x: ca, y: 0 },
  ];
  const minX = Math.min(0, bx);
  const maxX = Math.max(ca, bx);
  const scale = Math.min(200 / (maxX - minX), 150 / -raw[1].y);
  return raw.map(({ x, y }) => {
    const dx = (x - (minX + maxX) / 2) * scale;
    return { x: origin.x + (mirror ? -dx : dx), y: origin.y + y * scale };
  });
}

const TRIANGLES = [
  {
    vertices: 'ABC',
    sides: ['AB', 'BC', 'CA'] as TriangleSideId[],
    mirror: false,
    fill: '#cffafe',
    stroke: '#0891b2',
  },
  {
    vertices: 'DEF',
    sides: ['DE', 'EF', 'FD'] as TriangleSideId[],
    mirror: true,
    fill: '#fef3c7',
    stroke: '#d97706',
  },
];

// Side by side from sm up; stacked on a phone, where side by side would shrink the labels too small to read
const LAYOUTS = [
  {
    viewBox: '0 0 600 260',
    className: 'mx-auto hidden h-48 min-w-[460px] max-w-3xl sm:block sm:h-56',
    origins: [
      { x: 150, y: 190 },
      { x: 450, y: 190 },
    ],
    titleGap: 55,
    equals: { x: 300, y: 120 },
  },
  {
    viewBox: '0 0 300 500',
    className: 'mx-auto w-full max-w-xs sm:hidden',
    origins: [
      { x: 150, y: 190 },
      { x: 150, y: 445 },
    ],
    titleGap: 40,
    equals: { x: 150, y: 257 },
  },
];

const labelStyle = {
  fontWeight: 700,
  paintOrder: 'stroke',
  stroke: 'white',
  strokeLinejoin: 'round',
  strokeWidth: 5,
  dominantBaseline: 'middle',
} as const;

const CongruentTrianglesDiagram: React.FC<
  Extract<ProblemVisual, { kind: 'congruent-triangles' }>
> = ({
  lengths = DEFAULT_LENGTHS,
  firstSides,
  secondSides = {},
  firstAngles = {},
  secondAngles = {},
}) => {
  const sideValues = { ...firstSides, ...secondSides };
  const angleValues = { ...firstAngles, ...secondAngles };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 sm:p-4">
      {LAYOUTS.map(({ viewBox, className, origins, titleGap, equals }) => (
        <svg
          key={viewBox}
          viewBox={viewBox}
          role="img"
          aria-label="서로 합동인 삼각형 ABC와 삼각형 DEF 및 변의 길이와 각의 크기"
          className={className}
        >
          {TRIANGLES.map(({ vertices, sides, mirror, fill, stroke }, t) => {
            const origin = origins[t];
            const points = trianglePoints(lengths, origin, mirror);
            const center = {
              x: (points[0].x + points[1].x + points[2].x) / 3,
              y: (points[0].y + points[1].y + points[2].y) / 3,
            };
            // Pushes a point away from the triangle's center so labels sit outside it
            const outward = (point: Point, distance: number) => {
              const length = Math.hypot(point.x - center.x, point.y - center.y);
              return {
                x: point.x + ((point.x - center.x) / length) * distance,
                y: point.y + ((point.y - center.y) / length) * distance,
              };
            };

            return (
              <g key={vertices}>
                <polygon
                  points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {points.map((point, index) => {
                  const { x, y } = outward(point, 16);
                  return (
                    <text
                      key={vertices[index]}
                      x={x}
                      y={y}
                      fill="#0f172a"
                      fontSize="17"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {vertices[index]}
                    </text>
                  );
                })}
                {points.map((point, index) => {
                  const value = angleValues[vertices[index] as TriangleVertexId];
                  if (!value) return null;
                  // Unit vectors along the two sides meeting at this corner
                  const [u, v] = [points[(index + 1) % 3], points[(index + 2) % 3]].map((other) => {
                    const length = Math.hypot(other.x - point.x, other.y - point.y);
                    return { x: (other.x - point.x) / length, y: (other.y - point.y) / length };
                  });
                  const angle = Math.acos(u.x * v.x + u.y * v.y);
                  // Along the bisector, far enough in that the label fits between the two sides
                  const distance = Math.min(60, Math.max(24, 16 / Math.tan(angle / 2)));
                  const bisector = Math.hypot(u.x + v.x, u.y + v.y);
                  return (
                    <text
                      key={`angle-${vertices[index]}`}
                      x={point.x + ((u.x + v.x) / bisector) * distance}
                      y={point.y + ((u.y + v.y) / bisector) * distance}
                      fill={value === '?' ? '#4f46e5' : '#0f172a'}
                      fontSize={value === '?' ? 16 : 13}
                      textAnchor="middle"
                      {...labelStyle}
                    >
                      {value}
                    </text>
                  );
                })}
                {sides.map((side, index) => {
                  const value = sideValues[side];
                  if (!value) return null;
                  const from = points[index];
                  const to = points[(index + 1) % 3];
                  const dx = to.x - from.x;
                  const dy = to.y - from.y;
                  const length = Math.hypot(dx, dy);
                  const middle = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
                  // Normal of the side, flipped to point away from the triangle
                  let normalX = -dy / length;
                  let normalY = dx / length;
                  if (normalX * (middle.x - center.x) + normalY * (middle.y - center.y) < 0) {
                    normalX *= -1;
                    normalY *= -1;
                  }

                  return (
                    <text
                      key={side}
                      x={middle.x + normalX * 14}
                      y={middle.y + normalY * 14}
                      fill={value === '?' ? '#4f46e5' : '#0f172a'}
                      fontSize={value === '?' ? 18 : 15}
                      textAnchor={normalX > 0.35 ? 'start' : normalX < -0.35 ? 'end' : 'middle'}
                      {...labelStyle}
                    >
                      {value}
                    </text>
                  );
                })}
                <text
                  x={origin.x}
                  y={origin.y + titleGap}
                  fill="#475569"
                  fontSize="15"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  삼각형 {vertices}
                </text>
              </g>
            );
          })}
          <text
            x={equals.x}
            y={equals.y}
            fill="#4f46e5"
            fontSize="21"
            fontWeight="700"
            textAnchor="middle"
          >
            ≡
          </text>
        </svg>
      ))}
    </div>
  );
};

export const ProblemDiagram: React.FC<{ visual: ProblemVisual }> = ({ visual }) => {
  if (visual.kind === 'shape-set') return <ShapeSetDiagram {...visual} />;
  return <CongruentTrianglesDiagram {...visual} />;
};
