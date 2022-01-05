'use strict';

const { readFileSync } = require('fs');

const map = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.split('').map(parseFloat));

// First star:
