import once from 'lodash/once';
import { add, main } from '../../lib/utils';
import iter from 'iteragain/iter';
import { downloadInputSync } from '../../lib/downloadInput';
import NestedMap, { NestedMapValue } from '../../lib/NestedMap';
import ObjectIterator from 'iteragain/internal/ObjectIterator';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';

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

class FileSystem extends NestedMap<File> {
  constructor(lines: string[]) {
    super();
    let path: string[] = [];
    while(lines.length) {
      const line = lines.pop();
      if (line.startsWith('$')) {
        // Command:
        const [cmd, arg] = line.replace(/^\$ +/, '').split(' ');
        if (cmd === 'cd') {
          if (arg === '/')
            path = [];
          else if (arg === '..')
            path.pop();
          else if (typeof arg === 'string')
            path.push(arg);
          else
            throw new Error(`Invalid argument for cd: ${arg}`);
        }
      } else {
        const parts = line.split(' ');
        if (parts[0] !== 'dir') {
          // File:
          const [size, name] = parts;
          this.set(path, { size: parseInt(size), name });
        }
      }
    }
  }

  isFile(value: NestedMapValue<File>): value is File {
    return typeof value.name === 'string' && typeof value.size === 'number';
  }

  // dirSize(path: string[]) {
  //   return iter(this.get(...path))
  //     .filterMap(([path, value]) => this.isFile(value) ? value.size : null)
  //     .reduce(add);
  // }

  // dirs() {
  //   return iter(this.entries())
  //     .filterMap(([path, value]) => this.isFile(value) ? null : path);
  // }

  dirSizes(): Record<string, number> {
    const dirs: Record<string, number> = {};
    for (const [path, value] of this.entries()) {
      if (!this.isFile(value)) continue;
      const dir = path.slice(0, -1).join('/');
    }
    return dirs;
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
