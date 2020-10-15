// @ts-check

'use strict'

const Ajv = require('ajv')
const ajv = new Ajv({ removeAdditional: true, useDefaults: true, coerceTypes: true })

class EnvSchemaError extends Error {
  /** @param {import('ajv').ErrorObject[]} errors */
  constructor (errors) {
    const message = errors.map(e => e.message).join('\n')

    super(message)

    this.errors = errors
  }
}

ajv.addKeyword('separator', {
  type: 'string',
  metaSchema: {
    type: 'string',
    description: 'value separator'
  },
  modifying: true,
  valid: true,
  errors: false,
  compile: (schema) => (data, _dataPath, parentData, parentDataProperty) => {
    parentData[parentDataProperty] = data === '' ? [] : data.split(schema)
    return true
  }
})

const optsSchema = {
  type: 'object',
  required: ['schema'],
  properties: {
    schema: { type: 'object', additionalProperties: true },
    data: {
      oneOf: [
        { type: 'array', items: { type: 'object' }, minItems: 1 },
        { type: 'object' }
      ],
      default: {}
    },
    env: { type: 'boolean', default: true },
    dotenv: { type: ['boolean', 'object'], default: false }
  }
}
const optsSchemaValidator = ajv.compile(optsSchema)

/** @type {import('./index')} */
function loadAndValidateEnvironment (_opts) {
  const opts = { ..._opts }

  if (opts.schema && opts.schema[Symbol.for('fluent-schema-object')]) {
    opts.schema = opts.schema.valueOf()
  }

  const isOptionValid = optsSchemaValidator(opts)
  if (!isOptionValid) {
    throw new EnvSchemaError(optsSchemaValidator.errors)
  }

  const schema = {
    ...opts.schema,
    additionalProperties: false
  }

  const data = Array.isArray(opts.data) ? opts.data : [opts.data]

  if (opts.dotenv === true) {
    require('dotenv').config()
  } else if (opts.dotenv) {
    require('dotenv').config({ ...opts.dotenv })
  }

  if (opts.env) {
    data.unshift(process.env)
  }

  const merge = {}
  data.forEach(d => Object.assign(merge, d))

  const valid = ajv.validate(schema, merge)
  if (!valid) {
    throw new EnvSchemaError(ajv.errors)
  }

  return merge
}

module.exports = loadAndValidateEnvironment
