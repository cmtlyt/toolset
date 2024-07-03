import { safeGetGlobal } from '@/utils/getData';

export function warning(...args: any[]) {
  if (safeGetGlobal().__ClConfig__.disableWarning) return;
  console.warn('@cmtlyt/base:>', ...args);
}
