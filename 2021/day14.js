'use strict';
// https://adventofcode.com/2019/day/14

const { readFileSync } = require('fs');
const { stringSplice, subStrings } = require('../lib/utils');
const last = require('lodash/last');

const input = () => {
  const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
    .split(/[\n\r]+/);
  const template = input[0];
  const map = input.slice(1).reduce((map, line) => {
    const pair = line.split(' -> ');
    map[pair[0]] = pair[1];
    return map;
  }, {});
  return { template, map };
};
const testInput = () => {
  const input =
`NNCB
CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split('\n');
  const template = input[0];
  const map = input.slice(1).reduce((map, line) => {
    const pair = line.split(' -> ');
    map[pair[0]] = pair[1];
    return map;
  }, {});
  return { template, map };
};

const { map, template } = input();

// First Star:
function* pairs (str) {
  for (let i = str.length - 1; i > 0; i--) {
    yield {
      v: str[i - 1] + str[i],
      i: i - 1
    };
  }
}
function insertPairs (str, steps) {
  for (let step = 0; step < steps; step++) {
    // console.time(`Step ${step}`);
    for (const { v, i } of pairs(str)) {
      if (!map[v]) continue;
      str = stringSplice(str, i, 2, v[0] + map[v] + v[1]);
    }
    // console.timeEnd(`Step ${step}`);
  }
  return str;
}
function countChars (str) {
  const chars = {};
  for (let i = 0; i < str.length; i++) {
    if (chars[str[i]])
      chars[str[i]]++;
    else
      chars[str[i]] = 1;
  }
  return Object.entries(chars).sort((a, b) => b[1] - a[1]);
}
{
  const chars = countChars(insertPairs(template, 10));
  console.log('At 10 steps:', chars[0][1] - last(chars)[1]);
}

// Second Star:
class IncrementorMap {
  constructor () {
    this.map = {};
  }

  inc (key, value = 1) {
    if (!this.map[key])
      this.map[key] = value;
    else
      this.map[key] += value;
  }

  get (key) {
    return this.map[key] || 0;
  }

  set (key, value) {
    this.map[key] = value;
  }

  *entries () {
    for (const entry of Object.entries(this.map))
      yield entry;
  }
}
function calcPolymer (template, replacerMap, steps) {
  let pairs = new IncrementorMap();
  for (const pair of subStrings(template, 2, true))
    pairs.inc(pair);

  // Insert pairs:
  for (let step = 0; step < steps; step++) {
    const newPairs = new IncrementorMap();
    for (const [pair, count] of pairs.entries()) {
      if (pair in replacerMap) {
        const insert = replacerMap[pair];
        newPairs.inc(pair[0] + insert, count);
        newPairs.inc(insert + pair[1], count);
      } else
        newPairs.inc(pair, count);
    }
    pairs = newPairs;
  }

  // Count chars:
  let chars = new IncrementorMap();
  for (const [pair, count] of pairs.entries()) {
    chars.inc(pair[0], count);
    chars.inc(pair[1], count);
  }
  chars = [...chars.entries()].sort((a, b) => b[1] - a[1]);

  return chars[0][1] - last(chars)[1];
}

console.log('At 40 steps:', calcPolymer(template, map, 10));
