import map from 'iteragain/map';
import ObjectIterator from 'iteragain/internal/ObjectIterator';

export class NestedMap<V = any> implements Map<string, V> {
  public [Symbol.toStringTag] = 'NestedMap';
  protected _dict: any = {};

  public get size(): number {
    return Object.keys(this._dict).length;
  }

  public clear(): void {
    this._dict = {} as Record<string, V>;
  }

  public delete(key: string): boolean;
  public delete(keys: string[]): boolean;
  public delete(keyOrKeys: string | string[]): boolean {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    let dict = this._dict;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!dict[keys[i]]) return false;
      dict = dict[keys[i]];
    }
    const key = keys[keys.length - 1];
    if (key) delete dict[key];
    return true;
  }

  public forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void {
    const it = this.entries();
    let next: IteratorResult<[string, V]>;
    while (!(next = it.next()).done) callbackfn.call(thisArg, next.value[1], next.value[0], this);
  }

  public get(...keys: string[]): V | undefined {
    let dict = this._dict;
    for (const key of keys) {
      if (dict[key] === undefined) return undefined;
      dict = dict[key];
    }
    return dict;
  }

  public has(...keys: string[]): boolean {
    return this.get(...keys) !== undefined;
  }

  public set(key: string, value: V): this;
  public set(keys: string[], value: V): this;
  public set(keyOrKeys: string | string[], value: V): this {
    let dict = this._dict;
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    for (let i = 0; i < keys.length - 1; i++) {
      if (dict[keys[i]] === undefined) dict[keys[i]] = {};
      dict = dict[keys[i]];
    }
    dict[keys[keys.length - 1]] = value;
    return this;
  }

  public entries(): IterableIterator<[string, V]> {
    return map(new ObjectIterator(this._dict), ([key, value]) => [key, value] as [string, V]);
  }

  public keys(): IterableIterator<string> {
    return map(new ObjectIterator(this._dict), ([k]) => k as string);
  }

  public values(): IterableIterator<V> {
    return map(new ObjectIterator(this._dict), ([, v]) => v);
  }

  public [Symbol.iterator](): IterableIterator<[string, V]> {
    return this.entries();
  }

  public toJSON(): Record<string, V> {
    return this._dict;
  }

  public toString(): string {
    return JSON.stringify(this._dict);
  }
}

export default NestedMap;

// const nestedMap = new NestedMap<number>();
// nestedMap.set(['a', 'b'], 1);
// console.log([...nestedMap.values()]);
// nestedMap.delete(['a', 'b']);
// console.log([...nestedMap.values()]);
// console.log([...nestedMap.keys()]);
