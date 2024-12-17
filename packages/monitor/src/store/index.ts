export { logCache } from './log-cache';

const store: Record<string, any> = Object.create(null);

export function getStore(key?: string) {
  return key ? store[key] : store;
}

export function setStore(key: string, data: any) {
  store[key] = data;
}

export function removeStore(key: string) {
  delete store[key];
}

export function clearStore() {
  Object.keys(store).forEach((key) => {
    delete store[key];
  });
}
