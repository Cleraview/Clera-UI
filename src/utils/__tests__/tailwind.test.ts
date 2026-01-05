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

  it('keeps text size and design-system color classes together', () => {
    const classes = cn('text-ds-default text-label-sm')

    expect(classes).toMatch(/text-label-sm/)
    expect(classes).toMatch(/text-ds-default/)
  })

  it('should remove duplication classes', () => {
    const classes = cn('text-ds-default text-label-sm text-ds-destructive')

    console.log(classes)
    expect(classes).toMatch(/text-label-sm/)
    expect(classes).toMatch(/text-ds-destructive/)
    expect(classes).not.toMatch(/text-ds-default/)
  })

  it('prefers state-prefixed `text-ds-*` tokens over base tokens', () => {
    const classes = cn([
      'relative flex items-center',
      'text-label-sm',
      'text-ds-default',
      'text-ds-destructive',
      'hover:text-ds-destructive',
      'focus:text-ds-default',
      'focus:bg-ds-destructive-subtle',
    ])

    expect(classes).toMatch(/text-ds-destructive/)
    expect(classes).toMatch(/hover:text-ds-destructive/)
    expect(classes).not.toMatch(/(?:^|\s)text-ds-default(?:$|\s)/)
    expect(classes).toMatch(/text-label-sm/)
    expect(classes).toMatch(/focus:bg-ds-destructive-subtle/)
  })

  it('prefers state-prefixed `bg-ds-*` and `border-ds-*` tokens over base tokens', () => {
    const classes = cn([
      'p-2',
      'bg-ds-accent',
      'hover:bg-ds-accent',
      'border-ds-accent',
      'focus:border-ds-accent',
    ])

    expect(classes).toMatch(/bg-ds-accent/)
    expect(classes).toMatch(/hover:bg-ds-accent/)
    expect(classes).toMatch(/border-ds-accent/)
    expect(classes).toMatch(/focus:border-ds-accent/)
  })

  it('does not treat dark:variant + base as duplicate', () => {
    const result = cn('dark:text-ds-default', 'text-ds-default')

    expect(result).toMatch(/dark:text-ds-default/)
    expect(result).toMatch(/(^|\s)text-ds-default(?:$|\s)/)
  })

  it('removes duplicate base tokens and duplicate dark: tokens', () => {
    const result1 = cn('text-ds-default', 'text-ds-default')
    expect((result1.match(/text-ds-default/g) || []).length).toBe(1)

    const result2 = cn('dark:text-ds-default', 'dark:text-ds-default')
    expect((result2.match(/dark:text-ds-default/g) || []).length).toBe(1)
  })
})
