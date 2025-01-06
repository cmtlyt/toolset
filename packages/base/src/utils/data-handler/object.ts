import type { TObject } from '$/types/base';
import { STATIC_TYPE } from '$/common/constant';
import { warning } from '$/common/warning';
import { getType } from '../get-data';

/**
 * 深度克隆对象
 */
export function deepClone<T extends TObject<any>>(obj: T, hash = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object' || STATIC_TYPE.includes(getType(obj)))
    return obj;
  if (hash.has(obj))
    return hash.get(obj);

  const newObj: TObject<any> = Array.isArray(obj) ? [] : {};
  hash.set(obj, newObj);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = deepClone(obj[key], hash);
    }
  }
  return newObj as any;
}

function _merge(target: any, source: any) {
  const targetType = getType(target);
  if (STATIC_TYPE.includes(targetType))
    return target;
  if (targetType !== getType(source)) {
    if (STATIC_TYPE.includes(getType(source)))
      return source;
    warning('传入的两个参数类型不同,无法合并');
    return target;
  }
  if (targetType === 'string' || targetType === 'number')
    return target + source;
  if (Array.isArray(target))
    return target.concat(source);
  if (targetType === 'object') {
    for (const key in source) {
      const item = source[key];
      let current = target[key] ?? item;
      if (!STATIC_TYPE.includes(getType(current)) && typeof item === 'object' && item !== null) {
        current = target[key] || (Array.isArray(item) ? [] : {});
        current = _merge(current, item);
      }
      target[key] = current;
    }
  }
  return target || source;
}

/**
 * 合并对象, 会直接修改 target
 *
 * 如不希望修改 target 对象, 请使用 cloneMerge
 */
export function merge(target: any, ...source: any[]) {
  return source.reduce((acc, cur) => _merge(acc, cur), target);
}

/**
 * 合并对象, 返回新对象, 不影响原数据
 */
export function cloneMerge(target: any, ...source: any) {
  target = deepClone(target);
  return merge(target, ...source);
}
