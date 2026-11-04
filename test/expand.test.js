'use strict'

/* eslint-disable no-template-curly-in-string */

const { test } = require('node:test')
const makeTest = require('./make-test')
const { join } = require('node:path')

process.env.K8S_NAMESPACE = 'pippo'
process.env.K8S_CLUSTERID = 'pluto'
process.env.URL = 'https://prefix.$K8S_NAMESPACE.$K8S_CLUSTERID.my.domain.com'
process.env.PASSWORD = 'password'

const tests = [
  {
    name: 'simple object - ok - expandEnv',
    schema: {
      type: 'object',
      properties: {
        URL: {
          type: 'string'
        },
        K8S_NAMESPACE: {
          type: 'string'
        }
      }
    },
    expandEnv: true,
    isOk: true,
    confExpected: {
      URL: 'https://prefix.pippo.pluto.my.domain.com',
      K8S_NAMESPACE: 'pippo'
    }
  },
  {
    name: 'simple object - ok - expandEnv use dotenv',
    schema: {
      type: 'object',
      properties: {
        EXPANDED_VALUE_FROM_DOTENV: {
          type: 'string'
        }
      }
    },
    expandEnv: true,
    isOk: true,
    dotenv: { path: join(__dirname, '.env') },
    confExpected: {
      EXPANDED_VALUE_FROM_DOTENV: 'the password is password!'
    }
  },
  {
    name: 'simple object - ok - expandEnv works when passed an arbitrary new object based on process.env as data',
    schema: {
      type: 'object',
      properties: {
        URL: {
          type: 'string'
        },
        K8S_NAMESPACE: {
          type: 'string'
        }
      }
    },
    expandEnv: true,
    isOk: true,
    data: {
      ...process.env,
      K8S_NAMESPACE: 'hello'
    },
    confExpected: {
      URL: 'https://prefix.hello.pluto.my.domain.com',
      K8S_NAMESPACE: 'hello'
    }
  },
  {
    name: 'simple object - ok - expandEnv with undefined variable keeps placeholder',
    schema: {
      type: 'object',
      properties: {
        MESSAGE: {
          type: 'string'
        }
      }
    },
    expandEnv: true,
    isOk: true,
    data: {
      MESSAGE: 'Hello $UNDEFINED_VAR world'
    },
    confExpected: {
      MESSAGE: 'Hello $UNDEFINED_VAR world'
    }
  },
  {
    name: 'simple object - ok - expandEnv resolves chained references whatever the key order',
    schema: {
      type: 'object',
      properties: {
        DATABASE_URL: { type: 'string' },
        DB_HOST: { type: 'string' }
      }
    },
    expandEnv: true,
    isOk: true,
    data: {
      DATABASE_URL: 'postgres://$DB_HOST/app',
      DB_HOST: '${DB_NAME}.internal',
      DB_NAME: 'db'
    },
    confExpected: {
      DATABASE_URL: 'postgres://db.internal/app',
      DB_HOST: 'db.internal'
    }
  },
  {
    name: 'simple object - ok - expandEnv supports default values and escaped dollar signs',
    schema: {
      type: 'object',
      properties: {
        UNSET: { type: 'string' },
        EMPTY: { type: 'string' },
        EMPTY_DASH: { type: 'string' },
        SET: { type: 'string' },
        PRICE: { type: 'string' },
        URL: { type: 'string' },
        LOOP: { type: 'string' }
      }
    },
    expandEnv: true,
    isOk: true,
    data: {
      BLANK: '',
      HOST: 'h',
      UNSET: '${MISSING:-http://$HOST}',
      EMPTY: '${BLANK:-fallback}',
      EMPTY_DASH: '${BLANK-fallback}',
      SET: '${HOST:-fallback}',
      PRICE: '\\$5',
      PORT: 3000,
      URL: 'http://h:$PORT',
      LOOP: 'a$LOOP'
    },
    confExpected: {
      UNSET: 'http://h',
      EMPTY: 'fallback',
      EMPTY_DASH: '',
      SET: 'h',
      PRICE: '$5',
      URL: 'http://h:3000',
      LOOP: 'a$LOOP'
    }
  }
]

tests.forEach(function (testConf) {
  test(testConf.name, t => {
    const options = {
      schema: testConf.schema,
      data: testConf.data,
      dotenv: testConf.dotenv,
      dotenvConfig: testConf.dotenvConfig,
      expandEnv: testConf.expandEnv
    }

    makeTest(t, options, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
})
