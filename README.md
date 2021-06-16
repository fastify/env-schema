# env-schema

![CI](https://github.com/fastify/env-schema/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/env-schema.svg?style=flat)](https://www.npmjs.com/package/env-schema)
[![Known Vulnerabilities](https://snyk.io/test/github/fastify/env-schema/badge.svg)](https://snyk.io/test/github/fastify/env-schema)
[![Coverage Status](https://coveralls.io/repos/github/fastify/env-schema/badge.svg?branch=master)](https://coveralls.io/github/fastify/env-schema?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Utility to check environment variables using [JSON schema](https://json-schema.org/), [Ajv](http://npm.im/ajv), and
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
  dotenv: true // load .env if it is there, default: false
})

console.log(config)
// output: { PORT: 3000 }
```

It is also possible to use [fluent-json-schema](http://npm.im/fluent-json-schema):

```js
const envSchema = require('env-schema')
const S = require('fluent-json-schema')

const config = envSchema({
  schema: S.object().prop('port', S.string().default('3000').required()),
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

// config.data => ['127.0.0.1', '0.0.0.0']
```

#### `castBoolean`
Type: `string`

Applies to type: `string`

When present, the provided schema value will cast to [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean).

Value of castBoolean could be `normal` or `strict`.

* In **strict** mode value must be one of `'1'`, `'yes'` or `'true'` for `true` result, otherwise will be **false**.
* In **normal** mode must be one of `''`, `'0'`, `'no'` or `'false'` for `false` result, otherwise will be **true**.

**Note**: All value check case insensitively, so `Yes` is same as `yes`.

Example:
```js
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  required: [ 'IS_PRODUCTION' ],
  properties: {
    IS_PRODUCTION: {
      castBoolean: 'normal', // # `strict` or `normal`
      type: 'string'
    },
    IS_REALLY_TRUE: {
      castBoolean: 'strict', // # `strict` or `normal`
      type: 'string'
    }
  }
}

const data = {
  IS_PRODUCTION: 'iAgree',
  IS_REALLY_TRUE: 'iAgree',
}

const config = envSchema({
  schema: schema,
  data: data
}) 

console.log(config) // { IS_PRODUCTION: true, IS_REALLY_TRUE: false }
```

## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/) and
[NearForm](https://nearform.com).

## License

MIT
