import { TExclude, warning } from '@cmtlyt/base';

import { BaseStorage, StorageBaseOptions } from './base';

interface MemoryStorageOptions extends TExclude<StorageBaseOptions, 'autoSaveDelay'> {}

export class MemoryStorage extends BaseStorage {
  name = 'MemoryStorage';

  constructor(options: MemoryStorageOptions) {
    super({ ...options, autoSaveDelay: 0 });
  }

  protected init() {
    return {};
  }

  protected autoSave(_data: string): void {
    warning('MemaryStorage(内存存储) 不支持保存数据');
  }
}
