import type { TObject } from '@cmtlyt/base';
import { getType } from '@cmtlyt/base';
import { jsonSchemaGenerator } from './json-schema';
import { baseTypeDefaultValue } from './utils';

// {
//   aaa: 'string',
//   ccc: 'number',
//   ddd: {
//     map: 'map',
//     set: 'set',
//     array: 'array',
//   },
//   array2: ['number']
// }

function _getObject(obj: any): any {
  if (typeof obj === 'string')
    // @ts-expect-error 动态索引
    return baseTypeDefaultValue[obj]?.();
  if (Array.isArray(obj))
    return [_getObject(obj[0])];
  if (getType(obj) !== 'object')
    return {};
  const object: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const type = getType(value);
    if (type === 'string') {
      // @ts-expect-error 动态索引
      object[key] = baseTypeDefaultValue[value]?.();
    }
    else if (typeof value === 'object') {
      object[key] = _getObject(value);
    }
    else {
      object[key] = value;
    }
  });
  return object;
}

export function typeObjectToSchema(obj: TObject<any>) {
  const temp = _getObject(obj);
  return jsonSchemaGenerator(temp);
}
