import { expectError, expectType, expectAssignable, expectNotAssignable } from "tsd";
import envSchema, { PlainObject, EnvSchemaOpt } from "../..";
import { OptionsSchema } from "./options.schema"

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

expectType<PlainObject>(envSchema());

expectAssignable<EnvSchemaOpt>({ schema });
expectAssignable<EnvSchemaOpt>({ schema, data });

expectAssignable<EnvSchemaOpt>({
  schema,
  data: [{}],
});

expectAssignable<EnvSchemaOpt>({
  schema,
  data: [{}, {}],
});

expectAssignable<EnvSchemaOpt>({
  schema,
  dotenv: true,
});

expectAssignable<EnvSchemaOpt>({
  schema,
  dotenv: { path: './foo/bar.env' },
});

expectAssignable<EnvSchemaOpt>({
  schema,
  env: false,
});

expectNotAssignable<EnvSchemaOpt>({
  schema,
  dotenv: 'foobar',
});

expectError<EnvSchemaOpt>({});
expectError<EnvSchemaOpt>({
  schema,
  data: 'foo'
});

const assignableOpt: EnvSchemaOpt = { schema };
expectAssignable<OptionsSchema>(assignableOpt);