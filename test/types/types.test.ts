import envSchema from "../..";

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

envSchema();
envSchema({
  schema,
});
envSchema({
  schema,
  data: {
    foo: "bar",
  },
});
envSchema({
  // @ts-expect-error
  data: [], // min 1 item
});
envSchema({
  data: [{}],
});
envSchema({
  data: [{}, {}],
});
envSchema({
  dotenv: true,
});
envSchema({
  dotenv: {},
});
