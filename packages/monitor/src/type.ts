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
  /** 监控的所有事件 */
  listenerEvents?: (keyof WindowEventMap)[];
  needListenerCapture?: boolean;
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
