export = envSchema;

declare function envSchema(
  _opts?: envSchema.EnvSchemaOpt
): envSchema.PlainObject;

declare namespace envSchema {
  type PlainObject = { [key: string]: any };

  type EnvSchemaOpt = {
    schema: object;
    data?: PlainObject[] | PlainObject
    env?: boolean;
    dotenv?: boolean | PlainObject;
  };
}
