import { getType } from '@cmtlyt/base';

import { FinialRequestConfig } from '../../types';

function getData(data) {
  if (getType(data) === 'object' || Array.isArray(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export const getHttpRequest = () => {
  return function (config: FinialRequestConfig & { data: any }) {
    const { method, data, headers, url } = config;
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
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
