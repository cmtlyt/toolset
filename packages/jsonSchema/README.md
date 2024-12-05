# @cmtlyt/json-schema

处理 json schema 的工具

包括：

- 解析
- 校验
- mock

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
