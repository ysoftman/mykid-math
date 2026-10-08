import type React from 'react';

// "2와 1/3" (mixed number), "1/3", or "(5 - 3) / 15" and "(2 × 3) / (3 × 4)" (expressions)
const FRACTION =
  /(\d+)[와과] (\d+)\/(\d+)|(\d+|□)\/(\d+|□)|\((\d+ [-+×] \d+)\) ?\/ ?(?:\((\d+ [-+×] \d+)\)|(\d+))/g;

export const Fraction: React.FC<{ num: React.ReactNode; den: React.ReactNode }> = ({
  num,
  den,
}) => (
  <>
    <span className="sr-only">
      {den}분의 {num}
    </span>
    <span
      aria-hidden
      className="inline-flex flex-col items-center align-middle mx-0.5 text-[0.85em] leading-tight"
    >
      <span className="px-0.5">{num}</span>
      <span className="px-0.5 border-t-[1.5px] border-current w-full text-center">{den}</span>
    </span>
  </>
);

// Renders plain text with every "a/b" drawn as a stacked fraction
export const MathText: React.FC<{ text: string }> = ({ text }) => {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(FRACTION)) {
    parts.push(text.slice(last, m.index));
    parts.push(
      m[1] ? (
        <span key={m.index}>
          {m[1]}
          <Fraction num={m[2]} den={m[3]} />
        </span>
      ) : m[4] ? (
        <Fraction key={m.index} num={m[4]} den={m[5]} />
      ) : (
        <Fraction key={m.index} num={m[6]} den={m[7] ?? m[8]} />
      ),
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
};
