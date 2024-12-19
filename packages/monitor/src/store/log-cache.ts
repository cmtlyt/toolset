import type { TObject } from '@cmtlyt/base';
import type { Kind } from '@cmtlyt/logger';
import type { MonitorKind } from '../type';

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
    const node: CacheItem = { data, next: null };
    this.listenerSet.forEach(listener => listener(data));
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
