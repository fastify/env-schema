export type EnvSchemaData = {
  [key: string]: unknown;
};

export type EnvSchemaOpt = {
  schema?: object;
  data?: [EnvSchemaData, ...EnvSchemaData[]] | EnvSchemaData;
  env?: boolean;
  dotenv?: boolean | object;
};

declare function loadAndValidateEnvironment(
  _opts?: EnvSchemaOpt
): EnvSchemaData;

export default loadAndValidateEnvironment;
