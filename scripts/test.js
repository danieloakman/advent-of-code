'use script';

const terminal = require('terminal-kit').terminal;
const { walkdir } = require('more-node-fs');
const { join } = require('path');
const { execSync } = require('child_process');

let files = [];
for (const { path, stats } of walkdir(join(__dirname, '../')))
  if (stats.isFile() && /day\d+\.js/.test(path))
    files.push({ path, stats });
files = files
  .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
  .map(({ path }) => path.replace(process.cwd() + '\\', ''))

terminal.grabInput();
terminal.on('key', function (key, matches, data) {
  if (key === 'CTRL_C' || key === 'ESCAPE')
    process.exit();
});

function selectedText (err, res) {
  // console.log(err, res);
  try {
    execSync(`node ${res.selectedText}`);
  } catch (err) {
    console.log(err);
  }
  terminal.gridMenu(files, selectedText);
}

terminal.gridMenu(files, selectedText);