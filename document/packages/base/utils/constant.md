# 常量

## EMPTY

空对象

**类型声明**

```ts
const EMPTY: symbol | Object;
```

**示例**

```ts
import { EMPTY } from '@cmtlyt/base';
// import { EMPTY } from '@cmtlyt/base/common/constant';

const obj = {
  a: 1,
  b: 2,
};
obj === EMPTY; // false
EMPTY === EMPTY; // true
```
