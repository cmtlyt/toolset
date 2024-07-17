import { deepClone, type TObject } from '@cmtlyt/base';
import { decodeDataSchema, encodeDataSchema } from '@cmtlyt/json-schema';
import { unzipSync, createZip } from '@cmtlyt/string-zip';

interface BaseStorageOptions {
  dbName: string;
  autoSaveDelay: number;
  zipKeyLength: number;
}

export type StorageBaseOptions = Partial<BaseStorageOptions>;

export type ExtendStorageBaseOptions<T extends TObject<any> = Record<string, any>> = Partial<BaseStorageOptions> & T;

const zip = createZip({ reuse: true });

function mormalizeConfig(options: Partial<BaseStorageOptions> = {}): BaseStorageOptions {
  return {
    dbName: 'cl-storage',
    autoSaveDelay: 1000 * 60 * 5,
    zipKeyLength: 6,
    ...options,
  };
}

export abstract class BaseStorage {
  #_cache: Record<string, any> = {};
  #_initPromise: Promise<void>;

  protected config = {} as BaseStorageOptions;

  constructor(options?: Partial<BaseStorageOptions>) {
    this.config = mormalizeConfig(options);
    this.#_initPromise = new Promise((resolve, reject) => {
      this._createHook(deepClone(this.config));
      (async () => {
        try {
          const initialData = await this.init();
          if (typeof initialData === 'string') {
            this.#_cache = decodeDataSchema(unzipSync(initialData));
          } else {
            this.#_cache = initialData || {};
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      })();
      this._createdHook();
    });
    this._createAutoSaveInterval();
  }

  private _createAutoSaveInterval() {
    if (this.config.autoSaveDelay < 1) return;
    setTimeout(async () => {
      const dataSchema = await this.getDataSchema();
      this.autoSave(dataSchema);
      this._createAutoSaveInterval();
    }, this.config.autoSaveDelay);
  }

  get length() {
    return Object.keys(this.#_cache).length;
  }

  protected abstract init(): (Record<string, any> | string) | Promise<Record<string, any> | string>;

  protected _createHook(_config: BaseStorageOptions & Record<string, any>): any {}
  protected _createdHook(): any {}
  protected _setItemBeforeHook(_key: string, _value: any): any | void {}
  protected _setItemAfterHook(_key: string, _value: any): any {}
  protected _getItemBeforeHook(_key: string): any {}
  protected _getItemAfterHook(_key: string, _value: any): any | void {}
  protected _removeItemBeforeHook(_key: string): any {}
  protected _removeItemAfterHook(_key: string): any {}
  protected _clearBeforeHook(): any {}
  protected _clearAfterHook(): any {}
  protected _getKeysBeforeHook(): any {}
  protected _getKeysAfterHook(_keys: string[]): string[] | void {}

  protected autoSave(_data: string): void {}

  protected async getDataSchema() {
    return zip(encodeDataSchema(this.#_cache), this.config.zipKeyLength);
  }

  async setItem(key: string, value: any) {
    return this.#_initPromise.then(() => {
      value = this._setItemBeforeHook(key, value) ?? value;
      this.#_cache[key] = value;
      this._setItemAfterHook(key, value);
    });
  }

  async getItem(key: string) {
    return this.#_initPromise.then(() => {
      this._getItemBeforeHook(key);
      let value = this.#_cache[key];
      value = this._getItemAfterHook(key, value) ?? value;
      return value;
    });
  }

  async removeItem(key: string) {
    return this.#_initPromise.then(() => {
      this._removeItemBeforeHook(key);
      delete this.#_cache[key];
      this._removeItemAfterHook(key);
    });
  }

  async clear() {
    return this.#_initPromise.then(() => {
      this._clearBeforeHook();
      this.#_cache = {};
      this._clearAfterHook();
    });
  }

  async getKeys() {
    return this.#_initPromise.then(() => {
      this._getKeysBeforeHook();
      let keys = Object.keys(this.#_cache);
      keys = (this._getKeysAfterHook(keys) as string[]) ?? keys;
      return keys;
    });
  }
}
