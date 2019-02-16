'use strict'

const t = require('tap')
const envSchema = require('../index')

const SAMPLE_JSON_ENV_VAR = {
  foo: {
    bar: {
      baz: true
    }
  }
}

process.env.VALUE_FROM_ENV = 'pippo'

function makeTest (t, options, isOk, confExpected, errorMessage) {
  t.plan(1)
  options = Object.assign({ confKey: 'config' }, options)

  try {
    const conf = envSchema(options)
    t.strictSame(conf, confExpected)
  } catch (err) {
    if (isOk) {
      t.fail(err)
      return
    }
    t.strictSame(err.message, errorMessage)
  }
}

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
      required: [ 'PORT' ],
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
      required: [ 'PORT' ],
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
      required: [ 'PORT', 'MONGODB_URL' ],
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
    data: [ { PORT: 3333 }, { MONGODB_URL: 'mongodb://localhost/pippo' } ],
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
      required: [ 'VALUE_FROM_ENV' ],
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
      required: [ 'VALUE_FROM_ENV' ],
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
      required: [ 'VALUE_FROM_DOTENV' ],
      properties: {
        VALUE_FROM_DOTENV: {
          type: 'string'
        }
      }
    },
    data: undefined,
    isOk: true,
    dotenv: { path: `${__dirname}/.env` },
    confExpected: {
      VALUE_FROM_DOTENV: 'look ma'
    }
  },
  {
    name: 'simple object - KO',
    schema: {
      type: 'object',
      required: [ 'PORT' ],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: { },
    isOk: false,
    errorMessage: 'should have required property \'PORT\''
  },
  {
    name: 'simple object - invalid data',
    schema: {
      type: 'object',
      required: [ 'PORT' ],
      properties: {
        PORT: {
          type: 'integer'
        }
      }
    },
    data: [],
    isOk: false,
    errorMessage: 'should NOT have fewer than 1 items,should be object,should match exactly one schema in oneOf'
  },
  {
    name: 'preprocess simple object - standard object as json',
    schema: {
      preProcess: {
        SAMPLE_OBJECT: 'object'
      },
      type: 'object',
      required: [ 'SAMPLE_OBJECT', 'PORT' ],
      properties: {
        PORT: {
          type: 'integer'
        },
        SAMPLE_OBJECT: {
          type: 'object',
          properties: {
            bar: {
              type: 'boolean'
            }
          }
        }
      }
    },
    data: {
      PORT: 1000,
      SAMPLE_OBJECT: '{"foo":{"bar":true}}'
    },
    isOk: true,
    confExpected: {
      PORT: 1000,
      SAMPLE_OBJECT: {
        foo: {
          bar: true
        }
      }
    }
  },
  {
    name: 'preprocess simple object - standard array with colons',
    schema: {
      preProcess: {
        SAMPLE_ARRAY: 'array'
      },
      type: 'object',
      required: [ 'SAMPLE_ARRAY' ],
      properties: {
        SAMPLE_ARRAY: {
          type: 'array'
        }
      }
    },
    data: {
      SAMPLE_ARRAY: 'foo:bar:baz'
    },
    isOk: true,
    confExpected: {
      SAMPLE_ARRAY: ['foo', 'bar', 'baz']
    }
  },
  {
    name: 'preprocess simple object - custom function',
    schema: {
      preProcess: {
        SAMPLE_ARRAY (v) {
          return v.split(',')
        }
      },
      type: 'object',
      required: [ 'SAMPLE_ARRAY' ],
      properties: {
        SAMPLE_ARRAY: {
          type: 'array'
        }
      }
    },
    data: {
      SAMPLE_ARRAY: 'foo,bar,baz'
    },
    isOk: true,
    confExpected: {
      SAMPLE_ARRAY: ['foo', 'bar', 'baz']
    }
  },
  {
    name: 'preprocess simple object - custom function',
    schema: {
      preProcess: {
        TRUSTED_IPS: 'array', // default split by `:`
        SAMPLE_JSON: 'object', // valid JSON string by `JSON.parse`
        CUSTOM_ARRAY (val) { // or even with custom pre process
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
    },
    data: {
      TRUSTED_IPS: '127.0.0.1:127.0.0.2',
      CUSTOM_ARRAY: '127.0.0.1,127.0.0.2',
      SAMPLE_JSON: JSON.stringify(SAMPLE_JSON_ENV_VAR)
    },
    isOk: true,
    confExpected: {
      PORT: 3000,
      TRUSTED_IPS: [ '127.0.0.1', '127.0.0.2' ],
      CUSTOM_ARRAY: [ '127.0.0.1', '127.0.0.2' ],
      SAMPLE_JSON: SAMPLE_JSON_ENV_VAR
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
