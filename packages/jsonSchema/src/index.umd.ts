import Ajv from 'ajv';

import type { Schema, TObject } from './base';

export { jsonSchemaGenerator, mockFromSchema } from './base';

export const verifyBySchema = (() => {
  const ajv = new Ajv();
  return async (schema: Schema, data: TObject<any>): Promise<[boolean, { path: string; message: string }[] | null]> => {
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
