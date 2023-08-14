/* eslint-disable no-console */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { downloadInput, inputPath } from '../src/lib/downloadInput';
import { main } from '../src/lib/utils';

export function fileStr(year: string, day: string) {
  return `
import once from 'lodash/once';
import { main, Solution, downloadInputSync } from '../../lib';
import iter from 'iteragain/iter';
// import { ok as assert, deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/${year}/day/${day}/input */
export const input = once(() => downloadInputSync('${year}', '${day}').split(/[\\n\\r]+/));

export const solution = new Solution(
  /** @see https://adventofcode.com/${year}/day/${day} First Star */
  async () => {
    return null;
  },

  /** @see https://adventofcode.com/${year}/day/${day}#part2 Second Star */
  async () => {
    return null;
  }
);


main(module, () => solution.solve());
`.trimStart();
}

export function createFiles(year: string, day: string) {
  const tsFilePath = join(__dirname, `../src/years/${year}/day${day}.ts`);
  const fileInputPath = inputPath(year, day);
  const dir = join(__dirname, `../src/years/${year}`);
  if (!existsSync(dir)) mkdirSync(dir);
  if (!existsSync(tsFilePath)) writeFileSync(tsFilePath, fileStr(year, day));
  else console.log(`"${tsFilePath}" already exists.`);
  // if (!existsSync(fileInputPath)) writeFileSync(fileInputPath, '');
  // else console.log(`"${fileInputPath}" already exists.`);

  downloadInput(year, day).then(() => execSync(`code ${fileInputPath}`));
  execSync(`code ${tsFilePath}`);
  return { tsFilePath, fileInputPath };
}

export type AdventOfCodeFile = ReturnType<typeof createFiles>;

main(module, async () => {
  // Get command line arguments:
  const { ArgumentParser } = await import('argparse');
  const argparser = new ArgumentParser({ description: 'Create a new Advent of Code file' });
  argparser.add_argument('year');
  argparser.add_argument('day');
  const { year, day } = argparser.parse_args();

  createFiles(year, day);
});
