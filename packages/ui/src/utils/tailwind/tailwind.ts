import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<string, string>({
  extend: {
    classGroups: {
      'text-color': [
        { text: [(value: string) => String(value).startsWith('ds-')] },
      ],
      'font-size': [
        {
          text: [
            (value: string) => {
              if (!value) return false
              const formattedValue = String(value)
              return (
                formattedValue.startsWith('label-') ||
                formattedValue.startsWith('body-') ||
                formattedValue.startsWith('heading-') ||
                /^(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)$/.test(formattedValue)
              )
            },
          ],
        },
      ],
    },
    conflictingClassGroups: {
      'font-size': [],
      text: [],
      'text-color': [],
    },
  },
  override: {
    classGroups: {
      text: [
        {
          text: [
            (value: string) => {
              if (!value) return false
              const formattedValue = String(value)
              return (
                formattedValue.startsWith('ds-') ||
                formattedValue.startsWith('label-') ||
                formattedValue.startsWith('body-') ||
                formattedValue.startsWith('heading-') ||
                /^(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)$/.test(formattedValue)
              )
            },
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  const raw = clsx(inputs)
  const dsRegex = /(?:^|\s)((?:[^\s:]+:)?(?:text|bg|border)-ds-[^\s]+)/g
  const dsMatches = [] as string[]
  let m: RegExpExecArray | null
  while ((m = dsRegex.exec(raw))) {
    if (m[1]) dsMatches.push(m[1])
  }

  let merged = twMerge(raw)
  const escapeForRegExp = (s: string) =>
    s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  if (dsMatches.length) {
    const baseMap = new Map<string, string[]>()

    dsMatches.forEach(token => {
      const parts = token.split(':')
      const base = parts[parts.length - 1]
      const arr = baseMap.get(base) || []
      arr.push(token)
      baseMap.set(base, arr)
    })

    let adjusted = merged

    const presentBases = new Set<string>()
    baseMap.forEach((_, base) => {
      if (
        new RegExp(`(?:^|\\s)${escapeForRegExp(base)}(?:$|\\s)`).test(adjusted)
      ) {
        presentBases.add(base)
      }
    })

    baseMap.forEach((tokens, base) => {
      const prefixed = tokens.filter(t => t.includes(':'))

      if (presentBases.has(base)) {
        const parts = adjusted.split(/\s+/).filter(Boolean)
        prefixed.forEach(tok => {
          if (!parts.includes(tok)) parts.push(tok)
        })
        adjusted = parts.join(' ')
      }
    })

    if (adjusted !== merged) {
      merged = adjusted
    }
  }

  const hasDsInMerged =
    /(?:^|\s)(?:[^\s:]+:)?(?:text|bg|border)-ds-[^\s]+/.test(merged)

  const missing = dsMatches.filter(ds => {
    const safe = escapeForRegExp(ds)
    return !new RegExp(`(?:^|\\s)${safe}(?:$|\\s)`).test(merged)
  })

  if (!hasDsInMerged && missing.length) {
    merged = `${merged} ${missing.join(' ')}`.trim()
  }

  const dedupe = (s: string) => {
    const parts = s.split(/\s+/).filter(Boolean)
    const seen = new Set<string>()
    const out: string[] = []
    parts.forEach(p => {
      if (!seen.has(p)) {
        seen.add(p)
        out.push(p)
      }
    })
    return out.join(' ')
  }

  return dedupe(merged)
}

export function composeStyles<K extends string>(...objs: Record<K, string>[]) {
  const result = {} as Record<K, string>

  const keys = Object.keys(objs[0]) as K[]

  keys.forEach(key => {
    result[key] = cn(...objs.map(o => o[key]))
  })

  return result
}

export function mapTokenGroup(group: string, tokens: Record<string, string>) {
  return Object.keys(tokens).reduce(
    (acc, key) => {
      acc[`${group}-${key}`] = `text-${group}-${key}`
      return acc
    },
    {} as Record<string, string>
  )
}
