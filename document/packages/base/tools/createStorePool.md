# 存储池

## createStorePool - (function)

创建存储池, 返回存储池操作方法, 用于存储数据, 内部通过索引管理, 存储数据时会返回 id, 会自动维护索引, 自动扩容

### 参数

| 必填 | 参数       | 说明       | 类型             | 默认值                   |
| :--: | ---------- | ---------- | ---------------- | ------------------------ |
|      | controller | 存储控制器 | IStoreController | `DefaultStoreController` |

:::details 类型补充

**IStoreController**

```ts
interface IStoreController {
  save: (data: any) => number;
  get: (id: number) => any;
  delete: (id: number) => void;
  clear: () => void;
  pop: (id: number) => any;
}
```

:::

### 返回值

`IStorePoolHandle` 对象

:::details 类型补充

**IStorePoolHandle**

```ts
interface IStorePoolHandle {
  // 存储
  save: (value: any) => number;
  // 获取
  get: (id: number) => any;
  // 删除
  delete: (id: number) => void;
  // 清空
  clear: () => void;
  // 弹出
  pop: (id: number) => any;
  // 监听
  on: (type: string, listener: Function) => Function;
  // 取消监听
  off: (type: string, listener: Function) => void;
  // 监听一次
  once: (type: string, listener: Function) => Function;
  // 清空监听
  clearEvent: (type: string) => void;
  // 清空监听
  clearEvents: () => void;
}
```

:::
