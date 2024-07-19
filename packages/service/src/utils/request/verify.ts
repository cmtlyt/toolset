import { ErrorItem, verifyBySchema } from '@cmtlyt/json-schema';

import { MethodType } from '../../types';
import { useQuery } from '../useQuery';

export function requestDataVerify(
  method: MethodType,
  data: any,
  dataSchema?: string,
  querySchema?: string,
): [boolean, ErrorItem[]] {
  if (useQuery(method) && querySchema) {
    return verifyBySchema(querySchema, data);
  }
  return dataSchema ? verifyBySchema(dataSchema, data) : [true, []];
}
