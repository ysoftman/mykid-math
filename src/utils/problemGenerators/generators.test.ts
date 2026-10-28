import { expect, test } from 'bun:test';
import type { Difficulty, TopicId } from '../../types/math';
import { checkAnswer, formatAnswer } from '../answer';
import { gcd, josa } from '../mathHelpers';
import { KID_CALL } from '../profile';
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

test('shape dimensions are not degenerate', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 2000; i++) {
      for (const topicId of ['geometry', 'solids'] as TopicId[]) {
        const p = generateProblem(topicId, difficulty);
        const nums = (p.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
        // A "rectangle" with equal sides is a square, a "cuboid" with three equal edges is a cube
        if (/가로가? \d+cm, 세로가? \d+cm인 직사각형/.test(p.question)) {
          expect(nums[0]).not.toBe(nums[1]);
        }
        if (/가로 \d+cm, 세로 \d+cm, 높이 \d+cm인 직육면체/.test(p.question)) {
          expect(nums[0] === nums[1] && nums[1] === nums[2]).toBe(false);
        }
        if (p.subtopic === '마름모의 넓이') expect(nums[0]).not.toBe(nums[1]);
      }
    }
  }
});

test('point symmetry and congruence questions name their figures', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('symmetry', difficulty);
      if (p.subtopic === '점대칭 도형' && p.visual?.kind === 'shape-set') {
        for (const s of p.visual.shapes) expect(p.question).toContain(s.label.split(' · ')[1]);
      }
      if (p.subtopic === '합동인 도형의 대응각') {
        const angles = [...p.question.matchAll(/각 [A-C]가 (\d+)°/g)].map((m) => Number(m[1]));
        if (angles.length === 3) expect(angles[0] + angles[1] + angles[2]).toBe(180);
      }
    }
  }
});

test('factor and fraction problems are not trivial', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 2000; i++) {
      const f = generateProblem('factors', difficulty);
      const nums = (f.question.match(/\d+/g) ?? []).map(Number);
      // A prime leaves only the pair 1 × itself to find
      if (f.subtopic === '약수 찾기') expect(Number(f.correctAnswer)).toBeGreaterThan(2);
      // The divisor must exceed both remainders; the dividend answer is a two-digit number
      if (f.subtopic === '나누는 수 구하기') {
        expect(Number(f.correctAnswer)).toBeGreaterThan(Math.max(nums[1], nums[3]));
      }
      if (f.subtopic === '나누어지는 수 구하기') {
        expect(Number(f.correctAnswer)).toBeGreaterThanOrEqual(10);
        expect(Number(f.correctAnswer)).toBeLessThan(100);
      }
      const q = generateProblem('fractions', difficulty);
      const [a, b, c, d] = (q.question.match(/(\d+)\/(\d+)\D+(\d+)\/(\d+)/) ?? [])
        .slice(1)
        .map(Number);
      if (q.subtopic === '분모가 같은 분수의 나눗셈') {
        expect(b).toBe(d);
        expect(c).toBeGreaterThan(1);
      }
      if (['분수의 나눗셈', '통분', '분수의 크기 비교'].includes(q.subtopic)) expect(b).not.toBe(d);
      // Given fractions are in lowest terms ("1 - 3/4" has only one fraction and is skipped)
      if (q.subtopic === '분모가 같은 분수의 계산' && b) {
        expect(gcd(a, b)).toBe(1);
        expect(gcd(c, d)).toBe(1);
      }
    }
  }
});

test('ratio answers follow from the numbers in the question', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 2000; i++) {
      const p = generateProblem('ratios', difficulty);
      const nums = (p.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
      const answer = Number(p.correctAnswer);
      if (p.subtopic === '비례식의 성질') {
        const [a, b, c, d] = (p.question.match(/(\d+|□) : (\d+|□) = (\d+|□) : (\d+|□)/) ?? [])
          .slice(1)
          .map((s) => (s === '□' ? answer : Number(s)));
        expect(a * d).toBe(b * c);
        expect(p.hint).not.toMatch(/\d+배/);
      } else if (p.subtopic === '비율을 소수로') {
        const [a, b] = p.question.includes('타수') ? [nums[1], nums[0]] : nums;
        expect(answer * b).toBeCloseTo(a, 9);
        expect(String(answer)).toMatch(/^0\.\d{1,2}$/);
      } else if (p.subtopic === '할인율' && p.question.includes('할인율은')) {
        const [price, sale] = nums;
        expect(answer * price).toBe((price - sale) * 100);
      } else if (p.subtopic === '걸린 시간에 대한 거리의 비율 (속력)' && nums.length >= 4) {
        expect(nums[1] / nums[0]).not.toBe(nums[3] / nums[2]);
        expect(answer).toBe(Math.max(nums[1] / nums[0], nums[3] / nums[2]));
      } else if (p.subtopic === '비의 성질' && difficulty === 'hard') {
        expect(p.question).not.toMatch(/^1 : /);
      } else if (p.subtopic === '두 수 비교하기 (몇 배)') {
        // "사과 21개, 귤 7개가 있습니다. 사과 수는 귤 수의 몇 배": the count asked about over the other
        const [first, second] = nums;
        const asked = p.question.match(/있습니다\. (.+?) 수는/)?.[1] ?? '';
        const [top, bottom] = p.question.startsWith(`${asked} `)
          ? [first, second]
          : [second, first];
        if (p.answerType === 'fraction') {
          const f = p.correctAnswer as { num: number; den: number };
          expect(f.num * bottom).toBe(f.den * top);
        } else {
          expect(answer * bottom).toBe(top);
        }
      } else if (p.subtopic === '비교하는 양 구하기') {
        // "기준량이 50이고 비율이 0.9" or "학생 63명 중 ... 비율은 5/9"
        const rate = nums.length > 2 ? nums[1] / nums[2] : nums[1];
        expect(answer).toBeCloseTo(nums[0] * rate, 9);
      } else if (p.subtopic === '기준량 구하기') {
        expect(answer * nums[1]).toBeCloseTo(nums[0], 9);
      } else if (p.subtopic === '넓이에 대한 인구의 비율 (인구 밀도)') {
        if (difficulty === 'hard') {
          expect(nums[1] / nums[0]).not.toBe(nums[3] / nums[2]);
          expect(answer).toBe(Math.max(nums[1] / nums[0], nums[3] / nums[2]));
        } else {
          expect(answer * nums[0]).toBe(nums[1]);
        }
      } else if (p.subtopic === '비례배분으로 전체 구하기') {
        const [r1, r2, given] = nums;
        const gap = p.question.includes('더 많이');
        const kidFirst = p.question.includes(`가졌더니 ${KID_CALL}가`);
        // The kid takes r1, the friend r2; the one said to have more must hold the larger term
        if (gap) expect(kidFirst).toBe(r1 > r2);
        const bundles = gap ? Math.abs(r1 - r2) : kidFirst ? r1 : r2;
        expect(answer * bundles).toBe(given * (r1 + r2));
      }
    }
  }
});

test('congruent angle labels match the question and hide the asked angle', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 1000; i++) {
      const p = generateProblem('symmetry', difficulty);
      if (p.visual?.kind !== 'congruent-triangles') continue;
      if (p.subtopic !== '합동인 도형의 대응각') {
        // Side problems keep their side labels only
        expect(p.visual.firstAngles ?? p.visual.secondAngles).toBeUndefined();
        continue;
      }
      const given = Object.fromEntries(
        [...p.question.matchAll(/각 ([A-C])가 (\d+)°/g)].map((m) => [m[1], `${m[2]}°`]),
      );
      const asked = p.question.match(/각 ([D-F])의 크기/)?.[1] ?? '';
      const source = 'ABC'['DEF'.indexOf(asked)];
      expect(p.visual.firstAngles).toEqual(given);
      expect(p.visual.secondAngles).toEqual({ [asked]: '?' });
      // Hard leaves the matching angle out, so it comes from the angle sum of 180°
      expect(source in given).toBe(difficulty !== 'hard');
      const sum = Object.values(given).reduce((s, a) => s + Number.parseInt(a, 10), 0);
      expect(p.correctAnswer).toBe(
        source in given ? Number.parseInt(given[source], 10) : 180 - sum,
      );
    }
  }
});

test('semicircle, prism base and folded paper answers follow from the question', () => {
  const names = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십'];
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 1000; i++) {
      const g = generateProblem('geometry', difficulty);
      const nums = (g.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
      if (g.subtopic === '반원의 넓이') {
        const r = g.question.startsWith('지름') ? nums[0] / 2 : nums[0];
        expect(Number(g.correctAnswer)).toBeCloseTo((r * r * 3.14) / 2, 9);
      }
      const base = g.question.match(/밑면이 (.)각형인 (각기둥|각뿔)의 (면|모서리|꼭짓점)/);
      if (base) {
        const n = names.indexOf(base[1]);
        const counts =
          base[2] === '각기둥'
            ? { 면: n + 2, 모서리: n * 3, 꼭짓점: n * 2 }
            : { 면: n + 1, 모서리: n * 2, 꼭짓점: n + 1 };
        expect(g.correctAnswer).toBe(counts[base[3] as keyof typeof counts]);
      }
      const s = generateProblem('symmetry', difficulty);
      if (s.subtopic === '선대칭 도형의 둘레') {
        const [n] = (s.question.match(/\d+/g) ?? []).map(Number);
        expect(s.correctAnswer).toBe(s.question.includes('오려 낸 선의 길이는') ? n / 2 : n * 2);
      }
    }
  }
});

test('fraction quotients, products and comparisons follow from the question', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 3000; i++) {
      const p = generateProblem('fractions', difficulty);
      // Only the expression after ':  ', so the 1 in '(1보다 크면 가분수로)' is skipped
      const nums = (
        p.question
          .split(':  ')
          .at(-1)
          ?.match(/\d+(?:\.\d+)?/g) ?? []
      ).map(Number);
      const f = p.correctAnswer as { num: number; den: number };
      if (p.subtopic === '자연수 ÷ 자연수') {
        const [a, b] = nums;
        expect(f.num * b).toBe(f.den * a);
        expect(a % b).not.toBe(0);
      } else if (p.subtopic === '세 분수의 곱셈') {
        const [a, b, c, d, e, g] = nums;
        expect(f.num * b * d * g).toBe(f.den * a * c * e);
        // Something always cancels, as in 1/2 × 2/3 × 3/4
        expect(gcd(a * c * e, b * d * g)).toBeGreaterThan(1);
      } else if (p.subtopic === '대분수 ÷ 분수') {
        const [w, a, b, c, d] = nums;
        expect(f.num * b * c).toBe(f.den * (w * b + a) * d);
      } else if (p.subtopic === '분수와 소수의 크기 비교') {
        const [, n, d] = (p.question.match(/(\d+)\/(\d+)/) ?? []).map(Number);
        const values = [n / d, Number(p.question.match(/\d+\.\d+/)?.[0])];
        expect(values[0]).not.toBe(values[1]);
        const pick = p.question.includes('큰') ? Math.max(...values) : Math.min(...values);
        expect(Number(p.correctAnswer)).toBeCloseTo(pick, 9);
      }
      // Dividing by 1/5 is "× 5", never "× 5/1"
      for (const e of p.explanations) expect(e.content).not.toMatch(/\d\/1(?!\d)/);
    }
  }
});

test('factor explanations read naturally and answers vary', () => {
  for (const difficulty of DIFFICULTIES) {
    const relation = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      for (const topicId of ['factors', 'fractions'] as const) {
        const p = generateProblem(topicId, difficulty);
        const text = [p.hint, ...p.explanations.map((e) => e.content)].join(' ');
        // "공약수로 계속 나누면 2로 나누면 ..." and "= 72 입니다"
        expect(text).not.toMatch(/나누면 \d+으?로 나누면|\d (이므로|입니다)/);
        if (p.subtopic === '약수와 배수의 관계') relation.add(Number(p.correctAnswer));
        // 91 and 78 share only 13, which is too hard to spot in your head
        if (p.subtopic === '최대공약수') expect(Number(p.correctAnswer)).not.toBe(13);
      }
    }
    // The answer is the number of factors of k in a × k, so it must not always be the same count
    expect(relation.size).toBeGreaterThanOrEqual(3);
  }
});

test('decimal, product and mean answers follow from the numbers in the question', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 2000; i++) {
      const d = generateProblem('decimals', difficulty);
      const dAnswer = Number(d.correctAnswer);
      if (d.subtopic === '수의 범위') {
        const [, low, lowWord, high, highWord] =
          d.question.match(/([\d.]+) (이상|초과) ([\d.]+) (이하|미만)/) ?? [];
        const first = lowWord === '이상' ? Math.ceil(Number(low)) : Math.floor(Number(low)) + 1;
        const last = highWord === '이하' ? Math.floor(Number(high)) : Math.ceil(Number(high)) - 1;
        expect(dAnswer).toBe(last - first + 1);
      } else if (d.subtopic === '분수를 소수로' || d.subtopic === '몫을 소수로 나타내기') {
        const [a, b] = (d.question.match(/\d+/g) ?? []).map(Number);
        expect(dAnswer * b).toBeCloseTo(a, 9);
        // A fraction to convert is below 1, as in 3/4
        if (d.subtopic === '분수를 소수로') expect(a).toBeLessThan(b);
      }
      const m = generateProblem('decimalMul', difficulty);
      if (m.subtopic === '곱의 소수점 위치') {
        const [a, b] = (m.question.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
        expect(Number(m.correctAnswer)).toBeCloseTo(a * b, 9);
        expect([a, b].some((x) => [10, 100, 0.1, 0.01, 0.001].includes(x))).toBe(true);
      }
      const g = generateProblem('averages', difficulty);
      const nums = (g.question.match(/\d+/g) ?? []).map(Number);
      const mean = (values: number[]) => values.reduce((x, y) => x + y, 0) / values.length;
      if (g.subtopic === '평균보다 높은 자료의 수') {
        // "모둠 학생 5명의 ... 60, 80, 50, 90, 70번": the first number is the head count
        const values = nums.slice(1);
        expect(values.length).toBe(nums[0]);
        expect(Number(g.correctAnswer)).toBe(values.filter((v) => v > mean(values)).length);
      } else if (g.subtopic === '두 모둠의 평균 비교') {
        // "가 모둠 3명의 ... 40, 60, 80번이고, 나 모둠 4명의 ... 70, 70, 30, 30번"
        const first = nums.slice(1, 1 + nums[0]);
        const second = nums.slice(2 + nums[0]);
        expect(second.length).toBe(nums[1 + nums[0]]);
        const [x, y] = [mean(first), mean(second)];
        expect(x).not.toBe(y);
        expect(Number(g.correctAnswer)).toBe(
          g.question.includes('차이') ? Math.abs(x - y) : Math.max(x, y),
        );
      }
    }
  }
});

test('no shape subtopic takes over a run of back-to-back questions', () => {
  // Recent questions are skipped, so a subtopic with few distinct questions pushes the others up
  for (const topicId of ['geometry', 'symmetry', 'solids'] as TopicId[]) {
    for (const difficulty of DIFFICULTIES) {
      const counts: Record<string, number> = {};
      for (let i = 0; i < 2000; i++) {
        const { subtopic } = generateProblem(topicId, difficulty);
        counts[subtopic] = (counts[subtopic] ?? 0) + 1;
      }
      expect(Math.max(...Object.values(counts)) / 2000).toBeLessThan(0.4);
    }
  }
});

test('only the chance-word choices are split over lines', () => {
  for (const topic of TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      for (let i = 0; i < 300; i++) {
        const p = generateProblem(topic.id as TopicId, difficulty);
        const lines = p.question.split('\n');
        if (p.subtopic === '가능성을 말로 나타내기') {
          expect(lines.slice(1).map((l) => l[0])).toEqual(['①', '②', '③']);
        } else {
          expect(lines.length).toBe(1);
        }
      }
    }
  }
});

test('fractions to decimals come in enough kinds to avoid repeats', () => {
  for (const difficulty of DIFFICULTIES) {
    const seen = new Set<string>();
    for (let i = 0; i < 6000; i++) {
      const p = generateProblem('decimals', difficulty);
      if (p.subtopic === '분수를 소수로') seen.add(p.question);
    }
    expect(seen.size).toBeGreaterThanOrEqual(20);
  }
});

test('fraction answers over 1 say how to write them and hints do not give them away', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 3000; i++) {
      const p = generateProblem('fractions', difficulty);
      if (p.answerType !== 'fraction') continue;
      const f = p.correctAnswer as { num: number; den: number };
      // The answer box takes no mixed number
      if (f.num > f.den && f.den > 1) {
        expect(p.question).toMatch(/1보다 크면 가분수로|가분수로 나타내세요|가분수인/);
      }
      // A worked example such as "2와 1/3 = 7/3" must not be the answer itself
      expect(p.hint).not.toMatch(new RegExp(`= ${formatAnswer(p)}(?![\\d/])`));
    }
  }
});

test('every solids problem draws a sketch whose edge labels match the question', () => {
  for (const difficulty of DIFFICULTIES) {
    for (let i = 0; i < 500; i++) {
      const p = generateProblem('solids', difficulty);
      expect(p.visual?.kind).toBe('cuboid');
      if (p.visual?.kind !== 'cuboid') continue;
      for (const label of Object.values(p.visual.labels ?? {})) {
        if (label.endsWith('cm')) expect(p.question).toContain(label);
      }
      if (p.visual.highlight === 'top' || p.visual.highlight === 'bottom') {
        expect(p.question).toContain('색칠한 면');
      }
    }
  }
});
