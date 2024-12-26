import type { TObject } from '@cmtlyt/base';
import type { Kind } from '@cmtlyt/logger';
import type { MonitorKind } from '../type';
import { getStore } from '.';

interface LogData {
  kind: Kind | MonitorKind;
  message: string;
  extra: {
    timestamp: number;
  } & TObject<any>;
}

interface CacheItem {
  data: LogData;
  next: CacheItem | null;
}

// 用于缓存日志信息
class LogCache {
  private head: CacheItem | undefined | null = null;
  private tail: CacheItem | undefined | null = null;
  private listenerSet: Set<(data: LogData) => void> = new Set();

  push(data: LogData) {
    if (getStore('isUnload')) {
      // TODO: 持久化未被处理的日志
      return console.warn('页面已卸载, 无法继续记录日志, 后续会对此类日志进行持久化处理');
    }
    const node: CacheItem = { data, next: null };
    this.listenerSet.forEach(listener => listener({ ...data, extra: { ...data.extra, from: 'monitor' } }));
    // 如果有监听器, 不进行存储
    if (this.listenerSet.size)
      return;
    if (!this.head) {
      this.head = node;
      this.tail = node;
    }
    else if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    }
  }

  pop(): LogData | undefined {
    const result = this.head?.data;
    this.head = this.head?.next;
    return result;
  }

  viewCache(): LogData[] {
    const result = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.data);
      curr = curr.next;
    }
    return result;
  }

  popAll(): LogData[] {
    const result = [];
    while (this.head) {
      result.push(this.pop());
    }
    return result.filter(Boolean) as LogData[];
  }

  onChange(callback: (data: LogData) => void) {
    this.listenerSet.add(callback);
  }
}

export const logCache = new LogCache();
