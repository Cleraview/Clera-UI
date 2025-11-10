import { parse as parseDateFns, isValid as isValidDate } from 'date-fns'

export const safeParse = (val: string, fmt: string) => {
  try {
    const parsed = parseDateFns(val, fmt, new Date())
    if (isValidDate(parsed)) {
      return parsed
    }
    return undefined
  } catch {
    return undefined
  }
}
