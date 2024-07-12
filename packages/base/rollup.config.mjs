import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    { name: 'ClBase', format: 'umd', esModule: true, file: 'dist/index.umd.js' },
    { format: 'esm', esModule: true, file: 'dist/index.esm.js' },
  ],
  plugins: [
    alias({
      entries: [
        { find: '@/*', replacement: 'src/*' },
        { find: '@com/*', replacement: 'src/common/*' },
      ],
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ],
});
