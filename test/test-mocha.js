'use strict';

const { walkdir } = require('more-node-fs');
const { join } = require('path');
const { groupBy } = require('../lib/utils');

let files = [];
for (const { path, stats } of walkdir(join(__dirname, '..'))) {
  if (/day\d+\.js$/i.test(path)) {
    const nums = path
      .match(/\d+/g)
      .map(Number);
    files.push({ path, day: nums.pop(), year: nums.pop(), stats });
  }
}
files = groupBy(files, ['year']);

for (const year in files) {
  describe(`${year.toString()} - ${files[year].length}`, function () {
    for (const file of files[year].sort((a, b) => a.day - b.day)) {
      it(file.day.toString(), async function () {
        require(file.path);
      });
    }
  });
}
