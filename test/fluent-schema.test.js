'use strict'

const { test } = require('node:test')

if (parseInt(process.versions.node.split('.', 1)[0]) <= 8) {
  test.skip('not supported')
} else {
  run()
}

function run () {
  const S = require('fluent-json-schema')
  const makeTest = require('./make-test')

  test('simple object - fluent-json-schema', t => {
    const options = {
      schema: S.object().prop('PORT', S.string()),
      data: {
        PORT: '44'
      }
    }

    makeTest(t, options, true, {
      PORT: '44'
    })
  })
}
