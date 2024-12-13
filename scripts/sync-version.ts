import { readPackageJSON, writePackageJSON } from 'pkg-types';
import { globSync } from 'glob';
import { packageDir } from './utils';
import { cmp } from 'semver';
import { join } from 'node:path';
import pc from 'picocolors';
import { exit } from 'node:process';

const mainPkg = await readPackageJSON();
if (mainPkg.version) {
  const version = mainPkg.version;
  for (const path of globSync(`${packageDir}/*`, {
    absolute: true
  })) {
    const pkg = await readPackageJSON(path);
    if (!pkg.version || !cmp(pkg.version, '!==', version)) continue;
    const oldVersion = pkg.version;
    pkg.version = version;
    await writePackageJSON(join(path, 'package.json'), pkg);
    console.log(
      pc.green(`${pkg.name} ${pc.gray(oldVersion)} -> ${pc.white(version)}`)
    );
  }
} else {
  console.log(pc.red('main package version not found\n'));
  exit(1);
}
