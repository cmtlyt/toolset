import { createLogger, type Logger } from '@cmtlyt/logger';
import { omit, pick } from '@cmtlyt/base';
import { type Metric, onFCP, onLCP, onTTFB, onCLS, onINP } from 'web-vitals';

import { logCache } from './store';
import { MonitorConfig, OriginalOnLogBeforeEvent } from './type';

/** 排除所有内置的参数 */
const EXCLUDE_PARAMS = ['loggerOptions', 'formatLogInfo', 'reportStrategy', 'reportLog'];

export function createMonitorLogger<T extends string, E>(config: MonitorConfig<T, E>) {
  const extendsConfig = omit(EXCLUDE_PARAMS, config);
  const { loggerOptions, reportStrategy, reportLog, formatLogInfo = (v) => v } = config;
  return createLogger({
    ...loggerOptions,
    ...extendsConfig,
    onLogBefore(event: OriginalOnLogBeforeEvent<T>) {
      // 获取格式化的日志信息
      const logInfo = formatLogInfo.call(config, { config, logInfo: event });
      const needReport = (reportStrategy && reportStrategy.call(config, logInfo)) ?? true;
      needReport && reportLog && reportLog.call(config, logInfo);
    },
  });
}

const saveInfo = (info: Metric) => {
  logCache.push({
    kind: 'system',
    message: 'performanceInfo',
    extra: { timestamp: Date.now(), ...pick(['name', 'value', 'rating', 'delta', 'navigationType'], info) },
  });
};

/** 获取页面性能信息 */
export function savePagePerformanceInfo() {
  onTTFB(saveInfo);
  onFCP(saveInfo);
  onLCP(saveInfo);
  onCLS(saveInfo);
  onINP(saveInfo);
}

export function batchReportLog(logger: Logger) {
  const logDatas = logCache.popAll();
  logDatas.forEach((data) => {
    logger[data.kind](data.message, data.extra);
  });
}

export function listenerCacheChange(logger: Logger) {
  logCache.onChange((data) => {
    logger[data.kind](data.message, data.extra);
  });
}

export function getTargetSelector(target?: HTMLElement): string {
  if (!target) return '';
  if (target.id) return `#${target.id}`;
  let targetSelector = target.className;
  if (targetSelector) targetSelector = `.${targetSelector.split(' ').join('.')}`;
  else if (target.parentElement) {
    const index = Array.from(target.parentElement.children).indexOf(target);
    const tagName = target.tagName.toLowerCase();
    targetSelector = `${tagName}${tagName === 'body' ? '' : `:nth-child(${index + 1})`}`;
  }
  const parentSelector = getTargetSelector(target.parentElement);
  if (parentSelector) return `${parentSelector}>${targetSelector}`;
  return targetSelector;
}
