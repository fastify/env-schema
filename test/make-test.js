'use strict'

const envSchema = require('../index')

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

module.exports = makeTest
