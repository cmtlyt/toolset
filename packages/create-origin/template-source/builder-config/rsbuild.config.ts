const _default = `
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rsbuild/core';
<%- builderConfig.frameImport %>

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [<%= builderConfig.pluginUseCode %><%= builderConfig.pluginNeedCall ? '()' : '' %>],
  html: {
    crossorigin: true,
    mountId: 'app',
    template: path.resolve(__dirname, './index.html'),
  },
  source: {
    entry: {
      index: {
        import: path.resolve(__dirname, './src/main.ts'),
        html: true,
      },
    },
  },
  // 设置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`.trimStart();

export default {
  default: _default,
};
