import once from 'lodash/once';
import { main } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
// import { ok as assert, deepStrictEqual as equal } from 'assert';

/** @see https://adventofcode.com/2022/day/7/input */
export const input = once(() => downloadInputSync('2022', '7').split(/[\n\r]+/));
const testInput = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`.trim().split(/[\n\r]+/);

interface Command {
  type: 'cd' | 'ls' | 'dir';
  arg: string;
}

interface File {
  size: number;
  name: string;
}

class FileSystem {
  constructor(lines: string[]) {

  }

  private parseLine(line: string):  {
    if ()
  }
}

/** @see https://adventofcode.com/2022/day/7 First Star */
export async function firstStar() {
  //
}

/** @see https://adventofcode.com/2022/day/7#part2 Second Star */
export async function secondStar() {
  //
}

main(module, async () => {
  console.log('First star:', await firstStar());
  console.log('Second star:', await secondStar());
});
