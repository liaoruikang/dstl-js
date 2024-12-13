import { argv, exit } from 'node:process';
import { parseArgs } from 'node:util';
import { execa } from 'execa';
import { rimraf } from 'rimraf';
import { join, resolve } from 'node:path';
import { packageDir } from './utils';

const {
  values: { out, dev },
  positionals
} = parseArgs({
  args: argv.slice(2),
  options: {
    out: {
      type: 'string',
      short: 'o',
      default: 'dist'
    },
    dev: {
      type: 'boolean',
      default: false
    }
  },
  allowPositionals: true
});

if (!positionals.length) positionals.push('dstl-js');

try {
  await Promise.all(
    positionals.map(async target => {
      target = resolve(packageDir, target);
      await rimraf(join(target, out));
      await execa(
        'pnpm',
        [
          'rollup',
          '-c',
          '--environment',
          `TARGET:${target},OUT:${out},DEV:${dev}`,
          '--configPlugin',
          'typescript={tsconfig: `tsconfig.node.json`}',
          ...(dev ? ['-w'] : [])
        ],
        { stdio: 'inherit' }
      );
    })
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  exit(1);
}
