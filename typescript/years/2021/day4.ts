import { readFileSync } from 'fs';
const input = readFileSync(__filename.replace('.ts', '-input'), 'utf-8').split(/[\n\r]+/);

// Silver star:
const randNumbers = input.shift().split(',').map(parseFloat);
const boards = [];
while (input.length) {
  const boardNumbers = input.splice(0, 5);
  boards.push(
    boardNumbers.map(row =>
      row
        .trim()
        .split(/ +/)
        .map(num => ({ n: parseFloat(num), m: false })),
    ),
  );
}
function checkBoard(board) {
  const yCheck = new Array(board.length).fill(true);
  const xCheck = new Array(board[0].length).fill(true);
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (!board[y][x].m) {
        yCheck[y] = false;
        xCheck[x] = false;
      }
    }
  }
  if (yCheck.some(v => v) || xCheck.some(v => v))
    return board.reduce((p, row) => p + row.reduce((p, c) => p + (!c.m ? c.n : 0), 0), 0);
  return 0;
}
function markBoard(board, num) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x].n === num) {
        board[y][x].m = true;
        return;
      }
    }
  }
}
let firstBoardWinner;
let lastBoardWinner;
for (const [i, randNumber] of randNumbers.entries()) {
  for (const board of boards) {
    if (board.score) continue;
    markBoard(board, randNumber);
    if (i < 5) continue;
    const score = checkBoard(board) * randNumber;
    if (!score) continue;
    if (!firstBoardWinner) firstBoardWinner = board;
    lastBoardWinner = board;
    board.score = score;
  }
}
console.log({ firstBoardWinnerScore: firstBoardWinner.score });

// Gold star:
console.log({ lastBoardWinnerScore: lastBoardWinner.score });
