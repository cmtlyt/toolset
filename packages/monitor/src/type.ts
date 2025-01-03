import type { TExclude, TObject } from '@cmtlyt/base';
import type { Kind, Logger, LoggerOptions as OrigianlLoggerOptions } from '@cmtlyt/logger';

export type OriginalOnLogBefore<T extends string> = Required<OrigianlLoggerOptions<T, unknown>>['onLogBefore'];

export type OriginalOnLogBeforeEvent<T extends string> = Parameters<OriginalOnLogBefore<T>>[0];

export type LoggerOptions<T extends string> = TExclude<OrigianlLoggerOptions<T>, 'onLogBefore'>;

export type MonitorKind = 'system' | 'systemError' | 'event';

export interface LogInfo<T extends string, E extends TObject<any>> {
  /** 日志信息 */
  logInfo: OriginalOnLogBeforeEvent<T>;
  config: MonitorConfig<T, E>;
}

export interface ExtendLoggerOptions<T extends string, E extends TObject<any>> extends TExclude<LoggerOptions<T>, 'getPrintFunc'> {
  getPrintFunc?: (this: MonitorConfig<T, E>, logInfo: T | Kind) => ((...args: unknown[]) => void) | null | undefined;
}

export interface GenerateExtraInfo {
  event: Event;
  systemExtra: {
    timestamp: number;
    isCapture: boolean;
    selector: string;
  };
}

export interface ListenEventConfig<This> {
  events?: (keyof WindowEventMap)[];
  needListenCapture?: boolean;
  /**
   * 生成额外信息, 该格外信息会参与日志的格式化, 所以不允许出现循环引用
   */
  generateExtra?: (this: This, info: GenerateExtraInfo) => TObject<any>;
}

export interface BaseMonitorConfig<
  UserExtendLogType extends string = MonitorKind,
  // @ts-expect-error 默认值
  ExtendConfig extends TObject<any> = unknown,
  ExtendLogType extends string = UserExtendLogType | MonitorKind,
  This = MonitorConfig<ExtendLogType, ExtendConfig>,
> {
  /**
   * 事件监听的根元素
   * @default window
   */
  rootElement?: HTMLElement | Window;
  /** 日志输出工具配置 */
  loggerOptions: ExtendLoggerOptions<ExtendLogType, ExtendConfig>;
  /** 监控事件配置 */
  listenEventConfig?: ListenEventConfig<This>;
  /** 日志格式化 */
  formatLogInfo?: (this: This, info: LogInfo<Kind | ExtendLogType, ExtendConfig>) => any;
  /** 日志上报策略 */
  reportStrategy?: (this: This, info: any) => boolean;
  /** 日志上报前处理 */
  formatReportInfo?: (this: This, info: any) => any;
  /** 日志上报 */
  reportLog?: (this: This, info: any) => void;
}

export type MonitorConfig<
  ExtendLogType extends string = MonitorKind,
  // @ts-expect-error 默认值
  ExtendConfig extends TObject<any> = unknown,
> = BaseMonitorConfig<ExtendLogType, ExtendConfig> & ExtendConfig;

export type MonitorLogger<ET extends string = MonitorKind> = Logger &
  Record<ET | MonitorKind, (...args: unknown[]) => void>;
