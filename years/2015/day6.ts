// https://adventofcode.com/2015/day/6

const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const cmd = str.match(/^\D+/)[0].trim();
    const [start, end] = str
      .replace(cmd, '')
      .trim()
      .split(' through ')
      .map(nums => nums.split(',').map(Number));
    return { cmd, start, end };
  });

function* lightsWithin(start, end) {
  for (let x = start[0]; x <= end[0]; x++) {
    for (let y = start[1]; y <= end[1]; y++) {
      yield { x, y };
    }
  }
}

function countLights(lights) {
  return lights.reduce((acc, row) => acc + row.reduce((acc, light) => acc + light, 0), 0);
}

// First Star:
let lights = new Array(1000).fill(0).map(() => new Array(1000).fill(0));
for (const { cmd, start, end } of input) {
  for (const { x, y } of lightsWithin(start, end)) {
    if (cmd === 'turn on') lights[y][x] = 1;
    else if (cmd === 'turn off') lights[y][x] = 0;
    else if (cmd === 'toggle') lights[y][x] = lights[y][x] === 0 ? 1 : 0;
  }
}
console.log({ numOfLightsTurnedOn: countLights(lights) });

// Second Star:
lights = new Array(1000).fill(0).map(() => new Array(1000).fill(0));
for (const { cmd, start, end } of input) {
  for (const { x, y } of lightsWithin(start, end)) {
    if (cmd === 'turn on') lights[y][x] += 1;
    else if (cmd === 'turn off') lights[y][x] = Math.max(lights[y][x] - 1, 0);
    else if (cmd === 'toggle') lights[y][x] += 2;
  }
}
console.log({ numOfLightsTurnedOn: countLights(lights) });
