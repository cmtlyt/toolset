# @cmtlyt/storage

## 介绍

前端持久化存储解决方案 (不支持 commonjs)

根据需求自行选择使用的存储方式

需要注意根据浏览器支持度会进行存储降级 (浏览器不支持的情况下会进行降级处理): IndexedDB -> localStorage -> sessionStorage -> Memory

可以通过实例的 name 属性获取当前使用的存储方式

## 安装

npm

```bash
npm i @cmtlyt/storage
```

yarn

```bash
yarn add @cmtlyt/storage
```

pnpm

```bash
pnpm add @cmtlyt/storage
```

## 更新日志

### v0.2.1

针对 umd 产物, 将所有依赖打包进产物, 防止 umd 产物找不到依赖, 但是这样会引入一个新的问题, 就是每次依赖包升级后需要重新打包并发布版本, 所以 umd 版本的产物更新是滞后的, 可能会存在 bug, 所以建议不要使用 umd 版本的产物

### v0.2.0

调整打包策略

- esm 不打包生产依赖

原打包策略会将生产依赖一并打包到输出结果中, 导致依赖模块更新后需要重新打包并发布版本

- 移除对 commonjs 的支持

node 端不支持 localStorage / sessionStorage / indexedDB 所以本质上创建实例的时候只会返回 MemoryStorage 实例, 如果需要本模块提供的 api 请使用下方 rollup 打包配置进行二次打包

**index.js**

```js
export * from '@cmtlyt/storage';
```

**rollup.config.js**

```js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  input: './index.ts',
  output: [{ format: 'cjs', file: '[文件名].js' }],
  plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()],
});
```

**使用**

```js
import { IndexedDBStorage } from './[文件名].js';
```

### v0.1.5

包类型调整

### v0.1.4

单独导出 commonjs 模块

### v0.1.3

底层依赖更新

### v0.1.2

底层依赖更新

### v0.1.1

数据保存使用 gzip 压缩

### v0.1.0

实现基本的存储功能, 支持 localStorage, sessionStorage, IndexedDB, Memory
对应暴露类: LocalStorage, SessionStorage, IndexedDBStorage, MemoryStorage
