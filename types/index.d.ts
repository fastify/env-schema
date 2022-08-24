import Ajv, { KeywordDefinition } from "ajv";
import { DotenvConfigOptions } from "dotenv";

export type EnvSchemaData = {
  [key: string]: unknown;
};

export type EnvSchemaOpt = {
  schema?: object;
  data?: [EnvSchemaData, ...EnvSchemaData[]] | EnvSchemaData;
  env?: boolean;
  dotenv?: boolean | DotenvConfigOptions;
  expandEnv?: boolean
  ajv?: Ajv | {
    customOptions(ajvInstance: Ajv): Ajv;
  };
};

declare const loadAndValidateEnvironment: {
  <T = EnvSchemaData>(_opts?: EnvSchemaOpt): T;
  keywords: {
    separator: KeywordDefinition;
  }
}

export default loadAndValidateEnvironment;
export { loadAndValidateEnvironment as envSchema };
