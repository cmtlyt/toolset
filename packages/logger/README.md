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

## 更新

### v0.2.6

修复循环依赖导致的卡死问题

### v0.2.5

优化空对象输出样式

### v0.2.4

格式化输出内容方法修订

### v0.2.3

通过对 logConfig 的 key 进行 sort 保证顺序的一致性

### v0.2.2

工程重构, 上层构建工具, 补充单测

### v0.2.1

修复创建 logger 时的配置类型

针对 umd 产物, 将所有依赖打包进产物, 防止 umd 产物找不到依赖, 但是这样会引入一个新的问题, 就是每次依赖包升级后需要重新打包并发布版本, 所以 umd 版本的产物更新是滞后的, 可能会存在 bug, 所以建议不要使用 umd 版本的产物

### v0.2.0

调整打包策略

- esm 不打包生产依赖

原打包策略会将生产依赖一并打包到输出结果中, 导致依赖模块更新后需要重新打包并发布版本

### v0.1.1

移除无用依赖

### v0.1.0

实现浏览器控制台日志带样式输出能力及日志级别控制

支持扩展日志类型, 生产环境控制, 埋点回调等
