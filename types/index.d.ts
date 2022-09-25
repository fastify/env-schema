import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv';
import { DotenvConfigOptions } from 'dotenv';
import { ObjectSchema } from 'fluent-json-schema';

export type { JSONSchemaType };

export type EnvSchemaData = {
  [key: string]: unknown;
};

export type EnvSchemaOpt<T = EnvSchemaData> = {
  schema?: JSONSchemaType<T> | ObjectSchema;
  data?: [EnvSchemaData, ...EnvSchemaData[]] | EnvSchemaData;
  env?: boolean;
  dotenv?: boolean | DotenvConfigOptions;
  expandEnv?: boolean;
  ajv?:
    | Ajv
    | {
        customOptions(ajvInstance: Ajv): Ajv;
      };
};

declare const loadAndValidateEnvironment: {
  <T = EnvSchemaData>(_opts?: EnvSchemaOpt<T>): T;
  keywords: {
    separator: KeywordDefinition;
  };
};

export default loadAndValidateEnvironment;
export { loadAndValidateEnvironment as envSchema };
