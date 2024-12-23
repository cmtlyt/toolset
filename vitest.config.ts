import process from 'node:process';
import { defineConfig } from 'vitest/config';

declare module 'vitest' {
  export interface ProvidedContext {
    CI: boolean;
    env: NodeJS.ProcessEnv;
  }
}

export default defineConfig({
  test: {
    provide: {
      CI: process.env.CI === 'true',
      env: process.env,
    },
    coverage: {
      provider: 'istanbul',
      exclude: [
        // 文档相关
        'document/**',
        'doc_build/**',
        // 模板
        'template/**',
        // 输出目录和包根目录下的配置文件
        'packages/**/dist/**',
        'packages/*/*.ts',
        'packages/*/__test__/**',
        // 根目录配置文件
        '*.workspace.{js,ts}',
        '*.config.{js,ts}',
        '.*.{ts,js}',
        // 工程脚本
        'scripts/*',
        // 测试覆盖率相关文件
        '**/coverage/**',
      ],
      reporter: ['html'],
    },
  },
});
