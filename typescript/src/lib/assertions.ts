import { ok, deepStrictEqual } from 'assert';

export { throws } from 'assert';
export function assert(value: unknown, message?: string | Error): asserts value {
  ok(value, message);
}

/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
export const expectType = <T>(value: T) => value;

/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export const equal = <T>(actual: T, expected: T, message?: string | Error) => deepStrictEqual(actual, expected, message);
