import { caniuse, TRequired, warning } from '@cmtlyt/base';

import { BaseStorage, StorageBaseOptions } from './base';
import { MemoryStorage } from './memory';

interface SessionStorageOptions extends TRequired<StorageBaseOptions, 'dbName'> {}

export class SessionStorage extends BaseStorage {
  name = 'SessionStorage';

  constructor(options: SessionStorageOptions) {
    if (!caniuse('sessionStorage')) {
      warning('当前浏览器不支持 sessionStorage, 已自动降级为 MemaryStorage');
      // @ts-expect-error fullback to MemoryStorage
      return new MemoryStorage(options);
    }
    super({ dbName: 'cl-storage', autoSaveDelay: 1000 * 60 * 1, ...options });
  }

  protected init() {
    const dbName = this.config.dbName;
    return sessionStorage.getItem(dbName) || {};
  }

  protected autoSave(data: string): void {
    const dbName = this.config.dbName;
    sessionStorage.setItem(dbName, data);
  }
}
