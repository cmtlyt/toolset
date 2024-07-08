import type { Schema, TObject } from './base';

export { jsonSchemaGenerator, mockFromSchema } from './base';

export const verifyBySchema = (() => {
  let ajv;
  return async (schema: Schema, data: TObject<any>): Promise<[boolean, { path: string; message: string }[] | null]> => {
    if (!ajv) {
      const Ajv = (await import('ajv')).default;
      ajv = new Ajv();
    }
    const validate = ajv.compile(schema);
    return [
      validate(data),
      validate.errors?.map((item) => ({
        path: item.instancePath,
        message: item.message,
      })) || null,
    ];
  };
})();
