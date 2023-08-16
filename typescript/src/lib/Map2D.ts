import iter from 'iteragain/iter';
import range from 'iteragain/range';

export type Get<T> = {
  (x: number, y: number): T;
  up: (x: number, y: number) => T;
  down: (x: number, y: number) => T;
  left: (x: number, y: number) => T;
  right: (x: number, y: number) => T;
  upLeft: (x: number, y: number) => T;
  upRight: (x: number, y: number) => T;
  downLeft: (x: number, y: number) => T;
  downRight: (x: number, y: number) => T;
};

export type ValuePoint<T> = [number, number, T];

export class Map2D<T> {
  public get = Object.defineProperties((x: number, y: number) => this.map[`${x},${y}`], {
    'up': { value: (x: number, y: number) => this.map[`${x},${y - 1}`] },
    'down': { value: (x: number, y: number) => this.map[`${x},${y + 1}`] },
    'left': { value: (x: number, y: number) => this.map[`${x - 1},${y}`] },
    'right': { value: (x: number, y: number) => this.map[`${x + 1},${y}`] },
    'upLeft': { value: (x: number, y: number) => this.map[`${x - 1},${y - 1}`] },
    'upRight': { value: (x: number, y: number) => this.map[`${x + 1},${y - 1}`] },
    'downLeft': { value: (x: number, y: number) => this.map[`${x - 1},${y + 1}`] },
    'downRight': { value: (x: number, y: number) => this.map[`${x + 1},${y + 1}`] },
  }) as Get<T>;

  public point = {
    up: (x: number, y: number) => [x, y - 1] as const,
    down: (x: number, y: number) => [x, y + 1] as const,
    left: (x: number, y: number) => [x - 1, y] as const,
    right: (x: number, y: number) => [x + 1, y] as const,
    upLeft: (x: number, y: number) => [x - 1, y - 1] as const,
    upRight: (x: number, y: number) => [x + 1, y - 1] as const,
    downLeft: (x: number, y: number) => [x - 1, y + 1] as const,
    downRight: (x: number, y: number) => [x + 1, y + 1] as const,
  };

  public xMin: number;
  public xMax: number;
  public yMin: number;
  public yMax: number;
  private map: Record<string, T> = {};

  constructor({ xMin, xMax, yMin, yMax }: { xMin?: number; xMax?: number; yMin?: number; yMax?: number } = {}) {
    this.xMin = xMin || 0;
    this.xMax = xMax || 0;
    this.yMin = yMin || 0;
    this.yMax = yMax || 0;
  }

  get width(): number {
    return this.xMax - this.xMin + 1;
  }

  get height(): number {
    return this.yMax - this.yMin + 1;
  }

  setBounds(...numbers: number[]): void;
  setBounds(x: number, y: number): void {
    this.xMin = Math.min(this.xMin, x);
    this.xMax = Math.max(this.xMax, x);
    this.yMin = Math.min(this.yMin, y);
    this.yMax = Math.max(this.yMax, y);
  }

  resetBounds() {
    this.xMin = this.xMax = this.yMin = this.yMax = 0;
    Object.keys(this.map).forEach(key => this.setBounds(...key.split(',').map(parseFloat)));
  }

  set(x: number, y: number, value: T) {
    this.setBounds(x, y);
    this.map[`${x},${y}`] = value;
  }

  has(x: number, y: number) {
    return this.map[`${x},${y}`] !== undefined;
  }

  clear(x: number, y: number) {
    delete this.map[`${x},${y}`];
  }

  toArray() {
    const arr: T[][] = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      const row: T[] = [];
      for (let x = this.xMin; x <= this.xMax; x++) row.push(this.map[`${x},${y}`]);
      arr.push(row);
    }
    return arr;
  }

  print(toString: (arg0: ValuePoint<T>) => string = ([_, __, v]) => (v ? '#' : '.')) {
    const lines: string[][] = [];
    let padding = 0;

    for (let y = this.yMin; y <= this.yMax; y++) {
      const line: string[] = [];
      for (let x = this.xMin; x <= this.xMax; x++) {
        const value = toString([x, y, this.map[`${x},${y}`]]);
        padding = Math.max(padding, value.length);
        line.push(value);
      }
      lines.push(line);
    }

    const spacing = padding > 1 ? 1 : 0;

    console.log(
      lines
        .map(line => line.map(value => value.padEnd(padding)).join(' '.repeat(spacing)))
        .join('\n'.repeat(spacing + 1)),
    );
  }

  toString() {
    return this.toArray()
      .map(row => row.join(''))
      .join('\n');
  }

  /** An iterator for all points in the map. */
  points() {
    let x = this.xMin;
    let y = this.yMin;
    return iter(() => {
      if (x > this.xMax) {
        x = this.xMin;
        y++;
      }
      if (y > this.yMax) return null;
      return [x++, y, this.map[`${x - 1},${y}`]] as ValuePoint<T>;
    }, null);
  }

  /** An iterator for all points inside a specified bounds. */
  pointsInside(bounds = { xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax }) {
    let x = bounds.xMin;
    let y = bounds.yMin;
    return iter(() => {
      if (x > bounds.xMax) {
        x = bounds.xMin;
        y++;
      }
      if (y > bounds.yMax) return null;
      return [x++, y, this.map[`${x - 1},${y}`]] as ValuePoint<T>;
    }, null);
  }

  /** An optimised iterator for only the set values of the map. */
  values() {
    return iter(Object.entries(this.map)).map(
      ([key, value]) => [...key.split(',').map(Number), value] as ValuePoint<T>,
    );
  }

  rows(reverse = false) {
    return iter(reverse ? range(this.yMax, this.yMin - 1) : range(this.yMin, this.yMax)).map(y =>
      iter(reverse ? range(this.xMax, this.xMin - 1) : range(this.xMin, this.xMax)).map(
        x => [x, y, this.map[`${x},${y}`]] as ValuePoint<T>,
      ),
    );
  }

  columns(reverse = false) {
    return iter(reverse ? range(this.xMax, this.xMin - 1) : range(this.xMin, this.xMax)).map(x =>
      iter(reverse ? range(this.yMax, this.yMin - 1) : range(this.yMin, this.yMax)).map(
        y => [x, y, this.map[`${x},${y}`]] as ValuePoint<T>,
      ),
    );
  }

  /** Iterator for all 8 neighbours around a point. */
  neighbours(x: number, y: number) {
    return iter(Object.values(this.point)).map(fn => {
      const [nx, ny] = fn(x, y);
      return [nx, ny, this.map[`${nx},${ny}`]] as ValuePoint<T>;
    });
  }

  /** Iterator for only the 4 adjacent (up, down, left, right) neighbours around a point. */
  adjacentNeighbours(x: number, y: number) {
    return iter([this.point.up, this.point.down, this.point.left, this.point.right]).map(fn => {
      const [nx, ny] = fn(x, y);
      return [nx, ny, this.map[`${nx},${ny}`]] as ValuePoint<T>;
    });
  }

  /** Iterator for only the 4 diagonal neighbours around a point. */
  diagonalNeighbours(x: number, y: number) {
    return iter([this.point.upLeft, this.point.upRight, this.point.downLeft, this.point.downRight]).map(fn => {
      const [nx, ny] = fn(x, y);
      return [nx, ny, this.map[`${nx},${ny}`]] as ValuePoint<T>;
    });
  }

  /** Returns true if `x,y` is on the edge of the bounds of this map. */
  isOnEdge(x: number, y: number): boolean {
    return x === this.xMin || x === this.xMax || y === this.yMin || y === this.yMax;
  }

  /** @deprecated Use `points` instead. */
  getAll(predicate: (value: T, x: number, y: number) => any = v => typeof v !== 'undefined') {
    return this.getInside({ xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax }, predicate);
  }

  /** @deprecated Use `values` instead. */
  *getValues(predicate: (value: T, x: number, y: number) => any = v => typeof v !== 'undefined') {
    for (const key in this.map) {
      const [x, y] = key.split(',').map(Number);
      const value = this.map[key];
      if (predicate(value, x, y)) yield { x, y, value };
    }
  }

  /** @depreacted Use `pointsInside` instead. */
  *getInside(
    bounds = { xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax },
    predicate: (value: T, x: number, y: number) => any = v => typeof v !== 'undefined',
  ) {
    for (let y = bounds.yMin; y <= bounds.yMax; y++)
      for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        const value = this.map[`${x},${y}`];
        if (predicate(value, x, y)) yield { x, y, value };
      }
  }

  /** @deprecated Use `neighbours` instead. */
  getNeighbours(x: number, y: number, yieldUndefinedNeighbours = true) {
    return this.getInside(
      { xMin: x - 1, xMax: x + 1, yMin: y - 1, yMax: y + 1 },
      (value, x2, y2) => `${x},${y}` !== `${x2},${y2}` && (typeof value !== 'undefined' || yieldUndefinedNeighbours),
    );
  }
}

export default Map2D;
