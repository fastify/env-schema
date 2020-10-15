// @ts-check

import t from 'tap'
import envSync from '..'

t.test('esm-test', t => {
  t.plan(1)

  const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: {
        type: 'string',
        default: 3000
      }
    }
  }

  const data = {
    PORT: 'bar'
  }

  /** @type {import('..').PlainObject} */
  const config = envSync({
    schema,
    data
  })

  t.sameStrict(config, {
    PORT: 'bar'
  })
})
