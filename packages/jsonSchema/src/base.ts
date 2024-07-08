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
  return schema;
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

export function mockFromSchema(schema: Schema, handlerMap: Partial<MockHandlerMap> = {}) {
  const mockDefaultValue = { ...baseTypeDefaultValue, ...handlerMap };
  return _mockFromSchema(mockDefaultValue, schema);
}
