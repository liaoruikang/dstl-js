import {
  defineConfig,
  type Plugin,
  type OutputOptions,
  type RollupOptions,
  ExternalOption
} from 'rollup';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readPackageJSON } from 'pkg-types';
import { resolve } from 'node:path';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const TARGET = process.env.TARGET;
const OUT = process.env.OUT;
const dev = process.env.DEV === 'true';

const pkg = await readPackageJSON(resolve(TARGET));

const input = resolve(TARGET, 'src', 'index.ts');
const outDir = resolve(TARGET, OUT);

const outputs: Record<BuildFormat, OutputOptions> = {
  cjs: {
    file: `${outDir}/index.cjs`,
    format: 'commonjs',
    exports: 'named',
    sourcemap: dev
  },
  esm: {
    file: `${outDir}/index.mjs`,
    format: 'esm',
    sourcemap: dev
  },
  iife: {
    file: `${outDir}/index.js`,
    format: 'iife',
    exports: 'named',
    name: pkg.buildOptions?.name ?? 'Dstl',
    sourcemap: dev
  }
};

const createConfig = (
  output: BuildFormat | OutputOptions | BuildFormat[] | OutputOptions[],
  plugins: Plugin[] = [],
  callback?: (output: OutputOptions) => OutputOptions
): RollupOptions => {
  if (Array.isArray(output))
    output = output.map(o => (typeof o === 'string' ? outputs[o] : o));
  else if (typeof output === 'string') output = [outputs[output]];
  else output = [output];

  let external: ExternalOption = [];
  if (output.some(o => o.format === 'iife'))
    output.length > 1 &&
      plugins.push({
        name: 'iife-warn',
        buildStart() {
          this.warn(
            `The current output format is 'life' and the option 'external' will be ignored`
          );
        }
      });
  else if (!dev)
    external = Object.keys(pkg.dependencies ?? {}).filter(
      dep => !pkg.buildOptions?.internal?.includes(dep)
    );

  output = output.map(o => {
    callback && (o = callback(o));
    return {
      ...o,
      banner: `/**
* ${pkg.name} v${pkg.version}
* @license MIT
*/`
    };
  });

  return {
    input,
    external,
    output,
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.app.json'
      }),
      ...plugins
    ]
  };
};

const options = [createConfig('iife'), createConfig(['cjs', 'esm'])];
if (!dev)
  options.push(
    createConfig(
      {
        file: `${outDir}/index.d.ts`
      },
      [
        dts({
          tsconfig: './tsconfig.app.json',
          respectExternal: true
        })
      ]
    ),
    createConfig(['iife'], [terser()], o => ({
      ...o,
      file: o.file?.replace('.js', '.min.js')
    })),
    createConfig(['cjs', 'esm'], [terser()], o => ({
      ...o,
      file: o.file?.replace(/\.(cjs|mjs)$/, '.min.$1')
    }))
  );

export default defineConfig(options);
