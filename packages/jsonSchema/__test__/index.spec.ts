import { describe, expect, it } from 'vitest';
import { jsonSchemaGenerator, mockFromSchema, verifyBySchema } from '../src/index.esm';
import { decodeDataSchema, encodeDataSchema } from '../src/base';

function getFile(name: string) {
  return `snapshot/${name}`;
}

describe('jsonSchema', () => {
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
    expect(schema).toMatchFileSnapshot(getFile('generate.0'));
  });

  it('mock', () => {
    mockData = mockFromSchema(schema);
    expect(mockData).toMatchFileSnapshot(getFile('mock.0'));
  });

  it('mock custom handler', () => {
    mockData = mockFromSchema(schema, {
      string: () => 'test',
      number: () => 12,
      boolean: () => true,
      array: () => [],
      object: () => ({}),
    });
    expect(mockData).toMatchFileSnapshot(getFile('mock.1'));
  });

  it('verify', async () => {
    expect(await verifyBySchema(schema, mockData)).toMatchInlineSnapshot(`
      [
        true,
        [],
      ]
    `);
  });

  it('verify error', async () => {
    const testData = { ...data, age: '12' };
    expect(await verifyBySchema(schema, testData)).toMatchInlineSnapshot(`
      [
        false,
        [
          {
            "message": "is not of a type(s) number",
            "path": [
              "age",
            ],
          },
        ],
      ]
    `);
  });

  const data2 = {
    ...data,
    func1() {
      return [1, this.name];
    },
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
    reg: /^12[3](123)?.*?1+[^123](?=123)(?:123)(?!123)\d\w\s\D\W\S[0-9](1|2){2}1{1,}2{1,3}$/gms,
    date: new Date('2024-7-12'),
  };

  let dataSchema, dataSchema2;

  it('encodeDataSchema', () => {
    dataSchema = encodeDataSchema(data2);
    expect(dataSchema).toMatchFileSnapshot(getFile('encodeDataSchema.0.json'));
    dataSchema2 = encodeDataSchema(data3);
    expect(dataSchema2).toMatchFileSnapshot(getFile('encodeDataSchema.1.json'));
  });

  it('decodeDataSchema', async ({ expect }) => {
    const decodeData = decodeDataSchema(dataSchema);
    expect(decodeData).toMatchFileSnapshot(getFile('decodeDataSchema.0'));
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
    expect(decodeData2).toMatchFileSnapshot(getFile('decodeDataSchema.1'));
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
});
