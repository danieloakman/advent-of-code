// @see https://adventofcode.com/2023/day/1/input
import { Solution, add, newLine, equal, iife, matches, raise } from '@lib';
import { iter, range, toArray } from 'iteragain-es';
import { last } from 'lodash';

interface Parser {
  (str: string): number;
}

function isNumber(str: string): boolean {
  return !isNaN(Number(str));
}

function parseLine(str: string): number {
  const [first] = iter(str).filter(isNumber).take(1);
  const [last] = iter(str).reverse().filter(isNumber).take(1);
  return parseInt(first + last);
}

const parseLineStar2 = iife(
  (
    digits = /one|two|three|four|five|six|seven|eight|nine|\d/,
    map = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ...iter(range(1, 10))
        .map(n => [n.toString(), n] as const)
        .toArray(),
    },
  ) =>
    (str: string): number => {
      const m = iter(matches(digits, str))
        .map(m => m[0])
        .toArray();
      if (!m.length) throw new Error(`Less than 2 digits found in "${str}"`);
      return parseInt((map as any)[m[0]] + (map as any)[last(m) ?? raise('No last digit found')]);
    },
);

function parseLines(lines: string[], parser: Parser): number {
  return iter(lines).map(parser).reduce(add);
}

export const solution = new Solution(2023, 1)
  .firstStar(async input => parseLines(input.split(newLine), parseLine))
  .secondStar(async input => parseLines(input.split(newLine), parseLineStar2))
  .test('example', async () => {
    equal(
      parseLines(
        `1abc2
    pqr3stu8vwx
    a1b2c3d4e5f
    treb7uchet`
          .split(newLine)
          .map(s => s.trim()),
        parseLine,
      ),
      142,
    );
    equal(
      parseLines(
        `two1nine
    eightwothree
    abcone2threexyz
    xtwone3four
    4nineeightseven2
    zoneight234
    7pqrstsixteen`
          .split(newLine)
          .map(s => s.trim()),
        parseLineStar2,
      ),
      281,
    );
  })
  .main(import.meta.path);
