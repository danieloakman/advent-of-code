'use strict';
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { ArgumentParser } = require('argparse');
const { join } = require('path');
const { execSync } = require('child_process');
const { downloadInput } = require('../lib/downloadInput');

// Get command line arguments:
const argparser = new ArgumentParser({ description: 'Sync-Local-and-Cloud' });
argparser.add_argument('year');
argparser.add_argument('day');
const { year, day } = argparser.parse_args();

const fileStr =
`'use strict';
// https://adventofcode.com/${year}/day/${day}
// https://adventofcode.com/${year}/day/${day}/input

const { readFileSync } = require('fs');
const once = require('lodash/once');
// const { iterate } = require('iterare');

const input = once(() => readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(/[\\n\\r]+/));

// First Star:


// Second Star:


`;

const jsFilePath = join(__dirname, '../', `${year}/day${day}.js`);
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

downloadInput(year, day)
execSync(`code ${fileInputPath} && code ${jsFilePath}`);
