import { expectError, expectType } from 'tsd';
import envSchema, {
  EnvSchemaData,
  EnvSchemaOpt,
  envSchema as envSchemaNamed,
  default as envSchemaDefault,
} from '..';
import Ajv, { KeywordDefinition, JSONSchemaType } from 'ajv';

interface EnvData {
  PORT: number;
}

const schemaAsConst = {
  type: 'object',
  required: ['PORT'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
  },
} as const;

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

const data = {
  foo: 'bar',
};

expectType<EnvSchemaData>(envSchema());
expectType<EnvSchemaData>(envSchemaNamed());
expectType<EnvSchemaData>(envSchemaDefault());

const emptyOpt: EnvSchemaOpt = {};
expectType<EnvSchemaOpt>(emptyOpt);

const optWithSchemaAsConst: EnvSchemaOpt<EnvData> = {
  schema: schemaAsConst,
};
expectType<EnvSchemaOpt<EnvData>>(optWithSchemaAsConst);

const optWithSchemaWithType: EnvSchemaOpt<EnvData> = {
  schema: schemaWithType,
};
expectType<EnvSchemaOpt<EnvData>>(optWithSchemaWithType);

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

const envSchemaWithType = envSchema({ schema: schemaWithType });
expectType<EnvData>(envSchemaWithType);

const envSchemaAsConst = envSchema<EnvData>({ schema: schemaAsConst });
expectType<EnvData>(envSchemaAsConst);
