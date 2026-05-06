import { expect } from 'tstyche'
import envSchema, {
  EnvSchemaData,
  EnvSchemaOpt,
  keywords,
  envSchema as envSchemaNamed,
  default as envSchemaDefault,
} from '.'
import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv'
import { Static, Type } from 'typebox'

interface EnvData {
  PORT: number;
}

const schemaWithType: JSONSchemaType<EnvData> = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
  },
}

const schemaTypebox = Type.Object({
  PORT: Type.Number({ default: 3000 }),
})

type SchemaTypebox = Static<typeof schemaTypebox>

const data = {
  foo: 'bar',
}

expect(envSchema()).type.toBe<EnvSchemaData | unknown>()
expect(envSchemaNamed()).type.toBe<EnvSchemaData | unknown>()
expect(envSchemaDefault()).type.toBe<EnvSchemaData | unknown>()

const emptyOpt: EnvSchemaOpt = {}
expect(emptyOpt).type.toBe<EnvSchemaOpt>()

const optWithSchemaTypebox: EnvSchemaOpt = {
  schema: schemaTypebox,
}
expect(optWithSchemaTypebox).type.toBe<EnvSchemaOpt>()

const optWithSchemaWithType: EnvSchemaOpt<EnvData> = {
  schema: schemaWithType,
}
expect(optWithSchemaWithType).type.toBe<EnvSchemaOpt<EnvData>>()

const optWithData: EnvSchemaOpt = {
  data,
}
expect(optWithData).type.toBe<EnvSchemaOpt>()

expect<EnvSchemaOpt>().type.not.toBeAssignableFrom({
  data: [],
})

const optWithArrayData: EnvSchemaOpt = {
  data: [{}],
}
expect(optWithArrayData).type.toBe<EnvSchemaOpt>()

const optWithMultipleItemArrayData: EnvSchemaOpt = {
  data: [{}, {}],
}
expect(optWithMultipleItemArrayData).type.toBe<EnvSchemaOpt>()

const optWithDotEnvBoolean: EnvSchemaOpt = {
  dotenv: true,
}
expect(optWithDotEnvBoolean).type.toBe<EnvSchemaOpt>()

const optWithDotEnvOpt: EnvSchemaOpt = {
  dotenv: {},
}
expect(optWithDotEnvOpt).type.toBe<EnvSchemaOpt>()

const optWithEnvExpand: EnvSchemaOpt = {
  expandEnv: true,
}
expect(optWithEnvExpand).type.toBe<EnvSchemaOpt>()

const optWithAjvInstance: EnvSchemaOpt = {
  ajv: new Ajv(),
}
expect(optWithAjvInstance).type.toBe<EnvSchemaOpt>()
expect(envSchema.keywords.separator).type.toBe<KeywordDefinition>()

const optWithAjvCustomOptions: EnvSchemaOpt = {
  ajv: {
    customOptions (_ajvInstance: Ajv): Ajv {
      return new Ajv()
    },
  },
}
expect(optWithAjvCustomOptions).type.toBe<EnvSchemaOpt>()

expect<EnvSchemaOpt>()
  .type.not.toBeAssignableFrom({
    ajv: {
      customOptions (_ajvInstance: Ajv) {}
    }
  })

const envSchemaWithType = envSchema({ schema: schemaWithType })
expect(envSchemaWithType).type.toBe<EnvData>()

const envSchemaTypebox = envSchema<SchemaTypebox>({ schema: schemaTypebox })
expect(envSchemaTypebox).type.toBe<SchemaTypebox>()

expect(keywords.separator).type.toBe<KeywordDefinition>()
expect(envSchema.keywords.separator).type.toBe<KeywordDefinition>()
