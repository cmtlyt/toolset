import { getType, TObject } from '@cmtlyt/base';

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
