'use client'

import { parse as parseDateFns, isValid as isValidDate } from 'date-fns'
import type { DateRange } from 'react-day-picker'

export function safeParse(value: string, format: string): Date | undefined {
  try {
    const parsed = parseDateFns(value, format, new Date())
    return isValidDate(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

function normalizeDate(d: Date | undefined): Date | undefined {
  if (!d) return undefined
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function parseSelected(
  selected: Date | Date[] | DateRange | string | string[] | undefined,
  mode: 'single' | 'range' | 'multiple',
  formatDate: string
): Date | Date[] | DateRange | undefined {
  if (!selected) return undefined

  if (mode === 'single') {
    if (typeof selected === 'string') {
      return safeParse(selected, formatDate)
    }
    if (selected instanceof Date) return normalizeDate(selected)
    return undefined
  }

  if (mode === 'multiple') {
    if (Array.isArray(selected)) {
      const arr = selected.map(s =>
        typeof s === 'string' ? safeParse(s, formatDate) : s
      ) as Date[]
      return arr?.length
        ? (arr
            .filter(isValidDate)
            .map(d => normalizeDate(d!) as Date) as Date[])
        : undefined
    }

    if (selected instanceof Date) return [selected]
    return undefined
  }

  if (
    typeof selected === 'object' &&
    selected !== null &&
    ('from' in (selected as DateRange) || 'to' in (selected as DateRange))
  ) {
    const sel = selected as DateRange
    const fromRaw = sel.from
    const toRaw = sel.to
    const from =
      typeof fromRaw === 'string'
        ? safeParse(fromRaw, formatDate)
        : (fromRaw as Date | undefined)
    const to =
      typeof toRaw === 'string'
        ? safeParse(toRaw, formatDate)
        : (toRaw as Date | undefined)

    const nf = normalizeDate(from as Date | undefined)
    const nt = normalizeDate(to as Date | undefined)
    return nf || nt ? ({ from: nf, to: nt } as DateRange) : undefined
  }

  return undefined
}
