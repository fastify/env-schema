import { expectError, expectType } from "tsd";
import envSchema, { EnvSchemaData, EnvSchemaOpt, envSchema as envSchemaNamed, default as envSchemaDefault } from "../..";

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
  dotenv: true,
};
expectType<EnvSchemaOpt>(optWithDotEnvOpt);
