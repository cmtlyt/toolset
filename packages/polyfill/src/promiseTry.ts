import { TAnyFunc, TPromiseConstructor } from '@cmtlyt/base';

export function promiseTry<F extends TAnyFunc = TAnyFunc>(
  this: TPromiseConstructor<ReturnType<F>>,
  callbackFn: F,
  ...args: Parameters<F>
) {
  const Ctx = this;
  if ((typeof Ctx !== 'object' && typeof Ctx !== 'function') || Ctx === null)
    throw new TypeError('必须通过 Promise.try 方式调用');

  const promiseCapability = new Ctx((resolve, reject) => {
    try {
      const result = callbackFn.apply(null, args);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });

  return promiseCapability;
}
