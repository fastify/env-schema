'use strict'

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
