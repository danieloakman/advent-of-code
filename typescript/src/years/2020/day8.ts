import { readFileSync } from 'fs';
import { join } from 'path';

function getInstructions() {
  return readFileSync(join(__dirname, 'day8-input'), { encoding: 'utf-8' })
    .split(/[\n\r]+/)
    .filter(v => v)
    .map(v => {
      const { 0: op, 1: arg } = v.split(' ');
      return { op, arg: parseInt(arg), exe: 0 };
    });
}

// Gold Star:
let instructions = getInstructions();
let accumulator = 0;
for (let i = 0; true; i) {
  if (instructions[i].exe > 0) break;
  instructions[i].exe++;
  if (instructions[i].op === 'acc') {
    accumulator += instructions[i].arg;
    i++;
  } else if (instructions[i].op === 'jmp') i += instructions[i].arg;
  else if (instructions[i].op === 'nop') i++;
}
console.log({ accumulator });

// Silver Star:
for (let i2 = 0; i2 < instructions.length; i2++) {
  accumulator = 0;
  instructions = getInstructions();

  if (instructions[i2].op === 'nop') instructions[i2].op === 'jmp';
  else if (instructions[i2].op === 'jmp') instructions[i2].op = 'nop';
  else continue;

  let i = 0;
  for (i; i < instructions.length; i) {
    // console.log({ i, ins: JSON.stringify(instructions[i]) });
    if (instructions[i].exe > 0) break;
    instructions[i].exe++;
    if (instructions[i].op === 'acc') {
      accumulator += instructions[i].arg;
      i++;
    } else if (instructions[i].op === 'jmp') i += instructions[i].arg;
    else if (instructions[i].op === 'nop') i++;
  }
  // Successfully got to the end of the instructions
  if (i >= instructions.length) {
    console.log('success: ', { accumulator, i2 });
    break;
  }
}
