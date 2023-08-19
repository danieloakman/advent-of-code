export type Result<T> = T | Error;

/** Contains either T, null or undefined. */
export type Nullish<T> = T | null | undefined;

/** Contains either T, null, undefined or Error. */
export type NullishResult<T> = Result<Nullish<T>>;

/** Unwraps/extracts the wrapped value `T` from a union with undefined, null or error. */
export type Ok<T> = Exclude<T, Error | null | undefined>;

export interface AnyFunc<Args extends unknown[] = unknown[], Return = any> {
  (...args: Args): Return;
}

/** Inteface for methods in something that is "map like" */
export interface MapLike<Key, Value> {
  [Symbol.iterator]: () => IterableIterator<[Key, Value]>;
  get(key: Key): Value | undefined;
  set(key: Key, value: Value): this;
  has(key: Key): boolean;
  delete(key: Key): boolean;
  clear(): void;
  entries(): IterableIterator<[Key, Value]>;
  keys(): IterableIterator<Key>;
  values(): IterableIterator<Value>;
  forEach(callbackfn: (value: Value, key: Key, map: this) => void): void;
}
