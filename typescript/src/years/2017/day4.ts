// https://adventofcode.com/2017/day/4
// https://adventofcode.com/2017/day/4/input

import { readFileSync } from 'fs';
import { ok as assert } from 'assert';

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/);

// First Star:
function isValid(passphrase) {
  const words = passphrase.split(/ +/);
  const wordSet = new Set(words);
  return words.length === wordSet.size;
}
console.log({ valid: input.filter(isValid).length });

// Second Star:
// function strToRegex (str) {
//   return new RegExp(
//     take(new Set(str.split('')).values(), -1)
//       .join('|')
//   );
// }
/**
 * @param {string} passphrase
 */
function isValid2(passphrase) {
  if (!isValid(passphrase)) return false;
  const words = passphrase.split(/ +/).map(str => new Set(str));
  return words.every((wordA, aIdx) =>
    words.every(
      (wordB, bIdx) => wordA.size !== wordB.size || aIdx === bIdx || ![...wordA].every(char => wordB.has(char)),
    ),
  );
}
assert(isValid2('abcde fghij'));
assert(!isValid2('abcde xyz ecdab'));
assert(isValid2('a ab abc abd abf abj'));
assert(!isValid2('iiii oiii ooii oooi oooo'));
assert(!isValid2('oiii ioii iioi iiio'));
console.log({ valid2: input.filter(isValid2).length });
