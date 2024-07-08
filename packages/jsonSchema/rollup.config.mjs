import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const plugins = [
  json(),
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  terser(),
];

export default defineConfig([
  {
    input: 'src/index.esm.ts',
    output: [{ format: 'esm', dir: 'dist', esModule: true }],
    plugins,
  },
  {
    input: 'src/index.umd.ts',
    output: [{ name: 'ClJsonSchema', format: 'umd', esModule: true, file: 'dist/index.umd.js' }],
    plugins,
  },
]);
