import { getType } from '@cmtlyt/base';

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
  const schemaType = typeof data;
  const schema: Schema = { type: schemaType, description: '' };
  if (Array.isArray(data)) {
    const item = data[0];
    const itemSchema = _encodeJsonSchema(item);
    schema.type = 'array';
    if (item) schema.items = itemSchema;
  } else if (schemaType === 'object') {
    const required = [];
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

const baseTypeDefaultValue = {
  string: () => '',
  number: () => 0,
  boolean: () => false,
  array: () => [],
  object: () => ({}),
};

type MockHandlerMap = typeof baseTypeDefaultValue;

function _mockFromSchema(mockDefaultValue: MockHandlerMap, schema: Schema) {
  const type = schema.type;
  const defaultValue = (mockDefaultValue[type] || (() => {}))();
  if (type !== 'object' && type !== 'array') return defaultValue;
  if (type === 'object') {
    const properties = schema.properties;
    const result = defaultValue;
    for (const key in properties) {
      const child = properties[key];
      result[key] = _mockFromSchema(mockDefaultValue, child);
    }
    return result;
  } else if (type === 'array') {
    const items = schema.items;
    if (!items) return defaultValue;
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

const staticType = ['string', 'number', 'boolean'];
// const useCacheType = ['array', 'object', 'map', 'set', 'function', 'asyncfunction', 'date', 'regexp'];
let countId = 0;

function _encodeDataSchema(data: any, map = new Map<any, any>()) {
  const type = getType(data);
  const baseSchema = { type, id: countId, value: 'unknown' };
  if (map.has(data)) baseSchema.id = map.get(data);
  else {
    ++countId;
    map.set(data, baseSchema.id);
  }
  let result: any = baseSchema;
  if (staticType.includes(type)) result = { ...baseSchema, value: data };
  if (type === 'array') result = { ...baseSchema, value: (data as any[]).map((item) => _encodeDataSchema(item, map)) };
  else if (type === 'object') {
    result = {
      ...baseSchema,
      value: Object.keys(data)
        .sort()
        .reduce((prev, key) => {
          prev[key] = _encodeDataSchema(data[key], map);
          return prev;
        }, {}),
    };
  } else if (type === 'map') {
    result = {
      ...baseSchema,
      value: [...(data as Map<any, any>).entries()].map(([key, value]) => {
        const keySchema = _encodeDataSchema(key, map);
        const valueSchema = _encodeDataSchema(value, map);
        return { key: keySchema, value: valueSchema };
      }),
    };
  } else if (type === 'set') {
    result = {
      ...baseSchema,
      value: [...(data as Set<any>).values()].map((value) => _encodeDataSchema(value, map)),
    };
  } else if (type === 'function' || type === 'asyncfunction') {
    result = {
      ...baseSchema,
      value: (() => {
        const funcStr = data.toString();
        if (/^.*?=>/.test(funcStr)) return `return ${funcStr}`;
        if (funcStr.indexOf('async') === 0) return funcStr.replace('async', 'return async function');
        if (funcStr.indexOf('function') === 0) return `return ${funcStr}`;
        return `return function ${funcStr}`;
      })(),
    };
  } else if (type === 'date') result = { ...baseSchema, value: data.toISOString() };
  else if (type === 'regexp') {
    result = {
      ...baseSchema,
      value: { source: (data as RegExp).source, flags: (data as RegExp).flags },
    };
  }
  return result;
}

export function encodeDataSchema(data: any) {
  countId = 0;
  let map = new Map<any, any>();
  const dataSchema = _encodeDataSchema(data, map);
  map.clear();
  map = null;
  return JSON.stringify(dataSchema);
}

function _decodeDataSchema(dataSchema: TObject<any>, map: Record<string, any> = {}) {
  const type = dataSchema.type;
  if (staticType.includes(type)) return dataSchema.value;
  if (map[dataSchema.id]) return map[dataSchema.id];
  let result: any = 'unknown';
  if (type === 'array') result = (dataSchema.value as any[]).map((item) => _decodeDataSchema(item), map);
  else if (type === 'object') {
    result = Object.keys(dataSchema.value).reduce((prev, key) => {
      prev[key] = _decodeDataSchema(dataSchema.value[key], map);
      return prev;
    }, {});
  } else if (type === 'map') {
    result = new Map(
      (dataSchema.value as Array<{ key: any; value: any }>).map(({ key, value }) => {
        return [_decodeDataSchema(key, map), _decodeDataSchema(value, map)];
      }),
    );
  } else if (type === 'set') {
    result = new Set((dataSchema.value as any[]).map((value) => _decodeDataSchema(value, map)));
  } else if (type === 'function' || type === 'asyncfunction') result = new Function(dataSchema.value)();
  else if (type === 'date') result = new Date(dataSchema.value);
  else if (type === 'regexp') result = new RegExp(dataSchema.value.source, dataSchema.value.flags);
  map[dataSchema.id] = result;
  return result;
}

export function decodeDataSchema(dataSchema: string) {
  let map = {};
  const data = _decodeDataSchema(JSON.parse(dataSchema), map);
  for (const key in map) delete map[key];
  map = null;
  return data;
}
