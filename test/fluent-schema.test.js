'use strict'

const t = require('tap')

if (parseInt(process.versions.node.split('.')[0]) <= 8) {
  t.skip('not supported')
} else {
  run()
}

function run () {
  const S = require('fluent-json-schema')
  const makeTest = require('./make-test')

  t.test('simple object - fluent-json-schema', t => {
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
