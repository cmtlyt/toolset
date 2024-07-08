import type { Schema, TObject } from './base';

export { jsonSchemaGenerator, mockFromSchema } from './base';

type Validator = import('jsonschema').Validator;

export const verifyBySchema = (() => {
  let v: Validator = null;
  return async (
    schema: Schema,
    data: TObject<any>,
  ): Promise<[boolean, { path: (string | number)[]; message: string }[]]> => {
    if (!v) {
      const Validator = (await import('jsonschema')).Validator;
      v = new Validator();
    }
    const validate = v.validate(data, schema);
    return [
      validate.valid,
      validate.errors?.map((item) => ({
        path: item.path,
        message: item.message,
      })),
    ];
  };
})();
