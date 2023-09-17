import { describe, it } from 'bun:test';
import { existsSync } from 'fs';
import { range, iter } from 'iteragain-es';
import { join } from 'path';
import { safeCall, Solution } from './lib';

const solutions = () =>
  iter(range(2015, new Date().getFullYear() + 1)).flatMap(year =>
    iter(range(1, 26)).map(day => [year, day] as [year: number, day: number]),
  ).filterMap(([year, day]) => {
    const path = join(import.meta.dir, 'years', year.toString(), `day${day}.ts`);
    if (!existsSync(path)) return;
    // const { solution } = require(path);
    const imported: Record<string, unknown> = safeCall(() => require(path.replace(/\..+$/, ''))) || {};
    if (imported.solution instanceof Solution && imported.solution.tests.length)
      return [year, day, imported.solution.tests] as const;
  });

describe('Solutions', () => {
  for (const [year, day, tests] of solutions()) {
    for (const { testName, test, status } of tests) {
      switch (status) {
        case 'skip':
          it.skip(`${year}/${day} ${testName}`, test);
          break;
        case 'todo':
          it.todo(`${year}/${day} ${testName}`, test);
          break;
        case 'run':
          it(`${year}/${day} ${testName}`, test);
          break;
      }
    }
  }
});
