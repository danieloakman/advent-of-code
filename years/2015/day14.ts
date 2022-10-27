// https://adventofcode.com/2015/day/14

const { readFileSync } = require('fs');
const { deepCopy } = require('../../lib/utils');

const reindeers = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => {
    const [speed, fly, rest] = str.match(/\d+/g).map(Number);
    return { name: str.match(/^[a-z]+/i)[0], speed, fly, rest };
  });

// First and second Star:
function race(reindeers, seconds) {
  const distances = Object.values(reindeers).reduce((map, { name }) => {
    map[name] = 0;
    return map;
  }, {});
  const points = deepCopy(distances);

  const getWinner = byScoring => Object.keys(byScoring).sort((a, b) => byScoring[b] - byScoring[a])[0];

  for (let secs = 0; secs < seconds; secs++) {
    for (const { name, speed, fly, rest } of reindeers) if (secs % (fly + rest) < fly) distances[name] += speed;
    points[getWinner(distances)]++;
  }

  const distancesWinner = getWinner(distances);
  const pointsWinner = getWinner(points);
  console.log(`Distance winner: ${distancesWinner} with ${distances[distancesWinner]}km`);
  console.log(`Points winner: ${pointsWinner} with ${points[pointsWinner]} points`);
}

race(reindeers, 2503);
