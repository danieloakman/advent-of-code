'use strict';
// https://adventofcode.com/2015/day/5

const { readFileSync } = require('fs');

const isNice = (() => {
  const notAllowedStrings = ['ab', 'cd', 'pq', 'xy'];
  const vowels = 'aeiou';
  return str => {
    if (notAllowedStrings.some(s => str.includes(s)))
      return false;
    let hasDouble = false;
    let vowelsCount = 0;
    for (let i = 0; i < str.length; i++) {
      if (vowels.includes(str[i]))
        vowelsCount++;
      if (typeof str[i + 1] === 'string' && str[i] === str[i + 1])
        hasDouble = true;
      if (hasDouble && vowelsCount > 2)
        return true;
    }
    return false;
  };
})();

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)

// First Star:
console.log({ numOfNiceStrings: input.filter(isNice).length });

// Second Star:

/**
 * @param {string} str
 * @returns {boolean}
 */
function isNice2 (str) {
  const map = {};
  let contains2Pairs = false;
  let containsRepeat = false;
  for (let i = 0; i < str.length; i++) {
    if (i < str.length - 1 && !contains2Pairs) {
      const pair = str.slice(i, i + 2);
      if (!map[pair])
        map[pair] = { c: 1, idx: i };
      else if (map[pair].idx !== i + 1)
        contains2Pairs = true;
    }
    if (i < str.length - 2 && !containsRepeat) {
      const pair = str.slice(i, i + 3);
      if (pair[0] === pair[2])
        containsRepeat = true;
    }
    if (contains2Pairs && containsRepeat)
      return true;
  }
  return contains2Pairs && containsRepeat;
}
console.log(
  isNice2('qjhvhtzxzqqjkmpb'),
  isNice2('xxyxx'),
  isNice2('uurcxstgmygtbstg'),
  isNice2('ieodomkazucvgmuy'),
);
console.log({ numOfNiceStrings: input.filter(isNice2).length });
