import { caniuse, TRequired, warning } from '@cmtlyt/base';

import { BaseStorage, StorageBaseOptions } from './base';
import { LocalStorage } from './local';

interface IndexedDBStorageOptions extends TRequired<StorageBaseOptions, 'dbName'> {}

const fieldName = 'value';

export class IndexedDBStorage extends BaseStorage {
  #_db: IDBDatabase;

  constructor(options: IndexedDBStorageOptions) {
    if (!caniuse('indexedDB')) {
      warning('当前浏览器不支持 IndexedDB, 已自动降级为 LocalStorage');
      // @ts-expect-error fullback to LocalStorage
      return new LocalStorage(options);
    }
    super({ dbName: 'cl-storage', autoSaveDelay: 1000 * 60 * 1, ...options });
  }

  async #getValue() {
    const request = this.#_db
      .transaction([this.config.dbName], 'readonly')
      .objectStore(this.config.dbName)
      .get(fieldName);
    return new Promise((resolve, reject) => {
      request.addEventListener('error', reject);
      request.addEventListener('success', () => {
        resolve(request.result);
      });
    });
  }

  async #setValue(data: string) {
    const request = this.#_db
      .transaction([this.config.dbName], 'readwrite')
      .objectStore(this.config.dbName)
      .put(data, fieldName);
    return new Promise((resolve, reject) => {
      request.addEventListener('error', reject);
      request.addEventListener('success', () => {
        resolve(request.result);
      });
    });
  }

  protected autoSave(data: string): void {
    this.#setValue(data);
  }

  protected init() {
    const dbName = this.config.dbName;
    const request = indexedDB.open(dbName, 1);
    return new Promise((resolve, reject) => {
      request.addEventListener('error', reject);
      request.addEventListener('upgradeneeded', () => {
        const db = (this.#_db = request.result);
        if (!db.objectStoreNames.contains(dbName)) {
          db.createObjectStore(dbName);
          this.#setValue('');
        }
      });
      request.addEventListener('success', () => {
        this.#_db ??= request.result;
        this.#getValue().then(resolve, reject);
      });
    });
  }

  async forceSave() {
    return this.#setValue(await this.getDataSchema());
  }
}
