// https://adventofcode.com/2015/day/5
import { Solution, iife, newLine } from '@lib';
import { describe, it, expect } from 'vitest';

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
);

solution.main(module);

// import.meta.vitest

// //@ts-ignore
// if (import.meta.vitest) {
//   // @ts-ignore
//   const { describe, it, expect } = import.meta.vitest;
// tests((describe, it, expect) => {
if (process.argv.some(arg => arg.includes('tinypool'))) {
  describe('2015/day5', () => {
    it('isNice', () => {
      expect(isNice('ugknbfddgicrmopn')).toBe(true);
      expect(isNice('aaa')).toBe(true);
      expect(isNice('jchzalrnumimnmhp')).toBe(false);
      expect(isNice('haegwjzuvuyypxyu')).toBe(false);
      expect(isNice('dvszwmarrgswjxmb')).toBe(false);
    });
  
    it('isNice2', () => {
      expect(isNice2('qjhvhtzxzqqjkmpb')).toBe(true);
      expect(isNice2('xxyxx')).toBe(true);
      expect(isNice2('uurcxstgmygtbstg')).toBe(false);
      expect(isNice2('ieodomkazucvgmuy')).toBe(false);
    });
  });
}
// });
// }