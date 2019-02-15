# fastify-env

[![Greenkeeper badge](https://badges.greenkeeper.io/fastify/env-schema.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/fastify/env-schema.svg?branch=master)](https://travis-ci.com/fastify/env-schame)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Utility to check environment variables using JSON schema, Ajv and
dotenv.

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
  dotenv: true // load .env if it's there
})

console.log(config)
// output: { PORT: 3000 }
```

**NB:** internally this plugin force to not have additional properties, so the `additionalProperties` flag is forced to be `false`


## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/) and
[NearForm](https://nearform.com).

## License

MIT
