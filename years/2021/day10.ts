const { readFileSync } = require('fs');

const input = readFileSync(__filename.replace('.js', '-input'), 'utf-8').split(/[\n\r]+/);

// First star:
const syntaxErrMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const closingSyntaxMap = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};
function last(arr) {
  return arr[arr.length - 1];
}
const totalSyntaxErrors = input
  .map(line => {
    const stack = [];
    for (const char of line) {
      if (closingSyntaxMap[char] !== undefined) {
        if (last(stack) === closingSyntaxMap[char]) stack.pop();
        else return syntaxErrMap[char];
      } else stack.push(char);
    }
    return 0;
  })
  .reduce((a, b) => a + b, 0);
console.log({ totalSyntaxErrors });

// Second star:
const getScore = (() => {
  const syntaxPointsMap = {
    '(': 1,
    '[': 2,
    '{': 3,
    '<': 4,
  };
  return arrOrStr => {
    let score = 0;
    for (const char of arrOrStr.reverse()) {
      if (syntaxPointsMap[char] !== undefined) {
        score *= 5;
        score += syntaxPointsMap[char];
      }
    }
    return score;
  };
})();
const scores = input
  .map(line => {
    const stack = [];
    for (const char of line) {
      if (closingSyntaxMap[char] !== undefined) {
        if (last(stack) === closingSyntaxMap[char]) stack.pop();
        else return false;
      } else stack.push(char);
    }
    return stack;
  })
  .filter(v => v)
  .map(getScore)
  .sort((a, b) => b - a);
console.log({ middleScore: scores[Math.floor(scores.length / 2)] });
