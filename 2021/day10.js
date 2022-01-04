'use strict';

const { readFileSync } = require('fs');

const syntaxErrMap = {
  ')': 3, ']': 57, '}': 1197, '>': 25137
};
const syntaxMap = {
  ')': '(', ']': '[', '}': '{', '>': '<'
};
const closingSyntax = Object.keys(syntaxMap);
function last (arr) {
  return arr[arr.length - 1];
}
const totalSyntaxErrors = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(line => {
    const stack = [];
    for (const char of line) {
      if (closingSyntax.includes(char)) {
        if (last(stack) === syntaxMap[char])
          stack.pop();
        else
          return syntaxErrMap[char];
      } else
        stack.push(char);
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);
