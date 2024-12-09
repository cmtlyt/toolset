import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
// import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    { name: 'ClStorage', format: 'umd', esModule: true, file: 'dist/index.umd.js' },
    { format: 'esm', esModule: true, file: 'dist/index.esm.js' },
    // { format: 'cjs', file: 'dist/index.cjs.js' },
  ],
  plugins: [
    // resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser(),
  ],
});
