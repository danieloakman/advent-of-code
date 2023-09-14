import { main, sh, parseArgs } from '@lib';
import { globIterate } from 'glob';

main(import.meta.path, async () => {
  const args: { path: string, watch: boolean } = parseArgs({ description: 'Run tests, either "in source" or `.test` files.' }, ['path', { help: 'Either a path or glob' }], [
    '--watch',
    '-w',
    { action: 'store_true', default: false },
  ]);

  for await (const p of globIterate(args.path)) {
    console.log(p);
  }
});
