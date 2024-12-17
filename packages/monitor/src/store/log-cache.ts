import type { Kind } from '@cmtlyt/logger';
import type { TObject } from '@cmtlyt/base';

import { MonitorKind } from '../type';

interface LogData {
  kind: Kind | MonitorKind;
  message: string;
  extra: {
    timestamp: number;
  } & TObject<any>;
}

interface CacheItem {
  data: LogData;
  next: CacheItem;
}

// 用于缓存日志信息
class LogCache {
  private head: CacheItem = null;
  private tail: CacheItem = null;
  private listenerSet: Set<(data: LogData) => void> = new Set();

  push(data: LogData) {
    const node = { data, next: null };
    this.listenerSet.forEach((listener) => listener(data));
    // 如果有监听器, 不进行存储
    if (this.listenerSet.size) return;
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    }
  }
  pop(): LogData {
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
    return result;
  }
  onChange(callback: (data: LogData) => void) {
    this.listenerSet.add(callback);
  }
}

export const logCache = new LogCache();
