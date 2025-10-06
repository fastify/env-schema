'use strict'

const { test } = require('node:test')
const Ajv = require('ajv')
const makeTest = require('./make-test')
const { join } = require('node:path')

process.env.VALUE_FROM_ENV = 'pippo'

const tests = [
  {
    name: 'empty ok',
    schema: { type: 'object' },
    data: { },
    isOk: true,
    confExpected: {}
  },
  {
    name: 'simple object - ok',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'string'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: '44'
    }
  },
  {
    name: 'simple object - ok - coerce value',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - remove additional properties',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: {
      PORT: '44',
      ANOTHER_PORT: '55'
    },
    isOk: true,
    confExpected: {
      PORT: 44
    }
  },
  {
    name: 'simple object - ok - use default',
    schema: {
      type: 'object',
      properties: {
        PORT: {
          type: 'integer',
          default: 5555
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 5555
    }
  },
  {
    name: 'simple object - ok - required + default',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        }
      }
    },
    data: { },
    isOk: true,
    confExpected: {
      PORT: 6666
    }
  },
  {
    name: 'simple object - ok - allow array',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        }
      }
    },
    data: [{ }],
    isOk: true,
    confExpected: {
      PORT: 6666
    }
  },
  {
    name: 'simple object - ok - merge multiple object + env',
    schema: {
      type: 'object',
      required: ['PORT', 'MONGODB_URL'],
      properties: {
        PORT: {
          type: 'integer',
          default: 6666
        },
        MONGODB_URL: {
          type: 'string'
        },
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: [{ PORT: 3333 }, { MONGODB_URL: 'mongodb://localhost/pippo' }],
    isOk: true,
    confExpected: {
      PORT: 3333,
      MONGODB_URL: 'mongodb://localhost/pippo',
      VALUE_FROM_ENV: 'pippo'
    }
  },
  {
    name: 'simple object - ok - load only from env',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_ENV'],
      properties: {
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: undefined,
    isOk: true,
    confExpected: {
      VALUE_FROM_ENV: 'pippo'
    }
  },
  {
    name: 'simple object - ok - opts override environment',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_ENV'],
      properties: {
        VALUE_FROM_ENV: {
          type: 'string'
        }
      }
    },
    data: { VALUE_FROM_ENV: 'pluto' },
    isOk: true,
    confExpected: {
      VALUE_FROM_ENV: 'pluto'
    }
  },
  {
    name: 'simple object - ok - load only from .env',
    schema: {
      type: 'object',
      required: ['VALUE_FROM_DOTENV'],
      properties: {
        VALUE_FROM_DOTENV: {
          type: 'string'
        }
      }
    },
    data: undefined,
    isOk: true,
    dotenv: { path: join(__dirname, '.env') },
    confExpected: {
      VALUE_FROM_DOTENV: 'look ma'
    }
  },
  {
    name: 'simple object - KO',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: { },
    isOk: false,
    errorMessage: 'env must have required property \'PORT\''
  },
  {
    name: 'simple object - invalid data',
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: [],
    isOk: false,
    errorMessage: 'opts/data must NOT have fewer than 1 items, opts/data must be object, opts/data must match exactly one schema in oneOf'
  }
]

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true
})

tests.forEach(function (testConf) {
  test(testConf.name, t => {
    const options = {
      schema: testConf.schema,
      data: testConf.data,
      dotenv: testConf.dotenv,
      dotenvConfig: testConf.dotenvConfig,
      ajv
    }

    makeTest(t, options, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
})

const noCoercionTest = {
  name: 'simple object - not ok - should NOT coerce value',
  schema: {
    type: 'object',
    properties: {
      PORT: {
        type: 'integer'
      }
    }
  },
  data: {
    PORT: '44'
  },
  isOk: false,
  errorMessage: 'env/PORT must be integer',
  confExpected: {
    PORT: 44
  }
}

const strictValidator = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: false,
  allowUnionTypes: true
});

[noCoercionTest].forEach(function (testConf) {
  test(testConf.name, t => {
    const options = {
      schema: testConf.schema,
      data: testConf.data,
      dotenv: testConf.dotenv,
      dotenvConfig: testConf.dotenvConfig,
      ajv: strictValidator
    }

    makeTest(t, options, testConf.isOk, testConf.confExpected, testConf.errorMessage)
  })
})

test('ajv enhancement', async t => {
  t.plan(3)
  const testCaseFn = {
    schema: {
      type: 'object',
      required: ['MONGODB_URL'],
      properties: {
        MONGODB_URL: {
          type: 'string',
          format: 'uri'
        }
      }
    },
    data: [{ PORT: 3333 }, { MONGODB_URL: 'mongodb://localhost/pippo' }],
    isOk: true,
    confExpected: {
      MONGODB_URL: 'mongodb://localhost/pippo'
    }
  }
  const testCaseObj = {
    schema: {
      type: 'object',
      required: ['PORT'],
      properties: {
        PORT: {
          type: 'string',
        }
      }
    },
    data: [{ PORT: 3333 }],
    isOk: true,
    confExpected: {
      PORT: '3333'
    }
  }

  await t.test('customOptions fn return', async t => {
    const options = {
      schema: testCaseFn.schema,
      data: testCaseFn.data,
      ajv: {
        customOptions (ajvInstance) {
          require('ajv-formats')(ajvInstance)
          return ajvInstance
        }
      }
    }
    makeTest(t, options, testCaseFn.isOk, testCaseFn.confExpected)
  })

  await t.test('customOptions fn no return', async t => {
    const options = {
      schema: testCaseFn.schema,
      data: testCaseFn.data,
      ajv: {
        customOptions (_ajvInstance) {
          // do nothing
        }
      }
    }
    makeTest(t, options, false, undefined, 'customOptions function must return an instance of Ajv')
  })

  await t.test('customOptions object override', async t => {
    const options = {
      schema: testCaseObj.schema,
      data: testCaseObj.data,
      ajv: {
        customOptions: {
          coerceTypes: true,
        }
      }
    }
    makeTest(t, options, testCaseObj.isOk, testCaseObj.confExpected)
  })
})
