const MAX_ITEMS = 4
const INDENT = '  '

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Serializes a story's args back into a JSX snippet. Long data arrays are
 * elided — the point is a readable, copyable example, not a byte-for-byte
 * reproduction of the fixture.
 */
function serialize(value: unknown, depth: number): string | null {
  const pad = INDENT.repeat(depth)
  const padInner = INDENT.repeat(depth + 1)

  if (value === null || value === undefined) return null
  if (typeof value === 'function') return null
  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'

    const shown = value.slice(0, MAX_ITEMS)
    const parts = shown
      .map(item => serialize(item, depth + 1))
      .filter((part): part is string => part !== null)

    const elided = value.length > MAX_ITEMS ? `${padInner}/* ... */` : null
    const body = [...parts.map(p => `${padInner}${p}`), elided]
      .filter(Boolean)
      .join(',\n')

    // Keep short arrays of primitives on one line — `[1, 2, 3]` reads better
    // than one number per row.
    const primitives = shown.every(
      item => typeof item === 'number' || typeof item === 'string'
    )
    if (primitives && value.length <= 8) return `[${parts.join(', ')}]`

    return `[\n${body},\n${pad}]`
  }

  if (isPlainObject(value)) {
    const parts = Object.entries(value)
      .map(([key, item]) => {
        const serialized = serialize(item, depth + 1)
        return serialized === null ? null : `${padInner}${key}: ${serialized}`
      })
      .filter((part): part is string => part !== null)

    if (parts.length === 0) return '{}'

    const oneLine = `{ ${parts.map(p => p.trim()).join(', ')} }`
    if (oneLine.length <= 56) return oneLine

    return `{\n${parts.join(',\n')},\n${pad}}`
  }

  return null
}

export function toCode(
  component: string,
  args: Record<string, unknown> = {}
): string {
  const props = Object.entries(args)
    .map(([key, value]) => {
      if (typeof value === 'function' || value === undefined) return null
      if (value === true) return `${INDENT}${key}`
      if (value === false) return null

      const serialized = serialize(value, 1)
      if (serialized === null) return null
      if (typeof value === 'string') return `${INDENT}${key}=${serialized}`
      return `${INDENT}${key}={${serialized}}`
    })
    .filter((prop): prop is string => prop !== null)

  if (props.length === 0) return `<${component} />`

  return [
    `import { ${component} } from '@clera/charts'`,
    '',
    `<${component}`,
    ...props,
    '/>',
  ].join('\n')
}
