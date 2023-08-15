export type Nullish<T> = T | null | undefined;

export interface AnyFunc<Args extends unknown[] = unknown[], Return = any> {
  (...args: Args): Return;
}
