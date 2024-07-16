import type { TObject } from '@cmtlyt/base';
import { encodeDataSchema } from '@cmtlyt/json-schema';
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
    dbName: 'cl-cache',
    autoSaveDelay: 1000 * 60 * 5,
    zipKeyLength: 6,
    ...options,
  };
}

export abstract class BaseStorage {
  #_cache: Record<string, any> = {};
  #_config = {} as BaseStorageOptions;

  constructor(options?: Partial<BaseStorageOptions>) {
    this._createHook();
    this.#_config = mormalizeConfig(options);
    this.#_cache = (() => {
      const initialData = this.init();
      if (typeof initialData === 'string') return JSON.parse(unzipSync(initialData));
      return initialData || {};
    })();
    this._createAutoSaveInterval();
    this._createdHook();
  }

  private _createAutoSaveInterval() {
    if (this.#_config.autoSaveDelay < 1) return;
    setInterval(async () => {
      const dataSchema = await this.getDataSchema();
      this.autoSave(dataSchema);
    }, this.#_config.autoSaveDelay);
  }

  get length() {
    return Object.keys(this.#_cache).length;
  }

  protected abstract init(): Record<string, any> | string;
  protected _createHook(): any {}
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
    return zip(encodeDataSchema(this.#_cache), this.#_config.zipKeyLength);
  }

  setItem(key: string, value: any) {
    value = this._setItemBeforeHook(key, value) ?? value;
    this.#_cache[key] = value;
    this._setItemAfterHook(key, value);
  }

  getItem(key: string) {
    this._getItemBeforeHook(key);
    let value = this.#_cache[key];
    value = this._getItemAfterHook(key, value) ?? value;
    return value;
  }

  removeItem(key: string) {
    this._removeItemBeforeHook(key);
    delete this.#_cache[key];
    this._removeItemAfterHook(key);
  }

  clear() {
    this._clearBeforeHook();
    this.#_cache = {};
    this._clearAfterHook();
  }

  getKeys() {
    this._getKeysBeforeHook();
    let keys = Object.keys(this.#_cache);
    keys = (this._getKeysAfterHook(keys) as string[]) ?? keys;
    return keys;
  }
}
