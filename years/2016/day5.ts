// https://adventofcode.com/2016/day/5
// https://adventofcode.com/2016/day/5/input

import { readFileSync } from 'fs';
import once from 'lodash/once';
import iter from 'iteragain/iter';
// import { deepStrictEqual as equal } from 'assert';
import { hash } from '../lib/utils';
import range from 'iteragain/range';

const input = once(() => readFileSync(__filename.replace('.ts', '-input'), 'utf-8'));

// First Star:
function findPassword(doorID, endRange = Infinity) {
  return iter(range(0, endRange))
    .map(int => hash(`${doorID}${int}`, 'md5'))
    .filter(h => h.startsWith('00000'))
    .map(h => h[5])
    .take(8)
    .join('');
}
// equal(findPassword('abc'), '18f47a30');
console.log({ password: findPassword(input()) });

// Second Star:
function findPassword2(doorID, endRange = Infinity) {
  const password = [];
  const positions = iter(range(8))
    .map(n => n.toString())
    .toSet();
  for (const { pos, char } of iter(range(0, endRange, 1))
    .map(int => hash(`${doorID}${int}`, 'md5'))
    .filter(h => h.startsWith('00000'))
    .map(h => ({ pos: h[5], char: h[6] }))
    .filter(({ pos }) => positions.has(pos) && !password[pos])) {
    password[pos] = char;
    console.log({ password: password.join('|') });
    if (password.join('').length === 8) return password.join('');
  }
  return '';
}
// equal(findPassword2('abc'), '05ace8e3');
console.log({ password: findPassword2(input()) });
