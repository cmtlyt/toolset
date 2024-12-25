# @cmtlyt/monitor

## 简介

监控工具库

## 安装

npm

```bash
npm i @cmtlyt/monitor
```

yarn

```bash
yarn add @cmtlyt/monitor
```

pnpm

```bash
pnpm add @cmtlyt/monitor
```

## 更新日志

### v0.1.3

修复 getTargetSelector 方法中获取部分不到 className 时的报错
修复 getPrintFunc 类型问题
导出 Kind 类型 (系统中声明的所有 logger 方法)
页面卸载事件触发后不再进行日志处理, 后续会对此类日志进行持久化处理

### v0.1.2

新增自动埋点根元素配置
自动埋点 message 使用 eventName 替换
新增 formatReportInfo 配置

### v0.1.1

替换打包工具

### v0.1.0

- 游离错误监控
- 页面性能监控
- 日志主动上报
- 自定义上报策略
- 日志格式化
- 控制台美化输出配置
