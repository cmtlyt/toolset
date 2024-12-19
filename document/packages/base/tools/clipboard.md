# 剪切板

## clipboard - (object)

剪切板对象, 可以通过该对象的方法操作剪切板

### clipboard.copy - (function)

复制文本

**参数**

| 必填 | 参数名 | 说明           | 类型   | 默认值 |
| :--: | ------ | -------------- | ------ | ------ |
|  是  | text   | 需要复制的文本 | string |        |

**返回值**: void

### clipboard.paste - (function)

读取剪切板中的文本

**参数**

无

**返回值**: `Promise<string>`

### clipboard.clear - (function)

清空剪切板

**返回值**: void

### clipboard.isCopyable - (attribute)

是否可复制

**返回值**: boolean

### clipboard.isPasteable - (attribute)

是否可粘贴

**返回值**: boolean

### clipboard.isClearable - (attribute)

是否可清空

**返回值**: boolean
