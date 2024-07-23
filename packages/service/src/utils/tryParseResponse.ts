import { withResolvers } from '@cmtlyt/base';

import { ResponseConfig } from '../types';

const ParseFuncMap: [string[], (value: string, type: string) => any][] = [
  [['json'], (str: string) => JSON.parse(str)],
  [['form'], (str: string) => new URLSearchParams(str)],
  [['blob'], (value: string, type: string) => new Blob([value], { type })],
  [['*'], (value: string) => value],
];

const ContentTypeMap = {
  'application/json': 'json',
  'application/x-www-form-urlencoded': 'form',
  image: 'blob',
};

const getType = (value: string) => {
  for (const key in ContentTypeMap) {
    if (value.includes(key)) return ContentTypeMap[key];
  }
  return '*';
};

const getParseFunc = (type: string) => {
  for (const idx in ParseFuncMap) {
    const [types, func] = ParseFuncMap[idx];
    if (types.includes(type)) return func;
  }
};

export async function tryParseResponse(response: ResponseConfig) {
  const { data, headers } = response;
  const contentType = headers['content-type'];
  const type = getType(contentType);
  const parseFunc = getParseFunc(type);

  if (type !== 'blob') {
    const { resolve, promise } = withResolvers();
    const reader = new FileReader();
    reader.onload = () => {
      response.data = parseFunc(reader.result as string, contentType);
      resolve(response);
    };
    reader.readAsText(data);
    return promise;
  }

  response.data = parseFunc(data, contentType);
  return response;
}
