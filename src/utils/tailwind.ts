import { clsx, type ClassValue } from 'clsx'
// import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  // return twMerge(clsx(inputs))
  return clsx(inputs)
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
