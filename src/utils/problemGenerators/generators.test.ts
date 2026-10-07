import { expect, test } from 'bun:test';
import type { Difficulty, TopicId } from '../../types/math';
import { checkAnswer, formatAnswer } from '../answer';
import { gcd } from '../mathHelpers';
import { generateProblem, TOPICS } from '.';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

test.each(TOPICS.map((t) => t.id as TopicId))('%s generates valid problems', (topicId) => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 1000; i++) {
      const p = generateProblem(topicId, difficulty);
      const text = JSON.stringify(p);
      expect(text).not.toMatch(/NaN|undefined|Infinity/);
      if (p.answerType === 'fraction') {
        const f = p.correctAnswer as { num: number; den: number };
        expect(f.den).toBeGreaterThan(0);
        expect(gcd(f.num, f.den)).toBe(1);
      } else {
        expect(Number(p.correctAnswer)).toBeGreaterThan(0);
      }
      // The displayed answer must be accepted as correct
      expect(checkAnswer(p, formatAnswer(p))).toBe('correct');
    }
  }
});

test('does not repeat a recent question', () => {
  const recent: string[] = [];
  for (let i = 0; i < 30; i++) recent.push(generateProblem('factors', 'easy').question);
  expect(new Set(recent.slice(-10)).size).toBe(10);
});
