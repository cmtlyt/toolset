import { MethodType } from '../types';
import { QueryMethods } from '../constant';

export function useQuery(method: MethodType) {
  return QueryMethods.includes(method.toLocaleLowerCase());
}
