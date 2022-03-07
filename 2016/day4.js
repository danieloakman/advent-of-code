'use strict';
// https://adventofcode.com/2016/day/4
// https://adventofcode.com/2016/day/4/input

const { readFileSync } = require('fs');
const { ok: assert } = require('assert');
const { iterate } = require('iterare');
function parseRoom (str) {
  const name = str.match(/[a-z\-]+/)[0];
  const sector = parseInt(str.match(/\d+/)[0]);
  const checksum = str.match(/\[([a-z]+)\]/)[1];
  
}
const rooms =
iterate(readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/))
  .map(parseRoom)
  .toArray();

// First Star:
assert(parseRoom('aaaaa-bbb-z-y-x-123[abxyz]'));

// Second Star:


