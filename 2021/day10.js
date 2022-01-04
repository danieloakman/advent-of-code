'use strict';

const { readFileSync } = require('fs');

// First star:
const syntaxErrMap = {
  ')': 3, ']': 57, '}': 1197, '>': 25137
};
const closingSyntaxMap = {
  ')': '(', ']': '[', '}': '{', '>': '<'
};
function last (arr) {
  return arr[arr.length - 1];
}
const totalSyntaxErrors = readFileSync(__filename.replace('.js', '-input'), 'utf-8')
  .split(/[\n\r]+/)
  .map(line => {
    const stack = [];
    for (const char of line) {
      if (closingSyntaxMap[char] !== undefined) {
        if (last(stack) === closingSyntaxMap[char])
          stack.pop();
        else
          return syntaxErrMap[char];
      } else
        stack.push(char);
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);
console.log(totalSyntaxErrors);
