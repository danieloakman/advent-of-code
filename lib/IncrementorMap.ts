export class IncrementorMap {
  private map: Record<string, any> = {};

  inc(key: string, value = 1) {
    if (!this.map[key]) this.map[key] = value;
    else this.map[key] += value;
  }

  get(key: string) {
    return this.map[key] || 0;
  }

  set(key: string, value: any) {
    this.map[key] = value;
  }

  *entries() {
    for (const key in this.map) yield [key, this.map[key]];
  }

  isEqual(other: IncrementorMap) {
    for (const [pair, count] of this.entries()) if (other.get(pair) !== count) return false;
    for (const [pair, count] of other.entries()) if (this.get(pair) !== count) return false;
    return true;
  }
}
