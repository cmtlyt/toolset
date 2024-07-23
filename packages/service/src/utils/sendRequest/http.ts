import { getType, withResolvers } from '@cmtlyt/base';

import { FinialRequestConfig } from '../../types';
import { tryParseResponse } from '../tryParseResponse';

function getData(data) {
  if (getType(data) === 'object' || Array.isArray(data)) {
    return JSON.stringify(data);
  }
  return data;
}

function parseResponseHeaders(headerStr: string) {
  return headerStr
    .split('\r\n')
    .filter((line) => line)
    .reduce((headers, line) => {
      const [key, value] = line.split(': ');
      headers[key.toLowerCase()] = value;
      return headers;
    }, {});
}

function getResponse(xhr: XMLHttpRequest) {
  return {
    headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
    data: xhr.response,
    status: xhr.status,
    statusText: xhr.statusText,
    timestamp: Date.now(),
  };
}

export const getHttpRequest = () => {
  return function (config: FinialRequestConfig & { data: any }) {
    const { method, data, withCredentials, headers, url } = config;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = !!withCredentials || true;

    xhr.responseType = 'blob';

    const { resolve, reject, promise } = withResolvers();

    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = { method, requestConfig: config, ...getResponse(xhr) };
          const parseResponse = await tryParseResponse(response);
          resolve(parseResponse);
        }
      }
    };
    xhr.onerror = reject;
    if (method === 'GET') {
      Object.keys(data || {}).forEach((key) => {
        url.searchParams.set(key, data[key]);
      });
    }
    xhr.open(method, url);
    Object.keys(headers || {}).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.send(method === 'GET' ? null : getData(data));

    return promise;
  };
};
