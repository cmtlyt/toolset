import type { Kind } from '@cmtlyt/logger';
import type { MonitorConfig, MonitorKind, MonitorLogger } from './type';
import { initErrorListener, initEventListener } from './listener';
import { setStore } from './store';
import { batchReportLog, createMonitorLogger, listenerCacheChange, savePagePerformanceInfo } from './util';

type TKind = MonitorKind | Kind;

export { TKind as Kind, MonitorLogger };

// 初始化错误监听
initErrorListener();

/**
 * 创建监控
 */
// @ts-expect-error 默认值
export function createMonitor<ExtendLogType extends string = MonitorKind, ExtendConfig extends TObject<any> = unknown>(
  config: MonitorConfig<ExtendLogType, ExtendConfig>,
): MonitorLogger<ExtendLogType> {
  // 存储配置
  setStore('monitorConfig', config);
  // 获取性能数据
  savePagePerformanceInfo();
  // 初始化事件监听
  initEventListener(config.rootElement, config.listenerEvents, config.needListenerCapture);
  // 初始化日志输出对象
  const logger = createMonitorLogger(config);
  // 输出所有缓存的日志
  batchReportLog(logger);
  // 监听日志缓存变化
  listenerCacheChange(logger);
  // 返回日志输出工具
  return logger;
}
