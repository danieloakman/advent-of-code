'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

// Gold Star:
let bags = {};
readFileSync(join(__dirname, 'day7-input'), { encoding: 'utf-8' })
  .split(/\s*\n+\s*/)
  .filter(v => v)
  .forEach(v => {
    v = v.replace(/bags?|\d+|\./gi, '').split(/ *contain */i);
    bags[v[0]] = v[1].split(/ *, */).map(v => v.trim());
  });

function check (bag) {
  for (const b of bags[bag] ? bags[bag] : []) {
    if (b === 'shiny gold' || check(b))
      return true;
  }
  return false;
}
let numOfBags = 0;
for (const bag in bags) {
  if (check(bag)) numOfBags++;
}
console.log({ numOfBags });

// Silver Star:
bags = {};
readFileSync(join(__dirname, 'day7-input'), { encoding: 'utf-8' })
  .split(/\s*\n+\s*/)
  .filter(v => v)
  .forEach(v => {
    // REDO this part
  });