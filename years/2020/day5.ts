const { readFileSync } = require('fs');
const { join } = require('path');
const seats = readFileSync(join(__dirname, 'day5-input'), { encoding: 'utf-8' })
  .split(/\s+/)
  .filter(v => v);

// Gold Star:
function processSeat(seat) {
  let rowU = 127;
  let rowL = 0;
  for (let i = 0; i < 7; i++) {
    if (seat[i] === 'F') rowU -= Math.floor((rowU - rowL) / 2) + 1;
    else rowL += Math.floor((rowU - rowL) / 2) + 1;
  }
  let columnU = 7;
  let columnL = 0;
  for (let i = 7; i < 10; i++) {
    if (seat[i] === 'L') columnU -= Math.floor((columnU - columnL) / 2) + 1;
    else columnL += Math.floor((columnU - columnL) / 2) + 1;
  }
  return { row: rowU, column: columnU, id: rowU * 8 + columnU };
}

let highestSeatId = 0;
for (const seat of seats) {
  const s = processSeat(seat);
  if (s.id > highestSeatId) highestSeatId = s.id;
}
console.log({ highestSeatId });

// Silver Star:
const seatIDs = {};
for (let i = 89; i < highestSeatId + 1; i++) {
  seatIDs[i] = 1;
}
for (const seat of seats) {
  const s = processSeat(seat);
  delete seatIDs[s.id];
}
console.log('My seat ID:', Object.keys(seatIDs));
