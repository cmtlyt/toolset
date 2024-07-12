export interface IStorageController {
  length: number;
  key(): Promise<string[]>;
  clear(): Promise<void>;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class BaseStorage {
  constructor() {}
}
