# env-schema

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/env-schema.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/fastify/env-schema.svg?branch=master)](https://travis-ci.com/fastify/env-schame)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

It is possible to also use [fluent-schema](http://npm.im/fluent-schema):

```js
const envSchema = require('env-schema')
const S = require('fluent-schema')

const config = envSchema({
  schema: S.object().prop('port', S.string().default('3000').required()),
  data: data // optional, default: process.env
  dotenv: true // load .env if it's there, default: false
})

console.log(config)
// output: { PORT: 3000 }
```

**NB:** internally this plugin force to not have additional properties,
so the `additionalProperties` flag is forced to be `false`

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
