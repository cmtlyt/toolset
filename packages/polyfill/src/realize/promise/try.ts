import type { TAnyFunc, TPromiseConstructor } from '@cmtlyt/base';

export type PromiseTry = <F extends TAnyFunc = TAnyFunc>(
  callbackFn: F,
  ...args: Parameters<F>
) => Promise<ReturnType<F>>;

export function promiseTry<F extends TAnyFunc = TAnyFunc>(
  this: TPromiseConstructor<ReturnType<F>>,
  callbackFn: F,
  ...args: Parameters<F>
) {
  // eslint-disable-next-line ts/no-this-alias
  const Ctx = this;
  if ((typeof Ctx !== 'object' && typeof Ctx !== 'function') || Ctx === null)
    throw new TypeError('必须通过 Promise.try 方式调用');

  const promiseCapability = new Ctx((resolve, reject) => {
    try {
      // eslint-disable-next-line prefer-spread
      const result = callbackFn.apply(null, args);
      resolve(result);
    }
    catch (error) {
      reject(error);
    }
  });

  return promiseCapability;
}
