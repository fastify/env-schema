import Ajv, { KeywordDefinition } from "ajv";

export type EnvSchemaData = {
  [key: string]: unknown;
};

export type EnvSchemaOpt = {
  schema?: object;
  data?: [EnvSchemaData, ...EnvSchemaData[]] | EnvSchemaData;
  env?: boolean;
  dotenv?: boolean | object;
  ajv?: Ajv;
};

declare const loadAndValidateEnvironment: {
  (_opts?: EnvSchemaOpt): EnvSchemaData;
  keywords: {
    separator: KeywordDefinition;
  }
}

export default loadAndValidateEnvironment;
export { loadAndValidateEnvironment as envSchema };