'use strict';

/**
 * @param {number} ms 
 * @returns {Promise<void>}
 */
module.exports.sleep = function sleep (ms = 1000) {
  // console.log(`Sleeping for ${ms}ms`);
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.callSafely = function (fn, _this, ...args) {
  try {
    return fn.call(_this, ...args);
  } catch (_) {
    return null;
  }
};
