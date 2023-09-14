import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain-es/iter';
import { ok as assert /* , deepStrictEqual as equals */ } from 'assert';
import range from 'iteragain-es/range';
import memoize from 'lodash/memoize';

/** @see https://adventofcode.com/2016/day/7/input */
export const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/));

const HAS_BRACKET = /\[|\]/;

function isABBA(str: string) {
  return str[0] === str[3] && str[1] === str[2] && str[0] !== str[1];
}

function supportsTLS(str: string): boolean {
  let inBrackets = false;
  let contains1ABBA = false;
  for (const idxs of iter(range(str.length)).windows(4, 1)) {
    if (HAS_BRACKET.test(str[idxs[0]])) {
      inBrackets = !inBrackets;
      continue;
    }
    if (isABBA(str.slice(idxs[0], idxs[3] + 1))) {
      if (inBrackets) return false;
      contains1ABBA = true;
    }
  }
  return contains1ABBA;
}

/** https://adventofcode.com/2016/day/7 First Star */
export async function firstStar() {
  return input().filter(supportsTLS).length;
}

function isABA(str: string) {
  return str[0] === str[2] && str[0] !== str[1];
}

const hasBAB = memoize((ABA: string) => {
  const regex = new RegExp(`\\[[a-z]*${ABA[1]}${ABA[0]}${ABA[1]}[a-z]*\\]`);
  return (str: string) => regex.test(str);
});

function* ABAs(str: string) {
  let inBrackets = false;
  for (let i = 0; i < str.length - 2; i++) {
    const ABA = str.slice(i, i + 3);
    if (HAS_BRACKET.test(ABA)) {
      inBrackets = !inBrackets;
      i += 2;
      continue;
    } else if (inBrackets) continue;
    else if (isABA(ABA)) yield ABA;
  }
}

function supportsSSL(str: string): boolean {
  return iter(ABAs(str)).some(ABA => hasBAB(ABA)(str));
}

/** https://adventofcode.com/2016/day/7#part2 Second Star */
export async function secondStar() {
  return input().filter(supportsSSL).length;
}

main(module, async () => {
  assert(supportsTLS('abba[mnop]qrst'));
  assert(!supportsTLS('abcd[bddb]xyyx'));
  assert(!supportsTLS('aaaa[qwer]tyui'));
  assert(supportsTLS('ioxxoj[asdfgh]zxcvbn'));
  console.log('First star:', await firstStar());

  assert(supportsSSL('aba[bab]xyz'));
  assert(!supportsSSL('xyx[xyx]xyx'));
  assert(supportsSSL('aaa[kek]eke'));
  assert(supportsSSL('zazbz[bzb]cdb'));
  console.log('Second star:', await secondStar());
});
