import { terminal } from 'terminal-kit';
import { walkdirSync } from 'more-node-fs';
import { join, relative } from 'path';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';
const exec = promisify(_exec);
import iter from 'iteragain/iter';
import { ArgumentParser } from 'argparse';
import { main } from '../src/lib/utils';
import { Nullish } from '../src/lib/types';

export const files = iter(walkdirSync(join(__dirname, '../'), { ignore: /node_modules/i }))
  .filterMap(file => (file.stats.isFile() && /day\d+\.[tj]s/.test(file.path) ? file : null))
  .toArray()
  .sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs)
  .map(({ path }) => path.replace(process.cwd() + '\\', ''));

const relativeFiles = files.map(file => relative(process.cwd(), file));

export async function test(year: number | string, day: number | string, { log = false }: { log?: boolean } = {}) {
  try {
    const result = await exec(
      `npx ts-node --transpileOnly ${join(__dirname, '../years', year.toString(), `day${day.toString()}.ts`)}`,
    );
    if (log && result.stderr) terminal.error(result.stderr);
    if (log && result.stdout) terminal(result.stdout);
    return result.stdout;
  } catch (e) {
    const message = e.message ?? e;
    if (log && message) terminal.error(message);
    return message;
  }
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
    description: 'Test Advent of Code Typescript solutions',
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
    await test(args.year, args.day, { log: true });
    return;
  }

  terminal.grabInput({});
  terminal.on('key', function (key, _matches, _data) {
    if (key === 'CTRL_C' || key === 'ESCAPE' || key === 'q') {
      terminal.clear('Exited test mode.');
      process.exit();
    }
  });

  terminal.gridMenu(relativeFiles, selectedText);
});
