import { main, sh, parseArgs, iife } from '@lib';
import { globIterate } from 'glob';

const includesTest = /describe\(|\Wit\(/;

main(import.meta.path, async () => {
  const args: { path: string; watch: boolean } = parseArgs(
    { description: 'Run tests, either "in source" or `.test` files.' },
    ['path', { help: 'Either a path or glob', nargs: '*', default: '.' }],
    ['--watch', '-w', { action: 'store_true', default: false }],
  );
  // console.log(args);

  // TODO: Implement watch mode.
  if (args.watch) throw new Error('Watch mode not implemented.');

  const jobs: Promise<void>[] = [];
  for await (const path of globIterate(args.path)) {
    if (!path.endsWith('.ts')) continue;

    jobs.push(iife(async () => {
      const file = Bun.file(path);
      const text = await file.text();
      if (!includesTest.test(text)) return;
      await Bun.write(path.replace(/\.ts$/, '-IGNORE.test.ts'), text);
    }));
  }
  await Promise.all(jobs);

  await sh('bun test');
});
