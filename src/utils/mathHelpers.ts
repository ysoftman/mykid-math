// Common math helpers for elementary school grade 5-6

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: 0, den: 1 };
  const common = gcd(num, den);
  return {
    num: num / common,
    den: den / common,
  };
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Korean particle 과/와 after a number, based on how its last digit is read (일, 삼, 육, 칠, 팔, 십 end in a consonant)
export function withGwa(n: number): string {
  return `${n}${[0, 1, 3, 6, 7, 8].includes(n % 10) ? '과' : '와'}`;
}

// Numerator in [min, den - 1] that is coprime with den, so the fraction is already in lowest terms
export function randomNumerator(den: number, min = 1): number {
  let num = randomInt(min, den - 1);
  while (gcd(num, den) !== 1) num = randomInt(min, den - 1);
  return num;
}
