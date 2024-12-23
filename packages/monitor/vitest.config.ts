import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    dom: true,
    browser: {
      provider: 'playwright',
      name: 'chromium',
      enabled: true,
      headless: true,
    },
  },
});
