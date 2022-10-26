// https://adventofcode.com/2017/day/5
// https://adventofcode.com/2017/day/5/input

const { readFileSync } = require('fs');

function getInput() {
  // return [0, 3, 0, 1, -3];
  return readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
    .split(/[\n\r]+/)
    .map(Number);
}

// First Star:
{
  const input = getInput();
  let steps = 0;
  for (let i = 0; i < input.length; steps++) {
    const j = i;
    i += input[i];
    input[j]++;
  }
  console.log({ steps });
}

// Second Star:
{
  const input = getInput();
  let steps = 0;
  for (let i = 0; i < input.length; steps++) {
    const j = i;
    i += input[i];
    if (input[j] >= 3) input[j]--;
    else input[j]++;
  }
  console.log({ steps });
}
