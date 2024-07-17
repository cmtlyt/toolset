import { caniuse, TRequired, warning } from '@cmtlyt/base';

import { BaseStorage, StorageBaseOptions } from './base';
import { SessionStorage } from './session';

interface LocalStorageOptions extends TRequired<StorageBaseOptions, 'dbName'> {}

export class LocalStorage extends BaseStorage {
  constructor(options: LocalStorageOptions) {
    if (caniuse('localStorage')) {
      warning('当前浏览器不支持 localStorage, 已自动降级为 SessionStorage');
      // @ts-expect-error fullback to SessionStorage
      return new SessionStorage(options);
    }
    super({ dbName: 'cl-storage', autoSaveDelay: 1000 * 60 * 1, ...options });
  }

  protected init() {
    const dbName = this.config.dbName;
    return localStorage.getItem(dbName) || {};
  }

  protected autoSave(data: string): void {
    const dbName = this.config.dbName;
    localStorage.setItem(dbName, data);
  }
}
