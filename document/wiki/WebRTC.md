# WebRTC

## 简介

WebRTC (Web Real-Time Communication) 是一种开放的实时通信技术, 它允许网页和移动应用通过简单的 API 实现浏览器之间点对点的音频、视频和数据共享, 而无需安装浏览器插件或额外的软件. WebRTC 的核心组件和技术主要包括以下几点:

- Peer-to-Peer(P2P) 链接: WebRTC 利用 RTCPeerConnection API 建立浏览器之间的直接连接, 允许数据 (如音频、视频流) 在用户间直接传输, 减少了服务器中转的需求, 从而降低了延迟并提高了效率
- 媒体捕获和处理: 通过 getuserMedia API, WebRTC 能够访问用户的摄像头和麦克风, 捕获音频和视频数据. MediaStream API 则用于处理这些媒体流
- 音视频编解码: 为了实现实时通信, WebRTC 使用高效的音频和视频编解码器来压缩和解压缩数据流, 如 VP8、VP9 视频编解码器和 Opus 音频编解码器, 以适应网络带宽限制并保证通信质量
- 信令机制: 虽然 WebRTC 本身不指定信令协议, 但需要一个外部信令服务 (如 WebSocket、 XMPP 或其他自定义解决方案) 来协调两端的链接过程, 交换必要的会话信息 (如 SDP 描述符), 建立和维护连接
- 数据通道: 处理音视频通信外, WebRTC 还提供了 DataChannel API, 允许两个浏览器之间建立低延迟、高吞吐量的数据传输通道, 适用于游戏、文件共享、协作编辑等多种应用场景

WebRTC 被设计为跨平台的, 支持多种操作系统和浏览器, 包括 Chrome、Firefox、Safari(有限度支持)、Edge 等, 广泛应用于在线教育、远程会议、即时通讯、游戏、医疗健康等多个领域. 由于其开放性和强大的功能集, WebRTC 已经成为实时互联网通信领域的一个重要标准

## 接口

- [RTCPeerConnection](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection): 表示本地计算机与远程对等方之间的 WebRTC 连接. 它用于处理两个对等方之间的数据流式传输
- [RTCDataChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCDataChannel): 表示连接的两个对等方之间的双向数据通道
- [RTCDataChannelEvent (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannelEvent): 表示在将 RTCDataChannel 附加到 RTCPeerConnection 时发生的事件. 使用此接口发送的唯一事件是 datachannel
- [RTCSessionDescription](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCSessionDescription): 表示会话的参数. 每个 RTCSessionDescription 包括一个描述 type，指示其描述的提议/应答协商过程的哪一部分，以及会话的 SDP 描述符
- [RTCStatsReport](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCStatsReport): 提供有关连接或连接上的个别轨道的统计信息的详细信息；可以通过调用 RTCPeerConnection.getStats() 来获取报告
- [RTCIceCandidate](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCIceCandidate): 表示用于建立 RTCPeerConnection 的候选交互式连接建立（ICE）服务器
- [RTCIceTransport (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceTransport): 表示有关 ICE 传输的信息
- [RTCPeerConnectionIceEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnectionIceEvent): 表示与目标 ICE 候选项相关的事件，通常是 RTCPeerConnection. 此类型仅有一个事件：icecandidate
- [RTCRtpSender (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender): 管理在 RTCPeerConnection 上的 MediaStreamTrack 的数据编码和传输
- [RTCRtpReceiver (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpReceiver): 管理在 RTCPeerConnection 上的 MediaStreamTrack 的数据接收和解码
- [RTCTrackEvent (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCTrackEvent): 用于表示 track 事件的接口，该事件指示已将 RTCRtpReceiver 对象添加到 RTCPeerConnection 对象，表示已创建并添加了新的传入 MediaStreamTrack 至 RTCPeerConnection
- [RTCSctpTransport (英语)](https://developer.mozilla.org/en-US/docs/Web/API/RTCSctpTransport): 提供描述流控制传输协议（SCTP）传输的信息，并提供一种访问底层的用于所有 RTCPeerConnection 的数据通道发送和接收的 SCTP 包的数据报传输层安全（DTLS）传输的方式

## 事件

- bufferedamountlow: 表示数据通道当前缓冲的数据量（由其 bufferedAmount 属性指示）已经减少到或低于通道的最小缓冲数据大小（由 bufferedAmountLowThreshold 指定）
- close: 数据通道已完成关闭过程，现在处于 closed 状态. 此时，其底层数据传输完全关闭. 你可以通过观察 closing 事件来在关闭完成之前得到通知
- closing: RTCDataChannel 已转换为 closing 状态，表示它将很快关闭. 你可以通过观察 close 事件来检测关闭过程的完成
- connectionstatechange: 连接状态（可以通过 connectionState 访问）已更改
- datachannel: 有一个新的 RTCDataChannel 在远程对等方打开新数据通道之后可用. 此事件的类型是 RTCDataChannelEvent
- error: 表示数据通道上发生错误的 RTCErrorEvent
- error: 表示 RTCDtlsTransport 上发生错误的 RTCErrorEvent. 此错误将是 dtls-failure 或 fingerprint-failure
- gatheringstatechange: RTCIceTransport 的收集状态已更改
- icecandidate: 每当本地设备识别出一个新的 ICE 候选需要通过调用 setLocalDescription() 添加到本地对等方时，就会发送的 RTCPeerConnectionIceEvent
- icecandidateerror: 表示在收集 ICE 候选时发生错误的 RTCPeerConnectionIceErrorEvent
- iceconnectionstatechange: 在其 ICE 连接的状态（可通过 iceconnectionstate 属性访问）更改时，会发送给 RTCPeerConnection
- icegatheringstatechange: 在其 ICE 收集状态（可通过 icegatheringstate 属性访问）更改时，会发送给 RTCPeerConnection
- message: 在数据通道上收到消息. 该事件的类型为 MessageEvent
- negotiationneeded: 通知 RTCPeerConnection 需要通过调用 createOffer()，然后是 setLocalDescription() 来执行会话协商
- open: RTCDataChannel 的底层数据传输已成功打开或重新打开
- selectedcandidatepairchange: RTCIceTransport 上的当前选择的 ICE 候选对已更改时触发的事件
- track: 当成功协商了媒体流的流式传输后，将向 RTCPeerConnection 添加新轨道时，会发送类型为 RTCTrackevent 的 track 事件
- signalingstatechange: 在其 signalingstate 更改时，会发送到对等连接. 这是由于调用 setLocalDescription() 或 setRemoteDescription() 引起的
- statechange: RTCDtlsTransport 的状态已更改
- statechange: RTCIceTransport 的状态已更改
- statechange: RTCSctpTransport 的状态已更改
- rtctransform: 编码的视频或音频帧已准备好在 worker 中使用转换流进行处理

## WebRTC 链接流程图

![WebRTC 链接流程图](https://hacks.mozilla.org/wp-content/uploads/2013/07/webrtc-complete-diagram.png)

## 参考文档

[MDN WebRTC](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API)
