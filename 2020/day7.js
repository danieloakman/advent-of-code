'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const groups = readFileSync(join(__dirname, 'day7-input'), { encoding: 'utf-8' })
  .split(/\s{3,}/)
  .filter(v => v)
  .map(v => v.split(/\s+/).filter(v => v));

// Gold Star:
console.log();
