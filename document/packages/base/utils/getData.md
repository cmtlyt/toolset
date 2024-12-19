# 数据获取相关方法

## getRandomString

获取指定长度的随机字符串

**类型声明**

```ts
function getRandomString(len?: number): string;
```

**参数**

| 必填 | 参数 | 说明       | 类型   | 默认值 |
| :--: | ---- | ---------- | ------ | ------ |
|      | len  | 字符串长度 | number | 8      |

**返回值**: `string`

**示例**

```js
import { getRandomString } from '@cmtlyt/base';
// import { getRandomString } from '@cmtlyt/base/utils/getData'

const str = getRandomString(10);
console.log(str); // a8sdf9aqw1
```

## createLinkByString

将传入的字符串转化为 `blob` 地址

**类型声明**

```ts
function createLinkByString(resource: string): string;
```

**参数**

| 必填 | 参数     | 说明     | 类型   | 默认值 |
| :--: | -------- | -------- | ------ | ------ |
|  \*  | resource | 资源内容 | string | -      |

**返回值**: `string`

**示例**

```js
import { createLinkByString } from '@cmtlyt/base';
// import { createLinkByString } from '@cmtlyt/base/utils/getData'

const blobUrl = createLinkByString('console.log("hello world")');
console.log(blobUrl); // blob:https://xxxx
```

## generateCookieInfo

生成 cookie 信息

**类型声明**

```ts
interface ICookieOptions {
  duration?: number;
  expires?: string | Date;
  domain?: string;
  maxAge?: number;
  path?: string;
}

function generateCookieInfo(options: ICookieOptions): string;
```

**参数**

| 必填 | 参数    | 说明        | 类型           | 默认值 |
| :--: | ------- | ----------- | -------------- | ------ |
|      | options | cookie 配置 | ICookieOptions | \{}    |

**返回值**: `string`

**示例**

```js
import { generateCookieInfo } from '@cmtlyt/base';
// import { generateCookieInfo } from '@cmtlyt/base/utils/getData'

const cookieInfo = generateCookieInfo({
  duration: 10,
  expires: '2023-12-25',
  domain: 'example.com',
  maxAge: 10,
  path: '/',
});
console.log(cookieInfo); // "expires=Fri, 25 Dec 2023 00:00:00 GMT;domain=example.com;max-age=10;path=/"
```

## generateClassName

生成 className

**类型声明**

```ts
function generateClassName(
  ...args: (string | string[] | Record<string, boolean>|Record<string, boolean>[](string|Record<string, boolean>)[])[]
): string;

const gc: typeof generateClassName;
```

**参数**

| 必填 | 参数 | 说明 | 类型                                                                                                              | 默认值 |
| :--: | ---- | ---- | ----------------------------------------------------------------------------------------------------------------- | ------ |
|  \*  | args | 类名 | (string\|string\[]\|Record\<string, boolean>\|Record\<string, boolean>[]\|(string\|Record\<string, boolean>)[])[] | -      |

**返回值**: `string`

**示例**

```js
import { generateClassName, gc } from '@cmtlyt/base';
// import { generateClassName, gc } from '@cmtlyt/base/utils/getData'

const className = generateClassName('a', 'b', { c: true }, ['d', { e: false, f: true }]);
const className2 = gc('a', 'b', { c: true }, ['d', { e: false, f: true }]);
console.log('className:', className); // className: "a b c d f"
console.log('className2:', className2); // className2: "a b c d f"
```

## getNow

获取当前时间, 支持 `performance API` 的浏览器会返回 `performance.now`, 不支持的浏览器会返回 `Date.now`

**类型声明**

```ts
getNow(): number
```

**返回值**: `number`

**示例**

```ts
import { getNow } from '@cmtlyt/base';
// import { getNow } from '@cmtlyt/base/utils/getData';

getNow(); // 1692889934
getNow(); // 1692889935
getNow(); // 1692889936
getNow(); // 1692889937
```

## getOsType

获取操作系统类型

**类型声明**

```ts
function getOsType():
  | 'ios'
  | 'android'
  | 'openHarmony'
  | 'mac'
  | 'windows'
  | 'linux'
  | 'aix'
  | 'freebsd'
  | 'haiku'
  | 'openbsd'
  | 'sunos'
  | 'cygwin'
  | 'netbsd'
  | 'other';
```

**返回值**: `"ios" | "android" | "openHarmony" | "mac" | "windows" | "linux" | "aix" | "freebsd" | "haiku" | "openbsd" | "sunos" | "cygwin" | "netbsd" | "other"`

**示例**

```ts
import { getOsType } from '@cmtlyt/base';
// import { getOsType } from '@cmtlyt/base/utils/getData';
getOsType(); // ios
```

## getUserAgent

获取用户代理

**类型声明**

```ts
function getUserAgent(): string;
```

**返回值**: `string`

**示例**

```ts
import { getUserAgent } from '@cmtlyt/base';
// import { getUserAgent } from '@cmtlyt/base/utils/getData';

getUserAgent(); // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
```

## getDeviceInfo

获取设备信息

**类型声明**

```ts
function getDeviceInfo(): {
  appName: string;
  appVersion: string;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  platform: string;
  userAgent: string;
};
```

**返回值**: `{ appName: string; appVersion: string; screenWidth: number; screenHeight: number; devicePixelRatio: number; platform: string; userAgent: string; }`

**示例**

```ts
import { getDeviceInfo } from '@cmtlyt/base';
// import { getDeviceInfo } from '@cmtlyt/base/utils/getData';

getDeviceInfo(); // { appName: "Chrome", appVersion: "120.0.0.0", screenWidth: 1440, screenHeight: 900, devicePixelRatio: 2, platform: "macOS", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.
```

## safeGetGlobal

安全获取全局变量

**类型声明**

```ts
function safeGetGlobal(): any;
```

**返回值**: `any`

**示例**

```ts
import { safeGetGlobal } from '@cmtlyt/base';
// import { safeGetGlobal } from '@cmtlyt/base/utils/getData';

// 浏览器
safeGetGlobal(); // window
// node
safeGetGlobal(); // global
// 小程序
safeGetGlobal(); // my
```

## getType

获取值类型

**类型声明**

```ts
function getType(value: any): string;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `string`

**示例**

```ts
import { getType } from '@cmtlyt/base';
// import { getType } from '@cmtlyt/base/utils/getData';

getType(NaN); // 'number'
getType(undefined); // 'undefined'
getType(0); // 'number'
getType(''); // 'string'
getType([]); // 'array'
getType({}); // 'object'
getType(() => {}); // 'function'
getType(Promise.resolve()); // 'promise'
getType({ then() {} }); // 'object'
```
