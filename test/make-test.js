'use strict'

const envSchema = require('../index')

function makeTest (t, options, isOk, confExpected, errorMessage) {
  t.plan(1)
  options = Object.assign({ confKey: 'config' }, options)

  try {
    const conf = envSchema(options)
    t.assert.deepStrictEqual(conf, confExpected)
  } catch (err) {
    if (isOk) {
      t.assert.fail(err)
      return
    }
    t.assert.strictEqual(err.message, errorMessage)
  }
}

module.exports = makeTest
