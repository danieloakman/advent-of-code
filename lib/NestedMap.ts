export class NestedMap<K extends string | number = string | number, V = any> implements Map<K, V> {
  protected dict: Record<K, V> = {};
  // constructor()

  clear(): void {
    throw new Error('Method not implemented.');
  }

  delete(key: K): boolean {
    throw new Error('Method not implemented.');
  }

  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    throw new Error('Method not implemented.');
  }

  get(key: K): V;
  get(...keys: K[]): V {
    throw new Error('Method not implemented.');
  }

  has(key: K): boolean {
    throw new Error('Method not implemented.');
  }

  set(key: K, value: V): this;
  set(keys: K[], value: V): this;
  set(keyOrKeys: K | K [], value: V): this {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    while (keys.length > 1) {
      const key = keys.shift();
      if (!this.dict[key]) this.dict[key] = {};
      this.dict = this.dict[key];
    }
    return this;
  }

  size: number;
  entries(): IterableIterator<[K, V]> {
    throw new Error('Method not implemented.');
  }

  keys(): IterableIterator<K> {
    throw new Error('Method not implemented.');
  }

  values(): IterableIterator<V> {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    throw new Error('Method not implemented.');
  }

  [Symbol.toStringTag]: string;
}
