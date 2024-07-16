import { TExclude } from '@cmtlyt/base';

import { BaseStorage, StorageBaseOptions } from './base';

interface MemaryStorageOptions extends TExclude<StorageBaseOptions, 'autoSaveDelay'> {}

export class MemaryStorage extends BaseStorage {
  constructor(options: MemaryStorageOptions) {
    super({ ...options, autoSaveDelay: 0 });
  }

  protected init() {
    return {};
  }
}
