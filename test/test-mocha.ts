'use strict';

import { walkdirSync } from 'more-node-fs';
import { join } from 'path';
import { groupBy } from '../lib/utils';

const files: { path: string; day: number; year: number; stats: import('fs').Stats }[] = [];
for (const { path, stats } of walkdirSync(join(__dirname, '..')))
  if (/day\d+\.js$/i.test(path)) {
    const nums = path
      .match(/\d+/g)
      ?.map(Number);
    const [day, year] = [nums?.pop(), nums?.pop()];
    if (!(day && year)) continue;
    files.push({ path, day, year, stats });
  }
const groupedFiles = groupBy(files, ['year']);

for (const year in files)
  describe(`${year.toString()} - ${groupedFiles[year].length}`, function () {
    for (const file of groupedFiles[year].sort((a, b) => a.day - b.day))
      it(file.day.toString(), async function () {
        require(file.path);
      });
  });