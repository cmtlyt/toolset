import { Validator } from 'jsonschema';

import type { Schema, TObject } from './base';

export { jsonSchemaGenerator, mockFromSchema } from './base';

export const verifyBySchema = (() => {
  const v = new Validator();
  return async (
    schema: Schema,
    data: TObject<any>,
  ): Promise<[boolean, { path: (string | number)[]; message: string }[]]> => {
    const validate = v.validate(data, schema);
    return [
      validate.valid,
      validate.errors?.map((item) => ({
        path: item.path,
        message: item.message,
      })) || null,
    ];
  };
})();
