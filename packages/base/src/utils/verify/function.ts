import { warning } from '$/common/warning';
import { getType } from '../get-data';

/**
 * 判断是否为函数
 */
export function isFunc(value: any): value is (...args: any) => any {
  return typeof value === 'function';
}

/**
 * 判断是否为异步函数
 */
export function isAsyncFunc(value: any): value is (...args: any[]) => Promise<any> {
  warning('该方法存在生产环境和开发环境结果不一致风险, 请谨慎使用, 例如使用 babel 转换后 async 函数会变成普通函数');
  return getType(value) === 'asyncfunction';
}

/**
 * 判断是否为构造函数
 */
export function isConstructor(obj: any): boolean {
  if (!(obj instanceof Object))
    return false;
  if (typeof Object.getPrototypeOf(obj).constructor === 'function')
    return true;
  return false;
}
