import { getArray, getType, TObject } from '@cmtlyt/base';

import { useQuery } from '../useQuery';
import { MethodType } from '../../types';

export function getRequestData({
  method,
  params,
  defaultData,
  defaultQuery,
}: {
  method: MethodType;
  params: TObject<any>;
  defaultData: TObject<any>;
  defaultQuery: TObject<any>;
}) {
  if (useQuery(method)) {
    return { ...defaultQuery, ...params };
  }
  if (getType(params) === 'object') return { ...defaultData, ...params };
  if (Array.isArray(params)) return [...getArray(defaultData), ...params];
  return params;
}
