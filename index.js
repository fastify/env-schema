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

  if (opts.schema?.[Symbol.for('fluent-schema-object')]) {
    opts.schema = opts.schema.valueOf()
  }

  const isOptionValid = optsSchemaValidator(opts)
  if (!isOptionValid) {
    const error = new Error(sharedAjvInstance.errorsText(optsSchemaValidator.errors, { dataVar: 'opts' }))
    error.errors = optsSchemaValidator.errors
    throw error
  }

  const { schema } = opts
  schema.additionalProperties = false

  let { data, dotenv, env, expandEnv } = opts
  if (!Array.isArray(data)) {
    data = [data]
  }

  if (dotenv) {
    require('dotenv').config(Object.assign({}, dotenv))
  }

  /* istanbul ignore else */
  if (env) {
    data.unshift(process.env)
  }

  const merge = {}
  data.forEach(d => Object.assign(merge, d))

  if (expandEnv) {
    require('dotenv-expand').expand({ ignoreProcessEnv: true, parsed: merge })
  }

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
  if (ajvOpts instanceof Ajv) {
    return ajvOpts
  }
  let ajv = defaultInstance
  if (typeof ajvOpts === 'object' && typeof ajvOpts.customOptions === 'function') {
    ajv = ajvOpts.customOptions(getDefaultInstance())
    if (!(ajv instanceof Ajv)) {
      throw new TypeError('customOptions function must return an instance of Ajv')
    }
  } else if (typeof ajvOpts === 'object' && typeof ajvOpts.customOptions === 'object') {
    ajv = getDefaultInstance(ajvOpts.customOptions)
  }
  return ajv
}

function getDefaultInstance (overrideOpts = {}) {
  return new Ajv({
    allErrors: true,
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allowUnionTypes: true,
    addUsedSchema: false,
    keywords: [separator],
    ...overrideOpts
  })
}

envSchema.keywords = { separator }

module.exports = envSchema
module.exports.default = envSchema
module.exports.envSchema = envSchema
