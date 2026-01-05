import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function generateTypographyTokenMap(tokens: any): Record<string, string[]> {
  const groups = tokens.typography ?? tokens
  const result: Record<string, string[]> = {}

  for (const [group, entries] of Object.entries(groups)) {
    if (!entries || typeof entries !== 'object') continue
    const keys = Object.keys(entries)
    result[group] = keys.map(k => `text-${group}-${k}`)
  }

  return result
}

function main() {
  const tokensPath = path.join(process.cwd(), 'tokens', 'typography.json')
  const outDir = path.join(process.cwd(), 'src', 'utils', 'tailwind')
  const outPath = path.join(outDir, 'typography-map.json')

  if (!fs.existsSync(tokensPath)) {
    console.error('tokens/typography.json not found')
    process.exit(1)
  }

  const raw = fs.readFileSync(tokensPath, 'utf8')
  const tokens = JSON.parse(raw)
  const map = generateTypographyTokenMap(tokens)

  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8')
  console.log('Wrote', outPath)
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) main()
