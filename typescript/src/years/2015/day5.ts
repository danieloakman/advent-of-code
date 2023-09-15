// https://adventofcode.com/2015/day/5
import { Solution, iife, newLine, assert } from '@lib';

// First Star:
const isNice = iife(() => {
  const notAllowedStrings = ['ab', 'cd', 'pq', 'xy'];
  const vowels = 'aeiou';
  return (str: string): boolean => {
    if (notAllowedStrings.some(s => str.includes(s))) return false;
    let hasDouble = false;
    let vowelsCount = 0;
    for (let i = 0; i < str.length; i++) {
      if (vowels.includes(str[i])) vowelsCount++;
      if (typeof str[i + 1] === 'string' && str[i] === str[i + 1]) hasDouble = true;
      if (hasDouble && vowelsCount > 2) return true;
    }
    return false;
  };
});

// Second Star:
function isNice2(str: string): boolean {
  const map: Record<string, number> = {};
  let contains2Pairs = false;
  let containsRepeat = false;
  for (let i = 0; i < str.length; i++) {
    if (i < str.length - 1 && !contains2Pairs) {
      const pair = str.slice(i, i + 2);
      if (map[pair] === undefined) {
        map[pair] = i;
      } else if (map[pair] !== i && map[pair] + 1 !== i) contains2Pairs = true;
    }
    if (i < str.length - 2 && !containsRepeat) {
      const pair = str.slice(i, i + 3);
      if (pair[0] === pair[2]) containsRepeat = true;
    }
    if (contains2Pairs && containsRepeat) return true;
  }
  return contains2Pairs && containsRepeat;
}

// console.log(isNice2('qjhvhtzxzqqjkmpb'), isNice2('xxyxx'), isNice2('uurcxstgmygtbstg'), isNice2('ieodomkazucvgmuy'));

export const solution = new Solution(
  2015,
  5,
  async input => input.split(newLine).filter(isNice).length,
  async input => input.split(newLine).filter(isNice2).length,
  [
    [
      'isNice',
      async () => {
        assert(isNice('ugknbfddgicrmopn'));
        assert(isNice('aaa'));
        assert(!isNice('jchzalrnumimnmhp'));
        assert(!isNice('haegwjzuvuyypxyu'));
        assert(!isNice('dvszwmarrgswjxmb'));
      },
    ],
    [
      'isNice2',
      async () => {
        assert(isNice2('qjhvhtzxzqqjkmpb'));
        assert(isNice2('xxyxx'));
        assert(!isNice2('uurcxstgmygtbstg'));
        assert(!isNice2('ieodomkazucvgmuy'));
      },
    ],
  ],
);

solution.main(import.meta.path);
