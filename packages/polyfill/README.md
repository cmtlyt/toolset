# @cmtlyt/polyfill

es 新特性尝鲜

## 更新日志

### v0.1.3

包类型调整

针对 umd 产物, 将所有依赖打包进产物, 防止 umd 产物找不到依赖, 但是这样会引入一个新的问题, 就是每次依赖包升级后需要重新打包并发布版本, 所以 umd 版本的产物更新是滞后的, 可能会存在 bug, 所以建议不要使用 umd 版本的产物

### v0.1.2

包类型调整

### v0.1.1

单独导出 commonjs 模块

### v0.1.0

- ClPromise.try
- ClArray.fromAsync
- promiseTry
- arrayFromAsync
