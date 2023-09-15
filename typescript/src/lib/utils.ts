import { spawn } from 'child_process';
import once from 'lodash/once';
import memoize from 'lodash/memoize';
import { existsSync, mkdirSync } from 'fs';
import { BinaryLike, BinaryToTextEncoding, createHash } from 'crypto';
import { iter, range as _range, toArray, Tuple, map } from 'iteragain-es';
import { ExtendedIterator } from 'iteragain-es/internal/ExtendedIterator';
import readline from 'readline';
import { join } from 'path';
import { deepStrictEqual as equal } from 'assert';
import { AnyFunc, Nullish, Ok, Result } from './types';
import { ArgumentOptions, ArgumentParser } from 'argparse';

export const IS_RUNNING_WITH_BUN = 'Bun' in global;
if (IS_RUNNING_WITH_BUN) {
  // Polyfill module:
  // @ts-ignore
  global.module = { exports: {} };
}

export const tmpdir = once(() => {
  const tmpdir = join(__dirname, '../../..', 'tmp');
  if (!existsSync(tmpdir)) mkdirSync(tmpdir);
  return tmpdir;
});

export function sleep(ms = 1000): Promise<void> {
  // console.log(`Sleeping for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps the execution of `func` in a try catch block. Works on both synchronous and asynchronous
 * functions. Is used for calling functions that don't require anything to be done in the catch
 * block. Essentially just ommitting the need for a catch statement and having a way to safely call
 * a function in one line.
 * @param template T extends ((...params: any[]) => any)
 * @param fn
 * @param _this
 * @param args
 * @returns Null if func threw an error. If no error, then returns whatever func returns.
 * Returning the null on an error is so that checking for a valid result is simpler.
 */
export function callSafely<T extends (...args: any[]) => any>(
  fn: T,
  _this: ThisParameterType<T>,
  ...args: Parameters<T>
): ReturnType<T> | null {
  try {
    const result = fn.call(_this, ...args);
    return typeof result === 'object' && typeof result.catch === 'function'
      ? result.catch((_: Error): null => null)
      : result;
  } catch (_) {
    return null;
  }
}

/**
 * Calls regex.exec(string) continually until there are no more matches. Differs from
 * string.match(regex) as that only returns a string array.
 * @param regex The regular expression to use on string. Must have the global flag set.
 * @param string The string to search through.
 * @throws Throws an Error if regex does not have the global flag set.
 */
export function matches(regex: RegExp, string: string): ExtendedIterator<RegExpExecArray> {
  if (!regex.flags.includes('g')) regex = new RegExp(regex.source, regex.flags + 'g');
  return iter(() => regex.exec(string), null);
}

/**
 * A convenient type for using the most commonly used result of `RegExp.exec` or `String.match`
 * (when not using the "g" flag). For example `'abc'.match(/a/)[0]` returns the first complete capture group string of
 * the match. This type is just that string itself, as well as having the `start`, `end` and `input` properties.
 */
export type CompleteRegExpMatch = string & {
  /** The start index of this match in `input`. */
  start: number;
  /** The end index of this match in `input`. */
  end: number;
  /** The input string that was searched. */
  input: string;
};

/**
 * @param value Result from `RegExp.exec` or `String.match`.
 * @returns The first match from the result of `RegExp.exec` or `String.match`. I.e. result[0], result.index and
 * result.input.
 */
export function toMatch(value: Nullish<RegExpExecArray | RegExpMatchArray>): Nullish<CompleteRegExpMatch> {
  if (!value || typeof value.index !== 'number' || typeof value.input !== 'string') return null;
  const str = value[0];
  return Object.assign(str, { start: value.index, end: value.index + str.length, input: value.input });
}

/**
 * Implementation of Array.splice but with strings. It's quicker than doing
 * str.split('').map(func).join('') or similar as it just uses two slice methods.
 * @param str The string to be spliced.
 * @param index The index to start the splice.
 * @param count Optional, number of characters in str to remove (default: 1).
 * @param add Optional, the string to append at index.
 */
export function stringSplice(str: string, index: number, count = 1, add = '') {
  if (index < 0 || count < 0) throw new Error('index and count parameters cannot be less than zero');

  return str.slice(0, index) + add + str.slice(index + count);
}

const CHROME_EXE_PATH = once(() => {
  for (const path of [
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/ProgramData/Microsoft/Windows/Start Menu/Programs/Google Chrome.lnk',
    '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome',
  ])
    if (existsSync(path)) return path;
  throw new Error('Could not find Chrome executable on this device.');
});

/**
 * Opens chrome with all cookies of a normal chrome instance opened by the user on the OS.
 * @returns A promise that resolves to a string containing the browser WS endpoint.
 */
export function openChrome(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chrome = spawn(CHROME_EXE_PATH(), ['--remote-debugging-port=9222']);
    function onData(data: any) {
      data = data.toString();
      if (/listening on .+/.test(data)) resolve(data.match(/ws.+/)[0]);
      else if (/error/i.test(data)) reject(data.stack || data);
      else if (/opening in existing/i.test(data)) reject(new Error('Chrome instance already open'));
    }
    chrome.stdout.on('data', onData);
    chrome.on('message', onData);
    chrome.stderr.on('data', onData);
    chrome.on('error', onData);
  });
}

/** @deprecated Use the windows or chunks iterator for this. */
export function subStrings(str: string, subStringLength: number, canOverlap = true) {
  return iter(
    (function* () {
      const inc = canOverlap ? 1 : subStringLength;
      for (let i = 0; i < str.length - (subStringLength - 1); i += inc) yield str.substring(i, i + subStringLength);
    })(),
  );
}

/**
 * Calls the rfdc (really fast deep copy) package.
 * @see https://www.npmjs.com/package/rfdc rfdc npm package.
 * @param options Optional parameters:
 * - proto: Copies any enumarable prototype properties in `obj` as well (default: false). Marginal
 * performance increase when true (2%).
 * - circles: Enables tracking and preserving circular references in `obj` (default: false). If set
 * to true there is a 25% performance decrease, and this is regardless of whether or not `obj` even
 * has any circular references in it.
 * @note This will not preserve the class type of `obj`, if it has one. So if you pass in an
 * instance of `class MyClass` called `myObj`, then this will evaluate to
 * false: `deepCopy(myObj) instanceof MyClass`. The proto option has no effect on this also.
 * @returns The `obj` param deeply copied.
 */
export const deepCopy = (() => {
  // Memoizes the creation of the deep copy function.
  const rfdc = memoize(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    options => require('rfdc')(options),
    options => JSON.stringify(options),
  );
  return <T>(obj: T, options?: { proto?: boolean; circles?: boolean }) => rfdc(options ?? {})(obj) as T;
})();

export function partitionArray<T>(array: T[], numOfPartitions: number) {
  return new Array(numOfPartitions).fill(1).map((_, i, arr) => {
    return array.slice(Math.floor(array.length * (i / arr.length)), Math.floor(array.length * ((i + 1) / arr.length)));
  });
}

/** @deprecated Use some iterator for this. */
export function subArrays<T>(array: T[], subArrayLength: number, canOverlap = true) {
  return iter(
    (function* () {
      const inc = canOverlap ? 1 : subArrayLength;
      for (let i = 0; i < array.length - (subArrayLength - 1); i += inc) yield array.slice(i, i + subArrayLength);
    })(),
  );
}

/** @deprecated Use `add` instead. */
// @ts-ignore
export const sum = <T extends string | number>(a: T, b: T): T => a + b;

export type KeyItentifier<T> = string | ((item: T) => string);

/**
 * Groups elements together from a `T[]`, use the `key` function to determine how to group. Similar to lodash's groupBy
 * except allows multiple groups to be created from one iteration of `arr`.
 */
export function groupBy<T>(arr: T[], key: KeyItentifier<T>): Record<string, T[]>;
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]): Record<string, T[]>[];
export function groupBy<T>(arr: T[], ...keys: KeyItentifier<T>[]) {
  const results = toArray(map(keys, key => [key, {} as Record<string, T[]>] as const));
  for (const value of arr) {
    for (const [key, map] of results) {
      const k = typeof key === 'string' ? (value as any)?.[key] : key(value);
      map[k] = (map[k] ?? ([] as any[])).concat(value);
    }
  }
  return results.length < 2 ? results[0][1] : results.map(([_, map]) => map);
}

/**
 * Does a group by for any number of properties in an array of objects. If multiple props are specified,
 * then these are grouped together in a single returned property like: {'prop1,prop2': [all objects that have those props]}.
 * This differs from lodash.groupBy() because of this multiple props feature. In order to achieve the same thing with
 * lodash.groupBy(), multiple calls would need to be made to it, which means more than objects.length number of iterations.
 * Where as this function will always take objects.length number of iterations.
 * @param objects An array of objects.
 * @param  props The property/key/attribute(s) to group by.
 * @returns The groups of those specified properties.
 */
export function groupByProps<T>(objects: T[], props: string[]): { [key: string]: T[] } {
  const groups = {};
  for (const object of objects) {
    const propsStr =
      props.length > 1
        ? props.reduce((p, c) => (object as any)[p] + ',' + (object as any)[c])
        : (object as any)[props[0]];
    if (!(groups as any)[propsStr]) (groups as any)[propsStr] = [object];
    else (groups as any)[propsStr].push(object);
  }
  return groups;
}

/**
 * Does a group by for every property in every object in objects.
 * @param objects An array of objects.
 * @returns A 3D map. First dimension is the name of the property. Second dimension
 * is every property value for that particular property. 3rd dimension is every object that
 * has that property value.
 */
export function groupByAllProps<T extends Record<PropertyKey, any>>(
  objects: T[],
): { [key: string]: { [key: string]: T[] } } {
  const groups = {};
  for (const object of objects)
    for (const prop of Object.keys(object)) {
      if (!(groups as any)[prop]) (groups as any)[prop] = {};
      const value = object[prop];
      if (!(groups as any)[prop][value]) (groups as any)[prop][value] = [object];
      else (groups as any)[prop][value].push(object);
    }

  return groups;
}

export function middle(a: number, b: number) {
  return (a + b) / 2;
}

export function fibonacci(n = Infinity) {
  return iter(
    (function* () {
      let a = 1;
      let b = 1;
      while (n-- > 0) {
        yield a;
        [a, b] = [b, a + b];
      }
    })(),
  );
}

/** Multiply some degrees by this to get the radian conversion. */
export const RADIANS_MULT = Math.PI / 180;

/** Multiply some radians by this to get the degree conversion. */
export const DEGREES_MULT = 180 / Math.PI;

/**
 * 0 - 360 degrees corresponds to 0 - 6.28 in radians.
 * @param {number} degrees Can be positive or negative.
 * @returns The degrees parameter converted to radians.
 */
export function toRadians(degrees: number) {
  return degrees * RADIANS_MULT;
}

/**
 * 0 - 6.28 in radians corresponds to 0 - 360 in degrees.
 * @param {number} radians Can be positive or negative.
 * @returns The radians parameter converted to degrees.
 */
export function toDegrees(radians: number) {
  return radians * DEGREES_MULT;
}

/**
 * @param data The data to hash. Must be binary like,
 * e.g. a string, Buffer, ArrayBuffer, etc.
 * @param algorithm See require('crypto').getHashes() to get the available hash algorithms
 * on the current device (default: 'md4')
 * @param encoding The encoding of the returned value (default: 'hex').
 * @returns Returns data as hashed using md4 by default (it's usually the fastest). In
 * the case of md4, the returned string will be 32 in length.
 */
export function hash(data: BinaryLike, algorithm = 'md4', encoding: BinaryToTextEncoding = 'hex') {
  return createHash(algorithm).update(data).digest(encoding);
}

/** Returns true if node is debugging. */
export const isInDebug = function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return typeof require('inspector').url() !== 'undefined';
};

export const question = async function (
  questionStr: string,
  defaultAnswer: Nullish<string> = undefined,
): Promise<string> {
  return new Promise(resolve => {
    if (isInDebug()) resolve(defaultAnswer || '');
    else {
      const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      r1.question(questionStr, answer => {
        r1.close();
        resolve(answer || defaultAnswer || '');
      });
    }
  });
};

/** @deprecated Just use iteragain's range and iter separately, it's redundant to use this. */
export function range(...args: Parameters<typeof _range>) {
  return iter(_range(...args));
}

/**
 * Declares and runs a main function if the entry point to the program is `module`. This is esstentially the same as
 * python's `if __name__ == '__main__'` block.
 * @param module The NodeModule where this main function is running from or `import.meta.path`, i.e. the path where this is being called from.
 * @param mainFunction The main function to run.
 */
export function main(module: any, mainFunction: () => Promise<void>) {
  if (!(require?.main === module || (IS_RUNNING_WITH_BUN && Bun.main === module))) return;
  return mainFunction();
}

export function lazyTuple<T, Size extends number>(size: Size, getter: (index: number) => T): Readonly<Tuple<T, Size>> {
  const array: T[] = [];
  for (let i = 0; i < size; i++)
    Object.defineProperty(array, i, {
      get: once(() => getter(i)),
    });
  return array as Tuple<T, Size>;
}

/** Pipes an object through any number of functions. */
export function pipe<T>(value: T, ...funcs: ((value: T) => T)[]): T {
  return funcs.reduce((value, func) => func(value), value);
}

export function add(a: number, b: number): number;
export function add<T>(a: T, b: T): T;
export function add(b: number): (a: number) => number;
export function add<T>(b: T): (a: T) => T;
export function add(a: any, b?: any): any {
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => v + b[i]);
  if (typeof a === 'number') return (_a: number) => _a + a;
  if (Array.isArray(a)) return (_a: number[]) => _a.map((v, i) => v + a[i]);
}

export function mult(a: number, b: number): number;
export function mult<T>(a: T, b: T): T;
export function mult(b: number): (a: number) => number;
export function mult<T>(b: T): (a: T) => T;
export function mult(a: any, b?: any): any {
  if (typeof a === 'number' && typeof b === 'number') return a * b;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => v * b[i]);
  if (typeof a === 'number') return (_a: number) => _a * a;
  if (Array.isArray(a)) return (_a: number[]) => _a.map((v, i) => v * a[i]);
}

export function sub(a: number, b: number): number;
export function sub<T>(a: T, b: T): T;
export function sub(b: number): (a: number) => number;
export function sub<T>(b: T): (a: T) => T;
export function sub(a: any, b?: any): any {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => v - b[i]);
  if (typeof a === 'number') return (_a: number) => _a - a;
  if (Array.isArray(a)) return (_a: number[]) => _a.map((v, i) => v - a[i]);
}

export interface Queue<T> {
  length: number;
  push: Array<T>['push'];
  shift: Array<T>['shift'];
}

export interface Stack<T> {
  length: number;
  push: Array<T>['push'];
  pop: Array<T>['pop'];
}

export function multiComparator<T>(...comparators: ((a: T, b: T) => number)[]): (a: T, b: T) => number {
  return (a: T, b: T) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}

export function manhattanDistance(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);
}

export function limitConcurrentCalls<T extends (...args: any[]) => Promise<any>>(func: T, limit: number): T {
  const resolves: ((...any: any[]) => void)[] = [];

  return (async (...args: Parameters<T>) => {
    if (resolves.length >= limit) await new Promise(resolve => resolves.push(resolve));
    try {
      return await func(...args);
    } finally {
      resolves.shift()?.();
    }
  }) as T;
}

export function range2D(start: [number, number], stop: [number, number], step?: [number, number]) {
  const lastX = start[0];
  const lastY = start[1];
  return iter(_range(start[0], stop[0], step?.[0] ?? 1))
    .zipLongest(_range(start[1], stop[1], step?.[1] ?? 1))
    .map(nums => [nums[0] ?? lastX, nums[1] ?? lastY] as [number, number]);
}

/** Iterator of points starting at top left, spiraling inwards clockwise in a 2D grid. */
export function spiralRange(xMax: number, yMax: number, xMin = 0, yMin = 0) {
  const iterations = (xMax - xMin) * (yMax - yMin);
  return iter(
    (function* () {
      while (true) {
        // Right:
        yield iter(_range(xMin, xMax)).map(n => [n, yMin] as const);
        yMin++;
        // Down:
        yield iter(_range(yMin, yMax)).map(n => [xMax - 1, n] as const);
        xMax--;
        // Left:
        yield iter(_range(xMax - 1, xMin - 1)).map(n => [n, yMax - 1] as const);
        yMax--;
        // Up:
        yield iter(_range(yMax - 1, yMin - 1)).map(n => [xMin, n] as const);
        xMin++;
      }
    })(),
  )
    .flatten(1)
    .enumerate()
    .takeWhile(([i]) => i < iterations)
    .map(([_, v]) => v);
}
equal(spiralRange(3, 3).toArray(), [
  [0, 0],
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2],
  [1, 2],
  [0, 2],
  [0, 1],
  [1, 1],
]);
equal(spiralRange(2, 2).toArray(), [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]);

export function isBetween(value: number, minInclusive: number, maxInclusive: number): boolean {
  return value >= minInclusive && value <= maxInclusive;
}

/** Matches a new line character. Useful for splitting the AOC input into lines. */
export const newLine = /[\n\r]+/;

export function iife<T extends AnyFunc>(fn: T): ReturnType<T> {
  return fn();
}

/**
 * @deprecated With the migration to using Bun, in source testing can no longer be done.
 * Return true if this process can run tests.
 */
export function canTest(): boolean {
  return process.argv.some(arg => arg.includes('test') || arg.includes('tinypool'));
}

/** Returns `n.toFixed` with excess 0s removed. */
export function toFixed(n: number, decimalPlaces: number): string {
  return n.toFixed(decimalPlaces).replace(/\.?0+$/, '');
}

export type ShellCommandOptions = Omit<Parameters<typeof spawn>[2], 'shell' | 'stdio'> & {
  /**
   * @description If true then will pipe stdout and stderr of the spawned shell to console.
   * @default true
   */
  log?: boolean;
};

/** Runs a shell command and returns the output. If the command fails, then an error is returned. */
export function sh(command: string, options: ShellCommandOptions = {}): Promise<Error | string> {
  options.log = options.log ?? true;

  return new Promise(resolve => {
    const s = spawn(command, Object.assign({ shell: true }, options));
    let data = '';
    const handleData = (chunk: Buffer) => {
      const str = chunk.toString();
      data += str + '\n';
      if (options.log) console.log(str);
    };

    s.on('close', code => {
      if (code) resolve(new Error(`Command "${command}" exited with code ${code}`));
      else resolve(data);
    });
    s.on('error', resolve);
    s.stdout?.on('data', handleData);
    s.stderr?.on('data', handleData);
  });
}

export function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Wraps the execution of `func` in a try catch block. Works on both synchronous and asynchronous
 * functions. Is used for calling functions that don't require anything to be done in the catch
 * block. Essentially just ommitting the need for a catch statement and having a way to safely call
 * a function in one line.
 * @param func
 * @param params Optional. Append any params for use in `func`. Needs to be in correct order.
 * @returns Null or undefined if `func` threw an error. If no error, then returns whatever `func` returns.
 * Returning the null on an error is so that checking for a valid result is simpler.
 */
export function safeCall<T extends (...params: any[]) => any>(func: T, ...params: Parameters<T>): ReturnType<T> | null {
  try {
    const result = func(...params);
    return isObjectLike(result) && typeof result.catch === 'function' ? result.catch((_: Error): null => null) : result;
  } catch (_) {
    return null;
  }
}

/**
 * Wraps the execution of `func` in a try catch block. Works on both synchronous and asynchronous. Similar to lodash's
 * `attempt`, except this catches both sync and async errors.
 * @param params Optional. Append any params for use in `func`. Needs to be in correct order.
 * @returns Returns an error if `func` threw an error. If no error, then returns whatever `func` returns.
 */
export function attempt<T extends (...params: any[]) => any>(func: T, ...params: Parameters<T>): Result<ReturnType<T>> {
  try {
    const result = func(...params);
    return isObjectLike(result) && typeof result.catch === 'function' ? result.catch((error: Error) => error) : result;
  } catch (error) {
    return error as Result<ReturnType<T>>;
  }
}

export type AddArgumentParams =
  | [arg: string, options?: ArgumentOptions]
  | [arg1: string, arg2: string, options?: ArgumentOptions];

export function parseArgs<T = unknown>(
  constructorParams: ConstructorParameters<typeof ArgumentParser>[0],
  ...args: AddArgumentParams[]
): T {
  const parser = new ArgumentParser(constructorParams);
  // @ts-ignore
  for (const arg of args) parser.add_argument(...arg);
  return parser.parse_args();
}

export const noop = () => { };

export function isNullish(value: unknown): value is null | undefined {
  return value == null || value == undefined;
}

/**
 * @description Checks if `value` is not nullish or an error and returns it. This is analogous to the `unwrap` method in
 * Rust or any other Result implementation. Its use is for when you don't need or care to handle a non-ok value.
 * @throws {TypeError} Throws if `value` is an error or nullish.
 */
export function ok<T>(value: T): Ok<T> {
  if (value instanceof Error) throw value;
  if (isNullish(value)) throw new TypeError('Expected a non-nullish value.');
  return value as Ok<T>;
}