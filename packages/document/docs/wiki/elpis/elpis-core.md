# elpis-core

## elpis-core 是什么?

从表层来看 elpis-core 是一个服务端框架, 他是 egg 的阉割版, 基于 koa 后端框架开发, 提供了基础的接口服务

## 设计原则

elpis-core 的底层能力还是 koa 提供的, 那 elpis-core 做了什么呢?

我们每个开发者都有自己的开发习惯, 但是对于团队来说更需要的统一的风格和规范, 而不是每个开发者五花八门的**魔法**

为什么说是魔法呢? 因为你完全不知道其他人会把代码写在什么位置, 以及在什么位置添加或删除了什么

所以 elpis-core 就是为了解决这个问题而诞生的

实际上 elpis-core 也只是单纯的实现了一种后端框架编写的规范, 也叫约定.

例如

- 在 `app/controller` 路径下存放所有的 controller
- 在 `app/service` 路径下存放所有的 service
- 在 `app/middleware` 路径下存放所有的 middleware
- 在 `app/extend` 路径下存放所有的 extend
- 在 `app/config` 路径下存放所有的 config
- 在 `app/router-schema` 路径下存放所有的 router-schema
- 在 `app/router` 路径下存放所有的 router

这些都是 elpis-core 提供的约定, 使得 elpis-core 能够提供一种简单且统一的开发方式

elpis-core 会从这些目录读取对应的文件并且初始化代码, 然后挂载到 koa 的实例上, 这样我们就可以约束开发者的代码存放位置和编写规范, 然后对于报错来说也可以直接从对应的目录下找到问题, 从而提高开发效率

## 约定的好处

1. 规范
   - 代码的存放位置
   - 代码的编写规范
2. 统一
   - 代码的挂载
   - 代码的错误处理
3. 效率
   - 降低代码的维护成本
   - 降低代码的理解成本
   - 降低代码的上手难度

## 存在的问题

1. TS 支持较差

因为 elpis-core 是根据约定从对应目录读取文件初始化的, 所以对于 ts 的支持并不是特别好, 没法自动生成对于 ts 的类型描述

例如: 现在有个 product 的 controller 被挂载在 `app.controller.product` 上, 对于框架来说, product 具体类型是什么并不明确, 只有在开发的时候才会知道, 所以框架能做的就是, 告诉开发者, app 实例上存在一个 controller, 并且他的类型为 `Record<string, Record<string, () => any>>`, 更细致的就只能是开发者在使用的时候去指定了, 或者直接在声明文件中覆盖框架对默认 controller 的类型描述

2. 约定只是约定

elpis-core 并不对代码进行审查, 且约定并不是强制的, 部分开发者还是会在代码中引入一些黑盒逻辑或者过于跳跃的逻辑, 而这就会导致代码的维护成本增加
