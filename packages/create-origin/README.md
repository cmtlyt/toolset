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
# 创建项目
npm create @cmtlyt/origin [<project-name>]
# 创建 npm 包
npm create @cmtlyt/origin <package-name> --package

# 下列方法需要全局安装本 npm 包才支持

# 创建项目 (等价于 npm create @cmtlyt/origin)
origin create [<project-name>]
# 创建 npm 包 (等价于 npm create @cmtlyt/origin <package-name> --package)
origin create <package-name> --package
# 获取配置
origin fetch --config
# 获取模板
origin fetch --template
# 获取所有
origin fetch --all
# 从 github 获取所有
origin fetch --all --registry=github
```

## 安装

npm

```bash
npm i -g @cmtlyt/create-origin
```

yarn

```bash
yarn global add @cmtlyt/create-origin
```

pnpm

```bash
pnpm add -g @cmtlyt/create-origin
```

## 更新

### v0.2.0

安装本包后

新增 `fetch` , `template` 和 `create` 命令

fetch 用于持久化远端配置到本地, 减少创建项目时下载资源的时间

template 用于管理自定义配置, 包含 创建/删除/查看/清空 配置

create 用于创建项目

### v0.1.1

添加更多进度

### v0.1.0

支持生成 npm 包

支持生成 vite, rsbuild 两个构建器所支持的框架包括: vue, react, preact, svelte, solid
