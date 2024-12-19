# cookie

## cookie - (object)

Cookie 管理器, 可以通过该对象的方法操作 Cookie

### cookie.get - (function)

获取 cookie

**参数**

| 必填 | 参数 | 说明       | 类型   | 默认值 |
| ---- | ---- | ---------- | ------ | ------ |
| \*   | key  | cookie key | string |        |

**返回值**: `string | null`

### cookie.set - (function)

设置 cookie

**参数**

| 必填 | 参数    | 说明         | 类型           | 默认值 |
| ---- | ------- | ------------ | -------------- | ------ |
| \*   | key     | cookie key   | string         |        |
| \*   | value   | cookie value | string         |        |
|      | options | cookie 配置  | ICookieOptions | \{}    |

:::details 类型补充
**ICookieOptions**

```ts
interface ICookieOptions {
  duration?: number;
  expires?: string | Date;
  domain?: string;
  maxAge?: number;
  path?: string;
}
```

:::

**返回值**: `void`

### cookie.remove - (function)

移除 cookie

**参数**

| 必填 | 参数 | 说明       | 类型   | 默认值 |
| ---- | ---- | ---------- | ------ | ------ |
| 是   | key  | cookie key | string |        |

**返回值**: `void`
