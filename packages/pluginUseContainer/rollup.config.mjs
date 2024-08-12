import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default defineConfig([
  {
    input: 'src/container/index.ts',
    output: [{ format: 'umd', file: 'dist/container/index.umd.js' }],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        tsconfigOverride: { compilerOptions: { declaration: false } },
      }),
      terser(),
      copy({
        targets: [{ src: 'src/container/index.html', dest: 'dist/container' }],
        force: true,
      }),
    ],
  },
]);
