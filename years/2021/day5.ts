const { readFileSync } = require('fs');
class Line {
  constructor(...points) {
    this[0] = { x: points[0], y: points[1] };
    this[1] = { x: points[2], y: points[3] };
  }

  get isVertical() {
    const gradient = this.gradient;
    return gradient === Infinity || gradient === -Infinity;
  }

  get isDiagonal() {
    const gradient = this.gradient;
    return gradient === 1 || gradient === -1;
  }

  get isHorizontal() {
    return this.gradient === 0;
  }

  get gradient() {
    const result = (this[1].y - this[0].y) / (this[1].x - this[0].x);
    return isNaN(result) ? 0 : result;
  }

  *pointsAlongline() {
    let { x, y } = this[0];
    const incX = Math.sign(this[1].x - this[0].x);
    const incY = Math.sign(this[1].y - this[0].y);
    yield { x, y };
    do {
      x += incX;
      y += incY;
      yield { x, y };
    } while (!(x === this[1].x && y === this[1].y));
  }
}
const lines = readFileSync(__filename.replace('.ts', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .filter(v => v)
  .map(str => new Line(...str.match(/\d+/g).map(parseFloat)));

// Silver star:
let map = [];
function add(x, y) {
  if (!map[y]) map[y] = [];
  if (map[y][x] === undefined) map[y][x] = 1;
  else map[y][x]++;
}
function countOverlappedLines() {
  return map.reduce((sum, row) => sum + row.reduce((sum, col) => sum + (col > 1 ? 1 : 0), 0), 0);
}
lines
  .filter(line => line.isHorizontal || line.isVertical)
  .forEach(line => {
    for (const { x, y } of line.pointsAlongline()) add(x, y);
  });
console.log({ overlapCount: countOverlappedLines() });

// Gold star:
map = [];
lines
  .filter(line => line.isDiagonal || line.isHorizontal || line.isVertical)
  .forEach(line => {
    for (const { x, y } of line.pointsAlongline()) add(x, y);
  });
console.log({ overlapCount: countOverlappedLines() });
