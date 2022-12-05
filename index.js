'use strict'

const Ajv = require('ajv')

const separator = {
  keyword: 'separator',
  type: 'string',
  metaSchema: {
    type: 'string',
    description: 'value separator'
  },
  modifying: true,
  valid: true,
  errors: false,
  compile: (schema) => (data, { parentData: pData, parentDataProperty: pDataProperty }) => {
    pData[pDataProperty] = data === '' ? [] : data.split(schema)
  }
}

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
    dotenv: { type: ['boolean', 'object'], default: false },
    expandEnv: { type: ['boolean'], default: false },
    ajv: { type: 'object', additionalProperties: true }
  }
}

const sharedAjvInstance = getDefaultInstance()

const optsSchemaValidator = sharedAjvInstance.compile(optsSchema)

function envSchema (_opts) {
  const opts = Object.assign({}, _opts)

  if (opts.schema && opts.schema[Symbol.for('fluent-schema-object')]) {
    opts.schema = opts.schema.valueOf()
  }

  const isOptionValid = optsSchemaValidator(opts)
  if (!isOptionValid) {
    const error = new Error(sharedAjvInstance.errorsText(optsSchemaValidator.errors, { dataVar: 'opts' }))
    error.errors = optsSchemaValidator.errors
    throw error
  }

  const schema = opts.schema
  schema.additionalProperties = false

  let data = opts.data
  if (!Array.isArray(opts.data)) {
    data = [data]
  }

  if (opts.dotenv) {
    require('dotenv').config(Object.assign({}, opts.dotenv))
  }

  /* istanbul ignore else */
  if (opts.env) {
    if (opts.expandEnv) {
      require('dotenv-expand').expand({ parsed: process.env })
    }
    data.unshift(process.env)
  }

  const merge = {}
  data.forEach(d => Object.assign(merge, d))

  const ajv = chooseAjvInstance(sharedAjvInstance, opts.ajv)

  const valid = ajv.validate(schema, merge)
  if (!valid) {
    const error = new Error(ajv.errorsText(ajv.errors, { dataVar: 'env' }))
    error.errors = ajv.errors
    throw error
  }

  return merge
}

function chooseAjvInstance (defaultInstance, ajvOpts) {
  if (!ajvOpts) {
    return defaultInstance
  } else if (typeof ajvOpts === 'object' && typeof ajvOpts.customOptions === 'function') {
    const ajv = ajvOpts.customOptions(getDefaultInstance())
    if (!(ajv instanceof Ajv)) {
      throw new Error('customOptions function must return an instance of Ajv')
    }
    return ajv
  }
  return ajvOpts
}

function getDefaultInstance () {
  return new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
    addUsedSchema: false,
    keywords: [separator]
  })
}

envSchema.keywords = { separator }

module.exports = envSchema
module.exports.default = envSchema
module.exports.envSchema = envSchema
