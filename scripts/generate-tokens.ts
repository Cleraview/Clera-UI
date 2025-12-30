import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'

type TailwindColors = Record<string, Record<string, string>>
type StopCfg = { min?: number; max?: number; step?: number }
type OutputCfg = {
  enabled?: boolean
  path?: string
  prefix?: string
  suffix?: string
  includePaletteBlock?: boolean
}
type Outputs = {
  nativeCss?: OutputCfg
  tailwindCss?: OutputCfg
  tailwind?: OutputCfg
  runtimeJs?: OutputCfg
}
type Defaults = { themeRoot?: string; darkSelector?: string }

type FileOverride = {
  mode?: 'theme' | 'utility'
  prefix?: string
  excludePrefixFor?: string[]
  outPath?: string
}

type TokenMeta = { outPath?: { native?: string; theme?: string }; themeKind?: string }
type TokenValue = {
  $value?: string | Record<string, string>
  $type?: string
  $extensions?: { mode?: { dark?: string } }
  $meta?: TokenMeta
}

const __filename = new URL(import.meta.url).pathname

type Config = {
  tokensPath?: string
  outputs?: Outputs
  paletteResolution?: { strategy: string; requireTailwindPackage: boolean }
  stops?: StopCfg
  defaults?: Defaults
  overrides?: Record<string, FileOverride>
}

async function readConfig(
  configPath = 'config/token-gen.json'
): Promise<Config> {
  try {
    const cfgRaw = await fs.readFile(path.resolve(configPath), 'utf8')
    return JSON.parse(cfgRaw) as Config
  } catch (err) {
    console.error(`Failed to read or parse config at ${configPath}`, err)
    return {} as Config
  }
}

function normalizeStop(n: number, min = 50, max = 900, step = 50) {
  if (Number.isNaN(n)) return min
  let v = Math.round(n / step) * step
  if (v < min) v = min
  if (v > max) v = max
  return v
}

function replacePlaceholdersWithHex(s: string, tailwindColors: TailwindColors | null, stopsCfg?: StopCfg) {
  if (!s || typeof s !== 'string') return s
  return s.replace(
    /\{color\.([a-zA-Z0-9_-]+)\.(\d+)\}/g,
    (full, palette, stopStr) => {
      const stop = normalizeStop(
        Number(stopStr),
        stopsCfg?.min ?? 50,
        stopsCfg?.max ?? 900,
        stopsCfg?.step ?? 50
      )
      const pal = tailwindColors?.[palette]
      if (!pal) {
        throw new Error(`Tailwind palette not found: ${palette}`)
      }
      const hex = pal[String(stop)]
      if (!hex) {
        throw new Error(`Stop ${stop} not found in palette ${palette}`)
      }
      return hex
    }
  )
}

function defaultVarName(top: string, parts: string[]) {
  return `${top}-${parts.join('-')}`
}

function varNameFromPath(top: string, parts: string[]): string {
  if (top === 'color') {
    if (!parts || parts.length === 0) return parts.join('-')
    const [first, ...rest] = parts
    switch (first) {
      case 'text':
        return `text-color-${rest.join('-')}`
      case 'icon': {
        const idx = parts.indexOf('fill')
        if (idx > -1) {
          const afterFill = parts.slice(idx + 1).join('-')
          return `fill-ds-icon${afterFill ? `-${afterFill}` : ''}`
        }
        return `icon-${rest.join('-')}`
      }
      case 'border':
        return `border-color-${rest.join('-')}`
      case 'background':
        return `background-color-${rest.join('-')}`
      case 'elevation':
        return `background-color-ds-elevation-${parts.slice(2).join('-')}`
      case 'shadow':
        return `shadow-${parts.slice(1).join('-')}`
      case 'chart':
        if (rest[0] === 'ds') {
          return `chart-ds-${rest.slice(1).join('-')}`
        }
        return `chart-ds-${rest.join('-')}`
      default:
        return parts.join('-')
    }
  }
  return defaultVarName(top, parts)
}

function flattenTokens(
  obj: unknown,
  prefix: string[] = [],
  out: Record<string, TokenValue> = {}
) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return out
  const o = obj as Record<string, unknown>
  if ('$value' in o || '$type' in o) {
    out[prefix.join('.')] = o as TokenValue
  }
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('$')) continue
    flattenTokens(v, prefix.concat(k), out)
  }
  return out
}

const cssPropMap: Record<string, string> = {
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textDecoration: 'text-decoration',
  textTransform: 'text-transform',
  fontFamily: 'font-family',
}

function generateUtilityCss(
  flattened: Record<string, TokenValue>,
  override: FileOverride
): string[] {
  const lines: string[] = []
  const utilities: Record<string, Record<string, string>> = {}

  for (const [key, def] of Object.entries(flattened)) {
    const parts = key.split('.')
    let propIndex = -1
    let cssProp = ''
    
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i]
      if (cssPropMap[part]) {
        propIndex = i
        cssProp = cssPropMap[part]
        break
      }
    }

    const nameParts = []
    if (propIndex !== -1) {
      if (parts.length > 1) {
        const parentParts = parts.slice(1, propIndex)
        const modifierParts = parts.slice(propIndex + 1)
        nameParts.push(...parentParts, ...modifierParts)
      } else {
        nameParts.push(parts[0])
      }
    } else {
      nameParts.push(...parts)
    }
    
    const rawName = nameParts.join('-')
    
    let className = rawName
    if (override.prefix) {
       if (!rawName.startsWith(override.prefix)) {
         const shouldExclude = override.excludePrefixFor?.some(ex => rawName.startsWith(ex))
         if (!shouldExclude) {
            className = `${override.prefix}${rawName}`
         }
       }
    }

    if (!utilities[className]) {
      utilities[className] = {}
    }

    const finalProp = propIndex !== -1 ? cssProp : '@apply'

    if (typeof def.$value === 'string' || typeof def.$value === 'number') {
       utilities[className][finalProp] = String(def.$value)
    }
  }

  // --- CHANGED: Removed @layer utilities wrapper and used @utility syntax ---
  for (const [className, styles] of Object.entries(utilities)) {
    lines.push(`@utility ${className} {`)
    for (const [prop, val] of Object.entries(styles)) {
      if (prop === '@apply') {
        lines.push(`  @apply ${val};`)
      } else {
        lines.push(`  ${prop}: ${val};`)
      }
    }
    lines.push(`}`)
  }
  // -------------------------------------------------------------------------

  return lines
}

async function build() {
  const argv = process.argv.slice(2)
  let configPath = 'config/token-gen.json'
  let dryRun = false
  let resolvePalettesOverride: boolean | undefined = undefined
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--config' && argv[i + 1]) {
      configPath = argv[i + 1]
      i++
    } else if (a === '--dry-run') {
      dryRun = true
    } else if (a === '--resolve-palettes') {
      const v = argv[i + 1]
      if (v === 'true' || v === 'false') {
        resolvePalettesOverride = v === 'true'
        i++
      } else {
        resolvePalettesOverride = true
      }
    }
  }

  const cfg = await readConfig(configPath)
  const require = createRequire(import.meta.url)
  let tailwindColors: TailwindColors | null = null
  try {
    tailwindColors = require('tailwindcss/colors')
  } catch (err) {
    tailwindColors = null
  }

  const needPalette = cfg.paletteResolution?.requireTailwindPackage ?? false
  const resolvePalettes =
    resolvePalettesOverride ?? cfg.paletteResolution?.strategy === 'tailwind'
  if (needPalette && !tailwindColors) {
    throw new Error(
      'config.paletteResolution.requireTailwindPackage is true but tailwindcss/colors could not be required. Install tailwindcss.'
    )
  }

  const tokensDir = path.resolve('tokens')
  const files = await fs.readdir(tokensDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const filePath = path.join(tokensDir, file)
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    const tokenName = path.basename(file, '.json')
    
    const override = cfg.overrides?.[tokenName]
    const mode = override?.mode || 'theme'

    console.log(`Processing ${tokenName}.json -> Mode: ${mode}`)

    for (const topKey of Object.keys(parsed)) {
      const tree = parsed[topKey]
      const meta = tree.$meta ?? {}
      const flattened = flattenTokens(tree || {})

      const outNativeCfg = cfg.outputs?.nativeCss
      const outThemeCfg = cfg.outputs?.tailwindCss ?? cfg.outputs?.tailwind
      const outTailwindCfg = cfg.outputs?.tailwind

      const defaultNative = path.resolve(
        `src/styles/_${tokenName === 'color' ? 'colors' : tokenName}.css`
      )
      const defaultTheme = path.resolve(
        `src/styles/themes/${tokenName}.css`
      )

      function resolveCfgPath(
        cfgPath: string | undefined,
        metaPath: string | undefined,
        defaultPath: string,
        opts?: { prefix?: string; suffix?: string }
      ) {
        if (metaPath) return path.resolve(metaPath)
        
        if (override?.outPath) {
          const overridePath = path.resolve(override.outPath)
          const ext = path.extname(overridePath)
          if (!ext) {
             const prefix = opts?.prefix ?? ''
             const suffix = opts?.suffix ?? '.css'
             return path.join(overridePath, `${prefix}${tokenName}${suffix}`)
          }
          return overridePath
        }
        
        if (!cfgPath) return defaultPath
        if (cfgPath.includes('{token}'))
          return path.resolve(cfgPath.replace('{token}', tokenName))
        const ext = path.extname(cfgPath)
        if (!ext) {
          const prefix = opts?.prefix ?? ''
          const suffix = opts?.suffix ?? '.css'
          const filename = `${prefix}${tokenName}${suffix}`
          return path.resolve(cfgPath, filename)
        }
        return path.resolve(cfgPath)
      }

      const outNative = resolveCfgPath(
        outNativeCfg?.path,
        meta.outPath?.native,
        defaultNative,
        { prefix: outNativeCfg?.prefix, suffix: outNativeCfg?.suffix }
      )
      const outTheme = resolveCfgPath(
        outThemeCfg?.path,
        meta.outPath?.theme,
        defaultTheme,
        { prefix: outThemeCfg?.prefix, suffix: outThemeCfg?.suffix }
      )

      const themeKind =
        meta.themeKind ?? (topKey === 'spacing' ? 'inline' : 'static')

      let tailwindOutput: Record<string, Record<string, string>> = {}
      if (topKey === 'color' && resolvePalettes && tailwindColors) {
        const ph: Record<string, Set<number>> = {}
        for (const v of Object.values(flattened)) {
          const txt = String(v.$value ?? '')
          const matches = txt.matchAll(/\{color\.([a-zA-Z0-9_-]+)\.(\d+)\}/g)
          for (const m of matches) {
            ph[m[1]] ||= new Set()
            ph[m[1]].add(Number(m[2]))
          }
          const dtxt = String(v.$extensions?.mode?.dark ?? '')
          const matches2 = dtxt.matchAll(/\{color\.([a-zA-Z0-9_-]+)\.(\d+)\}/g)
          for (const m of matches2) {
            ph[m[1]] ||= new Set()
            ph[m[1]].add(Number(m[2]))
          }
        }
        for (const [palette, setStops] of Object.entries(ph)) {
          const pal = tailwindColors[palette]
          if (!pal) {
            console.warn(`Palette '${palette}' not found in tailwindcss/colors`)
            continue
          }
          tailwindOutput[palette] = {}
          for (const s of Array.from(setStops as Set<number>)) {
            const n = normalizeStop(
              s,
              cfg.stops?.min ?? 50,
              cfg.stops?.max ?? 900,
              cfg.stops?.step ?? 50
            )
            tailwindOutput[palette][String(n)] = pal[String(n)]
          }
        }
      }

      if ((outNativeCfg?.enabled ?? true) && mode !== 'utility') {
        const linesRoot: string[] = []
        const linesDark: string[] = []
        for (const key of Object.keys(flattened)) {
          const parts = key.split('.')
          const cssName = `--${varNameFromPath(topKey, parts)}`
          const def = flattened[key]
          const val = def.$value ?? ''
          const darkVal = def.$extensions?.mode?.dark ?? null
          let resolved = String(val)
          if (topKey === 'color' && Object.keys(tailwindOutput).length) {
            resolved = replacePlaceholdersWithHex(
              String(val),
              tailwindOutput,
              cfg.stops ?? { min: 50, max: 900, step: 50 }
            )
          }
          if (typeof val === 'string' || typeof val === 'number') {
            linesRoot.push(`  ${cssName}: ${resolved};`)
          }
          if (darkVal) {
            let resolvedDark = String(darkVal)
            if (topKey === 'color' && Object.keys(tailwindOutput).length) {
              resolvedDark = replacePlaceholdersWithHex(
                String(darkVal),
                tailwindOutput,
                cfg.stops ?? { min: 50, max: 900, step: 50 }
              )
            }
            linesDark.push(`  ${cssName}: ${resolvedDark};`)
          }
        }

        const outParts: string[] = []
        outParts.push(`${cfg.defaults?.themeRoot ?? ':root'} {`)
        outParts.push(...linesRoot)
        outParts.push('}')
        if (linesDark.length) {
          outParts.push(
            `${cfg.defaults?.darkSelector ?? "[data-theme='dark']"} {`
          )
          outParts.push(...linesDark)
          outParts.push('}')
        }

        if (!dryRun) {
          await fs.mkdir(path.dirname(outNative), { recursive: true })
          await fs.writeFile(outNative, outParts.join('\n') + '\n', 'utf8')
          console.log(`Wrote ${outNative}`)
        } else {
          console.log(`[dry-run] Would write ${outNative}`)
        }
      }

      if (outThemeCfg?.enabled ?? true) {
        let outPartsTheme: string[] = []

        if (mode === 'utility') {
           const utilityLines = generateUtilityCss(flattened, override!)
           outPartsTheme.push(...utilityLines)
        } else {
          const linesTheme: string[] = []
          const linesThemeDark: string[] = []
          
          for (const key of Object.keys(flattened)) {
            const parts = key.split('.')
            const cssName = `--${varNameFromPath(topKey, parts)}`
            const def = flattened[key]
            const val = def.$value ?? ''
            const darkVal = def.$extensions?.mode?.dark ?? null

            let outVal = String(val)
            if (topKey === 'color') {
              outVal = String(val).replace(
                /\{color\.([a-zA-Z0-9_-]+)\.(\d+)\}/g,
                (_full, palette, stopStr) => {
                  const n = normalizeStop(
                    Number(stopStr),
                    cfg.stops?.min ?? 50,
                    cfg.stops?.max ?? 900,
                    cfg.stops?.step ?? 50
                  )
                  return `theme(colors.${palette}.${n})`
                }
              )
            }
            linesTheme.push(`  ${cssName}: ${outVal};`)

            if (darkVal) {
              let outDark = String(darkVal)
              if (topKey === 'color') {
                outDark = String(darkVal).replace(
                  /\{color\.([a-zA-Z0-9_-]+)\.(\d+)\}/g,
                  (_full, palette, stopStr) => {
                    const n = normalizeStop(
                      Number(stopStr),
                      cfg.stops?.min ?? 50,
                      cfg.stops?.max ?? 900,
                      cfg.stops?.step ?? 50
                    )
                    return `theme(colors.${palette}.${n})`
                  }
                )
              }
              linesThemeDark.push(`  ${cssName}: ${outDark};`)
            }
          }
          
          outPartsTheme.push(`@theme ${themeKind} {`)
          outPartsTheme.push(...linesTheme)
          outPartsTheme.push(`}`)

          if (linesThemeDark.length) {
            outPartsTheme.push(`@layer base {`)
            outPartsTheme.push(
              `${cfg.defaults?.darkSelector ?? "[data-theme='dark']"} {`
            )
            outPartsTheme.push(...linesThemeDark)
            outPartsTheme.push(`}`)
            outPartsTheme.push(`}`)
          }
        }

        if (!dryRun) {
          await fs.mkdir(path.dirname(outTheme), { recursive: true })
          await fs.writeFile(outTheme, outPartsTheme.join('\n') + '\n', 'utf8')
          console.log(`Wrote ${outTheme}`)
        } else {
          console.log(`[dry-run] Would write ${outTheme}`)
        }
      }

      if (
        topKey === 'color' &&
        outTailwindCfg?.enabled &&
        outTailwindCfg?.path &&
        Object.keys(tailwindOutput).length
      ) {
        const outTw = path.resolve(outTailwindCfg.path)
        if (!dryRun) {
          await fs.mkdir(path.dirname(outTw), { recursive: true })
          const js = `module.exports = ${JSON.stringify(tailwindOutput, null, 2)};\n`
          await fs.writeFile(outTw, js, 'utf8')
          console.log(`Wrote ${outTw}`)
        } else {
          console.log(`[dry-run] Would write ${outTw}`)
        }
      }
    }
  }
}

build().catch(err => {
  console.error(
    'Error generating tokens:',
    err instanceof Error ? err.message : String(err)
  )
  process.exit(1)
})