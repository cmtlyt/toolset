import { describe, expect, inject, it } from 'vitest';

function stringify(obj: any) {
  try {
    return JSON.stringify(obj).replace(/\s+/, '');
  }
  catch {
    return '';
  }
}

describe('jsonSchema', async () => {
  const { decodeDataSchema, encodeDataSchema, jsonSchemaGenerator, mockFromSchema, typeObjectToSchema, verifyBySchema } = await (() => {
    return inject('CI') ? import('../dist') : import('../src');
  })() as typeof import('../src');

  const data = {
    name: 'test',
    age: 12,
    isFinite: true,
    address: [
      { city: 'beijing', area: 'chaoyang', street: 'chaoyang', house: 'chaoyang' },
      { city: 'beijing2', area: 'chaoyang2', street: 'chaoyang2', house: 'chaoyang2' },
    ],
    test1: {
      array: [{ name: 'test' }],
      boolean: true,
      string: 'test',
      number: 12,
      object: { name: 'test', array2: [] },
    },
  };

  let schema, mockData;

  it('generate', () => {
    schema = jsonSchemaGenerator(data);
    expect(stringify(schema)).toMatchInlineSnapshot(`""{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"name\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"age\\":{\\"type\\":\\"number\\",\\"description\\":\\"\\"},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"description\\":\\"\\"},\\"address\\":{\\"type\\":\\"array\\",\\"description\\":\\"\\",\\"items\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"city\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"area\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"street\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"house\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"}},\\"required\\":[\\"city\\",\\"area\\",\\"street\\",\\"house\\"]}},\\"test1\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"array\\":{\\"type\\":\\"array\\",\\"description\\":\\"\\",\\"items\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"name\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"}},\\"required\\":[\\"name\\"]}},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"description\\":\\"\\"},\\"string\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"number\\":{\\"type\\":\\"number\\",\\"description\\":\\"\\"},\\"object\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"name\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"},\\"array2\\":{\\"type\\":\\"array\\",\\"description\\":\\"\\"}},\\"required\\":[\\"name\\",\\"array2\\"]}},\\"required\\":[\\"array\\",\\"boolean\\",\\"string\\",\\"number\\",\\"object\\"]}},\\"required\\":[\\"name\\",\\"age\\",\\"isFinite\\",\\"address\\",\\"test1\\"]}""`);
  });

  it('generate with empty object', () => {
    const emptyData = {};
    const emptySchema = jsonSchemaGenerator(emptyData);
    expect(stringify(emptySchema)).toMatchInlineSnapshot(`""{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{},\\"required\\":[]}""`);
  });

  it('generate with nested objects', () => {
    const nestedData = { a: { b: { c: { d: 'test' } } } };
    const nestedSchema = jsonSchemaGenerator(nestedData);
    expect(stringify(nestedSchema)).toMatchInlineSnapshot(`""{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"a\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"b\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"c\\":{\\"type\\":\\"object\\",\\"description\\":\\"\\",\\"properties\\":{\\"d\\":{\\"type\\":\\"string\\",\\"description\\":\\"\\"}},\\"required\\":[\\"d\\"]}},\\"required\\":[\\"c\\"]}},\\"required\\":[\\"b\\"]}},\\"required\\":[\\"a\\"]}""`);
  });

  it('mock', () => {
    mockData = mockFromSchema(schema);
    expect(stringify(mockData)).toMatchInlineSnapshot(`"{"name":"","age":0,"isFinite":false,"address":[{"city":"","area":"","street":"","house":""}],"test1":{"array":[{"name":""}],"boolean":false,"string":"","number":0,"object":{"name":"","array2":[]}}}"`);
  });

  it('mock with nested schema', () => {
    const nestedSchema = JSON.stringify({
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: { b: { type: 'object', properties: { c: { type: 'string' } }, required: ['c'] } },
          required: ['b'],
        },
      },
      required: ['a'],
    });
    const nestedMockData = mockFromSchema(nestedSchema);
    expect(stringify(nestedMockData)).toMatchInlineSnapshot(`"{"a":{"b":{"c":""}}}"`);
  });

  it('mock custom handler', () => {
    mockData = mockFromSchema(schema, {
      string: () => 'test',
      number: () => 12,
      boolean: () => true,
      array: () => [],
      object: () => ({}),
    });
    expect(stringify(mockData)).toMatchInlineSnapshot(`"{"name":"test","age":12,"isFinite":true,"address":[{"city":"test","area":"test","street":"test","house":"test"}],"test1":{"array":[{"name":"test"}],"boolean":true,"string":"test","number":12,"object":{"name":"test","array2":[]}}}"`);
  });

  it('verify', () => {
    expect(stringify(verifyBySchema(schema, mockData))).toMatchInlineSnapshot(`"[true,[]]"`);
  });

  it('verify error', () => {
    const testData = { ...data, age: '12' };
    expect(stringify(verifyBySchema(schema, testData))).toMatchInlineSnapshot(`"[false,[{"path":"/age","message":"类型应该为number"}]]"`);
    const arrSchema = stringify({ type: 'array', items: { type: 'string' }, maxItems: 3, minItems: 1 });
    expect(stringify(verifyBySchema(arrSchema, []))).toMatchInlineSnapshot(`"[false,[{"path":"","message":"最多允许3 元素, 至少要有 1 元素, 当前 0 个"}]]"`);
    expect(stringify(verifyBySchema(arrSchema, [1]))).toMatchInlineSnapshot(`"[false,[{"path":"/0","message":"类型应该为string"}]]"`);
    expect(stringify(verifyBySchema(arrSchema, [1, '1']))).toMatchInlineSnapshot(`"[false,[{"path":"/0","message":"类型应该为string"}]]"`);
    expect(stringify(verifyBySchema(arrSchema, ['1', '1', '1', '1']))).toMatchInlineSnapshot(`"[false,[{"path":"","message":"最多允许3 元素, 至少要有 1 元素, 当前 4 个"}]]"`);
    expect(stringify(verifyBySchema(arrSchema, ['1', '1', '1']))).toMatchInlineSnapshot(`"[true,[]]"`);
    expect(stringify(verifyBySchema(arrSchema, ['1', '1']))).toMatchInlineSnapshot(`"[true,[]]"`);
  });

  const data2 = {
    ...data,
    func1() {
      return [1, this.name];
    },
    // eslint-disable-next-line object-shorthand
    func2: function () {
      return [2, this.name];
    },
    async func3() {
      return [3, this.name];
    },
    func4: () => [4, (this as any)?.name],
    func5: async () => [5, (this as any)?.name],
    func6: () => {
      return [6, (this as any)?.name];
    },
    func7: async () => {
      return [7, (this as any)?.name];
    },
  };

  const data3 = {
    set: new Set([1, 2, 3, data]),
    map: new Map<any, any>([
      ['1', 1],
      ['2', 2],
      ['3', 3],
      ['data', data],
      [data, data],
    ]),
    // eslint-disable-next-line regexp/no-useless-character-class, regexp/no-super-linear-backtracking, regexp/no-useless-non-capturing-group, regexp/prefer-d, regexp/prefer-plus-quantifier
    reg: /^12[3](123)?.*?1+[^123](?=123)(?:123)(?!123)\d\w\s\D\W\S[0-9](1|2){2}1{1,}2{1,3}$/gms,
    date: new Date('Sat, 13 Jul 2024 05:14:09 GMT'),
  };

  let dataSchema, dataSchema2;

  it('encodeDataSchema', () => {
    dataSchema = encodeDataSchema(data2);
    expect(stringify(dataSchema)).toMatchInlineSnapshot(`""{\\"type\\":\\"object\\",\\"id\\":0,\\"value\\":{\\"address\\":{\\"type\\":\\"array\\",\\"id\\":1,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":2,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":3,\\"value\\":\\"chaoyang\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":4,\\"value\\":\\"beijing\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":3,\\"value\\":\\"chaoyang\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":3,\\"value\\":\\"chaoyang\\"}}},{\\"type\\":\\"object\\",\\"id\\":5,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":6,\\"value\\":\\"chaoyang2\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":7,\\"value\\":\\"beijing2\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":6,\\"value\\":\\"chaoyang2\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":6,\\"value\\":\\"chaoyang2\\"}}}]},\\"age\\":{\\"type\\":\\"number\\",\\"id\\":8,\\"value\\":12},\\"func1\\":{\\"type\\":\\"function\\",\\"id\\":9,\\"value\\":\\"returnfunction func1() {\\\\n      return [1, this.name];\\\\n    }\\"},\\"func2\\":{\\"type\\":\\"function\\",\\"id\\":10,\\"value\\":\\"return function() {\\\\n      return [2, this.name];\\\\n    }\\"},\\"func3\\":{\\"type\\":\\"asyncfunction\\",\\"id\\":11,\\"value\\":\\"return async function func3() {\\\\n      return [3, this.name];\\\\n    }\\"},\\"func4\\":{\\"type\\":\\"function\\",\\"id\\":12,\\"value\\":\\"return () => [4, this?.name]\\"},\\"func5\\":{\\"type\\":\\"asyncfunction\\",\\"id\\":13,\\"value\\":\\"return async () => [5, this?.name]\\"},\\"func6\\":{\\"type\\":\\"function\\",\\"id\\":14,\\"value\\":\\"return () => {\\\\n      return [6, this?.name];\\\\n    }\\"},\\"func7\\":{\\"type\\":\\"asyncfunction\\",\\"id\\":15,\\"value\\":\\"return async () => {\\\\n      return [7, this?.name];\\\\n    }\\"},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"id\\":16,\\"value\\":true},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"test\\"},\\"test1\\":{\\"type\\":\\"object\\",\\"id\\":18,\\"value\\":{\\"array\\":{\\"type\\":\\"array\\",\\"id\\":19,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":20,\\"value\\":{\\"name\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"test\\"}}}]},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"id\\":16,\\"value\\":true},\\"number\\":{\\"type\\":\\"number\\",\\"id\\":8,\\"value\\":12},\\"object\\":{\\"type\\":\\"object\\",\\"id\\":21,\\"value\\":{\\"array2\\":{\\"type\\":\\"array\\",\\"id\\":22,\\"value\\":[]},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"test\\"}}},\\"string\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"test\\"}}}}}""`);
    dataSchema2 = encodeDataSchema(data3);
    expect(stringify(dataSchema2)).toMatchInlineSnapshot(`""{\\"type\\":\\"object\\",\\"id\\":0,\\"value\\":{\\"date\\":{\\"type\\":\\"date\\",\\"id\\":1,\\"value\\":\\"2024-07-13T05:14:09.000Z\\"},\\"map\\":{\\"type\\":\\"map\\",\\"id\\":2,\\"value\\":[{\\"key\\":{\\"type\\":\\"string\\",\\"id\\":3,\\"value\\":\\"1\\"},\\"value\\":{\\"type\\":\\"number\\",\\"id\\":4,\\"value\\":1}},{\\"key\\":{\\"type\\":\\"string\\",\\"id\\":5,\\"value\\":\\"2\\"},\\"value\\":{\\"type\\":\\"number\\",\\"id\\":6,\\"value\\":2}},{\\"key\\":{\\"type\\":\\"string\\",\\"id\\":7,\\"value\\":\\"3\\"},\\"value\\":{\\"type\\":\\"number\\",\\"id\\":8,\\"value\\":3}},{\\"key\\":{\\"type\\":\\"string\\",\\"id\\":9,\\"value\\":\\"data\\"},\\"value\\":{\\"type\\":\\"object\\",\\"id\\":10,\\"value\\":{\\"address\\":{\\"type\\":\\"array\\",\\"id\\":11,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":12,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":14,\\"value\\":\\"beijing\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"}}},{\\"type\\":\\"object\\",\\"id\\":15,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"beijing2\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"}}}]},\\"age\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"},\\"test1\\":{\\"type\\":\\"object\\",\\"id\\":21,\\"value\\":{\\"array\\":{\\"type\\":\\"array\\",\\"id\\":22,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":23,\\"value\\":{\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}]},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"number\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"object\\":{\\"type\\":\\"object\\",\\"id\\":24,\\"value\\":{\\"array2\\":{\\"type\\":\\"array\\",\\"id\\":25,\\"value\\":[]},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}},\\"string\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}}}},{\\"key\\":{\\"type\\":\\"object\\",\\"id\\":10,\\"value\\":{\\"address\\":{\\"type\\":\\"array\\",\\"id\\":11,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":12,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":14,\\"value\\":\\"beijing\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"}}},{\\"type\\":\\"object\\",\\"id\\":15,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"beijing2\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"}}}]},\\"age\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"},\\"test1\\":{\\"type\\":\\"object\\",\\"id\\":21,\\"value\\":{\\"array\\":{\\"type\\":\\"array\\",\\"id\\":22,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":23,\\"value\\":{\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}]},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"number\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"object\\":{\\"type\\":\\"object\\",\\"id\\":24,\\"value\\":{\\"array2\\":{\\"type\\":\\"array\\",\\"id\\":25,\\"value\\":[]},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}},\\"string\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}}},\\"value\\":{\\"type\\":\\"object\\",\\"id\\":10,\\"value\\":{\\"address\\":{\\"type\\":\\"array\\",\\"id\\":11,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":12,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":14,\\"value\\":\\"beijing\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"}}},{\\"type\\":\\"object\\",\\"id\\":15,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"beijing2\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"}}}]},\\"age\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"},\\"test1\\":{\\"type\\":\\"object\\",\\"id\\":21,\\"value\\":{\\"array\\":{\\"type\\":\\"array\\",\\"id\\":22,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":23,\\"value\\":{\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}]},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"number\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"object\\":{\\"type\\":\\"object\\",\\"id\\":24,\\"value\\":{\\"array2\\":{\\"type\\":\\"array\\",\\"id\\":25,\\"value\\":[]},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}},\\"string\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}}}}]},\\"reg\\":{\\"type\\":\\"regexp\\",\\"id\\":26,\\"value\\":{\\"source\\":\\"^12[3](123)?.*?1+[^123](?=123)(?:123)(?!123)\\\\\\\\d\\\\\\\\w\\\\\\\\s\\\\\\\\D\\\\\\\\W\\\\\\\\S[0-9](1|2){2}1{1,}2{1,3}$\\",\\"flags\\":\\"gms\\"}},\\"set\\":{\\"type\\":\\"set\\",\\"id\\":27,\\"value\\":[{\\"type\\":\\"number\\",\\"id\\":4,\\"value\\":1},{\\"type\\":\\"number\\",\\"id\\":6,\\"value\\":2},{\\"type\\":\\"number\\",\\"id\\":8,\\"value\\":3},{\\"type\\":\\"object\\",\\"id\\":10,\\"value\\":{\\"address\\":{\\"type\\":\\"array\\",\\"id\\":11,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":12,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":14,\\"value\\":\\"beijing\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":13,\\"value\\":\\"chaoyang\\"}}},{\\"type\\":\\"object\\",\\"id\\":15,\\"value\\":{\\"area\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"city\\":{\\"type\\":\\"string\\",\\"id\\":17,\\"value\\":\\"beijing2\\"},\\"house\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"},\\"street\\":{\\"type\\":\\"string\\",\\"id\\":16,\\"value\\":\\"chaoyang2\\"}}}]},\\"age\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"isFinite\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"},\\"test1\\":{\\"type\\":\\"object\\",\\"id\\":21,\\"value\\":{\\"array\\":{\\"type\\":\\"array\\",\\"id\\":22,\\"value\\":[{\\"type\\":\\"object\\",\\"id\\":23,\\"value\\":{\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}]},\\"boolean\\":{\\"type\\":\\"boolean\\",\\"id\\":19,\\"value\\":true},\\"number\\":{\\"type\\":\\"number\\",\\"id\\":18,\\"value\\":12},\\"object\\":{\\"type\\":\\"object\\",\\"id\\":24,\\"value\\":{\\"array2\\":{\\"type\\":\\"array\\",\\"id\\":25,\\"value\\":[]},\\"name\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}},\\"string\\":{\\"type\\":\\"string\\",\\"id\\":20,\\"value\\":\\"test\\"}}}}}]}}}""`);
  });

  it('decodeDataSchema', async ({ expect }) => {
    const decodeData = decodeDataSchema(dataSchema);
    expect(stringify(decodeData)).toMatchInlineSnapshot(`"{"address":[{"area":"chaoyang","city":"beijing","house":"chaoyang","street":"chaoyang"},{"area":"chaoyang2","city":"beijing2","house":"chaoyang2","street":"chaoyang2"}],"age":12,"isFinite":true,"name":"test","test1":{"array":[{"name":"test"}],"boolean":true,"number":12,"object":{"array2":[],"name":"test"},"string":"test"}}"`);
    const { func1, func2, func3, func4, func5, func6, func7, ...otherData } = decodeData;
    expect(otherData).toEqual(data);
    expect(decodeData.func1()).toEqual(decodeData.func1());
    expect(decodeData.func2()).toEqual(decodeData.func2());
    expect(decodeData.func3()).resolves.toEqual(await decodeData.func3());
    expect(decodeData.func4()).toEqual(decodeData.func4());
    expect(decodeData.func5()).resolves.toEqual(await decodeData.func5());
    expect(decodeData.func6()).toEqual(decodeData.func6());
    expect(decodeData.func7()).resolves.toEqual(await decodeData.func7());

    const decodeData2 = decodeDataSchema(dataSchema2);
    expect(stringify(decodeData2)).toMatchInlineSnapshot(`"{"date":"2024-07-13T05:14:09.000Z","map":{},"reg":{},"set":{}}"`);
    expect(decodeData2).toEqual(data3);
    decodeData2.map.entries(([key, value]) => {
      expect(value).toEqual(data3.map.get(key));
      if (typeof key === 'object') {
        expect(data3.map.get(key)).toBe(value);
      }
    });
    decodeData2.set.forEach((value) => {
      if (typeof value !== 'object') {
        expect(data3.set.has(value)).toBe(true);
      }
    });
  });

  it('typeObjectToSchema', () => {
    const schema = typeObjectToSchema({ a: 'string', b: 'number', c: 'boolean' });

    expect(schema).toMatchInlineSnapshot(`"{"type":"object","description":"","properties":{"a":{"type":"string","description":""},"b":{"type":"number","description":""},"c":{"type":"boolean","description":""}},"required":["a","b","c"]}"`);
  });
});
