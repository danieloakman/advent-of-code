'use strict';

const { readFileSync } = require('fs');
const { stringSplice } = require('../lib/utils');

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

const { map, template } = testInput();

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
    console.time(`Step ${step}`);
    for (const { v, i } of pairs(str)) {
      if (!map[v]) continue;
      str = stringSplice(str, i, 2, v[0] + map[v] + v[1]);
    }
    console.timeEnd(`Step ${step}`);
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

// First Star:
let chars = countChars(insertPairs(template, 10));
console.log(chars[0][1] - chars[chars.length - 1][1]);

// Second Star:
class Polymeriser {
  constructor (template, )
}
chars = countChars(insertPairs(template, 40));
console.log(chars);
