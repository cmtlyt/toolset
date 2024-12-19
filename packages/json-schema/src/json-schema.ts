import { cacheByReturn, getType, isFalse } from '@cmtlyt/base';

import { baseTypeDefaultValue } from './utils';

export interface Schema {
  type: string;
  description: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export type TObject<T> = Record<string | number | symbol, T>;

function _encodeJsonSchema(data: TObject<any>): Schema {
  const schemaType = getType(data);
  const schema: Schema = { type: schemaType, description: '' };
  if (Array.isArray(data)) {
    const item = data[0];
    const itemSchema = _encodeJsonSchema(item);
    schema.type = 'array';
    if (typeof item !== 'undefined')
      schema.items = itemSchema;
  }
  else if (schemaType === 'object') {
    const required: string[] = [];
    schema.properties = {};
    for (const key in data) {
      const value = data[key];
      const child = _encodeJsonSchema(value);
      schema.properties[key] = child;
      !required.includes(key) && required.push(key);
    }
    schema.required = required;
  }
  return schema;
}

export function jsonSchemaGenerator(data: TObject<any>) {
  const schema = _encodeJsonSchema(data);
  return JSON.stringify(schema);
}

type MockHandlerMap = typeof baseTypeDefaultValue;

function _mockFromSchema(mockDefaultValue: MockHandlerMap, schema: Schema) {
  const type = schema.type;
  // @ts-expect-error 动态索引
  const defaultValue = (mockDefaultValue[type] || (() => {}))();
  if (type !== 'object' && type !== 'array')
    return defaultValue;
  if (type === 'object') {
    const properties = schema.properties;
    const result = defaultValue;
    for (const key in properties) {
      const child = properties[key];
      result[key] = _mockFromSchema(mockDefaultValue, child);
    }
    return result;
  }
  else if (type === 'array') {
    const items = schema.items;
    if (!items)
      return defaultValue;
    const result = defaultValue;
    const { maxItems = 0, minItems = 0 } = items;
    const length = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems || 1;
    for (let i = 0; i < length; i++) {
      result.push(_mockFromSchema(mockDefaultValue, items));
    }
    return result;
  }
}

export function mockFromSchema(schema: string, handlerMap: Partial<MockHandlerMap> = {}) {
  const mockDefaultValue = { ...baseTypeDefaultValue, ...handlerMap };
  return _mockFromSchema(mockDefaultValue, JSON.parse(schema));
}

function _verifyBySchema(schema: Schema, data: any, path = '', errors: ErrorItem[] = []) {
  const type = getType(data);
  if (schema.type !== type)
    errors.push({ path, message: `类型应该为 ${schema.type}` });
  if (type === 'array') {
    const length = data.length;
    const { minItems = 0, maxItems = Infinity, uniqueItems, items } = schema;
    if (length > maxItems || length < minItems) {
      errors.push({ path, message: `最多允许 ${maxItems} 元素, 至少要有 ${minItems} 元素, 当前 ${length} 个` });
    }
    const uniqueSet = new Set();
    const func = cacheByReturn(() => {
      if (uniqueItems) {
        return (item: any, idx: number) => {
          if (uniqueSet.has(item)) {
            errors.push({ path, message: `元素必须唯一 ${idx}` });
            return false;
          }
          uniqueSet.add(item);
          if (!items)
            return;
          _verifyBySchema(items, item, `${path}/${idx}`, errors);
        };
      }
      return (item: any, idx: number) => {
        if (!items)
          return;
        _verifyBySchema(items, item, `${path}/${idx}`, errors);
      };
    });
    for (const idx in data) {
      const item = data[idx];
      if (isFalse(func(item, +idx)))
        break;
    }
  }
  if (type === 'object') {
    const { properties, required } = schema;
    required?.every((item: string) => {
      return item in data;
    });
    for (const key in properties) {
      _verifyBySchema(properties[key], data[key], `${path}/${key}`, errors);
    }
  }
}

export interface ErrorItem {
  path: string;
  message: string;
}

export function verifyBySchema(schema: string, data: any): [boolean, ErrorItem[]] {
  const errors: ErrorItem[] = [];
  _verifyBySchema(JSON.parse(schema), data, '', errors);
  return [errors.length === 0, errors];
}
