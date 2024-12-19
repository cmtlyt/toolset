# @cmtlyt/logger

<!-- import { Kind, Logger, LoggerOptions } from './types';
export declare function createLogger<T extends string, E = unknown>(options?: LoggerOptions<T, E>): Logger & Record<T, (...args: unknown[]) => void>;
export declare const logger: Logger & Record<string, (...args: unknown[]) => void>;
export { Kind, Logger }; -->

:::details 类型补充

```ts
interface LogEvent<T extends string = ''> {
  kind: Kind | T;
  messages: unknown[];
  logConf: LoggerConfig<T>;
  preventDefault: () => void;
}

interface StyleConfig {
  tagColor?: string;
  tagBg?: string;
  contentColor?: string;
  contentBg?: string;
  borderColor?: string;
  style?: (config: LoggerConfig) => {
    tagStyle: string;
    contentStyle: string;
  };
}

interface LoggerConfig<T extends string = ''> extends StyleConfig {
  kind: Kind | T;
  inherit?: Kind | T;
  noOutput?: boolean;
  needTrace?: boolean;
}

type LoggerConfigObj = Record<Kind, LoggerConfig>;

type LoggerOptions<T extends string = '', E = unknown> = {
  needTrace?: boolean;
  noOutput?: boolean;
  logConfig?: Partial<LoggerConfigObj> & { [key in T]: LoggerConfig<T> };
  printFunc?: ((...args: unknown[]) => void) | null;
  getPrintFunc?: (this: LoggerOptions<T, E>, kind: Kind | T) => ((...args: unknown[]) => void) | null;
  onLogBefore?: (this: LoggerOptions<T, E>, event: LogEvent<T>) => void;
} & E;

export type Kind = 'info' | 'warn' | 'error' | 'debug' | 'success';

export type Logger = Record<Kind, (...args: unknown[]) => void>;
```

:::

## logger

默认 logger 实例

> 只有日志输出的样式

```ts
const logger: Logger & Record<string, (...args: unknown[]) => void>;
```

## createLogger

创建一个 logger 实例

**类型声明**

```ts
function createLogger<T extends string, E = unknown>(
  options?: LoggerOptions<T, E>,
): Logger & Record<T, (...args: unknown[]) => void>;
```

**参数**
| 必填 | 参数 | 说明 | 类型 | 默认值 |
| :---: | :--- | :--- | :--- | :--- |
| | options | logger 配置 | LoggerOptions\<T, E> | - |
| | options.needTrace | 是否需要打印调用栈 | boolean | false |
| | options.noOutput | 是否需要输出日志 | boolean | false |
| | options.logConfig | logger 配置 | Partial\<LoggerConfigObj> & { [key in T]: LoggerConfig\<T> } | - |
| | options.printFunc | 打印日志的函数 | ((...args: unknown[]) => void) | console.log |
| | options.getPrintFunc | 获取打印日志的函数 (优先级低于 `printFunc`) | (this: LoggerOptions\<T, E>, kind: Kind \| T) => ((...args: unknown[]) => void) | - |
| | options.onLogBefore | 日志打印前回调 | (this: LoggerOptions\<T, E>, event: LogEvent\<T>) => void | - |

**返回值:** `Logger & Record<T, (...args: unknown[]) => void>`

**实例**

```ts
type ExtendKind = 'click' | 'appear' | 'todo' | 'event' | 'expose';
type AllKind = Kind | ExtendKind;

interface LoggerExtendOptions {
  store: {
    needExposeKind: AllKind[];
  };
}

const isProd = process.env.NODE_ENV === 'production';

const logger = createLogger<ExtendKind, LoggerExtendOptions>({
  // 非生产环境下需要打印调用栈
  needTrace: !isProd,
  // 生产环境下不在控制台输出
  noOutput: isProd,
  // 自定义 logger 方法配置
  logConfig: {
    // logger.click 方法样式继承自 logger.info
    click: { kind: 'click', inherit: 'info' },
    appear: { kind: 'appear', inherit: 'info', needTrace: false },
    error: { kind: 'error', needTrace: true },
  },
  // 通过 LoggerExtendsOptions 扩展的配置项
  store: {
    needExposeKind: ['click', 'appear', 'error'],
  },
  // 生产环境下不在控制台输出 (不推荐使用该方法阻止日志输出, 如果一定要的话可以使用 `noOutput`)
  // 返回 null 的话则将输出方法转交 `getPrintFunc` 控制
  printFunc: isProd ? () => {} : null,
  // 获取打印日志的函数, 如果未配置则默认使用 console.log
  getPrintFunc(kind) {
    // 根据不同的 kind 选择不同的输出方法
    if (kind === 'click' || kind === 'error') return console.log;
    return console.debug;
  },
  // 输出到控制台之前进行一些处理
  onLogBefore(e) {
    const { needExposeKind } = this.store;
    if (isProd && needExposeKind.includes(kind)) {
      // 阻止日志输出
      e.preventDefault();
      // 日志上报逻辑
      // ...
    }
  },
});
```
