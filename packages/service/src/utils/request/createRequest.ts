/* eslint-disable @typescript-eslint/no-unused-vars */
import { cloneMerge, getNow, isFalse, withResolvers } from '@cmtlyt/base';
import { MemoryStorage } from '@cmtlyt/storage';

import { DefaultHeanders } from '../../constant';
import { FilterBaseAPIConfig, FinialRequestConfig, RequestFunc } from '../../types';
import { getHttpRequest } from '../sendRequest';

import { requestDataVerify } from './verify';
import { getRequestData } from './getRequestData';

const storage = new MemoryStorage({ dbName: 'request' });

function getRequestConfig(config: FilterBaseAPIConfig): FinialRequestConfig | false {
  const { api, base, method = 'GET', cache, headers: headersFunc, interceptors, withCredentials } = config;
  const headers = typeof headersFunc === 'function' ? headersFunc({ ...DefaultHeanders }) : headersFunc;
  const { request } = interceptors || {};
  const userRequestConfig = request?.({ api, base, method, headers, cache }) || {};
  if (isFalse(userRequestConfig)) return false;
  if (userRequestConfig.url) userRequestConfig.url = new URL(userRequestConfig.url);
  const requestConfig = { url: new URL(api, base), headers, method, cache, withCredentials: withCredentials || false };
  return cloneMerge({}, userRequestConfig, requestConfig);
}

function getWithResolvers(map: Map<any, any>, cacheKey: any) {
  const { resolve, reject, promise } = withResolvers();
  return {
    resolve: (data: any) => {
      map.delete(cacheKey);
      resolve(data);
    },
    reject: (e: any) => {
      map.delete(cacheKey);
      reject(e);
    },
    promise,
  };
}

export function createRequest(): RequestFunc {
  const runningRequestMap = new Map();
  const func: RequestFunc = async (params, config) => {
    const { method, dataTypeSchema, defaultData, queryTypeSchema, defaultQuery, interceptors, requestHandler } =
      config as FilterBaseAPIConfig;
    const requestData = getRequestData({ method, params, defaultData, defaultQuery });
    const [requestVerifyResult, requestVerifyError] = requestDataVerify(
      method,
      requestData,
      dataTypeSchema,
      queryTypeSchema,
    );
    if (!requestVerifyResult) return Promise.reject(new TypeError(JSON.stringify(requestVerifyError)));
    const requestConfig = getRequestConfig(config) as FinialRequestConfig;
    if (isFalse(requestConfig)) return Promise.reject('请求拦截返回 false 已取消请求');
    const { cacheTime, getCacheKey } = requestConfig.cache || {};
    let cacheKey: any;
    const source = { ...requestConfig, data: requestData };
    if (cacheTime) {
      cacheKey = getCacheKey?.(source) || JSON.stringify(source);
      if (runningRequestMap.has(cacheKey)) return runningRequestMap.get(cacheKey).promise;
      runningRequestMap.set(cacheKey, getWithResolvers(runningRequestMap, cacheKey));
      const { data, time } = (await storage.getItem(cacheKey)) || {};
      if (time && getNow() - time < cacheTime) {
        runningRequestMap.delete(cacheKey);
        return Promise.resolve(data);
      }
    }
    const { resolve, reject } = runningRequestMap.get(cacheKey) || {};
    try {
      const result = await (requestHandler || getHttpRequest())(source);
      const { response } = interceptors || {};
      const responseResult = response?.(result);
      if (isFalse(responseResult)) return Promise.reject('响应拦截返回 false 已取消请求');
      const data = responseResult || result;
      if (cacheTime && cacheKey) {
        await storage.setItem(cacheKey, { data, time: getNow() });
        resolve?.(data);
      }
      return data;
    } catch (e) {
      reject?.(e);
      throw e;
    }
  };
  return func;
}
