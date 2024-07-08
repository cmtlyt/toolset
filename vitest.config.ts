import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      exclude: ['packages/document/**', '*.workspace.{js,ts}', '*.config.{js,ts}', '.*.{ts,js}', 'scripts/*'],
      reporter: ['html'],
    },
  },
});
