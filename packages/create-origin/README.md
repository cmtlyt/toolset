# 起源命令行

一个用于创建 **项目** / **npm** 包的命令行工具

添加框架流程

1. 补充解析插件信息 (src/constant/plugin-map.ts)
2. 补充导入插件语句 (src/constant/import-expression.ts)
3. 调整 tsconfig (template-source/other-config/tsconfig.ts)
4. 调整 env (template-source/other/${builder}-env.d.ts)
5. 添加框架支持 (src/constant/frame-support.ts)

## 使用示例

```bash
npm create @cmtlyt/origin [<project-name>]
```

## 更新

### v0.1.1

添加更多进度

### v0.1.0

支持生成 npm 包

支持生成 vite, rsbuild 两个构建器所支持的框架包括: vue, react, preact, svelte, solid
