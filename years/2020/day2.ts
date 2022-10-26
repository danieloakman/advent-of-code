const { readFileSync } = require('fs');
const { join } = require('path');
const passwordPolicies = readFileSync(join(__dirname, 'day2-input'), { encoding: 'utf-8' })
  .split('\n')
  .filter(v => v)
  .map(v => {
    v = v.replace('\r', '').split(':');
    const { 0: min, 1: max, 2: char } = v[0].split(/[ -]/);
    return {
      policy: { char, min, max },
      password: v[1].trim(),
    };
  });

// Gold Star:
let validPasswords = 0;
mainLoop: for (const { policy, password } of passwordPolicies) {
  let matchedChars = 0;
  for (const char of password) {
    if (char === policy.char) matchedChars++;
    if (matchedChars > policy.max) continue mainLoop;
  }
  if (matchedChars >= policy.min) validPasswords++;
}
console.log({ validPasswords });

// Silver Star:
validPasswords = 0;
for (const { policy, password } of passwordPolicies) {
  const firstPos = password.charAt(policy.min - 1) === policy.char;
  const secondPos = password.charAt(policy.max - 1) === policy.char;
  if ((firstPos && !secondPos) || (!firstPos && secondPos)) validPasswords++;
}
console.log({ validPasswords });
