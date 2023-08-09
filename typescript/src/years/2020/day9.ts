import { readFileSync } from 'fs';
import { join } from 'path';

const xmas = readFileSync(join(__dirname, 'day9-input'), { encoding: 'utf-8' })
  .split(/[\n\r]+/)
  .filter(v => v)
  .map(v => parseFloat(v));

// function* gen (xmas, preamble = 25) {
//   const map = {};
//   // Init map:
//   for (let i = 0; i < preamble; i++) {
//     for (let j = 0; j < preamble; j++) {
//       if (i === j || xmas[i] === xmas[j])
//         continue;
//       map[xmas[i] + xmas[j]] = {
//         i, j,
//         nums: [xmas[i], xmas[j]]
//       };
//     }
//   }

//   for (let i = preamble; i < xmas.length; i++) {
//     if (!map[xmas[i]] || map[xmas[i]].i < i - 25 || map[xmas[i]].j < i - 25)
//       yield { i, num: xmas[i], map: null };
//     else
//       yield { i, num: xmas[i], map: map[xmas[i]] };

//     // Update map:
//     // for (const key in map) {
//     //   if (map[key].i === i - 25 || map[key].j === i - 25)
//     //     delete map[key];
//     // }
//     for (let j = i - 25; j < i; j++) {
//       if (i === j || xmas[i] === xmas[j])
//         continue;
//       map[xmas[i] + xmas[j]] = {
//         i, j,
//         nums: [xmas[i], xmas[j]]
//       };
//     }
//   }
// }

// Gold Star:
// for (const v of gen(xmas)) {
//   if (!v.map) {
//     console.log(v);
//     break;
//   }
// }
let invalid;
loop1: for (let i = 25; i < xmas.length; i++) {
  const prev25 = xmas.slice(i - 25, i);
  for (let j = 0; j < prev25.length; j++) {
    for (let k = 1; k < prev25.length; k++) {
      if (j === k || prev25[j] === prev25[k]) continue;
      if (prev25[j] + prev25[k] === xmas[i]) continue loop1;
    }
  }
  console.log((invalid = { i, num: xmas[i] }));
  break;
}

// Silver Star:
loop1: for (let i = 0; i < invalid.i; i++) {
  let nums = [xmas[i]];
  let sum = xmas[i];
  for (let j = i + 1; j < invalid.i; j++) {
    nums.push(xmas[j]);
    sum += xmas[j];
    if (sum === invalid.num) {
      console.log(Math.min(...nums) + Math.max(...nums));
      break loop1;
    }
    if (sum > invalid.num) {
      nums = [];
      sum = 0;
    }
  }
}
