'use strict'

const t = require('tap')
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
  },
  {
    name: 'simple object - ok - with separator',
    schema: {
      type: 'object',
      required: ['ALLOWED_HOSTS'],
      properties: {
        ALLOWED_HOSTS: {
          type: 'string',
          separator: ','
        }
      }
    },
    data: {
      ALLOWED_HOSTS: '127.0.0.1,0.0.0.0'
    },
    isOk: true,
    confExpected: {
      ALLOWED_HOSTS: ['127.0.0.1', '0.0.0.0']
    }
  },
  {
    name: 'simple object - ok - with separator - only one value',
    schema: {
      type: 'object',
      required: ['ALLOWED_HOSTS'],
      properties: {
        ALLOWED_HOSTS: {
          type: 'string',
          separator: ','
        }
      }
    },
    data: {
      ALLOWED_HOSTS: '127.0.0.1'
    },
    isOk: true,
    confExpected: {
      ALLOWED_HOSTS: ['127.0.0.1']
    }
  },
  {
    name: 'simple object - ok - with separator - no values',
    schema: {
      type: 'object',
      required: ['ALLOWED_HOSTS'],
      properties: {
        ALLOWED_HOSTS: {
          type: 'string',
          separator: ','
        }
      }
    },
    data: {
      ALLOWED_HOSTS: ''
    },
    isOk: true,
    confExpected: {
      ALLOWED_HOSTS: []
    }
  },
  {
    name: 'simple object - KO - with separator',
    schema: {
      type: 'object',
      required: ['ALLOWED_HOSTS'],
      properties: {
        ALLOWED_HOSTS: {
          type: 'string',
          separator: ','
        }
      }
    },
    data: {},
    isOk: false,
    errorMessage: 'env must have required property \'ALLOWED_HOSTS\''
  },
  {
    name: 'simple object - KO - multiple required properties',
    schema: {
      type: 'object',
      required: ['A', 'B', 'C'],
      properties: {
        A: { type: 'string' },
        B: { type: 'string' },
        C: { type: 'string' },
        D: { type: 'string' }
      }
    },
    data: {},
    isOk: false,
    errorMessage: 'env must have required property \'A\', env must have required property \'B\', env must have required property \'C\''
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
