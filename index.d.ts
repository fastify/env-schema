export type EnvSchemaOpt = {
  schema?: object;
  data?: [object] | object;
  env?: boolean;
  dotenv?: boolean | object;
};

declare function loadAndValidateEnvironment(_opts?: EnvSchemaOpt): object;

export default loadAndValidateEnvironment;
