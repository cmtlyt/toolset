import type { TExclude } from '@cmtlyt/base';
import type { StorageBaseOptions } from './base';
import { warning } from '@cmtlyt/base';
import { BaseStorage } from './base';

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
