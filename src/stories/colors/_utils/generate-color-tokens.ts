import colorThemes from '!!css-loader!@/styles/themes/color.css'

const themeRegex = /theme\(colors\.([a-z]+)\.([a-z0-9]+)\)/i
const tokenRegex = /(--[a-z0-9-]+): (.*);/g

function parseThemeString(themeString: string) {
  if (!themeString) return null
  const match = themeString.match(themeRegex)
  if (!match) return themeString

  const color = match[1]
  const shade = match[2]
  const capColor = color.charAt(0).toUpperCase() + color.slice(1)
  return `${capColor}${shade}`
}

function parseCssContent(content: string) {
  const lightTokens: Record<string, string | null> = {}
  const darkTokens: Record<string, string | null> = {}

  const darkSectionMatch = content.match(
    /@layer base\s*{[^}]*\[data-theme='dark'\]\s*{([^}]+)}\s*}/ms
  )
  const lightSectionMatch = content.match(/@theme static\s*{([^}]+)}/ms)

  if (!lightSectionMatch || !darkSectionMatch) {
    console.error('Could not find @theme static or [data-theme="dark"] blocks.')
    return
  }

  const lightContent = lightSectionMatch[1]
  const darkContent = darkSectionMatch[1]

  let match
  while ((match = tokenRegex.exec(lightContent)) !== null) {
    const tokenName = match[1].trim()
    const tokenValue = match[2].trim()
    lightTokens[tokenName] = parseThemeString(tokenValue)
  }

  while ((match = tokenRegex.exec(darkContent)) !== null) {
    const tokenName = match[1].trim()
    const tokenValue = match[2].trim()
    darkTokens[tokenName] = parseThemeString(tokenValue)
  }

  return { light: lightTokens, dark: darkTokens }
}

export function generateTokens() {
  try {
    const filteredColorThemes = colorThemes[0][1]
    const tokenDefinitions = parseCssContent(filteredColorThemes)

    if (tokenDefinitions) {
      return tokenDefinitions
    }
  } catch (error) {
    console.error('Error generating token JSON:', error)
  }
}
