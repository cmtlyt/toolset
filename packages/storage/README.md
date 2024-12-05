# @cmtlyt/storage

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

存储降级 (浏览器不支持的情况下会进行降级处理): IndexedDB -> localStorage -> sessionStorage -> Memory
