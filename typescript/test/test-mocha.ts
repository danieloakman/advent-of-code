// @ts-nocheck
// DEPRECATED, will probably be removed in the future
import { walkdirSync } from 'more-node-fs';
import { join } from 'path';
import { groupByProps } from '../lib/utils';
import { execSync } from 'child_process';

const files: { path: string; day: number; year: number; stats: import('fs').Stats }[] = [];
for (const { path, stats } of walkdirSync(join(__dirname, '..')))
  if (/day\d+\.[tj]s$/i.test(path)) {
    const nums = path.match(/\d+/g)?.map(Number);
    const [day, year] = [nums?.pop(), nums?.pop()];
    if (!(day && year)) continue;
    files.push({ path, day, year, stats });
  }
const groupedFiles = groupByProps(files, ['year']);

for (const year in groupedFiles)
  describe(`${year.toString()} - ${groupedFiles[year].length}`, function () {
    for (const file of groupedFiles[year].sort((a, b) => a.day - b.day))
      it(file.day.toString(), async function () {
        this.timeout(1e3 * 60);
        execSync(`npx ts-node --transpileOnly ${file.path}`, { stdio: 'inherit' });
        // const funcs = await import(file.path);
        // await funcs?.firstStar?.();
        // await funcs?.secondStar?.();
      });
  });
