'use script';

import { terminal } from 'terminal-kit';
import { walkdirSync } from 'more-node-fs';
import { join } from 'path';
import { execSync } from 'child_process';
import iter from 'iteragain/iter';

const files = iter(walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  .filterMap(file => file.stats.isFile() && /day\d+\.[tj]s/.test(file.path) ? file : null)
  .toArray()
  .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
  .map(({ path }) => path.replace(process.cwd() + '\\', ''));

terminal.grabInput({});
terminal.on('key', function (key, _matches, _data) {
  if (key === 'CTRL_C' || key === 'ESCAPE') {
    terminal.clear('Exited test mode.');
    process.exit();
  }
});

function selectedText (err, res) {
  if (err) {
    terminal.clear(err);
    process.exit(1);
  }
  try {
    terminal.clear()(execSync(`npx ts-node --transpileOnly ${res.selectedText}`));
  } catch (err) {
    terminal.clear()(err.stack);
  }
  terminal.gridMenu(files, selectedText);
}

terminal.gridMenu(files, selectedText);
