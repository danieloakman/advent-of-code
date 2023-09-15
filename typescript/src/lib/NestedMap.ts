import map from 'iteragain-es/map';
import ObjectIterator from 'iteragain-es/internal/ObjectIterator';

export type NestedMapValue<V> = V | Record<string, V>;

export class NestedMap<V = any> implements Map<string, NestedMapValue<V>> {
  public [Symbol.toStringTag] = 'NestedMap';
  protected dict: any = {};

  public get size(): number {
    return Object.keys(this.dict).length;
  }

  public clear(): void {
    this.dict = {};
  }

  public delete(key: string): boolean;
  public delete(keys: string[]): boolean;
  public delete(keyOrKeys: string | string[]): boolean {
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    let dict = this.dict;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!dict[keys[i]]) return false;
      dict = dict[keys[i]];
    }
    const key = keys[keys.length - 1];
    if (key) delete dict[key];
    return true;
  }

  public forEach(
    callbackfn: (value: NestedMapValue<V>, key: string, map: Map<string, NestedMapValue<V>>) => void,
    thisArg?: any,
  ): void {
    const it = this.entries();
    let next: IteratorResult<[string, NestedMapValue<V>]>;
    while (!(next = it.next()).done) callbackfn.call(thisArg, next.value[1], next.value[0], this);
  }

  public get(...keys: string[]): NestedMapValue<V> | undefined {
    let dict = this.dict;
    for (const key of keys) {
      if (dict[key] === undefined) return undefined;
      dict = dict[key];
    }
    return dict;
  }

  public has(...keys: string[]): boolean {
    return this.get(...keys) !== undefined;
  }

  public set(key: string, value: NestedMapValue<V>): this;
  public set(keys: string[], value: NestedMapValue<V>): this;
  public set(keyOrKeys: string | string[], value: NestedMapValue<V>): this {
    let dict = this.dict;
    const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    for (let i = 0; i < keys.length - 1; i++) {
      if (dict[keys[i]] === undefined) dict[keys[i]] = {};
      dict = dict[keys[i]];
    }
    dict[keys[keys.length - 1]] = value;
    return this;
  }

  public entries(): IterableIterator<[string, NestedMapValue<V>]> {
    return map(new ObjectIterator(this.dict), ([key, value]) => [key, value] as [string, NestedMapValue<V>]);
  }

  public keys(): IterableIterator<string> {
    return map(new ObjectIterator(this.dict), ([k]) => k);
  }

  public values(): IterableIterator<V> {
    return map(new ObjectIterator(this.dict), ([, v]) => v);
  }

  public [Symbol.iterator](): IterableIterator<[string, NestedMapValue<V>]> {
    return this.entries();
  }

  public toJSON(): Record<string, NestedMapValue<V>> {
    return this.dict;
  }

  public toString(): string {
    return JSON.stringify(this.dict);
  }
}

export default NestedMap;
