import path from 'node:path';
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    includeSource: ['src/fp/utils/**/*.{js,ts}'],
  },
  resolve: {
    alias: {
      $: path.resolve(import.meta.dirname, './src'),
    },
  },
});
