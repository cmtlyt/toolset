# 日志管理

## Logger - (class)

日志管理器

### 静态方法

```ts
function getInstance(options: LoggerOptions): Logger;
```

### 参数

| 必填 | 参数名                  | 说明        | 类型                        | 默认值                                       |
| :--- | :---------------------- | :---------- | :-------------------------- | :------------------------------------------- |
|      | options                 | 日志配置    | object                      |                                              |
|      | options.showModuleIds   | 展示模块 id | any[]                       | []                                           |
|      | options.showMethods     | 展示方法    | string[]                    | ['log', 'info', 'warn', 'error', 'debug']    |
|      | options.ignoreMessage   | 忽略的消息  | string[]\|IgnoreMessageFunc | []                                           |
|      | options.messageTemplate | 消息模板    | string\|MessageTemplateFunc | `#[date] #[moduleId]-#[method]:=>#[message]` |
|      | options.controller      | 日志控制器  | Controller                  | `console`                                    |

:::details 类型扩展

**IgnoreMessageFunc**

**类型声明**

```ts
type IgnoreMessageFunc = (message: string) => boolean;
```

---

**MessageTemplateFunc**

**类型声明**

```ts
type MessageTemplateFunc = (
  data: any[],
  moduleId: ModuleId,
  method: string,
  date: Date
) => string | any[];
```

---

**Controller**

`options.controller` 必须要实现 `Controller` 接口

**类型声明**

```ts
type ControllerFunc = (moduleId: any, ...args: any[]) => void;

interface Controller {
  log: ControllerFunc;
  info: ControllerFunc;
  warn: ControllerFunc;
  error: ControllerFunc;
  debug: ControllerFunc;
  onOutput?: (logInfo: LogInfo) => void;
}
```

:::

### 返回值

`Logger` 实例

### 实例方法

```ts
interface Logger {
  log(moduleId: any, method: string, ...args: any[]): void;
  info(moduleId: any, method: string, ...args: any[]): void;
  warn(moduleId: any, method: string, ...args: any[]): void;
  error(moduleId: any, method: string, ...args: any[]): void;
  debug(moduleId: any, method: string, ...args: any[]): void;
}
```
