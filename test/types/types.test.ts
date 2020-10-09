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
  data: {},
});
envSchema({
  dotenv: true,
});
envSchema({
  dotenv: {},
});
