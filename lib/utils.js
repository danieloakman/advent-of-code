'use strict';
const { spawn } = require('child_process');
const memoize = require('lodash/memoize');

/**
 * @param {number} ms 
 * @returns {Promise<void>}
 */
module.exports.sleep = function sleep (ms = 1000) {
  // console.log(`Sleeping for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Wraps the execution of `func` in a try catch block. Works on both synchronous and asynchronous
 * functions. Is used for calling functions that don't require anything to be done in the catch
 * block. Essentially just ommitting the need for a catch statement and having a way to safely call
 * a function in one line.
 * @param {(...params: any[]) => any} fn
 * @param {any} _this
 * @param {args: any[]}
 * @param params Optional. Append any params for use in func. Needs to be in correct order.
 * @returns Null if func threw an error. If no error, then returns whatever func returns.
 * Returning the null on an error is so that checking for a valid result is simpler.
 */
module.exports.callSafely = function (fn, _this, ...args) {
  try {
    const result = fn(...params);
    return typeof result === 'object' && typeof result.catch === 'function'
      ? result.catch(_ => null)
      : result;
  } catch (_) {
    return null;
  }
};

/**
 * Calls regex.exec(string) continually until there are no more matches. Differs from
 * string.match(regex) as that only returns a string array.
 * @param {RegExp} regex The regular expression to use on string. Must have the global flag set.
 * @param {string} string The string to search through.
 * @throws {Error} Throws an Error if regex does not have the global flag set.
 */
module.exports.matches = function* matches (regex, string) {
  if (!(regex instanceof RegExp) || !regex.flags.includes('g')) {
      throw new Error(
          'regex parameter must be a RegExp and have the global \'g\' flag assigned to it.'
      );
  }

  let match;
  while ((match = regex.exec(string)) !== null)
    yield match;
};

/**
 * Implementation of Array.splice but with strings. It's quicker than doing
 * str.split('').map(func).join('') or similar as it just uses two slice methods.
 * @param {string} str The string to be spliced.
 * @param {number} index The index to start the splice.
 * @param {number} count Optional, number of characters in str to remove (default: 1).
 * @param {string} add Optional, the string to append at index.
 */
module.exports.stringSplice = function stringSplice (str, index, count = 1, add = '') {
  if (index < 0 || count < 0) {
    throw new InvalidArgumentError('index and count parameters cannot be less than zero');
  }
  return str.slice(0, index) + add + str.slice(index + count);
};

/**
 * Opens chrome with all cookies of a normal chrome instance opened by the user on the OS.
 * @returns {Promise<string>} A promise that resolves to a string containing the browser WS endpoint.
 */
module.exports.openChrome = function openChrome () {
  return new Promise((resolve, reject) => {
    const chrome = spawn(
      'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      [
        '--remote-debugging-port=9222'
      ]
    );
    function onData (data) {
      data = data.toString();
      if (/listening on .+/.test(data)) {
        resolve(data.match(/ws.+/)[0]);
      } else if (/error/.test(data)) {
        reject(data.stack || data);
      }
    }
    chrome.stdout.on('data', onData);
    chrome.on('message', onData);
    chrome.stderr.on('data', onData);
    chrome.on('error', onData);
  });
};

/**
* @param {string} str
* @param {number} subStringLength
*/
module.exports.subStrings = function* subStrings (str, subStringLength, canOverlap = true) {
  const inc = canOverlap ? 1 : subStringLength;
  for (let i = 0; i < str.length - (subStringLength - 1); i += inc)
    yield str.substring(i, i + subStringLength);
};

/**
 * Calls the rfdc (really fast deep copy) package.
 * @see https://www.npmjs.com/package/rfdc rfdc npm package.
 * @param obj The object to deep copy.
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
module.exports.deepCopy = (() => {
  // Memoizes the creation of the deep copy function.
  const rfdc = memoize(
    options => require('rfdc')(options),
    options => JSON.stringify(options)
  );
  return (obj, options) => {
    return rfdc(options)(obj);
  };
})();

module.exports.partitionArray = function partitionArray (array, numOfPartitions) {
  return new Array(numOfPartitions)
    .fill(1)
    .map((_, i, arr) => {
      return array.slice(
        Math.floor(array.length * (i / arr.length)),
        Math.floor(array.length * ((i + 1) / arr.length))
      );
    });
};

module.exports.subArrays = function* subArrays (array, subArrayLength, canOverlap = true) {
  const inc = canOverlap ? 1 : subArrayLength;
  for (let i = 0; i < array.length - (subArrayLength - 1); i += inc)
    yield array.slice(i, i + subArrayLength);
};

module.exports.sum = (a, b) => a + b;

/**
* Does a group by for any number of properties in an array of objects. If multiple props are specified,
* then these are grouped together in a single returned property like: {'prop1,prop2': [all objects that have those props]}.
* This differs from lodash.groupBy() because of this multiple props feature. In order to achieve the same thing with
* lodash.groupBy(), multiple calls would need to be made to it, which means more than objects.length number of iterations.
* Where as this function will always take objects.length number of iterations.
* @param object An array of objects.
* @param props The property/key/attribute(s) to group by.
* @returns The groups of those specified properties.
*/
module.exports.groupBy = function groupBy (objects, props) {
  const groups = {};
  for (const object of objects) {
    const propsStr = props.length > 1
      ? props.reduce((p, c) => object[p] + ',' + object[c])
      : object[props[0]];
    if (!groups[propsStr])
      groups[propsStr] = [object];
    else
      groups[propsStr].push(object);
  }
  return groups;
};

/**
 * Does a group by for every property in every object in objects.
 * @param object An array of objects.
 * @returns A 3D map. First dimension is the name of the property. Second dimension
 * is every property value for that particular property. 3rd dimension is every object that
 * has that property value.
 */
module.exports.groupByAll = function groupByAll (objects) {
  const groups = {};
  for (const object of objects) {
    for (const prop of Object.keys(object)) {
      if (!groups[prop])
        groups[prop] = {};
      const value = object[prop];
      if (!groups[prop][value])
        groups[prop][value] = [object];
      else
        groups[prop][value].push(object);
    }
  }
  return groups;
};

module.exports.Map2D = class Map2D {
  constructor () {
    this.map = [];
  }

  set (x, y, value) {
    if (this.map[y] === undefined)
      this.map[y] = [];
    this.map[y][x] = value;
  }

  get (x, y) {
    return this.map[y] ? this.map[y][x] : undefined;
  }

  *getAll (predicate = (value, x, y) => value) {
    for (let y = 0; y < this.map.length; y++) {
      if (!this.map[y]) continue;
      for (let x = 0; x < this.map[y].length; x++) {
        const value = this.get(x, y);
        if (predicate(value, x, y))
          yield { x, y, value };
      }
    }
  }
};

/**
 * Similar to lodash's take method except this function works with iterator/generator functions.
 * On arrays, calling take(arr, 1) is functionally the same as arr.shift().
 * @template T
 * @param {T[]|Generator<T>} iterable Array or iterator/generator.
 * @param {number} takeNum Number of elements starting from the front of iterable to
 * take (default: 1). Set to -1 to take all until iterable is empty.
 * @returns {T[]} Returns the array of elements taken from the front.
 */
module.exports.take = function take (iterable, takeNum = 1) {
  const results = [];
  if (Array.isArray(iterable)) {
    while (takeNum-- !== 0 && iterable.length)
      results.push(iterable.shift());
  } else {
    let next;
    while (takeNum-- !== 0 && !(next = iterable.next()).done)
      results.push(next.value);
  }
  return results;
};
