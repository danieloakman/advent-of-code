import { terminal } from 'terminal-kit';
import { walkdirSync } from 'more-node-fs';
import { join, relative } from 'path';
import iter from 'iteragain-es/iter';
import { ArgumentParser } from 'argparse';
import { main, safeCall, sh, Nullish, Solution } from '../src/lib';

export const files = iter(walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  .filterMap(file => (file.stats.isFile() && /day\d+\.[tj]s/.test(file.path) ? file : null))
  .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
  .map(({ path }) => path.replace(process.cwd() + '\\', ''))
  .toArray();

export const relativeFiles = files.map(file => relative(process.cwd(), file));

export function testPath(year: number | string, day: number | string) {
  return join(__dirname, '../src/years', year.toString(), `day${day.toString()}.ts`);
}

export async function test(year: number | string, day: number | string) {
  const path = testPath(year, day);

  const imported: Record<string, unknown> = safeCall(() => require(path.replace(/\..+$/, ''))) || {};
  if (imported.solution instanceof Solution) {
    await imported.solution.solve();
  } else {
    const result = await sh(`bun run ${path}`);
    if (result instanceof Error) console.error(result);
  }
}

async function selectedText(err?: Error, res?: { selectedText: string }) {
  if (err) {
    terminal.clear(err);
    process.exit(1);
  }
  try {
    const [year, day] = res?.selectedText.match(/\d+/g)?.map(parseFloat) as number[];
    // terminal(`Testing day ${day} of year ${year}`);
    terminal.clear()(await test(year, day));
  } catch (err) {
    if (err instanceof Error) terminal.clear()(err.stack);
  }
  terminal.gridMenu(relativeFiles, selectedText);
}

main(import.meta.path, async () => {
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
  parser.add_argument('-i', '--interactive', {
    action: 'store_true',
    default: false,
    dest: 'interactive',
  });
  const args: { year: Nullish<number>; day: Nullish<number>; interactive: boolean } = parser.parse_args();

  if (args.year && args.day) {
    const file = safeCall(() => require(join(__dirname, '../src/years', args.year?.toString() ?? '', `day${args.day}`))) || {};
    if (file.solution instanceof Solution) await file.solution.solve();
    else await test(args.year, args.day);
    return;
  }

  if (args.interactive) {
    terminal.on('key', function (key: string, _matches: unknown, _data: unknown) {
      if (key === 'CTRL_C' || key === 'ESCAPE' || key === 'q') {
        terminal.clear('Exited test mode.');
        process.exit();
      }
    });
    terminal.grabInput({});

    terminal.gridMenu(relativeFiles, selectedText);
  } else {
    for (const file of files) {
      const [year, day] = file.match(/\d+/g) as string[];
      await test(year, day);
    }
  }
});
