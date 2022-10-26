const { readFileSync } = require('fs');

const map = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(str => str.split('').map(parseFloat));

function get(x, y) {
  return map[y] && typeof map[y][x] === 'number' ? map[y][x] : Infinity;
}
function findLowPoints() {
  const lowPoints = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const middle = get(x, y);
      if ([get(x, y - 1), get(x, y + 1), get(x - 1, y), get(x + 1, y)].every(v => v > middle))
        lowPoints.push({ x, y, v: middle });
    }
  }
  return lowPoints;
}
// 1st Star:
const lowPoints = findLowPoints();
console.log({ sumOfRiskLevels: lowPoints.reduce((sum, { v }) => sum + (v + 1), 0) });

// 2nd Star:
const getUnvisited = (() => {
  const visited = {};
  return (x, y) => {
    const key = `${x},${y}`;
    const hasVisited = visited[key] !== undefined;
    visited[key] = true;
    return { v: hasVisited ? Infinity : get(x, y), x, y };
  };
})();
function getAdjacent(x, y) {
  return [getUnvisited(x, y - 1), getUnvisited(x, y + 1), getUnvisited(x - 1, y), getUnvisited(x + 1, y)].filter(
    point => point.v !== Infinity,
  );
}
function findBasins(lowPoints) {
  const basins = [];
  for (const lowPoint of lowPoints) {
    const basin = [getUnvisited(lowPoint.x, lowPoint.y)];
    const stack = getAdjacent(lowPoint.x, lowPoint.y);
    while (stack.length) {
      const point = stack.pop();
      if (point.v < 9) {
        basin.push(point);
        stack.push(...getAdjacent(point.x, point.y).filter(p => p.v < 9));
      }
    }
    basins.push(basin);
  }
  return basins;
}
const basins = findBasins(lowPoints).sort((a, b) => b.length - a.length);
console.log(basins[0].length * basins[1].length * basins[2].length);
