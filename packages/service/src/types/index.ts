import { TAllType, TExclude, TObject } from '@cmtlyt/base';

interface RequestConfig {
  api: string;
  base: string;
  method: MethodType;
  headers: TObject<string>;
  cache: CahceInfo;
}

export interface FinialRequestConfig {
  url: URL;
  headers: Record<string, string>;
  method: MethodType;
  query: Record<string, any>;
  cache: CahceInfo;
  withCredentials: boolean;
}

export interface ResponseConfig {
  data: any;
  headers: Record<string, string>;
  status: number;
  statusText: string;
  method: MethodType;
  requestConfig: FinialRequestConfig & TObject<any>;
  timestamp: number;
}

interface Interceptors {
  request?: (config: RequestConfig) => Partial<FinialRequestConfig & TObject<any>> | false;
  response?: (response: ResponseConfig) => any;
}

type Headers = TObject<string> | ((header: TObject<string>) => TObject<string>);

interface CahceInfo {
  cacheTime: number;
  getCacheKey?: (config: FinialRequestConfig & TObject<any>) => any;
}

type TypeMap = TAllType | Record<string, TAllType> | [TAllType] | [Record<string, TAllType>];

type TypeObject = Record<string, TypeMap>;

export type MethodType =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'TRACE'
  | 'CONNECT'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | 'trace'
  | 'connect';

export interface BaseAPIConfig {
  api: string;
  base?: string;
  method?: MethodType;
  dataType?: TypeObject;
  defaultData?: Record<string, any>;
  dataTypeSchema?: string;
  queryType?: TypeObject;
  defaultQuery?: Record<string, any>;
  queryTypeSchema?: string;
  interceptors?: Interceptors;
  headers?: Headers;
  cache?: CahceInfo;
  withCredentials?: boolean;
  requestHandler?: (config: FinialRequestConfig & TObject<any>) => Promise<any>;
}

export interface FilterBaseAPIConfig extends TExclude<BaseAPIConfig, 'dataType' | 'queryType'> {}

type PlatformConfig = BaseAPIConfig | ((platform: string) => BaseAPIConfig);

export interface PlatformAPIConfig extends BaseAPIConfig {
  web?: Partial<PlatformConfig>;
  wechat?: Partial<PlatformConfig>;
  dingtalk?: Partial<PlatformConfig>;
  taobao?: Partial<PlatformConfig>;
  alipay?: Partial<PlatformConfig>;
  bytedance?: Partial<PlatformConfig>;
  other?: Partial<PlatformConfig>;
}

export interface APIConfig extends PlatformAPIConfig {}

export type GetPlatformFunc = () => 'web' | 'dingtalk' | 'bytedance' | 'wechat' | 'taobao' | 'alipay' | 'other';
export type GetConfigHandler = (config: PlatformAPIConfig | ServiceConfig) => BaseAPIConfig;

export interface ServiceConfig extends Partial<APIConfig> {
  getConfigHandler?: GetConfigHandler;
  getPlatformHandler?: GetPlatformFunc;
}

export type RequestFunc = (params?: any, config?: APIConfig) => Promise<any>;

export type ServiceMethods<T> = {
  [key in keyof T]: RequestFunc;
};
