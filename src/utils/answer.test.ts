import { expect, test } from 'bun:test';
import type { Problem } from '../types/math';
import { checkAnswer, cleanAnswerInput, formatAnswer, MAX_ANSWER_LENGTH } from './answer';

const base = {
  id: 't',
  topicId: 'fractions',
  subtopic: '',
  difficulty: 'easy',
  question: '',
  hint: '',
  explanations: [],
} as const;
const frac = (num: number, den: number): Problem => ({
  ...base,
  answerType: 'fraction',
  correctAnswer: { num, den },
});
const num = (n: number): Problem => ({ ...base, answerType: 'number', correctAnswer: n });

test('fraction answers', () => {
  expect(checkAnswer(frac(3, 4), '3/4')).toBe('correct');
  expect(checkAnswer(frac(3, 4), ' 3 / 4 ')).toBe('correct');
  expect(checkAnswer(frac(3, 4), '6/8')).toBe('unreduced');
  expect(checkAnswer(frac(3, 4), '1/4')).toBe('wrong');
  expect(checkAnswer(frac(3, 4), '3/0')).toBe('wrong');
  expect(checkAnswer(frac(3, 4), '')).toBe('empty');
  expect(checkAnswer(frac(3, 4), '/4')).toBe('empty');
});

test('whole-number fraction answers accept a bare numerator', () => {
  expect(checkAnswer(frac(3, 1), '3')).toBe('correct');
  expect(checkAnswer(frac(3, 1), '3/')).toBe('correct');
  expect(checkAnswer(frac(3, 1), '3/1')).toBe('correct');
  expect(checkAnswer(frac(3, 1), '6/2')).toBe('unreduced');
  expect(formatAnswer(frac(3, 1))).toBe('3');
  expect(formatAnswer(frac(3, 4))).toBe('3/4');
});

test('number answers', () => {
  expect(checkAnswer(num(0.3), '0.3')).toBe('correct');
  expect(checkAnswer(num(0.1 + 0.2), '0.3')).toBe('correct');
  expect(checkAnswer(num(37.91), '37.9')).toBe('wrong');
  expect(checkAnswer(num(12), '12abc')).toBe('wrong');
  expect(checkAnswer(num(12), '  ')).toBe('empty');
});

test('answer boxes keep only digits and one separator', () => {
  expect(cleanAnswerInput('12a.5.3', '.')).toBe('12.53');
  expect(cleanAnswerInput('1e5', '.')).toBe('15');
  expect(cleanAnswerInput('3/4/5', '/')).toBe('3/45');
  expect(cleanAnswerInput('3.5')).toBe('35');
  expect(cleanAnswerInput('가나다abc'.repeat(20), '.')).toBe('');
  expect(cleanAnswerInput('9'.repeat(100), '.')).toHaveLength(MAX_ANSWER_LENGTH);
  expect(checkAnswer(num(3), '.')).toBe('empty');
});
