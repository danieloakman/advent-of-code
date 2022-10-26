// https://adventofcode.com/2018/day/2
// https://adventofcode.com/2018/day/2/input

const { readFileSync } = require('fs');
const { groupBy } = require('../lib/utils');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(/[\n\r]+/);

// First Star:
function containsTwoOrThree(str) {
  const counts = groupBy(
    str.split('').map(v => ({ v })),
    'v',
  );
  let two = false,
    three = false;
  Object.values(counts).forEach(v => {
    two = two || v.length === 2;
    three = three || v.length === 3;
  });
  return { two, three };
}
const { two, three } = input.map(containsTwoOrThree).reduce(
  (p, v) => {
    p.two += v.two ? 1 : 0;
    p.three += v.three ? 1 : 0;
    return p;
  },
  { two: 0, three: 0 },
);
console.log({ checksum: two * three });

// Second Star:
// function findDifferences (a, b) {
//   return a.split('').reduce((p, v, i) => {
//     if (v !== b[i])
//       p.push(v);
//     return p;
//   }, []);
// }
function findInCommon(a, b) {
  return a.split('').reduce((p, v, i) => {
    if (v === b[i]) p.push(v);
    return p;
  }, []);
}
loop: for (const a of input) {
  for (const b of input) {
    const inCommon = findInCommon(a, b);
    if (inCommon.length === a.length - 1) {
      console.log({ common: inCommon.join('') });
      break loop;
    }
  }
}
