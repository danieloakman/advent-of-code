export class Map2D {
  public get = Object.defineProperties((x: number, y: number) => this.map[`${x},${y}`], {
    'up': { value: (x: number, y: number) => this.map[`${x},${y - 1}`] },
    'down': { value: (x: number, y: number) => this.map[`${x},${y + 1}`] },
    'left': { value: (x: number, y: number) => this.map[`${x - 1},${y}`] },
    'right': { value: (x: number, y: number) => this.map[`${x + 1},${y}`] },
    'upLeft': { value: (x: number, y: number) => this.map[`${x - 1},${y - 1}`] },
    'upRight': { value: (x: number, y: number) => this.map[`${x + 1},${y - 1}`] },
    'downLeft': { value: (x: number, y: number) => this.map[`${x - 1},${y + 1}`] },
    'downRight': { value: (x: number, y: number) => this.map[`${x + 1},${y + 1}`] },
  });
  public xMin: number;
  public xMax: number;
  public yMin: number;
  public yMax: number;
  private map: Record<string, any> = {};

  constructor({ xMin, xMax, yMin, yMax }: { xMin?: number; xMax?: number; yMin?: number; yMax?: number } = {}) {
    this.xMin = xMin || 0;
    this.xMax = xMax || 0;
    this.yMin = yMin || 0;
    this.yMax = yMax || 0;
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

  set(x: number, y: number, value: any) {
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
    const arr = [];
    for (let y = this.yMin; y <= this.yMax; y++) {
      const row = [];
      for (let x = this.xMin; x <= this.xMax; x++) row.push(this.map[`${x},${y}`]);
      arr.push(row);
    }
    return arr;
  }

  toString() {
    return this.toArray()
      .map(row => row.join(''))
      .join('\n');
  }

  getAll(predicate: (value: any, x: number, y: number) => any = v => typeof v !== 'undefined') {
    return this.getInside({ xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax }, predicate);
  }

  *getValues(predicate: (value: any, x: number, y: number) => any = v => typeof v !== 'undefined') {
    for (const key in this.map) {
      const [x, y] = key.split(',').map(Number);
      const value = this.map[key];
      if (predicate(value, x, y)) yield { x, y, value };
    }
  }

  *getInside(
    bounds = { xMin: this.xMin, xMax: this.xMax, yMin: this.yMin, yMax: this.yMax },
    predicate: (value: any, x: number, y: number) => any = v => typeof v !== undefined,
  ) {
    for (let y = bounds.yMin; y <= bounds.yMax; y++)
      for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        const value = this.map[`${x},${y}`];
        if (predicate(value, x, y)) yield { x, y, value };
      }

  }

  getNeighbours(x: number, y: number, yieldUndefinedNeighbours = true) {
    return this.getInside(
      { xMin: x - 1, xMax: x + 1, yMin: y - 1, yMax: y + 1 },
      (value, x2, y2) => `${x},${y}` !== `${x2},${y2}` && (typeof value !== 'undefined' || yieldUndefinedNeighbours),
    );
  }
}
