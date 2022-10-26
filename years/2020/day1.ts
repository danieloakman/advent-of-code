const { readFileSync } = require('fs');
const { join } = require('path');
const nums = readFileSync(join(__dirname, 'day1-input'), { encoding: 'utf-8' })
  .split('\n')
  .map(n => parseFloat(n.replace('\r', '')));

// Gold Star:
loop: for (const num1 of nums) {
  for (const num2 of nums) {
    if (num1 + num2 === 2020) {
      console.log('answer1:', num1 * num2);
      break loop;
    }
  }
}

// Silver Star:
loop: for (const num1 of nums) {
  for (const num2 of nums) {
    if (num1 + num2 >= 2020) continue;
    for (const num3 of nums) {
      if (num1 + num2 + num3 === 2020) {
        console.log('answer2:', num1 * num2 * num3);
        break loop;
      }
    }
  }
}
