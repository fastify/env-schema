'use strict'

const Ajv = require('ajv')
const { parseEnv } = require('node:util')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')

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

// Same syntax as dotenv-expand, which was used before: $VAR, ${VAR},
// ${VAR:-default} (VAR unset or empty), ${VAR-default} (VAR unset) and \$
const EXPANSION_RE = /\\\$|\$\{([A-Z_][A-Z0-9_]*)(:?-)([^}]*)\}|\$\{?([A-Z_][A-Z0-9_]*)\}?/gi

function expandVariables (obj) {
  const raw = Object.assign({}, obj)
  const expanded = {}

  // References are resolved against the expanded value of the referenced
  // variable, whatever the order of the keys
  function expand (key, stack) {
    if (Object.prototype.hasOwnProperty.call(expanded, key)) {
      return expanded[key]
    }
    if (stack.includes(key)) {
      // circular reference, keep it as written
      return undefined
    }
    const value = raw[key]
    if (typeof value !== 'string') {
      return value
    }
    stack.push(key)
    const result = interpolate(value, stack)
    stack.pop()
    expanded[key] = result
    return result
  }

  function interpolate (value, stack) {
    return value.replace(EXPANSION_RE, (match, name, operator, fallback, plainName) => {
      if (match === '\\$') {
        return '$'
      }
      const resolved = raw[name || plainName] === undefined ? undefined : expand(name || plainName, stack)
      if (operator && (resolved === undefined || (operator === ':-' && resolved === ''))) {
        return interpolate(fallback, stack)
      }
      return resolved === undefined ? match : String(resolved)
    })
  }

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = expand(key, [])
    }
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

  let parsedEnv
  if (dotenv) {
    const dotenvOpts = typeof dotenv === 'object' ? dotenv : {}
    const path = dotenvOpts.path || '.env'
    const encoding = dotenvOpts.encoding || 'utf8'

    try {
      const envFileContent = readFileSync(resolve(path), encoding)
      parsedEnv = parseEnv(envFileContent)
    } catch (err) {
      // Silently ignore if file doesn't exist
      if (err.code !== 'ENOENT') {
        throw err
      }
      parsedEnv = {}
    }
  }

  /* istanbul ignore else */
  if (env) {
    data.unshift(process.env)
  }

  if (parsedEnv) {
    data.unshift(parsedEnv)
  }

  const merge = {}
  data.forEach(d => Object.assign(merge, d))

  if (expandEnv) {
    expandVariables(merge)
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
