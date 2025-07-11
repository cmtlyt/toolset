# GitDown

git 文件下载工具

## 安装

npm

```bash
npm i @cmtlyt/git-down
```

yarn

```bash
yarn add @cmtlyt/git-down
```

pnpm

```bash
pnpm add @cmtlyt/git-down
```

## 示例

```js
import gitDown from '@cmtlyt/git-down';

// 下载文件
await gitDown('https://github.com/cmtlyt/toolset/blob/main/packages/base/README.md', { output: '' });

// 下载目录
await gitDown('https://github.com/cmtlyt/toolset/tree/main/packages/base/src/common', { output: tempFolder });

// 下载仓库
await gitDown('http://github.com/cmtlyt/test', { output: tempFolder });
```

## 更新

### v0.3.0

新增 `gd` 命令行工具

### v0.2.2

新增 `gitDown` 具名导出

### v0.2.1

修复 windows 下 rename 问题

### v0.2.0

移除目录切换逻辑, 下载文件/目录支持并发

### v0.1.0

实现文件/仓库/目录下载功能 (js 接口, 暂不支持 cli)

导出了 `parseGitUrl` 方法用于从 url 解析 git 信息
