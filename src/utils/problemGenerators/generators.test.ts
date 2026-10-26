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
      } else if (topicId === 'symmetry') {
        // A parallelogram or trapezoid has no line of symmetry, so 0 is a real answer here
        expect(Number(p.correctAnswer)).toBeGreaterThanOrEqual(0);
      } else {
        expect(Number(p.correctAnswer)).toBeGreaterThan(0);
      }
      // The displayed answer must be accepted as correct
      expect(checkAnswer(p, formatAnswer(p))).toBe('correct');
    }
  }
});

test('congruent triangles are drawn from the lengths they show', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 1000; i++) {
      const { visual } = generateProblem('symmetry', difficulty);
      if (visual?.kind !== 'congruent-triangles') continue;
      const [ab, bc, ca] = visual.lengths ?? [];
      expect(new Set([ab, bc, ca]).size).toBe(3);
      expect(ab + bc + ca).toBeGreaterThan(2 * Math.max(ab, bc, ca));
      expect(visual.firstSides.AB ?? `${ab}cm`).toBe(`${ab}cm`);
      expect(visual.firstSides.BC ?? `${bc}cm`).toBe(`${bc}cm`);
      expect(visual.firstSides.CA ?? `${ca}cm`).toBe(`${ca}cm`);
    }
  }
});

test('particles match how the number or word before them is read', () => {
  const base = { 와: '과', 를: '을', 가: '이', 는: '은', 로: '으로' } as Record<string, string>;
  const vowel = { 과: '와', 을: '를', 이: '가', 은: '는', 으로: '로' } as Record<string, string>;
  // "12와", "3/4을", "2.5는" before a space or punctuation; copulas such as "4이므로" are not checked
  const particle = /((?:\d+\/)?\d+(?:\.\d+)?)(과|와|을|를|이|가|은|는|으로|로)(?=[\s,.!?:)]|$)/g;
  // Shape words filled into templates, such as "모서리는" and "꼭짓점이"
  const words =
    '꼭짓점|모서리|밑면|옆면|겉넓이|넓이|높이|둘레|부피|원주|지름|반지름|대각선|밑변|윗변|아랫변|변|면';
  const wordParticle = new RegExp(
    `(?<![가-힣])(${words})(과|와|을|를|이|가|은|는|으로|로)(?=[\\s,.!?:)]|$)`,
    'g',
  );
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 300; i++) {
        const p = generateProblem(topic.id, difficulty);
        for (const text of [p.question, p.hint, ...p.explanations.map((e) => e.content)]) {
          for (const [, n, word] of text.matchAll(particle)) {
            expect(`${n}${word}`).toBe(josa(n, (base[word] ?? word) as Parameters<typeof josa>[1]));
          }
          for (const [, w, word] of text.matchAll(wordParticle)) {
            // Final consonant of the last syllable: 0 is none, 8 is ㄹ, which takes 로 like a vowel
            const final = (w.charCodeAt(w.length - 1) - 0xac00) % 28;
            const consonant = final !== 0 && !(final === 8 && word.endsWith('로'));
            expect(`${w}${word}`).toBe(
              `${w}${consonant ? (base[word] ?? word) : (vowel[word] ?? word)}`,
            );
          }
        }
      }
    }
  }
});

test('explanations are numbered, add up and end with the answer', () => {
  // "6개 + 3개 = 9개": one operation between two numbers with only words or units around them.
  // Longer chains such as "6 + 12 + 8 = 26" and remainders such as "7 ÷ 2 = 3 ... 1" are skipped.
  const oneStep =
    /(?<![\d.+\-×÷/(]\s*)(\d+(?:\.\d+)?)[가-힣a-z²³\s]*([+\-×÷])[가-힣a-z²³\s]*(\d+(?:\.\d+)?)[가-힣a-z²³\s]*=\s*(\d+(?:\.\d+)?)(?!\d|\.\d|\s*(?:[+\-×÷/]|\.\.\.))/g;
  const ops: Record<string, (a: number, b: number) => number> = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '×': (a, b) => a * b,
    '÷': (a, b) => a / b,
  };
  // "150에서 소수점을 왼쪽으로 3칸 옮기면 0.150" before the trailing 0 is dropped
  const shift = /(\d+)에서 소수점을 왼쪽으로 (\d+|한) ?칸 옮기면 ([\d.]+)/;
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 1000; i++) {
        const p = generateProblem(topic.id, difficulty);
        const steps = p.explanations
          .map((e) => e.title.match(/^(\d+)단계/)?.[1])
          .filter(Boolean)
          .map(Number);
        expect(steps).toEqual(steps.map((_, k) => k + 1));
        for (const text of [p.question, p.hint, ...p.explanations.map((e) => e.content)]) {
          for (const [m, a, op, b, c] of text.matchAll(oneStep)) {
            if (Math.abs(ops[op](Number(a), Number(b)) - Number(c)) > 1e-9) {
              throw new Error(`${p.subtopic}: "${m}" in "${text}"`);
            }
          }
          const s = text.match(shift);
          if (s) {
            const places = s[2] === '한' ? 1 : Number(s[2]);
            expect(s[3]).toBe((Number(s[1]) / 10 ** places).toFixed(places));
          }
        }
        // This answer is a count of decimal places, which the first step spells out as "소수 세 자리"
        if (p.subtopic === '곱의 소수점 아래 자리 수') continue;
        // A fraction must appear as displayed ("2", not "2/1"); a decimal may keep a 0 as in "36.0"
        const last = p.explanations.at(-1)?.content ?? '';
        const shown = last.match(/\d+(?:\.\d+)?(?:\/\d+)?/g) ?? [];
        const answer = formatAnswer(p);
        const ok =
          p.answerType === 'fraction'
            ? shown.includes(answer)
            : shown.some((n) => Math.abs(Number(n) - Number(answer)) < 1e-6);
        if (!ok) throw new Error(`${p.subtopic}: "${last}" does not show ${answer}`);
      }
    }
  }
});

test('wording follows the elementary textbook', () => {
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 1000; i++) {
        const p = generateProblem(topic.id, difficulty);
        const text = [p.subtopic, p.question, p.hint, ...p.explanations.map((e) => e.content)];
        expect(text.join(' ')).not.toMatch(/역수|거꾸로 나눗셈|GCD|LCM|\[|기약분수로 나타내면/);
        for (const e of p.explanations) {
          expect(e.title).not.toContain('/');
          // "약분하기: 7/10 = 7/10" reduces nothing
          if (e.title.includes('약분')) expect(e.content).not.toMatch(/(\d+\/\d+) = \1(?![\d/])/);
        }
        // Textbooks write 0.5, not 0.50
        if (/소수의 (덧셈|뺄셈)|어림하기 \(반올림\)/.test(p.subtopic)) {
          expect(p.question).not.toMatch(/\d\.\d*0(?!\d)/);
        }
      }
    }
  }
});

test('problems are not trivial', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 2000; i++) {
      const f = generateProblem('factors', difficulty);
      if (f.subtopic === '공배수 활용') {
        // If one number divides the other, the larger one is already the least common multiple
        const [a, b] = (f.question.match(/\d+/g) ?? []).map(Number);
        expect(a % b && b % a).toBeTruthy();
      }
      const q = generateProblem('fractions', difficulty);
      if (q.subtopic === '분수의 나눗셈') expect(formatAnswer(q)).not.toBe('1');
      const r = generateProblem('ratios', difficulty);
      const [x, y] = (r.question.match(/(\d+) : (\d+)/) ?? []).slice(1).map(Number);
      if (r.subtopic === '비례배분') {
        expect(x).not.toBe(y);
        expect(gcd(x, y)).toBe(1);
      } else if (r.subtopic === '비례식의 성질') {
        expect(x).not.toBe(y);
      } else if (r.subtopic === '비율을 분수로') {
        // The type asks to reduce, so there is always a common factor
        expect(gcd(x, y)).toBeGreaterThan(1);
      }
      const m = generateProblem('averages', difficulty);
      // Raising the mean never needs a perfect score
      if (m.subtopic === '평균 올리기') expect(Number(m.correctAnswer)).toBeLessThan(100);
    }
  }
});

test('chance problems answer 0, 1/2 and 1', () => {
  for (const difficulty of DIFFICULTIES) {
    const answers = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('averages', difficulty);
      if (p.subtopic !== '가능성을 수로 나타내기') continue;
      answers.add(formatAnswer(p));
      // Hard drops the "(불가능하면 0, ...)" reminder
      expect(p.question.includes('(불가능하면')).toBe(difficulty !== 'hard');
    }
    expect([...answers].sort()).toEqual(['0', '1', '1/2']);
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
