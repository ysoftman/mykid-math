import { expect, test } from 'bun:test';
import type { Difficulty } from '../types/math';
import { checkAnswer, formatAnswer } from './answer';
import { gcd } from './mathHelpers';
import { lineTotal, makeShoppingRound, ROUND_TYPES, STORES } from './shopping';

const LIMITS: Record<Difficulty, number> = { easy: 10000, medium: 30000, hard: 50000 };

test('catalog ids are unique image names', () => {
  const ids = STORES.flatMap((s) => [s.id, ...s.goods.map((g) => g.id)]);
  expect(new Set(ids).size).toBe(ids.length);
  for (const s of STORES) for (const g of s.goods) expect(g.price % 100).toBe(0);
});

test.each(['easy', 'medium', 'hard'] as Difficulty[])(
  '%s rounds have matching answers',
  (difficulty) => {
    for (let i = 0; i < 500; i++) {
      for (const type of new Set(ROUND_TYPES)) {
        const r = makeShoppingRound(type, difficulty);
        expect(JSON.stringify(r)).not.toMatch(/NaN|undefined|Infinity/);
        expect(checkAnswer(r.problem, formatAnswer(r.problem))).toBe('correct');
        for (const l of r.lines) expect(lineTotal(l) % 100).toBe(0);
        const total = r.lines.reduce((sum, l) => sum + lineTotal(l), 0);
        if (type === 'rate') {
          const { num, den } = r.problem.correctAnswer as { num: number; den: number };
          const { price } = r.lines[0].goods;
          expect(gcd(num, den)).toBe(1);
          expect(price - total).toBe((price / den) * num);
        } else {
          expect(r.lines.some((l) => l.discount)).toBe(true);
          expect(total).toBeLessThan(LIMITS[difficulty]);
          expect(r.problem.correctAnswer).toBe(type === 'pay' ? total : r.paid - total);
          if (type === 'change') expect(r.paid).toBeGreaterThan(total);
        }
      }
    }
  },
);
