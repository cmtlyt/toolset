import path from 'node:path';
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  // 入口文件配置
  entries: ['src/index'],
  // 输出目录
  outDir: 'dist',
  // 路径别名
  alias: { $: path.resolve(__dirname, 'src') },
  // 每次打包清空输出目录
  clean: true,
  // 生成类型
  declaration: true,
  // 不生成 sourcemap
  sourcemap: false,
  rollup: {
    // 生成 cjs 桥
    cjsBridge: true,
    // 生成 cjs 版本
    emitCJS: true,
    esbuild: {
      minify: true,
    },
  },
  failOnWarn: false,
});
