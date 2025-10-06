# env-schema

[![CI](https://github.com/fastify/env-schema/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fastify/env-schema/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/env-schema.svg?style=flat)](https://www.npmjs.com/package/env-schema)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-brightgreen?style=flat)](https://github.com/neostandard/neostandard)

Utility to check environment variables using [JSON schema](https://json-schema.org/), [Ajv](http://npm.im/ajv), and
[dotenv](http://npm.im/dotenv).

See [supporting resources](#supporting-resources) section for helpful guides on getting started.

## Install

```
npm i env-schema
```

## Usage

```js
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    }
  }
}

const config = envSchema({
  schema: schema,
  data: data, // optional, default: process.env
  dotenv: true // load .env if it is there, default: false
  // or you can pass DotenvConfigOptions
  // dotenv: {
  //   path: '/custom/path/to/.env'
  // }
})

console.log(config)
// output: { PORT: 3000 }
```

see [DotenvConfigOptions](https://github.com/motdotla/dotenv#options)

### Custom ajv instance

Optionally, the user can supply their own ajv instance:

```js
const envSchema = require('env-schema')
const Ajv = require('ajv')

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    }
  }
}

const config = envSchema({
  schema: schema,
  data: data,
  dotenv: true,
  ajv: new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true
  })
})

console.log(config)
// output: { PORT: 3000 }
```

It is possible to enhance the default ajv instance providing the `customOptions` as a function or object parameter.

When `customOptions` is an object, the provided ajv options override the default ones:

```js
const config = envSchema({
  schema: schema,
  data: data,
  dotenv: true,
  ajv: {
    customOptions: {
      coerceTypes: true
    }
  }
})
```

When `customOptions` is a function, it must return the updated ajv instance.
This example shows how to use the `format` keyword in your schemas.

```js
const config = envSchema({
  schema: schema,
  data: data,
  dotenv: true,
  ajv: {
    customOptions (ajvInstance) {
      require('ajv-formats')(ajvInstance)
      return ajvInstance
    }
  }
})
```

### Order of configuration loading

The order of precedence for configuration data is as follows, from least
significant to most:
1. Data sourced from `.env` file (when `dotenv` configuration option is set)
2. Data sourced from environment variables in `process.env`
3. Data provided via the `data` configuration option

### Fluent-Schema API

It is also possible to use [fluent-json-schema](http://npm.im/fluent-json-schema):

```js
const envSchema = require('env-schema')
const S = require('fluent-json-schema')

const config = envSchema({
  schema: S.object().prop('PORT', S.number().default(3000).required()),
  data: data, // optional, default: process.env
  dotenv: true, // load .env if it is there, default: false
  expandEnv: true, // use dotenv-expand, default: false
})

console.log(config)
// output: { PORT: 3000 }
```

**NB** Support for additional properties in the schema is disabled for this plugin, with the `additionalProperties` flag set to `false` internally.

### Custom keywords
This library supports the following Ajv custom keywords:

#### `separator`
Type: `string`

Applies to type: `string`

When present, the provided schema value will be split on this value.

Example:
```js
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  required: [ 'ALLOWED_HOSTS' ],
  properties: {
    ALLOWED_HOSTS: {
      type: 'string',
      separator: ','
    }
  }
}

const data = {
  ALLOWED_HOSTS: '127.0.0.1,0.0.0.0'
}

const config = envSchema({
  schema: schema,
  data: data, // optional, default: process.env
  dotenv: true // load .env if it is there, default: false
})

// config.ALLOWED_HOSTS => ['127.0.0.1', '0.0.0.0']
```

The ajv keyword definition objects can be accessed through the property `keywords` on the `envSchema` function:

```js
const envSchema = require('env-schema')
const Ajv = require('ajv')

const schema = {
  type: 'object',
  properties: {
    names: {
      type: 'string',
      separator: ','
    }
  }
}

const config = envSchema({
  schema: schema,
  data: data,
  dotenv: true,
  ajv: new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
    keywords: [envSchema.keywords.separator]
  })
})

console.log(config)
// output: { names: ['foo', 'bar'] }
```

### TypeScript

You can specify the type of your `config`:

```ts
import { envSchema, JSONSchemaType } from 'env-schema'

interface Env {
  PORT: number;
}

const schema: JSONSchemaType<Env> = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    }
  }
}

const config = envSchema({
  schema
})
```

You can also use a `JSON Schema` library like `typebox`:

```ts
import { envSchema } from 'env-schema'
import { Static, Type } from '@sinclair/typebox'

const schema = Type.Object({
  PORT: Type.Number({ default: 3000 })
})

type Schema = Static<typeof schema>

const config = envSchema<Schema>({
  schema
})
```

If no type is specified the `config` will have the `EnvSchemaData` type.

```ts
export type EnvSchemaData = {
  [key: string]: unknown;
}
```

## Supporting resources

The following section lists helpful reference applications, articles, guides, and other
resources that demonstrate the use of env-schema in different use cases and scenarios:

* A reference application using [Fastify with env-schema and dotenv](https://github.com/lirantal/fastify-dotenv-envschema-example)

## Acknowledgments

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/) and
[NearForm](https://nearform.com).

## License

Licensed under [MIT](./LICENSE).
