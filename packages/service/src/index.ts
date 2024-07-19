/**
 * 请求拦截 - 发送请求前, 获取响应后
 * 通过配置生成api
 *
 * 支持配置项:
 * - 接口地址
 * - 请求方法
 * - 请求参数类型
 * - 默认请求参数
 * - 接口拦截
 * - 请求头
 * - 是否缓存
 * - 缓存时间
 */

import { cacheByReturn, cloneMerge } from '@cmtlyt/base';
import { typeObjectToSchema } from '@cmtlyt/json-schema';

import {
  BaseAPIConfig,
  APIConfig,
  ServiceConfig,
  GetPlatformFunc,
  GetConfigHandler,
  ServiceMethods,
  FilterBaseAPIConfig,
} from './types';
import { getConfigHandler as _getConfigHandler, filterConfig, getPlatformType } from './utils';
import { createRequest } from './utils/request';

export * from './utils/sendRequest';

export class Service {
  #_config: BaseAPIConfig;

  #getPlatformType: GetPlatformFunc;
  #getConfigHandler: GetConfigHandler;

  constructor(config: ServiceConfig = {}) {
    const { getConfigHandler, getPlatformHandler } = config;
    this.#getPlatformType = getPlatformHandler || getPlatformType;
    this.#getConfigHandler = cacheByReturn(() => {
      if (getConfigHandler) return getConfigHandler;
      return _getConfigHandler(this.#getPlatformType);
    });
    this.#_config = this.#getConfigHandler(config);
  }

  #configHandler(config: BaseAPIConfig) {
    const { dataType, queryType, method } = config;
    let _method = method;
    if (!method) {
      _method = config.method = 'GET';
    }
    if (queryType && _method === 'GET') {
      config.queryTypeSchema ||= typeObjectToSchema(queryType);
    } else if (dataType) {
      config.dataTypeSchema ||= typeObjectToSchema(dataType);
    }
  }

  #configurePreprocessing(config: Record<string, APIConfig>): Record<string, FilterBaseAPIConfig> {
    const temp: Record<string, FilterBaseAPIConfig> = {};
    const _config = this.#_config;
    for (const key in config) {
      const tempConfig = this.#getConfigHandler(cloneMerge({}, config[key], _config));
      this.#configHandler(tempConfig);
      temp[key] = filterConfig(tempConfig);
    }
    return temp;
  }

  #createService(config: Record<string, FilterBaseAPIConfig>) {
    const service = {};
    const request = createRequest();
    for (const key in config) {
      service[key] = (params: any, _config?: APIConfig) => {
        const tempConfig = this.#getConfigHandler(cloneMerge({}, _config || {}, config[key]));
        this.#configHandler(tempConfig);
        const requestConfig = filterConfig(tempConfig);
        return request(params, requestConfig);
      };
    }
    return service;
  }

  batchCreateService<T extends Record<string, APIConfig>>(config: T): ServiceMethods<T> {
    const _config = this.#configurePreprocessing(config);
    return this.#createService(_config) as any;
  }
}
