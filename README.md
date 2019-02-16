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

### Preprocess

```js
const envSchema = require('env-schema')

const schema = {
  preProcess: {
    TRUSTED_IPS: 'array', // default split by `:`
    SAMPLE_JSON: 'object', // valid JSON string by `JSON.parse`
    CUSTOM_ARRAY (val) {
      return val.split(',')
    }
  },
  type: 'object',
  required: [ 'TRUSTED_IPS', 'SAMPLE_JSON', 'CUSTOM_ARRAY' ],
  properties: {
    PORT: {
      type: 'integer',
      default: '3000'
    },
    SAMPLE_JSON: {
      type: 'object',
      properties: {
        foo: {
          type: 'object',
          properties: {
            bar: {
              type: 'object',
              properties: {
                baz: {
                  type: 'boolean'
                }
              }
            }
          }
        }
      }
    },
    TRUSTED_IPS: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    CUSTOM_ARRAY: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
}

const config = envSchema({
  schema: schema,
  data: {
    TRUSTED_IPS: '127.0.0.1:127.0.0.2',
    CUSTOM_ARRAY: '127.0.0.1,127.0.0.2',
    SAMPLE_JSON: '{"foo":{"bar":{"baz":true}}}'
  }
})

console.log(config)
// output: {
//   PORT: 3000,
//   TRUSTED_IPS: [ '127.0.0.1', '127.0.0.2' ],
//   CUSTOM_ARRAY: [ '127.0.0.1', '127.0.0.2' ],
//   SAMPLE_JSON: {
//     foo: {
//       bar: {
//         baz: true
//       }
//     }
//   }
// }
```

**NB:** internally this plugin force to not have additional properties, so the `additionalProperties` flag is forced to be `false`


## Acknowledgements

Kindly sponsored by [Mia Platform](https://www.mia-platform.eu/) and
[NearForm](https://nearform.com).

## License

MIT
