import { globSync } from 'glob';
import { packageDir } from './utils';
import { readPackageJSON } from 'pkg-types';
import { argv } from 'node:process';
import { basename, join, resolve } from 'node:path';
import { execa } from 'execa';
import { rimraf } from 'rimraf';
import { parseArgs } from 'node:util';
import pc from 'picocolors';

const {
  values: { tag, 'skip-build': skipBuild, registry, provenance },
  positionals
} = parseArgs({
  args: argv.slice(2),
  options: {
    tag: {
      type: 'string'
    },
    registry: {
      type: 'string'
    },
    provenance: {
      type: 'boolean'
    },
    'skip-build': {
      type: 'boolean'
    }
  },
  allowPositionals: true
});

const releaseTags = ['alpha', 'beta', 'rc'];

const publish = async (id: string) => {
  const pkg = await readPackageJSON(id);
  if (!pkg.version || !pkg.name)
    return Promise.reject(`Package name or version not found\n`);

  console.log(pc.green(`Start publishing package ${pkg.name}@${pkg.version}`));

  let releaseTag = tag;
  if (!releaseTag)
    releaseTag = releaseTags.find(
      tagName => pkg.version!.match(tagName) && tagName
    );

  try {
    await execa(
      'pnpm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
        ...(registry ? ['--registry', registry] : []),
        ...(provenance ? ['--provenance'] : [])
      ],
      {
        cwd: id
      }
    );
  } catch (error) {
    return Promise.reject(error);
  }
  console.log(
    pc.green(`Package ${pkg.name}@${pkg.version} is published successfully`)
  );
};

const targets =
  positionals.length !== 0
    ? positionals.map(target => resolve(packageDir, target))
    : globSync(`${packageDir}/*`, {
        absolute: true
      });

if (!skipBuild)
  try {
    await execa('pnpm', [
      'build',
      '--out',
      'dist',
      ...targets.map(target => basename(target))
    ]);
  } catch (error) {
    await Promise.all(targets.map(target => rimraf(join(target, 'dist'))));
    throw error;
  }

console.log('\n');
for (const target of targets)
  await publish(target)
    .catch(err => console.error(err))
    .finally(() => rimraf(join(target, 'dist')));
