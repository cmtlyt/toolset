import { resolve } from 'node:path';
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@com': resolve(__dirname, 'src/common'),
    },
  },
});
