# @cmtlyt/string-zip

## 介绍

可用于前端环境的字符串压缩, 如果客户端环境不支持 gzip 则会降级为字典压缩

node 环境 暂时不支持使用 gzip

## 安装

npm

```bash
npm i @cmtlyt/string-zip
```

yarn

```bash
yarn add @cmtlyt/string-zip
```

pnpm

```bash
pnpm add @cmtlyt/string-zip
```

## 更新日志

### v0.4.1

针对 umd 产物, 将所有依赖打包进产物, 防止 umd 产物找不到依赖, 但是这样会引入一个新的问题, 就是每次依赖包升级后需要重新打包并发布版本, 所以 umd 版本的产物更新是滞后的, 可能会存在 bug, 所以建议不要使用 umd 版本的产物

### v0.4.0

调整打包策略

- esm 不打包生产依赖

原打包策略会将生产依赖一并打包到输出结果中, 导致依赖模块更新后需要重新打包并发布版本

### v0.3.4

包类型调整

### v0.3.3

单独导出 commonjs 模块

### v0.3.2

底层依赖更新

### v0.3.1

底层依赖更新

### v0.3.0

新增 gzip, unGzip 方法, 如果不支持 gzip 压缩的话则会降级为原来的 **字典压缩**

### v0.2.0

新增 createZip, createUnzip 方法
支持自行配置 worker 参数

### v0.1.1

修复 worker 方法函数丢失问题

### v0.1.0

实现基本的 zipSync, unzipSync, zip, unzip
