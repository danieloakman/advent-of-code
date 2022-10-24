/* eslint-disable no-console */
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { ArgumentParser } from 'argparse';
import { join } from 'path';
import { execSync } from 'child_process';
import { downloadInput } from '../lib/downloadInput';

// Get command line arguments:
const argparser = new ArgumentParser({ description: 'Sync-Local-and-Cloud' });
argparser.add_argument('year');
argparser.add_argument('day');
const { year, day } = argparser.parse_args();

const fileStr =
`'use strict';
// @ts-check

import { readFileSync } from 'fs';
import once from 'lodash/once';
import iter from 'iteragain/iter';
// import { ok as assert, deepStrictEqual as equals } from 'assert';
// import * as utils from '../lib/utils';

/** @see https://adventofcode.com/${year}/day/${day}/input */
const input = once(() => iter(readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(/[\\n\\r]+/)));

// https://adventofcode.com/${year}/day/${day} First Star:


// https://adventofcode.com/${year}/day/${day}#part2 Second Star:

`;

const jsFilePath = join(__dirname, '../', `${year}/day${day}.ts`);
const fileInputPath = join(__dirname, '../', `${year}/day${day}-input`);
const dir = join(__dirname, '../', `${year}`);
if (!existsSync(dir))
  mkdirSync(dir);
if (!existsSync(jsFilePath))
  writeFileSync(jsFilePath, fileStr);
else
  console.log(`"${jsFilePath}" already exists.`);
if (!existsSync(fileInputPath))
  writeFileSync(fileInputPath, '');
else
  console.log(`"${fileInputPath}" already exists.`);

downloadInput(year, day);
execSync(`code ${fileInputPath} && code ${jsFilePath}`);
