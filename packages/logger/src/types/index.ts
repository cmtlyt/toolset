export type Kind = 'info' | 'warn' | 'error' | 'debug' | 'success';

export type LoggerConfigObj = Record<Kind, LoggerConfig>;

export type Logger = Record<Kind, (...args: unknown[]) => void>;

export interface StyleConfig {
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

export interface LoggerConfig<T extends string = Kind> extends StyleConfig {
  kind: Kind | T;
  inherit?: Kind | T;
  noOutput?: boolean;
  needTrace?: boolean;
}

export interface ContentInfo {
  text: string;
  length: number;
  hasChinese: boolean;
}

export interface LogEvent<T extends string = Kind> {
  kind: Kind | T;
  messages: unknown[];
  logConf: LoggerConfig<T>;
  preventDefault: () => void;
}

export type LoggerOptions<T extends string = Kind, E = unknown> = {
  needTrace?: boolean;
  noOutput?: boolean;
  logConfig?: Partial<LoggerConfigObj> & { [K in T]: LoggerConfig<T> };
  /** 该配置会覆盖 getPrintFunc 配置, 推荐优先使用 getPrintFunc */
  printFunc?: ((...args: unknown[]) => void) | null;
  getPrintFunc?: (this: LoggerOptions<T, E>, kind: Kind | T) => ((...args: unknown[]) => void) | null;
  onLogBefore?: (this: LoggerOptions<T, E>, event: LogEvent<T>) => void;
} & E;

export enum LogThrow {
  PREVENT_DEFAULT = 'cl:logger:preventDefault',
  NO_OUTPUT = 'cl:logger:noOutput',
}
