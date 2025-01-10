# @cmtlyt/base

## 简介

cmtlyt 的基础工具库

> README 每次发包才会更新，如果需要看最新的更新日志或文档，请前往 homepage 查看

## 安装

npm

```bash
npm i @cmtlyt/base
```

yarn

```bash
yarn add @cmtlyt/base
```

pnpm

```bash
pnpm add @cmtlyt/base
```

## 更新日志

### 日志标识总览

- (O) 对象
- (D) 目录
- (F) 函数
- (I) 接口
- (CV) 常量
- (T) 类型
- -> 别名

### v0.11.0

新增

- (F) parseUrl
- (F) parseSearch
- (F) parseSearchObject
- (F) fromEntries
- (F) debounceAsync

新增 fp 相关内容

- (F) collectBy
- (F) deepExec
- (F) deepExecWith
- (F) nth
- (F) adjust
- (F) aperture
- (F) append
- (F) every
- (F) filter
- (F) findIndex
- (F) find
- (F) groupBy
- (F) groupWith
- (F) includes
- (F) join
- (F) makeBy
- (F) map
- (F) partition
- (F) reduce
- (F) replicate
- (F) some
- (F) both
- (F) eq
- (F) gt
- (F) lt
- (F) applySpec
- (F) applyTo
- (F) apply
- (F) argNumLimit
- (F) placeholderFunc
- (CV) placeholderFunc.\_\_
- (F) assoc
- (F) deepProp
- (F) omit
- (F) pick
- (F) prop
- (F) addThen
- (F) always
- (F) defaultValue
- (F) id
- (F) identity
- (F) toCamelCase
- (F) toKebabCase
- (F) toLowerCase
- (F) toUnderlineCase
- (F) toUpperCase
- (CV) \_\_
- (F) trace

这些方法均导出了非 curry 版本, 即函数后添加 `_`

例如:

```js
// curry 版本
makeBy;
// 非 curry 版本
makeBy_;
```

部分函数不再由 `@cmtlyt/base` 透出, 迁移到 `import { utils } from '@cmtlyt/base/fs';` 或 `import { xxx } from '@cmtlyt/base/fp/utils';`

本次改动涉及到的方法:

- filter
- map
- reduce
- every
- some
- find
- findIndex
- includes
- join
- trace
- pick
- omit

不再导出内部使用的 STATIC_TYPE 常量

### v0.10.1

源码目录重构, 不影响使用

### v0.10.0

新增 fp 模块

算子 (实现了最基本的能力例如 `map` `flatMap`, 其余更高级的方法暂时未实现)

- functor.container
- functor.either
- functor.maybe
- functor.task
- functor.io

工具方法

- utils.trace

修复 compose 和 pipe 无法正确处理数组返回值的问题

新增

- (F) getConcurrentQueue
- (F) noop

小版本迭代会逐次标记数据转换中所有 chunkString 相关方法弃用, 并在下一个大版本迭代中删除
生成 chunkString 相关方法变为对应方法的别名, 从 base64 转换为其他类型的方法支持 chunkString, 但会抛出警告

当前迭代涉及方法

- arrayBufferToChunkBase64String
- chunkBase64StringToBlob
- chunkBase64StringToArrayBuffer
- streamToChunkBase64String
- chunkBase64StringToStream
- blobToChunkBase64String

### v0.9.3

新增

- (F) completion

下列方法用于函数式编程

- (F) filter
- (F) map
- (F) reduce
- (F) every
- (F) some
- (F) find
- (F) findIndex
- (F) includes
- (F) join

### v0.9.2

打包工具调整, 工程重构

### v0.9.1

针对 umd 产物, 将所有依赖打包进产物, 防止 umd 产物找不到依赖, 但是这样会引入一个新的问题, 就是每次依赖包升级后需要重新打包并发布版本, 所以 umd 版本的产物更新是滞后的, 可能会存在 bug, 所以建议不要使用 umd 版本的产物

新增

- (F) pick
- (F) omit
- (T) TMany
- (T) TObjKeyType

### v0.9.0

调整打包策略

- esm 不打包生产依赖

原打包策略会将生产依赖一并打包到输出结果中, 导致依赖模块更新后需要重新打包并发布版本

### v0.8.6

包类型调整

### v0.8.5

单独导出 commonjs 模块

### v0.8.4

兼容旧版方法

### v0.8.3

新增

chunk string 相关方法需要使用对应方法解析

- (F) arrayBufferToChunkBase64String
- (F) chunkBase64StringToBlob
- (F) chunkBase64StringToArrayBuffer
- (F) blobToChunkBase64String
- (F) streamToChunkBase64String
- (F) chunkBase64StringToStream

### v0.8.2

更新 verify 分类下的类型声明, 使 `isNumber`, `isTrue` 等函数能直接断言数据类型

新增

- (F) isArray

### v0.8.1

新增

- (F) onceFunc

### v0.8.0

新增一组数据转换方法

- (F) streamToString
- (F) stringToStream
- (F) stringToBinary
- (F) binaryToString
- (F) arrayBufferToBase64String
- (F) base64StringToUint8Array
- (F) streamToBase64String
- (F) base64StringToStream
- (F) streamToArrayBuffer
- (F) base64StringToStream

### v0.7.3

新增

- (F) isConstructor
- (F) isArrayLike
- (T) TPromiseConstructor
- (T) TConstructor

### v0.7.2

新增

- tryCall
- tryCallFunc

### v0.7.1

修复 merge 函数逻辑错误

新增 withResolvers 可同步获取 resolve, reject 和 promise 实例, 通常用于需要在外部完成 promise 的场景

### v0.7.0

扩展更多工具类型

! 循环依赖处理, 部分指定文件导入的模块会失效 例如: `import { cacheByReturn } from '@cmtlyt/base/utils/funcHandler'`, 如果使用 `import { cacheByReturn } from '@cmtlyt/base'` 的方式导入则不受本次修改的影响

受影响的方法:

- cacheByReturn
- getAliAppEnv
- getOsType
- getDeviceInfo
- getType
- getUserAgent
- isWeb
- isNode
- isMiniApp
- isAliMiniApp
- isByteDanceMicroApp
- isWeChatMiniProgram
- isWeex
- isIOS
- isAndroid
- isOpenHarmony
- isString
- isUndef

### v0.6.9

对外暴露工具类型

### v0.6.8

修复 createWorkerFunc 传递函数依赖打包混淆后, 函数丢失问题

### v0.6.7

优化

- createWorkerFunc 支持直接从传入函数作为依赖
- getRandomString 从原来的 32 进制更新为 36 进制

修复

- createWorkerFunc 返回值类型修复

### v0.6.6

类型调整

### v0.6.5

新增

- (D) utils
  - (F) sleepSync

修复一些 bug

### v0.6.4

新增

- (D) utils
  - (F) reverseArgs
  - (F) asyncFilter

### v0.6.1

函数所属目录调整

### v0.6.0

- 目录分类重构
- 新增客户端检测
- 使用 rollup 打包

### v0.5.17

优化

- `isUrl` 支持 https 判断

### v0.5.16

优化

- `gc` 类型优化

### v0.5.15

修改

修复 `merge` 类型提示

### v0.5.14

修改

添加友好的 `merge` 类型提示

### v0.5.13

新增

- (D) utils
  - (F) merge
  - (F) cloneMerge

### v0.5.12

修改

`createPool` 的所有权控制增强, 修改返回值类型

### v0.5.11

部分函数添加警告

新增

- `createUploader` 支持二进制上传,支持配置 `headersHandler`
- (D) utils
  - (F) sleep
  - (F) asyncReplace
  - (F) memoize
  - (F) deepClone

### v0.5.10

全局添加可控警告
通过 `window.__ClConfig__.disableWarning` 控制

### v0.5.9

新增

- (D) utils
  - (F) chunkTask
  - (F) isAsyncFunc

修复

- 修复 `apply` 方法传参错误问题

优化

- 优化 `cacheByReturn` 方法底层调用方式

### v0.5.8

新增

- (D) utils
  - (F) getNow

### v0.5.7

新增

- (D) utils
  - (F) getCallStack

### v0.5.6

新增

- (D) utils
  - (F) isTrue
  - (F) isFalse

修改

- 所有 `function` 类改为 `class` 类
- 所有私有属性和方法, 使用 `ES6` 的私有句法定义

### v0.5.5

新增

- (D) utils
  - (F) apply
  - (F) construct
  - (F) defineProperty
  - (F) deleteProperty
  - (F) get
  - (F) getOwnPropertyDescriptor
  - (F) getPrototypeOf
  - (F) has
  - (F) isExtensible
  - (F) ownKeys
  - (F) preventExtensions
  - (F) set
  - (F) setPrototypeOf
- `createUploader` 支持用户自定义 `fetch` 参数

### v0.5.4

新增

- `createUploader` 新增 `concurrentNode` 配置, 用于配制并发上传的节点

### v0.5.3

新增

- `Logger` 新增 `getInstance` 静态方法

修改

- 部分类型修订
- 移除多余类型
- 移除 `createStorePool` 中的 `DefaultStoreController` 导出

### v0.5.2

新增

- (F) createPool
- (F) getPool

修复

- 部分类型修复

优化

- `createUploader` 使用 `createPool` 管理上传任务，并增加可配置参数

### v0.5.1

修复

- 修复 `isHttpUrlString` 无法识别 `//` 开头链接的问题

### v0.5.0

新增

- (F) createUploader
- (D) utils
  - (F) isFile
  - (F) isBlob
  - (F) isHttpUrlString
  - (F) isBlobUrlString
  - (F) isDataUrlString
  - (F) isUrl
  - (F) getArraySlice

修复

- `logger` 类型错误，及内部参数赋值错误
- `string` 模块类型修复
- 移除多余类型声明
- `createWorkerFunc` 类型完善

新增

- `createWorkerFunc` 监听用户自己发送的事件

备注

- 如果 `createWorkerFunc` 第三个参数的 `needPost` 配置项被设置为 `true` 后，会改变 `func` 的第一个参数为 `postMessage` 函数，如果需要使用，请注意！！！

### v0.4.2

新增

- (D) utils
  - (F) isEmpty

修复

- 大范围类型修复
- 修复 `pipe` 和 `compose` 写反了的问题

修改

- `generateCookieInfo` 增加可配置参数

### v0.4.1

新增

- (D) utils
  - (F) getType

修改

- `Calculator` 的 `valueOf` 方法改为计算器的等于运算符，并新增 `getCurrValue` 来获取当前值，但不计算最终结果

```js
// valueOf 会真实计算结果
const calc = new Calculator(1);
calc.add(1);
calc.valueOf(); // 2
calc.mut(2);
calc.valueOf(); // 4

// getCurrValue 不会真实计算结果
const calc2 = new Calculator(1);
calc2.add(1);
calc2.getCurrValue(); // 2;
calc2.mut(2);
calc2.valueOf(); // 3
```

修复

- 大范围类型修复

### v0.4.0

新增

- (F) curry
- (F) compose
- (F) pipe

警告

`compose` 和 `pipe` 类型存在缺陷，只能判断最后输入的函数是否满足条件，不能判断中间的函数
也就是说从前往后传入函数可以正确判断类型，但是如果是在中间插入函数就不行，而且对于柯理化后的函数，只能判断第一个参数的类型

### v0.3.3

修复

- [x] 修复 `clipboard.paste` 返回类型不统一问题

### v0.3.2

修复

- [x] 修复 `getArray` 类型提示中返回类型错误问题

### v0.3.1

修复

- [x] 修复调用 `getArray` 出现找不到 `isNull` 的问题

### v0.3.0

新增

- (O) cookie
  - (F) get
  - (F) set
  - (F) remove
- (D) utils
  - (F) generateCookieInfo
  - (F) generateClassName -> gc

### v0.2.0

新增

- (F) createStorePool
- (C) DefaultStoreController
- (I) IStoreController
- (C) EventEmitter
- (C) CustomEvent
- (O) clipboard
  - (F) copy
  - (F) paste
  - (F) clear
- (C) Calculator
- (D) utils
  - (F) debounce
  - (F) throttle
  - (F) isNumber
  - (F) isNaN
  - (F) isPromise

### v0.1.0

新增

- (F) createWorkerFunc
- (C) Logger
- (D) utils
  - (F) getArray
  - (F) cacheByReturn
  - (F) formatDate
  - (F) getRandomString
  - (F) createLinkByString
  - (F) isNull
- (CV) EMPTY
