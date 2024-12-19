# @cmtlyt/json-schema

:::details 类型补充

```ts
interface Schema {
  type: string;
  description: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  maxLength?: number;
  minLength?: number;
}
type TObject<T> = Record<string | number | symbol, T>;
type MockHandlerMap = {
  string: () => string;
  number: () => number;
  boolean: () => boolean;
  array: () => any[];
  object: () => {};
};
```

:::

## jsonSchemaGenerator

json schema 生成器

**类型声明**

```ts
function jsonSchemaGenerator(data: TObject<any>): Schema;
```

**参数**
| 必填 | 参数 | 说明 | 类型 | 默认值 |
| :--: | -------- | -------- | ------------------------------------------------------------ | ------ |
| \* | data | 数据 | `TObject<any>` | |

**返回值**: `Schema`

**示例**

```js
import { jsonSchemaGenerator } from '@cmtlyt/json-schema';

jsonSchemaGenerator({
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    street: 'Wall Street',
  },
});
/*
{
  type: 'object',
  description: '',
  required: ['name', 'age', 'address'],
  properties: {
    name: {
      type: 'string',
      description: '',
    },
    age: {
      type: 'number',
      description: '',
    },
    address: {
      type: 'object',
      description: '',
      required: ['city', 'street'],
      properties: {
        city: {
          type: 'string',
          description: '',
        },
        street: {
          type: 'string',
          description: '',
        },
      },
    },
  },
}
*/
```

## verifyBySchema

验证数据是否符合 schema

**类型声明**

```ts
const verifyBySchema: (
  schema: Schema,
  data: TObject<any>,
) => Promise<[boolean, { path: string; message: string }[] | null]>;
```

**参数**
| 必填 | 参数 | 说明 | 类型 | 默认值 |
| :--: | -------- | -------- | ------------------------------------------------------------ | ------ |
| \* | schema | schema | `Schema` | |
| \* | data | 数据 | `TObject<any>` | |

**返回值**: `Promise<[boolean, { path: string; message: string }[] | null]>`

**示例**

```js
import { verifyBySchema } from '@cmtlyt/json-schema';

verifyBySchema(
  {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
  {
    name: 'John',
    age: 30,
  },
);
/*
[ true, null ]
*/

verifyBySchema(
  {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
  {
    name: 123,
    age: '30',
  },
);
/*
[ false, [
  {
    path: '/name',
    message: 'Expected type string but got number',
  },
  {
    path: '/age',
    message: 'Expected type number but got string',
  },
] ]
```

## mockFromSchema

根据 schema 生成 mock 数据

**类型声明**

```ts
function mockFromSchema(schema: Schema, handlerMap?: Partial<MockHandlerMap>): any;
```

**参数**

| 必填 | 参数       | 说明       | 类型                      | 默认值 |
| :--: | ---------- | ---------- | ------------------------- | ------ |
|  \*  | schema     | schema     | `Schema`                  |        |
|      | handlerMap | 类型处理器 | `Partial<MockHandlerMap>` |        |

**返回值**: `any`

**示例**

```js
import { mockFromSchema } from '@cmtlyt/json-schema';

mockFromSchema({
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
  },
});
/*
{
  name: '',
  age: 0,
}
*/

mockFromSchema(
  {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
  {
    string: () => 'mock',
  },
);
/*
{
  name: 'mock',
  age: 0,
}
*/
```
