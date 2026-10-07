import type { Problem } from '../types/math';

export type AnswerResult = 'empty' | 'correct' | 'unreduced' | 'wrong';

// Fraction input is "num/den"; a bare "3" or "3/" means the whole number 3 (= 3/1).
export function checkAnswer(problem: Problem, input: string): AnswerResult {
  const raw = input.trim();
  if (problem.answerType === 'fraction') {
    const [numText, denText = ''] = raw.split('/').map((s) => s.trim());
    if (numText === '') return 'empty';
    const num = Number(numText);
    const den = denText === '' ? 1 : Number(denText);
    if (!Number.isInteger(num) || !Number.isInteger(den) || den === 0) return 'wrong';
    const target = problem.correctAnswer as { num: number; den: number };
    if (num === target.num && den === target.den) return 'correct';
    return num * target.den === den * target.num ? 'unreduced' : 'wrong';
  }
  if (raw === '') return 'empty';
  const value = Number(raw);
  return Number.isFinite(value) && Math.abs(value - Number(problem.correctAnswer)) < 1e-6
    ? 'correct'
    : 'wrong';
}

export function formatAnswer(problem: Problem): string {
  if (problem.answerType === 'fraction') {
    const f = problem.correctAnswer as { num: number; den: number };
    return f.den === 1 ? String(f.num) : `${f.num}/${f.den}`;
  }
  return String(problem.correctAnswer);
}
