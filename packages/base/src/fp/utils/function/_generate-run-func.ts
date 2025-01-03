import type { TAnyFunc } from '$/types/base';

export function _generateRunFunc(funcs: TAnyFunc[], callback: (funcs: TAnyFunc[], ...args: any[]) => any) {
  if (funcs.length === 0)
    return (arg: any) => arg;
  if (funcs.length === 1)
    return funcs[0];
  const runFunc = (...args: any[]) => callback(funcs, ...args)[0];
  return runFunc;
}
