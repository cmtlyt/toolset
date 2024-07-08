import { describe, expect, it } from 'vitest';
import { jsonSchemaGenerator, mockFromSchema, verifyBySchema } from '../src/index.esm';

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
});
