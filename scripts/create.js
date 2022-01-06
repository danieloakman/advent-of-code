'use strict';
const { writeFileSync, existsSync } = require('fs');
const { ArgumentParser } = require('argparse');
const { join } = require('path');
const { execSync } = require('child_process');

// Get command line arguments:
const argparser = new ArgumentParser({ description: 'Sync-Local-and-Cloud' });
argparser.add_argument('year');
argparser.add_argument('day');
const { year, day } = argparser.parse_args();

const fileStr =
`'use strict';

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\\n\\r]+/)

// First Star:


// Second Star:


`;

const jsFilePath = join(__dirname, '../', `${year}/day${day}.js`);
const fileInputPath = join(__dirname, '../', `${year}/day${day}-input`);
if (!existsSync(jsFilePath))
  writeFileSync(jsFilePath, fileStr);
else
  console.log(`"${jsFilePath}" already exists.`);
if (!existsSync(fileInputPath))
  writeFileSync(fileInputPath, '');
else
  console.log(`"${fileInputPath}" already exists.`);

execSync(`code ${jsFilePath} && code ${fileInputPath}`);
