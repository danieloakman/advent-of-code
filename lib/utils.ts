/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
'use strict';
import { spawn } from 'child_process';
import once = require('lodash/once');
import memoize = require('lodash/memoize');
import { existsSync } from 'fs';
import { BinaryLike, BinaryToTextEncoding, createHash } from 'crypto';
import { iter as iterate } from 'iteragain';
import readline = require('readline');

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
    return typeof result === 'object' && typeof result.catch === 'function' ? result.catch(_ => null) : result;
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
export function matches(regex: RegExp, string: string) {
  return iterate(
    (function* () {
      if (!(regex instanceof RegExp) || !regex.flags.includes('g'))
        throw new Error("regex parameter must be a RegExp and have the global 'g' flag assigned to it.");

      let match: RegExpMatchArray;
      while ((match = regex.exec(string)) !== null) yield match;
    })(),
  );
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
  ])
    if (existsSync(path)) return path;
});

/**
 * Opens chrome with all cookies of a normal chrome instance opened by the user on the OS.
 * @returns A promise that resolves to a string containing the browser WS endpoint.
 */
export function openChrome(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chrome = spawn(CHROME_EXE_PATH(), ['--remote-debugging-port=9222']);
    function onData(data) {
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

export function subStrings(str: string, subStringLength: number, canOverlap = true) {
  return iterate(
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
    options => require('rfdc')(options),
    options => JSON.stringify(options),
  );
  return <T>(obj: T, options?: { proto?: boolean; circles?: boolean }) => rfdc(options ?? {})(obj) as T;
})();

export const partitionArray = function partitionArray(array, numOfPartitions) {
  return new Array(numOfPartitions).fill(1).map((_, i, arr) => {
    return array.slice(Math.floor(array.length * (i / arr.length)), Math.floor(array.length * ((i + 1) / arr.length)));
  });
};

export function subArrays<T>(array: T[], subArrayLength: number, canOverlap = true) {
  return iterate(
    (function* () {
      const inc = canOverlap ? 1 : subArrayLength;
      for (let i = 0; i < array.length - (subArrayLength - 1); i += inc) yield array.slice(i, i + subArrayLength);
    })(),
  );
};

// @ts-ignore
export const sum = <T extends string | number>(a: T, b: T): T => a + b;

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
export function groupBy<T>(objects: T[], props: string[]): { [key: string]: T[] } {
  const groups = {};
  for (const object of objects) {
    const propsStr = props.length > 1 ? props.reduce((p, c) => object[p] + ',' + object[c]) : object[props[0]];
    if (!groups[propsStr]) groups[propsStr] = [object];
    else groups[propsStr].push(object);
  }
  return groups;
};

/**
 * Does a group by for every property in every object in objects.
 * @param objects An array of objects.
 * @returns A 3D map. First dimension is the name of the property. Second dimension
 * is every property value for that particular property. 3rd dimension is every object that
 * has that property value.
 */
export function groupByAll<T>(objects: T[]): { [key: string]: { [key: string]: T[] } } {
  const groups = {};
  for (const object of objects)
    for (const prop of Object.keys(object)) {
      if (!groups[prop]) groups[prop] = {};
      const value = object[prop];
      if (!groups[prop][value]) groups[prop][value] = [object];
      else groups[prop][value].push(object);
    }

  return groups;
};

/**
 * Similar to lodash's take method except this function works with iterator/generator functions.
 * On arrays, calling take(arr, 1) is functionally the same as arr.shift().
 * @param iterable Array or iterator/generator.
 * @param takeNum Number of elements starting from the front of iterable to
 * take (default: 1). Set to -1 to take all until iterable is empty.
 * @returns Returns the array of elements taken from the front.
 */
export function take<T>(iterable: T[] | Generator<T>, takeNum = 1): T[] {
  const results = [];
  if (Array.isArray(iterable)) while (takeNum-- !== 0 && iterable.length) results.push(iterable.shift());
  else {
    let next;
    while (takeNum-- !== 0 && !(next = iterable.next()).done) results.push(next.value);
  }
  return results;
};

export const midNum = function middle(a: number, b: number) {
  return (a + b) / 2;
};

export function fibonacci(n = Infinity) {
  return iterate(
    (function* () {
      let a = 1;
      let b = 1;
      while (n-- > 0) {
        yield a;
        [a, b] = [b, a + b];
      }
    })(),
  );
};

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

/**
 * Returns a generator/iterator for all numbers starting at the start index and one step before
 * the stop index.
 * @see https://lodash.com/docs/4.17.15#range Similar to lodash.range but this is a generator
 * function instead.
 * @param {number} start The start index (inclusive) (default: 0).
 * @param {number} stop The stop index (exclusive).
 * @param {number} step The optional amount to increment each step by, can be positive or
 * negative (default: Math.sign(stop - start)).
 * @returns
 * @example
 * for (const i of range(10).map(i => i * 2))
 *     console.log(i);
 * // logs: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18
 * for (const i of range(0, 10, 1))
 *     console.log(i);
 * // logs: 0 1 2 3 4 5 6 7 8 9
 *
 * for (const i of range(5, 0, -1))
 *     console.log(i);
 * // logs: 5 4 3 2 1
 */
export const range = function (...params) {
  return iterate(
    (function* () {
      let start = 0,
        stop = 0,
        step = null;
      if (params.length === 1) stop = params[0];
      else if (params.length > 1) [start, stop, step] = params;
      if (typeof step !== 'number') step = Math.sign(stop - start);
      const notDone = start < stop ? (stop, i) => stop > i : (stop, i) => stop < i;
      for (let i = start; notDone(stop, i); i += step) yield i;
    })(),
  );
};

/** Returns true if debugging. */
export const isInDebug = function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return typeof require('inspector').url() !== 'undefined';
};

export const question = async function (questionStr, defaultAnswer = undefined) {
  return new Promise(resolve => {
    if (isInDebug()) resolve(defaultAnswer);
    else {
      const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      r1.question(questionStr, answer => {
        r1.close();
        resolve(answer || defaultAnswer);
      });
    }
  });
};
