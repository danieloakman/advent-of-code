// @see https://adventofcode.com/2023/day/1/input
import { Solution, add, newLine, equal } from '@lib';
import { iter } from 'iteragain-es';

function isNumber(str: string): boolean {
  return !isNaN(Number(str));
}

function parseLine(str: string): number {
  const [first] = iter(str).filter(isNumber).take(1);
  const [last] = iter(str).reverse().filter(isNumber).take(1);
  return parseInt(first + last);
}

function parseLines(lines: string[]): number {
  return iter(lines).map(parseLine).reduce(add);
}

export const solution = new Solution(2023, 1)
  .firstStar(async input => parseLines(input.split(newLine)))
  // .secondStar(async input => null)
  .test('example', async () => {
    equal(
      parseLines(
        `1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet`
          .split(newLine)
          .map(s => s.trim()),
      ),
      142,
    );
  })
  .main(import.meta.path);
