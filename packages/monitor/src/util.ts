import type { TObject } from '@cmtlyt/base';
import type { MonitorConfig, OriginalOnLogBeforeEvent } from './type';
import { pick } from '@cmtlyt/base';
import { createLogger, type Logger } from '@cmtlyt/logger';

import { type Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { logCache } from './store';

export function createMonitorLogger<T extends string, E extends TObject<any>>(config: MonitorConfig<T, E>) {
  const { loggerOptions, reportStrategy, reportLog, formatLogInfo = v => v, formatReportInfo = v => v } = config;
  const { getPrintFunc } = loggerOptions;
  return createLogger({
    ...loggerOptions,
    // @ts-expect-error nocheck config
    getPrintFunc: getPrintFunc?.bind(config),
    // @ts-expect-error nocheck event
    onLogBefore(event: OriginalOnLogBeforeEvent<T>) {
      // 获取格式化的日志信息
      try {
      // @ts-expect-error nocheck config
        const logInfo = formatLogInfo.call(config, { config, logInfo: event });
        const needReport = (reportStrategy && reportStrategy.call(config, logInfo)) ?? true;
        if (!needReport)
          return;
        const reportInfo = formatReportInfo.call(config, logInfo);
        reportLog && reportLog.call(config, reportInfo);
      }
      catch (error) {
        if (event.kind === 'error')
          return console.error('formatLogInfo error', error);
        logCache.push({ kind: 'error', message: 'formatLogInfo error', extra: { timestamp: Date.now(), error } });
      }
    },
  });
}

function saveInfo(info: Metric) {
  logCache.push({
    kind: 'system',
    message: 'performanceInfo',
    extra: { timestamp: Date.now(), ...pick(['name', 'value', 'rating', 'delta', 'navigationType'], info) },
  });
}

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
    // @ts-expect-error nocheck
    logger[data.kind](data.message, data.extra);
  });
}

export function listenerCacheChange(logger: Logger) {
  logCache.onChange((data) => {
    // @ts-expect-error nocheck
    logger[data.kind](data.message, data.extra);
  });
}

export function getTargetSelector(target?: HTMLElement): string {
  if (!target)
    return '';
  if (target.id)
    return `#${target.id}`;
  let targetSelector = target.className;
  if (targetSelector) {
    try {
      if (typeof targetSelector !== 'string')
        targetSelector = '';
      else targetSelector = `.${targetSelector.split(' ').join('.')}`;
    }
    catch {
      targetSelector = '';
    }
  }
  else if (target.parentElement) {
    const index = Array.from(target.parentElement.children).indexOf(target);
    const tagName = target.tagName.toLowerCase();
    targetSelector = `${tagName}${tagName === 'body' ? '' : `:nth-child(${index + 1})`}`;
  }
  // @ts-expect-error nocheck dom
  const parentSelector = getTargetSelector(target.parentElement);
  if (parentSelector)
    return `${parentSelector}>${targetSelector}`;
  return targetSelector;
}
