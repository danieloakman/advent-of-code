'use strict';
const { spawn } = require('child_process');

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
 * @throws {InvalidArgumentError} Throws an InvalidArgumentError if regex does not have the
 * global flag set.
 */
module.exports.matches = function* matches (regex, string) {
  if (!(regex instanceof RegExp) || !regex.flags.includes('g')) {
      throw new InvalidArgumentError(
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
