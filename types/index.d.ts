import Ajv, { KeywordDefinition, JSONSchemaType as AjvJSONSchemaType } from 'ajv'
import { AnySchema } from 'ajv/dist/core'

type StrictNullChecksWrapper<Name extends string, Type> = undefined extends null
  ? `strictNullChecks must be true in tsconfig to use ${Name}`
  : Type
type UnionToIntersection<U> = (U extends any ? (_: U) => void : never) extends (_: infer I) => void ? I : never
type UncheckedPartialSchema<T> = Partial<UncheckedJSONSchemaType<T, true>>
type JSONType<T extends string, IsPartial extends boolean> = IsPartial extends true ? T | undefined : T

interface NumberKeywords {
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  format?: string;
}

interface StringKeywords {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
}

type UncheckedJSONSchemaType<T, IsPartial extends boolean> = (
  | {
    anyOf: readonly UncheckedJSONSchemaType<T, IsPartial>[];
  }
  | {
    oneOf: readonly UncheckedJSONSchemaType<T, IsPartial>[];
  }
  | ({
    type: readonly (T extends number
      ? JSONType<'number' | 'integer', IsPartial>
      : T extends string
        ? JSONType<'string', IsPartial>
        : T extends boolean
          ? JSONType<'boolean', IsPartial>
          : never)[];
  } & UnionToIntersection<
    T extends number ? NumberKeywords : T extends string ? StringKeywords : T extends boolean ? unknown : never
  >)
  | ((T extends number
    ? {
      type: JSONType<'number' | 'integer', IsPartial>;
    } & NumberKeywords
    : T extends string
      ? {
        type: JSONType<'string', IsPartial>;
      } & StringKeywords
      : T extends boolean
        ? {
            type: JSONType<'boolean', IsPartial>;
          }
        : T extends readonly [any, ...any[]]
          ? {
            type: JSONType<'array', IsPartial>;
            items: {
              readonly [K in keyof T]-?: UncheckedJSONSchemaType<T[K], false> & Nullable<T[K]>;
            } & {
              length: T['length'];
            };
            minItems: T['length'];
          } & ({ maxItems: T['length'] } | { additionalItems: false })
          : T extends readonly any[]
            ? {
                type: JSONType<'array', IsPartial>;
                items: UncheckedJSONSchemaType<T[0], false>;
                contains?: UncheckedPartialSchema<T[0]>;
                minItems?: number;
                maxItems?: number;
                minContains?: number;
                maxContains?: number;
                uniqueItems?: true;
                additionalItems?: never;
              }
            : T extends Record<string, any>
              ? {
                type: JSONType<'object', IsPartial>;
                additionalProperties?: boolean | UncheckedJSONSchemaType<T[string], false>;
                unevaluatedProperties?: boolean | UncheckedJSONSchemaType<T[string], false>;
                properties?: IsPartial extends true
                  ? Partial<UncheckedPropertiesSchema<T>>
                  : UncheckedPropertiesSchema<T>;
                patternProperties?: Record<string, UncheckedJSONSchemaType<T[string], false>>;
                propertyNames?: Omit<UncheckedJSONSchemaType<string, false>, 'type'> & {
                  type?: 'string';
                };
                dependencies?: {
                  [K in keyof T]?: readonly (keyof T)[] | UncheckedPartialSchema<T>;
                };
                dependentRequired?: {
                  [K in keyof T]?: readonly (keyof T)[];
                };
                dependentSchemas?: {
                  [K in keyof T]?: UncheckedPartialSchema<T>;
                };
                minProperties?: number;
                maxProperties?: number;
              } & (IsPartial extends true
                ? {
                    required: readonly (keyof T)[];
                  }
                : [UncheckedRequiredMembers<T>] extends [never]
                    ? {
                        required?: readonly UncheckedRequiredMembers<T>[];
                      }
                    : {
                        required: readonly UncheckedRequiredMembers<T>[];
                      })
              : T extends null
                ? {
                    type: JSONType<'null', IsPartial>;
                    nullable: true;
                  }
                : never) & {
                  allOf?: readonly UncheckedPartialSchema<T>[];
                  anyOf?: readonly UncheckedPartialSchema<T>[];
                  oneOf?: readonly UncheckedPartialSchema<T>[];
                  if?: UncheckedPartialSchema<T>;
                  then?: UncheckedPartialSchema<T>;
                  else?: UncheckedPartialSchema<T>;
                  not?: UncheckedPartialSchema<T>;
                })
) & {
  [keyword: string]: any;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, UncheckedJSONSchemaType<Known, true>>;
  definitions?: Record<string, UncheckedJSONSchemaType<Known, true>>;
}

type Known =
  | { [key: string]: Known }
  | [Known, ...Known[]]
  | Known[]
  | number
  | string
  | boolean
  | null

type UncheckedPropertiesSchema<T> = {
  [K in keyof T]-?:
    | (UncheckedJSONSchemaType<T[K], false> & Nullable<T[K]>)
    | (NonNullable<T[K]> extends readonly string[]
      ? UncheckedJSONSchemaType<string, false> & { separator: string } & Nullable<
        undefined extends T[K] ? string | string[] | undefined : string | string[]
      >
      : never)
    | {
      $ref: string;
    };
}

type UncheckedRequiredMembers<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T]

type Nullable<T> = undefined extends T
  ? {
      nullable: true;
      const?: null;
      enum?: readonly (T | null)[];
      default?: T | null;
    }
  : {
      nullable?: false;
      const?: T;
      enum?: readonly T[];
      default?: T;
    }

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
  encoding?: 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';
}

type EnvSchema = typeof envSchema

declare namespace envSchema {
  export type JSONSchemaType<T> = StrictNullChecksWrapper<'JSONSchemaType', UncheckedJSONSchemaType<T, false>>

  export type EnvSchemaData = {
    [key: string]: unknown;
  }

  export type EnvSchemaOpt<T = EnvSchemaData> = {
    schema?: JSONSchemaType<T> | AjvJSONSchemaType<T> | AnySchema;
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
