# env-schema

![CI](https://github.com/fastify/env-schema/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/env-schema.svg?style=flat)](https://www.npmjs.com/package/env-schema)
[![Known Vulnerabilities](https://snyk.io/test/github/fastify/env-schema/badge.svg)](https://snyk.io/test/github/fastify/env-schema)
[![Coverage Status](https://coveralls.io/repos/github/fastify/env-schema/badge.svg?branch=master)](https://coveralls.io/github/fastify/env-schema?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Utility to check environment variables using [JSON schema](https://json-schema.org/), [Ajv](http://npm.im/ajv) and
[dotenv](http://npm.im/dotenv).

## Install

```
npm install --save env-schema
```

## Usage

```js
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const config = envSchema({
  schema: schema,
  data: data // optional, default: process.env
  dotenv: true // load .env if it's there, default: false
})

console.log(config)
// output: { PORT: 3000 }
```

It is possible to also use [fluent-json-schema](http://npm.im/fluent-json-schema):

```js
const envSchema = require('env-schema')
const S = require('fluent-json-schema')

const config = envSchema({
  schema: S.object().prop('port', S.string().default('3000').required()),
  data: data, // optional, default: process.env
  dotenv: true, // load .env if it's there, default: false
  expandEnv: true, // use dotenv-expand, default: false
})

console.log(config)
// output: { PORT: 3000 }
```

**NB:** support for additional properties in the schema is disabled for this plugin, with the `additionalProperties` flag set to `false` internally.

### Custom keywords
This library supports the following Ajv custom keywords:

#### `separator`
Type: `string`

Applies to type: `string`

When present, the value provided will be split based by this value.

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
  dotenv: true // load .env if it's there, default: false
}) 

// config.data => ['127.0.0.1', '0.0.0.0']
```

## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/) and
[NearForm](https://nearform.com).

## License

MIT
