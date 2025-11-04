import { cn } from '../tailwind'

describe('utils/tailwind (cn)', () => {
  it('should concatenate basic strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('should handle conditional objects with truthy values', () => {
    const isLoggedIn = true
    const hasError = true
    expect(
      cn('base', {
        'user-active': isLoggedIn,
        'has-error': hasError,
      })
    ).toBe('base user-active has-error')
  })

  it('should ignore conditional objects with falsy values', () => {
    const isLoggedIn = false
    const hasError = null
    const hasWarning = undefined
    const count = 0
    expect(
      cn('base', {
        'user-active': isLoggedIn,
        'has-error': hasError,
        'has-warning': hasWarning,
        'has-items': count,
      })
    ).toBe('base')
  })

  it('should handle arrays, including nested ones', () => {
    expect(cn('a', ['b', 'c'], 'd', [['e', 'f']])).toBe('a b c d e f')
  })

  it('should handle mixed argument types (strings, objects, arrays)', () => {
    const hasError = true
    expect(
      cn(
        'base',
        hasError && 'error-class',
        ['foo', 'bar'],
        { 'baz-active': hasError, 'qux-active': false },
        null,
        undefined
      )
    ).toBe('base error-class foo bar baz-active')
  })

  it('should return an empty string if no valid classes are provided', () => {
    expect(cn(null, undefined, false, 0, { a: false, b: null })).toBe('')
  })
})
