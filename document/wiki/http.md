# HTTP 协议

## HTTP/0.9

> 1990 年前后, 由当时在欧洲核子研究中心工作的前端祖师爷迪姆帕纳斯李 (Tim Berners Lee) 提出草案, 基于 TCP、IP 协议实现了 HTTP 协议
> 0.9 版本简单却不简陋, 一经发布, 就让浏览器和服务器对 HTTP 协议产生了旺盛的需求, 在随后的纪念里社区对 0.9 版本的协议自发的进行了许多修补和增强
> 一开始没有版本号, 后来约定俗成称为 0.9 版本

### 解决的痛点

欧洲核子研究中心内部文档管理混乱, 信息交流不方便

### 新特性

最早的 HTTP 协议版本, 他只有 GET 方法, 仅支持传输 HTML 内容, 没有实现 HTTP 请求头和请求体, HTTP 请求只有 1 行内容: `GET /index.html`

除了 HTTP 协议, 还一并实现了 HTML, 主要用于学术交流, 仅支持纯文本信息. 也正是因为简单好用, HTTP 协议迅速在互联网上流行开来, 被众多浏览器和服务器接纳

## HTTP/1.0

> 1996 年前后, 为了强化 HTTP 协议、解决不同浏览器、服务器之间基于 HTTP/0.9 协议通信靠相互试探的问题, 由蒂姆帕纳斯李发起了一份意见征求稿: RFC 1945, 从众多自发的实践经验中汲取精华, 讨论确立了 HTTP/1.0 版本

### 解决的痛点

- 0.9 版本仅支持文本一种类型的信息交流, 无法满足日益多样的互联网通信需求
- 0.9 版本无状态, 导致无法感知成功、失败状态

> 队头阻塞 (HOL blocking) 问题: 浏览器和服务器通信过程中, 因为部分请求长期无响应, 导致阻塞后续请求发送和响应接受
>
> 例如: 浏览器请求一个 1MB 的 JS 文件时, 如果响应较慢, 就会导致后续 1KB 的 CSS 文件长时间等待、无法加载. 就像我们去或者站排队买票时, 排在队头的第一个客户长时间占据窗口, 就会导致后续用户等待较长时间

### 新特性

1. 明确了 HTTP/1.0 的版本, 并且规定跟随请求头发送
2. 引入请求、响应以及状态码等诸多基础概念
3. 引入 HTTP 头的概念, 支持传输各类自定义数据, 大大强化 HTTP 协议的灵活性、扩展性
4. 引入 Content-Type 响应头, 支持图片等更多类型的响应

## HTTP/1.1

> 与 1.0 版本几乎相同, 更正式的规范讨论也在进行, 并于 1997 年发布了意见征询稿: RFC 2068, 进一步解决了 HTTP 协议的诸多痛点. HTTP/1.1 版本后续虽有小修小补, 但总体上稳定了长达 15 年之久

### 解决的痛点

- 1.0 版本链接延迟较大: 因为队头堵塞 (HOL blocking) 导致浏览器传输效率受限
- 1.0 版本只支持短链接: 每一对请求响应, 都必须经历 TCP 三握四挥的过程, 才能通信, 开小较大. 这也是为什么早年间的网页流行使用精灵图 (Sprites) 技术, 以减少请求数量的原因

### 新特性

1. 长链接 (Persistent Connection): 支持在一个 TCP 连接上传送多个 HTTP 请求和响应, 减少了建立和关闭连接的消耗和延迟
2. 通过 Host 字段, 支持虚拟主机, 允许多个域名共用一个 IP 地址
3. 新的缓存机制: `Etag`, `If-None-match`, `Cache-Control` 等专用头部
4. 新增了 `OPTIONS`, `HEAD`, `PUT`, `DELETE` 等新一批的 HTTP 请求方法, 以及 307 永久重定向等一批新的 HTTP 状态码

## HTTP/2.0

> 2009 年前后, 为了解决 HTTP/1.1 版本性能, Google 实现了名为 SPDY 的实验性协议. 2015 年, 由 Google 推动, 在 SPDY 协议的基础上, 标准化了 HTTP/2 协议

### 解决的痛点

十几年过去, HTTP/1.1 版本的性能表现日渐落后, 急需大幅优化性能

### 新特性

1. 多路复用

   - 同域名下所有通信都在单个 TCP 连接上完成, 消除了因创建多个 TCP 连接而带来的延时和内存消耗
   - 解决了 HTTP 层的队列头阻塞问题 (但 TCP 层的队列头阻塞问题仍然存在)
   - 单个连接上可以并行交错的请求和响应, 但相互之间互不干扰

2. 服务端推送

   建立连接后, 即使还没有收到浏览器的请求, 服务器也可以主动把各种类型的资源推送给浏览器
   比如, 浏览器只请求了 index.html, 但是服务器把 index.html、style.css、example.png 全部都发送给浏览器. 这样的话只需要一轮 HTTP 通信, 浏览器就得到了全部资源, 提高了性能
   不建议一次推送太多资源, 这样反而会拖累性能, 因为浏览器不得不处理所有推送过来的资源. 只推送 CSS 样式表可能是一个比较好的选择

3. 头部压缩

   将有大量重复内容的 HTTP 请求响应头进行压缩, 节省网络流量

4. 全面基于二进制格式传输

   此前的 HTTP/1.1 版本, 头部必须是文本格式, 数据支持文本、二进制两种格式. HTTP/2 进一步全面支持二进制格式, 以及基于二进制数据分帧, 从客户端乱序发送, 到服务端再按帧内数据排序组装

## HTTP/3

> 2013 年, Google 为了进一步优化 HTTP 协议的性能, 加快网页传输, 设计并实现了快速 UDP 互联网连接 (Quick UDP internet Connection, 简称 QUIC), 为 2018 年 HTTP/3 的确立奠定了基础

### 解决的痛点

HTTP/2 连接建立时长较短, 因为基于 TCP 协议, 三握四挥的过程开销无法避免

TCP 队头阻塞问题: HTTP/2 运行在单个 TCP 连接上, 因此 TCP 层进行丢包检测和重传时可能会阻塞后续数据

HTTP/2 在弱网环境, 尤其是移动互联网场景中性能较差, 因为移动设备连接互联网时, 往往会时不时切换网络环境, 例如从 4G 切换到 WiFi, 这种情况下 HTTP/2 不得不重新创建 TCP 连接, 开销较大

### 新特性

1. 基于 UDP 协议实现

   减少了连接延迟, 避免了 TCP 三握四挥的开销, 避免网络环境变化时需要重新连接的问题, 优化了移动设备的连接性能

2. 囊括 TLS 协议

   更快的实现了 TLS 握手, 进一步减少往返时间 (Round Trip Time, RTT) 延迟
