'use strict'

const t = require('tap')
const envSchema = require('../index')

t.test('no globals', t => {
  t.plan(2)

  const options = {
    confKey: 'secrets',
    data: {
      MONGO_URL: 'good'
    },
    schema: {
      $id: 'schema:dotenv',
      type: 'object',
      required: ['MONGO_URL'],
      properties: {
        PORT: {
          type: 'integer',
          default: 3000
        },
        MONGO_URL: {
          type: 'string'
        }
      }
    }
  }

  {
    const conf = envSchema(JSON.parse(JSON.stringify(options)))
    t.strictSame(conf, { MONGO_URL: 'good', PORT: 3000 })
  }
  {
    const conf = envSchema(JSON.parse(JSON.stringify(options)))
    t.strictSame(conf, { MONGO_URL: 'good', PORT: 3000 })
  }
})
