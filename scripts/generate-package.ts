import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const rootPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8')
)

const distPackageJson = {
  ...rootPackageJson,
  main: 'lib/index.js',
  module: 'es/index.js',
  types: 'es/index.d.ts',
  scripts: undefined,
  devDependencies: undefined,
  pnpm: undefined,
  private: false,
}

fs.writeFileSync(
  path.resolve(rootDir, 'dist/package.json'),
  JSON.stringify(distPackageJson, null, 2)
)

console.log('Generated clean package.json in dist/')