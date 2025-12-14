import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'

// Stronger types to avoid `any`
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

type TokenMeta = { outPath?: { native?: string; theme?: string }; themeKind?: string }
type TokenValue = {
  $value?: string
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
}

async function readConfig(
  configPath = 'config/token-gen.json'
): Promise<Config> {
  try {
    const cfgRaw = await fs.readFile(path.resolve(configPath), 'utf8')
    return JSON.parse(cfgRaw) as Config
  } catch (err) {
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
        `src/styles/themes/${tokenName}.generated.css`
      )

      function resolveCfgPath(
        cfgPath: string | undefined,
        metaPath: string | undefined,
        defaultPath: string,
        opts?: { prefix?: string; suffix?: string }
      ) {
        if (metaPath) return path.resolve(metaPath)
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

      if (outNativeCfg?.enabled ?? true) {
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
          linesRoot.push(`  ${cssName}: ${resolved};`)
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
        const linesTheme: string[] = []
        const linesThemeDark: string[] = []
        let lastGroup: string | null = null
        let lastGroupDark: string | null = null

        function groupForParts(parts: string[]) {
          const g = parts[0]
          switch (g) {
            case 'text':
              return 'TEXT'
            case 'link':
              return 'LINK'
            case 'icon':
              return 'ICON'
            case 'border':
              return 'BORDER'
            case 'background':
              return 'BACKGROUND'
            case 'skeleton':
              return 'SKELETON'
            case 'chart':
              return 'CHART'
            case 'elevation':
              return 'ELEVATION'
            case 'shadow':
              return 'ELEVATION SHADOWS'
            default:
              return g.toUpperCase()
          }
        }
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
          const grp = groupForParts(parts)
          if (grp !== lastGroup) {
            linesTheme.push(`  /* ===== ${grp} ===== */`)
            lastGroup = grp
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
            const grpD = groupForParts(parts)
            if (grpD !== lastGroupDark) {
              linesThemeDark.push(`  /* ===== ${grpD} ===== */`)
              lastGroupDark = grpD
            }
            linesThemeDark.push(`  ${cssName}: ${outDark};`)
          }
        }

        const outPartsTheme: string[] = []
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

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const parsed = JSON.parse(
      await fs.readFile(path.join(tokensDir, file), 'utf8')
    )
    for (const topKey of Object.keys(parsed)) {
      const canonical = path.resolve(`src/styles/themes/${topKey}.css`)
      const generated = path.resolve(
        `src/styles/themes/${topKey}.generated.css`
      )
      try {
        const a = (await fs.readFile(canonical, 'utf8'))
          .split(/\r?\n/)
          .map(l => l.trim())
          .filter(Boolean)
          .filter(l => l.startsWith('--'))
        const b = (await fs.readFile(generated, 'utf8'))
          .split(/\r?\n/)
          .map(l => l.trim())
          .filter(Boolean)
          .filter(l => l.startsWith('--'))
        const setB = new Set(b)
        const setA = new Set(a)
        const missing = a.filter(l => !setB.has(l))
        const extra = b.filter(l => !setA.has(l))
        if (missing.length || extra.length) {
          console.log(
            `DIFF for ${topKey}: missing ${missing.length} lines, extra ${extra.length} lines`
          )
        } else {
          console.log(`No differences for ${topKey}`)
        }
      } catch (err) {}
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
