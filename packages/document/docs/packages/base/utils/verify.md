# 校验相关方法

## isNull

判断是否为 null

**类型声明**

```ts
function isNull(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isNull } from '@cmtlyt/base';
// import { isNull } from '@cmtlyt/base/utils/verify';

isNull(null); // true
isNull(undefined); // true
isNull(0); // false
isNull(''); // false
isNull([]); // false
isNull({}); // false
isNull(() => {}); // false
isNull(Promise.resolve()); // false
```

## isNaN

判断是否为 NaN

**类型声明**

```ts
function isNaN(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isNaN } from '@cmtlyt/base';
// import { isNaN } from '@cmtlyt/base/utils/verify';

isNaN(NaN); // true
isNaN(undefined); // false
isNaN(0); // false
isNaN(''); // false
isNaN([]); // false
isNaN({}); // false
isNaN(() => {}); // false
isNaN(Promise.resolve()); // false
```

## isNumber

判断是否为数字

**类型声明**

```ts
function isNumber(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isNumber } from '@cmtlyt/base';
// import { isNumber } from '@cmtlyt/base/utils/verify';

isNumber(NaN); // true
isNumber(undefined); // false
isNumber(0); // true
isNumber(''); // false
isNumber([]); // false
isNumber({}); // false
isNumber(() => {}); // false
isNumber(Promise.resolve()); // false
```

## isPromise

判断是否为 Promise

**类型声明**

```ts
function isPromise(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isPromise } from '@cmtlyt/base';
// import { isPromise } from '@cmtlyt/base/utils/verify';

isPromise(Promise.resolve()); // true
isPromise(undefined); // false
isPromise(0); // false
isPromise(''); // false
isPromise([]); // false
isPromise({}); // false
isPromise(() => {}); // false
isPromise(NaN); // false
isPromise({ then() {} }); // true
```

## isEmpty

判断是否为空

**类型声明**

```ts
function isEmpty(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isEmpty } from '@cmtlyt/base';
// import { isEmpty } from '@cmtlyt/base/utils/verify';

isEmpty(NaN); // true
isEmpty(undefined); // true
isEmpty(0); // false
isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(() => {}); // false
isEmpty(Promise.resolve()); // false
isEmpty({ then() {} }); // false
isEmpty(new Set()); // true
isEmpty(new Set([1])); // false
```

## isFile

判断是否为文件

**类型声明**

```ts
function isFile(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isFile } from '@cmtlyt/base';
// import { isFile } from '@cmtlyt/base/utils/verify';

isFile(new File([], 'test.txt')); // true
isFile(new Blob([], { type: 'text/plain' })); // false
```

## isBlob

判断是否为 Blob

**类型声明**

```ts
function isBlob(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isBlob } from '@cmtlyt/base';
// import { isBlob } from '@cmtlyt/base/utils/verify';

isBlob(new File([], 'test.txt')); // false
isBlob(new Blob([], { type: 'text/plain' })); // true
```

## isHttpUrlString

判断是否为 http 链接字符串

**类型声明**

```ts
function isHttpUrlString(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isHttpUrlString } from '@cmtlyt/base';
// import { isHttpUrlString } from '@cmtlyt/base/utils/verify';

isHttpUrlString('https://cmtlyt.com'); // false
isHttpUrlString('http://cmtlyt.com'); // true
isHttpUrlString('//cmtlyt.com'); // true
isHttpUrlString('ftp://cmtlyt.com'); // false
isHttpUrlString('file://cmtlyt.com'); // false
isHttpUrlString('mailto://cmtlyt.com'); // false
isHttpUrlString('tel://cmtlyt.com'); // false
isHttpUrlString('data://cmtlyt.com'); // false
```

## isBlobUrlString

判断是否为 blob 链接字符串

**类型声明**

```ts
function isBlobUrlString(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isBlobUrlString } from '@cmtlyt/base';
// import { isBlobUrlString } from '@cmtlyt/base/utils/verify';

isBlobUrlString('blob:https://cmtlyt.com'); // true
isBlobUrlString('blob:http://cmtlyt.com'); // true
isBlobUrlString('blob://cmtlyt.com'); // true
isBlobUrlString('blob:ftp://cmtlyt.com'); // true
isBlobUrlString('blob:file://cmtlyt.com'); // true
isBlobUrlString('mailto://cmtlyt.com'); // false
isBlobUrlString('tel://cmtlyt.com'); // false
isBlobUrlString('data://cmtlyt.com'); // false
```

## isDataUrlString

判断是否为 data 链接字符串

**类型声明**

```ts
function isDataUrlString(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isDataUrlString } from '@cmtlyt/base';
// import { isDataUrlString } from '@cmtlyt/base/utils/verify';

isDataUrlString('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D'); // true
```

## isUrl

判断是否为 url

**类型声明**

```ts
function isUrl(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isUrl } from '@cmtlyt/base';
// import { isUrl } from '@cmtlyt/base/utils/verify';

isUrl('https://cmtlyt.com'); // true
isUrl('http://cmtlyt.com'); // true
isUrl('//cmtlyt.com'); // true
isUrl('ftp://cmtlyt.com'); // false
isUrl('file://cmtlyt.com'); // false
isUrl('mailto://cmtlyt.com'); // false
isUrl('tel://cmtlyt.com'); // false
isUrl('data://cmtlyt.com'); // true
isUrl('blob:https://cmtlyt.com'); // true
isUrl('blob:http://cmtlyt.com'); // true
isUrl('blob://cmtlyt.com'); // true
isUrl('blob:ftp://cmtlyt.com'); // true
isUrl('blob:file://cmtlyt.com'); // true
isUrl('mailto://cmtlyt.com'); // false
isUrl('tel://cmtlyt.com'); // false
isUrl('data://cmtlyt.com'); // true
isUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D'); // true
```

## isAsyncFunc

判断是否为异步函数

**类型声明**

```ts
function isAsyncFunc(value: any): boolean;
```

**参数**

| 必填 | 参数名 | 类型 | 描述       | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
|  \*  | value  | any  | 待判断的值 | -      |

**返回值**: `boolean`

**示例**

```ts
import { isAsyncFunc } from '@cmtlyt/base';
// import { isAsyncFunc } from '@cmtlyt/base/utils/verify';

isAsyncFunc(async () => {}); // true
isAsyncFunc(() => {}); // false
isAsyncFunc(async function () {}); // true
isAsyncFunc(function () {}); // false
isAsyncFunc(class {}); // false
isAsyncFunc(Promise.resolve()); // false
isAsyncFunc({ then() {} }); // false
```

## isUndef

判断是否为 undefined

**类型声明**

```ts
function isUndef(value: any): boolean;
```

**参数**
| 必填 | 参数名 | 类型 | 描述 | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
| \* | value | any | 待判断的值 | - |

**返回值**: `boolean`

**示例**

```ts
import { isUndef } from '@cmtlyt/base';
// import { isUndef } from '@cmtlyt/base/utils/verify';

isUndef(undefined); // true
isUndef(void 0); // false
isUndef(null); // false
isUndef(0); // false
isUndef(''); // false
isUndef([]); // false
isUndef({}); // false
isUndef(() => {}); // false
isUndef(Promise.resolve()); // false
```

## isString

判断是否为字符串

**类型声明**

```ts
function isString(value: any): boolean;
```

**参数**
| 必填 | 参数名 | 类型 | 描述 | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
| \* | value | any | 待判断的值 | - |

**返回值**: `boolean`

**示例**

```ts
import { isString } from '@cmtlyt/base';
// import { isString } from '@cmtlyt/base/utils/verify';

isString(NaN); // false
isString(undefined); // false
isString(0); // false
isString(''); // true
isString([]); // false
isString({}); // false
isString(() => {}); // false
isString(Promise.resolve()); // false
```

## isHttpsUrlString

判断是否为 https 链接字符串

**类型声明**

```ts
function isHttpsUrlString(value: any): boolean;
```

**参数**
| 必填 | 参数名 | 类型 | 描述 | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
| \* | value | any | 待判断的值 | - |

**返回值**: `boolean`

**示例**

```ts
import { isHttpsUrlString } from '@cmtlyt/base';
// import { isHttpsUrlString } from '@cmtlyt/base/utils/verify';
isHttpsUrlString('https://cmtlyt.com'); // true
isHttpsUrlString('http://cmtlyt.com'); // false
isHttpsUrlString('//cmtlyt.com'); // false
isHttpsUrlString('ftp://cmtlyt.com'); // false
isHttpsUrlString('file://cmtlyt.com'); // false
isHttpsUrlString('mailto://cmtlyt.com'); // false
isHttpsUrlString('tel://cmtlyt.com'); // false
```

## isTrue

判断是否为 true

**类型声明**

```ts
function isTrue(value: any): boolean;
```

**参数**
| 必填 | 参数名 | 类型 | 描述 | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
| \* | value | any | 待判断的值 | - |
**返回值**: `boolean`
**示例**

```ts
import { isTrue } from '@cmtlyt/base';
// import { isTrue } from '@cmtlyt/base/utils/verify';
isTrue(true); // true
isTrue(false); // false
isTrue('true'); // true
isTrue('True'); // true
isTrue(0); // false
isTrue(''); // false
isTrue([]); // false
isTrue({}); // false
isTrue(() => {}); // false
isTrue(Promise.resolve()); // false
isTrue('123'); // false
isTrue(123); // false
```

## isFalse

判断是否为 false

**类型声明**

```ts
function isFalse(value: any): boolean;
```

**参数**
| 必填 | 参数名 | 类型 | 描述 | 默认值 |
| :--: | ------ | ---- | ---------- | ------ |
| \* | value | any | 待判断的值 | - |
**返回值**: `boolean`
**示例**

```ts
import { isFalse } from '@cmtlyt/base';
// import { isFalse } from '@cmtlyt/base/utils/verify';
isFalse(true); // false
isFalse(false); // true
isFalse('false'); // true
isFalse('False'); // true
isFalse('true'); // false
isFalse('True'); // false
isFalse(0); // false
isFalse(''); // false
isFalse([]); // false
isFalse({}); // false
isFalse(() => {}); // false
isFalse(Promise.resolve()); // false
isFalse('123'); // false
isFalse(123); // false
```

## isInIframe

判断是否在 iframe 中

**类型声明**

```ts
function isInIframe(): boolean;
```

**返回值**: `boolean`

**示例**

```ts
import { isInIframe } from '@cmtlyt/base';
// import { isInIframe } from '@cmtlyt/base/utils/verify';

isInIframe(); // false
```
