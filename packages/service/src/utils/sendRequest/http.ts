import { getType } from '@cmtlyt/base';

import { FinialRequestConfig, ResponseConfig } from '../../types';

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
      headers[key] = value;
      return headers;
    }, {});
}

function tryParseResponse(response: ResponseConfig) {
  // todo
  return response;
}

function getResponse(xhr: XMLHttpRequest) {
  return {
    headers: parseResponseHeaders(xhr.getAllResponseHeaders()),
    data: xhr.responseText,
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
    return new Promise<ResponseConfig>((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = { method, requestConfig: config, ...getResponse(xhr) };
            const parseResponse = tryParseResponse(response);
            resolve(parseResponse);
          }
        }
      };
      xhr.onerror = reject;
      xhr.open(method, url);
      Object.keys(headers || {}).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      if (method === 'GET') {
        Object.keys(data || {}).forEach((key) => {
          url.searchParams.set(key, data[key]);
        });
      }
      xhr.send(method === 'GET' ? null : getData(data));
    });
  };
};
