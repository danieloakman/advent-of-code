import { terminal } from 'terminal-kit';
import { walkdirSync } from 'more-node-fs';
import { join, relative } from 'path';
import iter from 'iteragain/iter';
import { ArgumentParser } from 'argparse';
import { main, sh } from '../src/lib/utils';
import { Nullish } from '../src/lib/types';
import Solution from '../src/lib/Solution';

export const files = iter(walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  .filterMap(file => (file.stats.isFile() && /day\d+\.[tj]s/.test(file.path) ? file : null))
  .toArray()
  .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
  .map(({ path }) => path.replace(process.cwd() + '\\', ''));

const relativeFiles = files.map(file => relative(process.cwd(), file));

export async function test(year: number | string, day: number | string, { log = false }: { log?: boolean } = {}) {
  const result = await sh(`pnpm tsn ${join(__dirname, '../src/years', year.toString(), `day${day.toString()}.ts`)}`, {
    log,
  });
  if (result instanceof Error) terminal.error(log);
  return result;
}

async function selectedText(err?: Error, res?: { selectedText: string }) {
  if (err) {
    terminal.clear(err);
    process.exit(1);
  }
  try {
    const [year, day] = res.selectedText.match(/\d+/g).map(parseFloat) as number[];
    // terminal(`Testing day ${day} of year ${year}`);
    terminal.clear()(await test(year, day));
  } catch (err) {
    terminal.clear()(err.stack);
  }
  terminal.gridMenu(relativeFiles, selectedText);
}

main(module, async () => {
  const parser = new ArgumentParser({
    description: 'Solve Advent of Code Typescript solutions',
  });
  parser.add_argument('year', {
    type: 'int',
    nargs: '?',
    default: null,
  });
  parser.add_argument('day', {
    type: 'int',
    nargs: '?',
    default: null,
  });
  const args: { year: Nullish<number>; day: Nullish<number> } = parser.parse_args();

  if (args.year && args.day) {
    const file = require(join(__dirname, '../src/years', args.year.toString(), `day${args.day}`)) || { };
    if (file.solution instanceof Solution) await file.solution.solve();
    else await test(args.year, args.day, { log: true });
    return;
  }

  terminal.grabInput({});
  terminal.on('key', function (key: string, _matches: unknown, _data: unknown) {
    if (key === 'CTRL_C' || key === 'ESCAPE' || key === 'q') {
      terminal.clear('Exited test mode.');
      process.exit();
    }
  });

  terminal.gridMenu(relativeFiles, selectedText);
});
