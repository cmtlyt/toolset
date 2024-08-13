# @cmtlyt/plugin-use-container

将 vite 构建的应用运行在 web container 中, 同时提供后端支持

后端代码自行编写(可以使用 node api), 使用插件时, 传递后端代码路径和启动命令即可

> 注意: 这个后端代码, 运行时所有数据都是客户端的, 如果需要持久化, 则需要将数据同步至远程数据库
>
> 如果需要将运行时数据持久化到客户端, 可以使用 node:fs 模块将数据写入到 storage 目录下, 然后容器会自动保存这个目录下的文件进行客户端的持久化

```js
import { writeFileSync, readFileSync } from 'fs';

readFileSync('storage/test.txt', { encoding: 'utf-8' }); // 第一次运行 找不到文件, 刷新页面后运行或写入后读取, 返回 'test'
writeFileSync('storage/test.txt', 'test');
```

## 更新日志

### v0.1.3

自行实现 __dirname 和 __filename

### v0.1.2

修改打包后文件后缀为 mjs

### v0.1.1

修复 vite 设置 base 后导致资源类型错误问题

### v0.1.0

提供 buildContainerPlugin / injectSourcePlugin 两个插件

buildContainerPlugin 用于将 vite 构建的应用运行在 web container 中, 并且可以通过配置打包后端文件, 如果传递了后端则运行时会发送一个 postMessage `{ type: 'backend-url', url: 'xxx' }`, 在应用程序中可以通过监听 message 事件获取后端链接

injectSourcePlugin 用于将资源注入到 html 中, 例如全局变量等
