import { expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Difficulty, TopicId } from '../types/math';
import { generateProblem, TOPICS } from '../utils/problemGenerators';
import { MathText } from './MathText';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

// What a child sees, with each stacked fraction written as [a/b]
const visible = (text: string) =>
  renderToStaticMarkup(createElement(MathText, { text }))
    .replace(/<span class="sr-only">[^<]*<\/span>/g, '')
    .replace(
      /<span class="px-0.5">([^<]*)<\/span><span class="px-0.5 border-t[^"]*">([^<]*)<\/span>/g,
      '[$1/$2]',
    )
    .replace(/<[^>]+>/g, '');

test('mixed numbers keep their whole part and a decimal before a fraction stays a decimal', () => {
  expect(visible('두 수 0.53과 11/20 중에서')).toBe('두 수 0.53과 [11/20] 중에서');
  expect(visible('12와 1/3 + 1과 4/5')).toBe('12[1/3] + 1[4/5]');
  expect(visible('두 분수 1/2과 1/3')).toBe('두 분수 [1/2]과 [1/3]');
});

test('no generated text loses the particle after a decimal', () => {
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 300; i++) {
        const p = generateProblem(topic.id as TopicId, difficulty);
        for (const text of [p.question, p.hint, ...p.explanations.map((e) => e.content)]) {
          const shown = visible(text);
          // "0.53과" must not turn into the mixed number "53과 11/20"
          for (const [m] of text.matchAll(/\d\.\d+[와과]/g)) expect(shown).toContain(m);
        }
      }
    }
  }
});
