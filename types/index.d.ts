import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv'
import { AnySchema } from 'ajv/dist/core'
import { DotenvConfigOptions } from 'dotenv'

type EnvSchema = typeof envSchema

declare namespace envSchema {
  export type { JSONSchemaType }

  export type EnvSchemaData = {
    [key: string]: unknown;
  }

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
  }

  export const keywords: {
    separator: KeywordDefinition
  }

  export const envSchema: EnvSchema
  export { envSchema as default }
}

declare function envSchema<T = envSchema.EnvSchemaData> (_opts?: envSchema.EnvSchemaOpt<T>): T
export = envSchema
