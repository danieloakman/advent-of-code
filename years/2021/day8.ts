const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [input, output] = str.split(/ +\| +/);
    return { input: input.split(' '), output: output.split(' ') };
  });

// 1st Star:
let a;

// 2nd Star:
