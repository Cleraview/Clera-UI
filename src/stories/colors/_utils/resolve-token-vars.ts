import { generateTokens } from './generate-color-tokens'

type Theme = 'light' | 'dark'

export type TokenRecord = {
  name: string
  varName: string
  palette?: string | null
  description?: string
  light?: string | null
  dark?: string | null
  lightBase?: string | null
  darkBase?: string | null
}

export type ColorVariableThemes = {
  [key in Theme]: Record<string, string>
}

export type DynamicToken = TokenRecord

export function scanColorVariables(): ColorVariableThemes {
  const rootVars: Record<string, string> = {}
  const darkVars: Record<string, string> = {}

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { light: rootVars, dark: darkVars }
  }

  try {
    const root = document.documentElement
    const prev = root.getAttribute('data-theme')

    root.removeAttribute('data-theme')
    void root.offsetHeight
    const lightComputed = getComputedStyle(root)

    for (let i = 0; i < lightComputed.length; i++) {
      const prop = lightComputed.item(i)
      if (prop && prop.startsWith('--')) {
        const val = lightComputed.getPropertyValue(prop).trim()
        if (val) rootVars[prop] = val
      }
    }

    root.setAttribute('data-theme', 'dark')
    void root.offsetHeight
    const darkComputed = getComputedStyle(root)
    for (let i = 0; i < darkComputed.length; i++) {
      const prop = darkComputed.item(i)
      if (prop && prop.startsWith('--')) {
        const val = darkComputed.getPropertyValue(prop).trim()
        if (val) darkVars[prop] = val
      }
    }

    if (prev === null) {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', prev)
    }
  } catch (e) {
    console.log('Error scanning color variables:', e)
  }

  return { light: rootVars, dark: darkVars }
}

export const resolveAllColorTokens = (): TokenRecord[] => {
  const tokenDefinitions = generateTokens() ?? { light: {}, dark: {} }
  const { light: computedLight, dark: computedDark } = scanColorVariables()

  const out: TokenRecord[] = []

  for (const tokenName in tokenDefinitions.light) {
    const lightBaseName =
      (tokenDefinitions.light as Record<string, string>)[tokenName] ?? null
    const darkBaseName =
      (tokenDefinitions.dark as Record<string, string>)[tokenName] ?? null

    const lightValue = computedLight[tokenName] ?? null
    const darkValue = computedDark[tokenName] ?? null

    const name = tokenName
      .replace(/^--/, '')
      .replace(/^background-color-/, 'bg-')
      .replace(/^(text|fill|link|border|icon)-color-/, '$1-')
      .replace(/^(text|fill|link|border|icon)-color$/, '$1')
      .replace(/^color-(text|link|border|icon)/, '$1')

    out.push({
      name: name,
      varName: tokenName,
      light: lightValue,
      dark: darkValue,
      lightBase: lightBaseName,
      darkBase: darkBaseName,
      palette: null,
      description: '',
    })
  }

  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

export default resolveAllColorTokens
