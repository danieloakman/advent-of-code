// import { lineLength } from 'geometric';
// console.log(lineLength([[0, 0], [10, 10]]));

import { walkdirSync } from 'more-node-fs';
import { join, sep } from 'path';
import { iter } from 'iteragain';
import nth from 'lodash/nth';

// Format .ts files
iter(walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  .filter(file => file.stats.isFile() && /^\d{4}$/i.test(nth(file.path.split(sep), -2) ?? '') && /\.ts$/.test(file.path))
  .forEach(file => console.log(file.path));
