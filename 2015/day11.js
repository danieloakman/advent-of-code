'use strict';
// https://adventofcode.com/2015/day/11

const { readFileSync } = require('fs');
const { subStrings } = require('../lib/utils');
const { strictEqual: equal, ok: assert } = require('assert');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const FORBIDDEN_CHARS = /[iol]/;

// First Star:
function isValid (password) {
  if (FORBIDDEN_CHARS.test(password))
    return false;

  let hasStraightOfChars = false;
  for (const str of subStrings(password, 3))
    if (ALPHABET.includes(str)) {
      hasStraightOfChars = true;
      break;
    }
  if (!hasStraightOfChars)
    return false;

  let doubles = 0;
  let skipFlag = false;
  for (const str of subStrings(password, 2)) {
    if (skipFlag) {
      skipFlag = false;
      continue;
    }
    if (str[0] === str[1]) {
      doubles++;
      skipFlag = true;
    }
    if (doubles > 1)
      return true;
  }
  return doubles > 1;
}

function nextChar (char) {
  return char === 'z'
    ? 'a'
    : ALPHABET[ALPHABET.indexOf(char) + 1];
}

function incrementPassword (password) {
  const chars = password.split('');
  for (let i = chars.length - 1; i > -1; i--) {
    chars[i] = nextChar(chars[i]);
    if (chars[i] !== 'a')
      break;
  }
  return chars.join('');
}

function nextPassword (password) {
  do {
    password = incrementPassword(password);
  } while (!isValid(password))
  return password;
}
// assert(isValid('abcdffaa'));
// assert(isValid('ghjaabcc'));
// equal(nextPassword('abcdefgh'), 'abcdffaa');
// equal(nextPassword('ghijklmn'), 'ghjaabcc');
let password = nextPassword(input);
console.log({ password });

// Second Star:
password = nextPassword(password);
console.log({ password });

