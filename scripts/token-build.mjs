import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const TOKEN_EXTENSION_NAMESPACE = 'nettoolskit'
export const CSS_VARIABLE_PATTERN = /^--ntk-[a-z0-9]+(?:-[a-z0-9]+)*$/

const REFERENCE_PATTERN = /\{([^{}]+)\}/g
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDirectory, '..')

export const DEFAULT_SOURCE_PATH = path.join(repoRoot, 'src/design-system/tokens/source.json')
export const DEFAULT_CSS_OUTPUT_PATH = path.join(repoRoot, 'src/design-system/tokens/generated.css')
export const DEFAULT_TS_OUTPUT_PATH = path.join(repoRoot, 'src/design-system/tokens/generated.ts')

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function isTokenNode(value) {
  return isObject(value) && Object.hasOwn(value, '$value')
}

function getTokenCssVariable(token) {
  return token.$extensions?.[TOKEN_EXTENSION_NAMESPACE]?.cssVariable
}

function extractReferences(value) {
  if (typeof value !== 'string') {
    return []
  }

  return [...value.matchAll(REFERENCE_PATTERN)].map(match => match[1].trim())
}

function stringifyTokenValue(value) {
  return typeof value === 'number' ? String(value) : value
}

export async function readTokenSource(sourcePath = DEFAULT_SOURCE_PATH) {
  const source = await readFile(sourcePath, 'utf8')
  return JSON.parse(source)
}

export function flattenTokens(source) {
  const tokens = []

  function visit(node, pathSegments, inheritedType) {
    if (!isObject(node)) {
      return
    }

    const nodeType = typeof node.$type === 'string' ? node.$type : inheritedType

    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) {
        continue
      }

      if (!isObject(child)) {
        continue
      }

      const childPathSegments = [...pathSegments, key]

      if (isTokenNode(child)) {
        const childType = typeof child.$type === 'string' ? child.$type : nodeType
        tokens.push({
          path: childPathSegments.join('.'),
          pathSegments: childPathSegments,
          type: childType,
          value: child.$value,
          description: child.$description,
          cssVariable: getTokenCssVariable(child),
          token: child,
        })
        continue
      }

      visit(child, childPathSegments, nodeType)
    }
  }

  visit(source, [], undefined)
  return tokens
}

function createTokenMap(source) {
  const tokens = flattenTokens(source)
  return {
    tokens,
    byPath: new Map(tokens.map(token => [token.path, token])),
  }
}

function replaceReferences(value, resolveReference) {
  if (typeof value !== 'string') {
    return stringifyTokenValue(value)
  }

  return value.replace(REFERENCE_PATTERN, (_match, referencePath) => resolveReference(referencePath.trim()))
}

export function resolveTokenValue(source, tokenPath, stack = []) {
  const { byPath } = createTokenMap(source)

  function resolvePath(pathToResolve, activeStack) {
    if (activeStack.includes(pathToResolve)) {
      throw new Error(`Circular token reference detected: ${[...activeStack, pathToResolve].join(' -> ')}`)
    }

    const token = byPath.get(pathToResolve)
    if (!token) {
      throw new Error(`Unknown token reference: ${pathToResolve}`)
    }

    return replaceReferences(token.value, referencePath => resolvePath(referencePath, [...activeStack, pathToResolve]))
  }

  return resolvePath(tokenPath, stack)
}

export function resolveTokens(source) {
  const { tokens, byPath } = createTokenMap(source)

  function toResolvedValue(tokenPath, activeStack = []) {
    if (activeStack.includes(tokenPath)) {
      throw new Error(`Circular token reference detected: ${[...activeStack, tokenPath].join(' -> ')}`)
    }

    const token = byPath.get(tokenPath)
    if (!token) {
      throw new Error(`Unknown token reference: ${tokenPath}`)
    }

    return replaceReferences(token.value, referencePath => toResolvedValue(referencePath, [...activeStack, tokenPath]))
  }

  function toCssValue(token) {
    return replaceReferences(token.value, referencePath => {
      const referencedToken = byPath.get(referencePath)
      if (!referencedToken) {
        throw new Error(`Unknown token reference: ${referencePath}`)
      }

      if (!referencedToken.cssVariable) {
        throw new Error(`Referenced token is missing cssVariable: ${referencePath}`)
      }

      return `var(${referencedToken.cssVariable})`
    })
  }

  return tokens.map(token => ({
    path: token.path,
    pathSegments: token.pathSegments,
    type: token.type,
    value: toResolvedValue(token.path),
    rawValue: stringifyTokenValue(token.value),
    cssValue: toCssValue(token),
    cssVariable: token.cssVariable,
    description: token.description,
  }))
}

export function validateTokenSource(source) {
  const errors = []

  if (!isObject(source)) {
    return {
      valid: false,
      errors: ['Token source must be an object.'],
      tokens: [],
    }
  }

  const tokens = flattenTokens(source)
  const cssVariables = new Map()
  const byPath = new Map(tokens.map(token => [token.path, token]))

  if (tokens.length === 0) {
    errors.push('Token source must include at least one token with $value.')
  }

  for (const token of tokens) {
    if (typeof token.type !== 'string' || token.type.length === 0) {
      errors.push(`${token.path} is missing $type.`)
    }

    if (typeof token.value !== 'string' && typeof token.value !== 'number') {
      errors.push(`${token.path} must use a string or number $value.`)
    }

    if (typeof token.cssVariable !== 'string') {
      errors.push(`${token.path} is missing $extensions.${TOKEN_EXTENSION_NAMESPACE}.cssVariable.`)
    } else if (!CSS_VARIABLE_PATTERN.test(token.cssVariable)) {
      errors.push(`${token.path} cssVariable must preserve --ntk-* naming: ${token.cssVariable}`)
    } else if (cssVariables.has(token.cssVariable)) {
      errors.push(`${token.path} duplicates cssVariable ${token.cssVariable} used by ${cssVariables.get(token.cssVariable)}.`)
    } else {
      cssVariables.set(token.cssVariable, token.path)
    }

    for (const referencePath of extractReferences(token.value)) {
      if (!byPath.has(referencePath)) {
        errors.push(`${token.path} references unknown token ${referencePath}.`)
      }
    }
  }

  for (const token of tokens) {
    try {
      resolveTokenValue(source, token.path)
    } catch (error) {
      errors.push(`${token.path} could not be resolved: ${error.message}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    tokens,
  }
}

export function assertValidTokenSource(source) {
  const validation = validateTokenSource(source)

  if (!validation.valid) {
    throw new Error(`Invalid token source:\n${validation.errors.join('\n')}`)
  }

  return validation
}

export function generateCssCustomProperties(source, options = {}) {
  const selector = options.selector ?? ':root'
  assertValidTokenSource(source)

  const lines = [
    '/**',
    ' * Generated from src/design-system/tokens/source.json.',
    ' * Do not edit manually.',
    ' */',
    `${selector} {`,
  ]

  for (const token of resolveTokens(source)) {
    lines.push(`  ${token.cssVariable}: ${token.cssValue};`)
  }

  lines.push('}')
  return lines.join('\n')
}

export function generateTsTokenMap(source) {
  assertValidTokenSource(source)
  const resolvedTokens = resolveTokens(source)
  const designTokens = {}
  const designTokenValues = {}
  const designTokenCssVariables = {}
  const designTokensByCssVariable = {}

  for (const token of resolvedTokens) {
    designTokens[token.path] = {
      type: token.type,
      value: token.value,
      rawValue: token.rawValue,
      cssValue: token.cssValue,
      cssVariable: token.cssVariable,
    }
    designTokenValues[token.path] = token.value
    designTokenCssVariables[token.path] = token.cssVariable
    designTokensByCssVariable[token.cssVariable] = token.path
  }

  return [
    '/**',
    ' * Generated from src/design-system/tokens/source.json.',
    ' * Do not edit manually.',
    ' */',
    `export const designTokens = ${JSON.stringify(designTokens, null, 2)} as const`,
    '',
    `export const designTokenValues = ${JSON.stringify(designTokenValues, null, 2)} as const`,
    '',
    `export const designTokenCssVariables = ${JSON.stringify(designTokenCssVariables, null, 2)} as const`,
    '',
    `export const designTokensByCssVariable = ${JSON.stringify(designTokensByCssVariable, null, 2)} as const`,
    '',
    'export type DesignTokenPath = keyof typeof designTokens',
    'export type DesignTokenCssVariable = keyof typeof designTokensByCssVariable',
  ].join('\n')
}

export async function writeGeneratedTokens(options = {}) {
  const sourcePath = options.sourcePath ?? DEFAULT_SOURCE_PATH
  const cssOutputPath = options.cssOutputPath ?? DEFAULT_CSS_OUTPUT_PATH
  const tsOutputPath = options.tsOutputPath ?? DEFAULT_TS_OUTPUT_PATH
  const source = await readTokenSource(sourcePath)
  const cssOutput = generateCssCustomProperties(source)
  const tsOutput = generateTsTokenMap(source)

  await mkdir(path.dirname(cssOutputPath), { recursive: true })
  await mkdir(path.dirname(tsOutputPath), { recursive: true })
  await writeFile(cssOutputPath, cssOutput, 'utf8')
  await writeFile(tsOutputPath, tsOutput, 'utf8')

  return {
    cssOutputPath,
    tsOutputPath,
    tokenCount: resolveTokens(source).length,
  }
}

export async function checkGeneratedTokens(options = {}) {
  const sourcePath = options.sourcePath ?? DEFAULT_SOURCE_PATH
  const cssOutputPath = options.cssOutputPath ?? DEFAULT_CSS_OUTPUT_PATH
  const tsOutputPath = options.tsOutputPath ?? DEFAULT_TS_OUTPUT_PATH
  const source = await readTokenSource(sourcePath)
  const expectedCss = generateCssCustomProperties(source)
  const expectedTs = generateTsTokenMap(source)
  const [actualCss, actualTs] = await Promise.all([
    readFile(cssOutputPath, 'utf8'),
    readFile(tsOutputPath, 'utf8'),
  ])
  const mismatches = []

  if (actualCss !== expectedCss) {
    mismatches.push(path.relative(repoRoot, cssOutputPath))
  }

  if (actualTs !== expectedTs) {
    mismatches.push(path.relative(repoRoot, tsOutputPath))
  }

  return {
    ok: mismatches.length === 0,
    mismatches,
    tokenCount: resolveTokens(source).length,
  }
}

function parseCliArgs(argv) {
  return {
    check: argv.includes('--check'),
  }
}

async function runCli() {
  const args = parseCliArgs(process.argv.slice(2))

  if (args.check) {
    const result = await checkGeneratedTokens()
    if (!result.ok) {
      throw new Error(`Generated token outputs are stale: ${result.mismatches.join(', ')}`)
    }

    console.log(`Token outputs are up to date (${result.tokenCount} tokens).`)
    return
  }

  const result = await writeGeneratedTokens()
  console.log(`Generated ${result.tokenCount} tokens.`)
  console.log(path.relative(repoRoot, result.cssOutputPath))
  console.log(path.relative(repoRoot, result.tsOutputPath))
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ''

if (import.meta.url === invokedPath) {
  runCli().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
}