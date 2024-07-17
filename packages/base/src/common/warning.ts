export function warning(...args: any[]) {
  if (globalThis?.__ClConfig__?.disableWarning) return;
  console.warn('@cmtlyt/base:>', ...args);
}
