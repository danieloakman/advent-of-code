/* eslint-disable no-console */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { downloadInput } from '../lib/downloadInput';
import { main } from '../lib/utils';

export function fileStr(year: string, day: string) {
  return `import { readFileSync } from 'fs';
import once from 'lodash/once';
import { main } from '../lib/utils';
import iter from 'iteragain/iter';
// import { ok as assert, deepStrictEqual as equals } from 'assert';

/** @see https://adventofcode.com/${year}/day/${day}/input */
export const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\\n\\r]+/));

/** https://adventofcode.com/${year}/day/${day} First Star */
export async function firstStar() {
  //
}

/** https://adventofcode.com/${year}/day/${day}#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  await firstStar();
  await secondStar();
});
`;
}

export function createFiles(year: string, day: string) {
  const tsFilePath = join(__dirname, '../', `${year}/day${day}.ts`);
  const fileInputPath = join(__dirname, '../', `${year}/day${day}-input`);
  const dir = join(__dirname, '../', `${year}`);
  if (!existsSync(dir)) mkdirSync(dir);
  if (!existsSync(tsFilePath)) writeFileSync(tsFilePath, fileStr(year, day));
  else console.log(`"${tsFilePath}" already exists.`);
  if (!existsSync(fileInputPath)) writeFileSync(fileInputPath, '');
  else console.log(`"${fileInputPath}" already exists.`);

  downloadInput(year, day);
  execSync(`code ${fileInputPath} && code ${tsFilePath}`);
  return { tsFilePath, fileInputPath };
}

export type AdventOfCodeFile = ReturnType<typeof createFiles>;

main(module, async () => {
  // Get command line arguments:
  const { ArgumentParser } = await import('argparse');
  const argparser = new ArgumentParser({ description: 'Sync-Local-and-Cloud' });
  argparser.add_argument('year');
  argparser.add_argument('day');
  const { year, day } = argparser.parse_args();

  createFiles(year, day);
});
