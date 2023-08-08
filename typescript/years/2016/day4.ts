// https://adventofcode.com/2016/day/4
// https://adventofcode.com/2016/day/4/input

import { readFileSync } from 'fs';
import { ok as assert, deepStrictEqual as equal } from 'assert';
import iter, { iter as iterate } from 'iteragain/iter';
import once from 'lodash/once';

const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/));

type Room = { name: string; sector: number; checksum?: string };

function parseRoom(str: string) {
  const name = str.match(/^[a-z-]+/)[0];
  const sector = parseInt(str.match(/\d+/)[0]);
  const checksum = str.match(/\[([a-z]+)\]/)?.[1];
  return { name, sector, checksum };
}

function isRealRoom(room: Room): boolean {
  const map = iter(room.name)
    .filter(char => char !== '-')
    .reduce((map, char) => ((map[char] = (map[char] || 0) + 1), map), {} as Record<string, any>);
  const chars = Object.keys(map).sort((a, b) => map[b] - map[a] || a.localeCompare(b));
  return room.checksum === chars.slice(0, 5).join('');
}

assert(isRealRoom(parseRoom('aaaaa-bbb-z-y-x-123[abxyz]')));
assert(isRealRoom(parseRoom('a-b-c-d-e-f-g-h-987[abcde]')));
assert(isRealRoom(parseRoom('not-a-real-room-404[oarel]')));
assert(!isRealRoom(parseRoom('totally-real-room-200[decoy]')));

// First Star:
const rooms = iterate(input()).map(parseRoom).toArray();
console.log({
  sum: iter(rooms)
    .filter(isRealRoom)
    .reduce((sum, room) => sum + room.sector, 0),
});

// Second Star:
function decrypt(room: Room): string {
  return iter(room.name)
    .filter(char => !/\d/.test(char))
    .map(char => (char === '-' ? ' ' : String.fromCharCode(((char.charCodeAt(0) - 97 + room.sector) % 26) + 97)))
    .join('')
    .trim();
}
equal(decrypt(parseRoom('qzmt-zixmtkozy-ivhz-343')), 'very encrypted name');
console.log({ sector: iter(rooms).find(room => /north|pole/.test(decrypt(room)))?.sector });
