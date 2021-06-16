'use strict'

const t = require('tap')
const makeTest = require('./make-test')

process.env.VALUE_FROM_ENV = 'pippo'

const tests = [
  {
    name: 'simple boolean',
    schema: {
      type: 'object',
      properties: {
        BOOLEAN_TEST_TRUE_STRICT_1: {
          castBoolean: 'strict',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_STRICT_2: {
          castBoolean: 'strict',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_STRICT_3: {
          castBoolean: 'strict',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_STRICT_4: {
          castBoolean: 'strict',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_NON_STRICT_1: {
          castBoolean: 'normal',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_NON_STRICT_2: {
          castBoolean: 'normal',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_NON_STRICT_3: {
          castBoolean: 'normal',
          type: 'string'
        },
        BOOLEAN_TEST_TRUE_NON_STRICT_4: {
          castBoolean: 'normal',
          type: 'string'
        }
      }
    },
    data: {
      BOOLEAN_TEST_TRUE_STRICT_1: 'yes',
      BOOLEAN_TEST_TRUE_STRICT_2: 'TRUE',
      BOOLEAN_TEST_TRUE_STRICT_3: '1',
      BOOLEAN_TEST_TRUE_STRICT_4: 'disabled',
      BOOLEAN_TEST_TRUE_NON_STRICT_1: 'false',
      BOOLEAN_TEST_TRUE_NON_STRICT_2: '0',
      BOOLEAN_TEST_TRUE_NON_STRICT_3: 'no',
      BOOLEAN_TEST_TRUE_NON_STRICT_4: 'notReally'
    },
    isOk: true,
    confExpected: {
      BOOLEAN_TEST_TRUE_STRICT_1: true,
      BOOLEAN_TEST_TRUE_STRICT_2: true,
      BOOLEAN_TEST_TRUE_STRICT_3: true,
      BOOLEAN_TEST_TRUE_STRICT_4: false,
      BOOLEAN_TEST_TRUE_NON_STRICT_1: false,
      BOOLEAN_TEST_TRUE_NON_STRICT_2: false,
      BOOLEAN_TEST_TRUE_NON_STRICT_3: false,
      BOOLEAN_TEST_TRUE_NON_STRICT_4: true
    }
  }
]

tests.forEach(function (testConf) {
  t.test(testConf.name, t => {
    const options = {
      schema: testConf.schema,
      data: testConf.data,
      dotenv: testConf.dotenv,
      dotenvConfig: testConf.dotenvConfig
    }

    makeTest(t, options, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
})
