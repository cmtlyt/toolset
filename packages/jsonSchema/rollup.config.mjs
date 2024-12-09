import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const plugins = [
  // resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
  }),
  terser(),
];

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      { name: 'ClJsonSchema', format: 'umd', esModule: true, file: 'dist/index.umd.js' },
      { format: 'esm', file: 'dist/index.esm.js', esModule: true },
      { format: 'cjs', file: 'dist/index.cjs.js' },
    ],
    plugins,
  },
]);
