'use strict';

module.exports = class IncrementorMap {
  constructor () {
    this.map = {};
  }

  inc (key, value = 1) {
    if (!this.map[key])
      this.map[key] = value;
    else
      this.map[key] += value;
  }

  get (key) {
    return this.map[key] || 0;
  }

  set (key, value) {
    this.map[key] = value;
  }

  *entries () {
    for (const key in this.map)
      yield [key, this.map[key]];
  }

  isEqual (other) {
    for (const [pair, count] of this.entries())
      if (other.get(pair) !== count)
        return false;
    for (const [pair, count] of other.entries())
      if (this.get(pair) !== count)
        return false;
    return true;
  }
};
