import { getType, TObject } from '@cmtlyt/base';

import { jsonSchemaGenerator } from './jsonSchema';
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

function _getObject(obj: any) {
  if (typeof obj === 'string') return baseTypeDefaultValue[obj]?.();
  if (Array.isArray(obj)) return [_getObject(obj[0])];
  if (getType(obj) !== 'object') return {};
  const object = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const type = getType(value);
    if (type === 'string') {
      object[key] = baseTypeDefaultValue[value]?.();
    } else if (typeof value === 'object') {
      object[key] = _getObject(value);
    } else {
      object[key] = value;
    }
  });
  return object;
}

export function typeObjectToSchema(obj: TObject<any>) {
  const temp = _getObject(obj);
  return jsonSchemaGenerator(temp);
}
