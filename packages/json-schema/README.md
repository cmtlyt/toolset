# @cmtlyt/json-schema

## 介绍

处理 json schema 的工具

包括：

- 解析
- 校验
- mock

使用文档: https://cmtlyt.github.io/toolset/packages/jsonSchema/index

## 安装

npm

```bash
npm i @cmtlyt/json-schema
```

yarn

```bash
yarn add @cmtlyt/json-schema
```

pnpm

```bash
pnpm add @cmtlyt/json-schema
```

## 更新日志

### v0.4.2

工程重构, 打包工具修改

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

新增工具方法 typeObjectToSchema 用于将 `{ aaa: 'string', bbb: 'number' }` 类似对象转换为 json schema
修复数组非值 (0, '', ...) 生成scheam失败问题

### v0.3.1

修订类型文件指向

### v0.3.0

自行实现 verify

### v0.2.0

实现 decode/encode dataScheam

### v0.1.0

初步实现 verify/generage schema
