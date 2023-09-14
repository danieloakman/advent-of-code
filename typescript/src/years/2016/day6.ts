import { readFileSync } from 'fs';
import once from 'lodash/once';
import iter from 'iteragain-es/iter';
import range from 'iteragain-es/range';
import enumerate from 'iteragain-es/enumerate';
import { /* ok as assert, */ deepStrictEqual as equal } from 'assert';
import { IncrementorMap } from '../../lib/IncrementorMap';
// import * as utils from '../../lib/utils';

/** @see https://adventofcode.com/2016/day/6/input */
const input = once(() => readFileSync(__filename.replace(/.[tj]s/, '-input'), 'utf-8').split(/[\n\r]+/));

// https://adventofcode.com/2016/day/6 First Star:
enum Mode {
  LeastLikely,
  MostLikely,
}

function decrypt(strings: string[], mode: Mode = Mode.MostLikely) {
  const maps = iter(range(strings[0].length))
    .map(() => new IncrementorMap())
    .toArray();
  for (const string of strings) for (const [index, char] of enumerate(string)) maps[index].inc(char);
  return maps.map(map => map.minmax()[mode]).join('');
}
equal(
  decrypt([
    'eedadn',
    'drvtee',
    'eandsr',
    'raavrd',
    'atevrs',
    'tsrnev',
    'sdttsa',
    'rasrtv',
    'nssdts',
    'ntnada',
    'svetve',
    'tesnvt',
    'vntsnd',
    'vrdear',
    'dvrsen',
    'enarar',
  ]),
  'easter',
);
console.log({ message: decrypt(input()) });

// https://adventofcode.com/2016/day/6#part2 Second Star:
console.log({ message: decrypt(input(), Mode.LeastLikely) });
