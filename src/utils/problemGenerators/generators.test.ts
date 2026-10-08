import { expect, test } from 'bun:test';
import type { Difficulty, TopicId } from '../../types/math';
import { checkAnswer, formatAnswer } from '../answer';
import { gcd, josa } from '../mathHelpers';
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

test('particles after numbers match how the number is read', () => {
  const base = { 와: '과', 를: '을', 가: '이', 는: '은', 로: '으로' } as Record<string, string>;
  // "12와", "3/4을", "2.5는" before a space or punctuation; copulas such as "4이므로" are not checked
  const particle = /((?:\d+\/)?\d+(?:\.\d+)?)(과|와|을|를|이|가|은|는|으로|로)(?=[\s,.!?:)]|$)/g;
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 300; i++) {
        const p = generateProblem(topic.id, difficulty);
        for (const text of [p.question, p.hint, ...p.explanations.map((e) => e.content)]) {
          for (const [, n, word] of text.matchAll(particle)) {
            expect(`${n}${word}`).toBe(josa(n, (base[word] ?? word) as Parameters<typeof josa>[1]));
          }
        }
      }
    }
  }
});

test('rounded and percent answers are exact', () => {
  for (const topicId of ['decimals', 'ratios'] as TopicId[]) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 5000; i++) {
        const p = generateProblem(topicId, difficulty);
        const nums = (p.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
        const places = p.question.includes('첫째') ? 1 : 2;
        const answer = Number(p.correctAnswer);
        if (p.subtopic === '백분율 (%)') {
          const [total, part] = nums;
          expect(answer * total).toBe(part * 100);
        } else if (p.subtopic === '어림하기 (반올림)') {
          const thousandths = Math.round(nums[0] * 1000);
          const div = 10 ** (3 - places);
          expect(answer).toBe(Math.floor((thousandths + div / 2) / div) / 10 ** places);
        } else if (p.subtopic === '몫을 반올림하여 나타내기') {
          const [a, b] = nums;
          const cut = Math.floor((a * 10 ** (places + 1)) / b);
          expect(answer).toBe(Math.floor((cut + 5) / 10) / 10 ** places);
        }
      }
    }
  }
});

test('does not repeat a recent question', () => {
  const recent: string[] = [];
  for (let i = 0; i < 30; i++) recent.push(generateProblem('factors', 'easy').question);
  expect(new Set(recent.slice(-10)).size).toBe(10);
});

test('numbers stay small enough for mental math', () => {
  // Money stays in round thousands, a few place-value types read 3-digit numbers
  const limits: Record<string, number> = {
    할인율: 10000,
    '비례 관계와 가격': 10000,
    '어림하기 (버림)': 10000,
    '소수점의 이동': 1000, // "× 1000" itself
    '길이·무게·들이 단위 바꾸기': 999,
    '소수의 크기 (0.1, 0.01의 개수)': 399,
    '원의 넓이': 201, // 8 × 8 × 3.14 = 200.96
  };
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 2000; i++) {
        const p = generateProblem(topic.id, difficulty);
        const answer =
          p.answerType === 'fraction'
            ? Math.max(
                (p.correctAnswer as { num: number; den: number }).num,
                (p.correctAnswer as { num: number; den: number }).den,
              )
            : Number(p.correctAnswer);
        const nums = (p.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
        const largest = Math.max(answer, ...nums);
        if (largest > (limits[p.subtopic] ?? 200)) {
          throw new Error(`${p.subtopic} (${difficulty}): ${largest} in "${p.question}"`);
        }
      }
    }
  }
});
