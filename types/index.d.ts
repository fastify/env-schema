import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv';
import { AnySchema } from 'ajv/dist/core';
import { DotenvConfigOptions } from 'dotenv';

export type { JSONSchemaType };

export type EnvSchemaData = {
  [key: string]: unknown;
};

export type EnvSchemaOpt<T = EnvSchemaData> = {
  schema?: JSONSchemaType<T> | AnySchema;
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
