// @see https://adventofcode.com/2023/day/3/input
import { Solution, NDArray, newLine, safeParseInt, range2D } from '@lib';
import { enumerate } from 'iteragain-es';

function charToNum(char: string): number {
  const n = safeParseInt(char);
  if (n != null) return n;
  if (char === '.') return 10;
  return 11;
}

function toNDArray(input: string) {
  const SIZE = 200; // Should be big enough
  const arr = new NDArray(new Uint8Array(SIZE * SIZE), [SIZE, SIZE]);
  for (const [y, line] of enumerate(input.split(newLine))) {
    for (const [x, char] of enumerate(line)) {
      arr.set([x, y], charToNum(char));
    }
  }
  return arr;
}

function partNumbers(arr: NDArray<[number, number]>) {
  const isNextToSymbol = new Map<[number, number], boolean>();
  return arr.iter().map(([x, y], n) => {
    // TODO
  });
}

export const solution = new Solution(2023, 3)
  .firstStar(async input => null)
  .secondStar(async input => null)
  // .test('example', async () => {})
  .main(import.meta.path);
