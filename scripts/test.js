'use script';

const terminal = require('terminal-kit').terminal;
const { readdirDeepSync } = require('more-node-fs');
const { join } = require('path');

const dirs = readdirDeepSync(join('../', __dirname))
  .files
  .filter(dir => /day\d+\.js/.test(dir));

terminal.dir