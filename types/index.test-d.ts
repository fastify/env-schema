import { expectError, expectType } from 'tsd';
import envSchema, {
  EnvSchemaData,
  EnvSchemaOpt,
  keywords,
  envSchema as envSchemaNamed,
  default as envSchemaDefault,
} from '..';
import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv';
import { Static, Type } from '@sinclair/typebox';
import S from 'fluent-json-schema';

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
};

const schemaFluent = S.object().prop(
  'PORT',
  S.number().default(3000).required()
);

const schemaTypebox = Type.Object({
  PORT: Type.Number({ default: 3000 }),
});

type SchemaTypebox = Static<typeof schemaTypebox>;

const data = {
  foo: 'bar',
};

expectType<EnvSchemaData>(envSchema());
expectType<EnvSchemaData>(envSchemaNamed());
expectType<EnvSchemaData>(envSchemaDefault());

const emptyOpt: EnvSchemaOpt = {};
expectType<EnvSchemaOpt>(emptyOpt);

const optWithSchemaFluent: EnvSchemaOpt = {
  schema: schemaFluent,
};
expectType<EnvSchemaOpt>(optWithSchemaFluent);

const optWithSchemaTypebox: EnvSchemaOpt = {
  schema: schemaTypebox,
};
expectType<EnvSchemaOpt>(optWithSchemaTypebox);

const optWithSchemaWithType: EnvSchemaOpt = {
  schema: schemaWithType,
};
expectType<EnvSchemaOpt>(optWithSchemaWithType);

const optWithData: EnvSchemaOpt = {
  data,
};
expectType<EnvSchemaOpt>(optWithData);

expectError<EnvSchemaOpt>({
  data: [], // min 1 item
});

const optWithArrayData: EnvSchemaOpt = {
  data: [{}],
};
expectType<EnvSchemaOpt>(optWithArrayData);

const optWithMultipleItemArrayData: EnvSchemaOpt = {
  data: [{}, {}],
};
expectType<EnvSchemaOpt>(optWithMultipleItemArrayData);

const optWithDotEnvBoolean: EnvSchemaOpt = {
  dotenv: true,
};
expectType<EnvSchemaOpt>(optWithDotEnvBoolean);

const optWithDotEnvOpt: EnvSchemaOpt = {
  dotenv: {},
};
expectType<EnvSchemaOpt>(optWithDotEnvOpt);

const optWithEnvExpand: EnvSchemaOpt = {
  expandEnv: true,
};
expectType<EnvSchemaOpt>(optWithEnvExpand);

const optWithAjvInstance: EnvSchemaOpt = {
  ajv: new Ajv(),
};
expectType<EnvSchemaOpt>(optWithAjvInstance);
expectType<KeywordDefinition>(envSchema.keywords.separator);

const optWithAjvCustomOptions: EnvSchemaOpt = {
  ajv: {
    customOptions(ajvInstance: Ajv): Ajv {
      return new Ajv();
    },
  },
};
expectType<EnvSchemaOpt>(optWithAjvCustomOptions);
expectError<EnvSchemaOpt>({
  ajv: {
    customOptions(ajvInstance: Ajv) {},
  },
});

const envSchemaWithType = envSchema<EnvData>({ schema: schemaWithType });
expectType<EnvData>(envSchemaWithType);

const envSchemaTypebox = envSchema<SchemaTypebox>({ schema: schemaTypebox });
expectType<SchemaTypebox>(envSchemaTypebox);

expectType<KeywordDefinition>(keywords.separator);
expectType<KeywordDefinition>(envSchema.keywords.separator);
