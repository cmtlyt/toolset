# @cmtlyt/logger

## 介绍

美化浏览器控制台日志输出

提供埋点主动上报能力

使用文档: https://cmtlyt.github.io/toolset/packages/logger/index

## 安装

npm

```bash
npm i @cmtlyt/logger
```

yarn

```bash
yarn add @cmtlyt/logger
```

pnpm

```bash
pnpm add @cmtlyt/logger
```

### v0.2.0

调整打包策略

- esm 不打包生产依赖

原打包策略会将生产依赖一并打包到输出结果中, 导致依赖模块更新后需要重新打包并发布版本

### v0.1.1

移除无用依赖

### v0.1.0

实现浏览器控制台日志带样式输出能力及日志级别控制

支持扩展日志类型, 生产环境控制, 埋点回调等
