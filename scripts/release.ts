import { globSync } from 'glob';
import { packageDir } from './utils';
import { readPackageJSON } from 'pkg-types';
import { argv } from 'node:process';
import { basename, join, resolve } from 'node:path';
import { execa, ExecaError } from 'execa';
import { rimraf } from 'rimraf';
import { parseArgs } from 'node:util';
import pc from 'picocolors';
import { cmp } from 'semver';

const {
  values: { tag, 'skip-build': skipBuild, registry },
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
    'skip-build': {
      type: 'boolean'
    }
  },
  allowPositionals: true
});

const releaseTags = ['alpha', 'beta', 'rc'];

const publish = async (id: string) => {
  const pkg = await readPackageJSON(id).catch(() => void 0);
  if (!pkg) return Promise.reject(`${basename(id)}: package.json not found`);

  if (!pkg.version || !pkg.name)
    return Promise.reject(`${basename(id)}: name or version not found`);

  console.log(pc.green(`${pkg.name}@${pkg.version}: start publishing...`));

  let releaseTag = tag;
  if (!releaseTag)
    releaseTag = releaseTags.find(
      tagName => pkg.version!.match(tagName) && tagName
    );

  try {
    const { stdout: remoteVersion } = await execa('pnpm', [
      'view',
      `${pkg.name}${releaseTag ? `@${releaseTag}` : ''}`,
      'version'
    ]).catch(() => ({ stdout: void 0 }));
    if (remoteVersion && cmp(pkg.version, '<=', remoteVersion))
      return Promise.resolve(
        `${pkg.name}@${pkg.version}: package version <= remote version, skip publish`
      );

    await execa(
      'pnpm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public',
        ...(registry ? ['--registry', registry] : []),
        ...(process.env.CI ? ['--provenance', '--no-git-checks'] : [])
      ],
      {
        cwd: id
      }
    );
  } catch (error) {
    return Promise.reject(
      `${pkg.name}@${pkg.version}: ${(error as ExecaError).message}`
    );
  }
  console.log(pc.green(`${pkg.name}@${pkg.version}: published successfully`));
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

await Promise.all(
  targets.map(target =>
    publish(target).finally(() => rimraf(join(target, 'dist')))
  )
);
