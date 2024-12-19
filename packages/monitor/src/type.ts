import type { TExclude, TObject } from '@cmtlyt/base';
import type { Kind, Logger, LoggerOptions as OrigianlLoggerOptions } from '@cmtlyt/logger';

export type OriginalOnLogBefore<T extends string> = Required<OrigianlLoggerOptions<T, unknown>>['onLogBefore'];

export type OriginalOnLogBeforeEvent<T extends string> = Parameters<OriginalOnLogBefore<T>>[0];

export type LoggerOptions<T extends string> = TExclude<OrigianlLoggerOptions<T>, 'onLogBefore'>;

export type MonitorKind = 'system' | 'event';

export interface LogInfo<T extends string, E extends TObject<any>> {
  /** 日志信息 */
  logInfo: OriginalOnLogBeforeEvent<T>;
  config: MonitorConfig<T, E>;
}

export interface BaseMonitorConfig<
  UserExtendLogType extends string = MonitorKind,
  // @ts-expect-error 默认值
  ExtendConfig extends TObject<any> = unknown,
  ReportInfo = unknown,
  ExtendLogType extends string = UserExtendLogType | MonitorKind,
  This = MonitorConfig<ExtendLogType, ExtendConfig>,
> {
  /** 日志输出工具配置 */
  loggerOptions: LoggerOptions<ExtendLogType>;
  /** 监控的所有事件 */
  listenerEvents?: (keyof WindowEventMap)[];
  needListenerCapture?: boolean;
  /** 日志格式化 */
  formatLogInfo?: (this: This, info: LogInfo<Kind | ExtendLogType, ExtendConfig>) => ReportInfo;
  /** 日志上报策略 */
  reportStrategy?: (this: This, info: ReportInfo) => boolean;
  /** 日志上报 */
  reportLog?: (this: This, info: ReportInfo) => void;
}

export type MonitorConfig<
  ExtendLogType extends string = MonitorKind,
  // @ts-expect-error 默认值
  ExtendConfig extends TObject<any> = unknown,
> = BaseMonitorConfig<ExtendLogType, ExtendConfig> & ExtendConfig;

export type MonitorLogger<ET extends string = MonitorKind> = Logger &
  Record<ET | MonitorKind, (...args: unknown[]) => void>;
