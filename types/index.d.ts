import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv'
import { AnySchema } from 'ajv/dist/core'

/**
 * Options for loading .env files
 */
interface DotenvOptions {
  /**
   * Path to .env file (default: '.env')
   */
  path?: string;
  /**
   * Encoding of .env file (default: 'utf8')
   */
  encoding?: BufferEncoding;
}

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
    dotenv?: boolean | DotenvOptions;
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
