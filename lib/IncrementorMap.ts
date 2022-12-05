import iter from 'iteragain/iter';

export class IncrementorMap {
  private map: Record<string, number> = {};

  inc(key: string, value = 1) {
    this.map[key] = (this.map[key] || 0) + value;
    return this;
  }

  get(key: string) {
    return this.map[key] || 0;
  }

  set(key: string, value: number) {
    this.map[key] = value;
    return this;
  }

  has(key: string) {
    return key in this.map;
  }

  delete(key: string) {
    delete this.map[key];
    return !!this.map[key];
  }

  minmax(): [string, string] {
    let min: [string, number] = ['', Infinity];
    let max: [string, number] = ['', -Infinity];
    for (const [pair, count] of this.entries()) {
      if (count < min[1]) min = [pair, count];
      if (count > max[1]) max = [pair, count];
    }
    return [min[0], max[0]];
  }

  entries() {
    return iter(Object.entries(this.map));
  }

  isEqual(other: IncrementorMap) {
    for (const [pair, count] of this.entries()) if (other.get(pair) !== count) return false;
    for (const [pair, count] of other.entries()) if (this.get(pair) !== count) return false;
    return true;
  }
}

export default IncrementorMap;
