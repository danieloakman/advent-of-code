const { readFileSync } = require('fs');
const { join } = require('path');
const groups = readFileSync(join(__dirname, 'day6-input'), { encoding: 'utf-8' })
  .split(/\s{3,}/)
  .filter(v => v)
  .map(v => v.split(/\s+/).filter(v => v));

// Gold Star:
function groupBy(str) {
  const map = {};
  for (const char of str) {
    if (!map[char]) map[char] = true; /* 1;
    else
      map[char]++; */
  }
  return map;
}
let countOfYes = 0;
for (const group of groups) {
  countOfYes += Object.keys(groupBy(group.join(''))).length;
}
console.log({ countOfYes });

// Silver Star:
function getSet(str) {
  const bits = new Array(26).fill(0);
  for (const char of str) {
    // Assumes str is lower case
    bits[char.charCodeAt(0) % 97] = 1;
  }
  return parseInt(bits.join(''), 2);
}
countOfYes = 0;
for (const group of groups) {
  countOfYes += group
    .map(getSet) // Get integer representing a 26 bit binary set
    .reduce((p, c) => p & c) // Bitwise AND all sets together
    .toString(2) // Convert back to binary string
    .replace(/0/g, '').length; // Get rid of all zeros // Count all ones
}
console.log({ countOfYes });
