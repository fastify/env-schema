import { expectError, expectType } from "tsd";
import envSchema, { EnvSchemaData, EnvSchemaOpt, envSchema as envSchemaNamed, default as envSchemaDefault } from "../..";
import Ajv, { KeywordDefinition } from 'ajv'

const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
  },
};
const data = {
  foo: "bar",
};

expectType<EnvSchemaData>(envSchema());
expectType<EnvSchemaData>(envSchemaNamed());
expectType<EnvSchemaData>(envSchemaDefault());

const emptyOpt: EnvSchemaOpt = {};
expectType<EnvSchemaOpt>(emptyOpt);

const optWithSchema: EnvSchemaOpt = {
  schema,
};
expectType<EnvSchemaOpt>(optWithSchema);

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
  expandEnv: true
}
expectType<EnvSchemaOpt>(optWithEnvExpand);

const optWithAjvInstance: EnvSchemaOpt = {
  ajv: new Ajv()
};
expectType<EnvSchemaOpt>(optWithAjvInstance)
expectType<KeywordDefinition>(envSchema.keywords.separator)


const optWithAjvCustomOptions: EnvSchemaOpt = {
    ajv: {
        customOptions(ajvInstance: Ajv): Ajv {
            return new Ajv();
        }
    }
};
expectType<EnvSchemaOpt>(optWithAjvCustomOptions)
expectError<EnvSchemaOpt>({
    ajv: {
        customOptions(ajvInstance: Ajv) {
        }
    }
});

const envSchemaDefaultsToEnvSchemaData = envSchema({ schema: schema });
expectType<EnvSchemaData>(envSchemaDefaultsToEnvSchemaData)

interface EnvData {
  PORT: string
}
const envSchemaAllowsToSpecifyType = envSchema<EnvData>({ schema });
expectType<EnvData>(envSchemaAllowsToSpecifyType)
