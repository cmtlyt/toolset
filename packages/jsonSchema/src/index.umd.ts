import { Validator } from 'jsonschema';

import type { TObject } from './base';

export { jsonSchemaGenerator, mockFromSchema } from './base';

export const verifyBySchema = (() => {
  const v = new Validator();
  return async (
    schema: string,
    data: TObject<any>,
  ): Promise<[boolean, { path: (string | number)[]; message: string }[]]> => {
    const validate = v.validate(data, JSON.parse(schema));
    return [
      validate.valid,
      validate.errors?.map((item) => ({
        path: item.path,
        message: item.message,
      })) || null,
    ];
  };
})();
