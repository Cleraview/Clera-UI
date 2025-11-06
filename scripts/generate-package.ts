// scripts/generate-package.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read the root package.json
const rootPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf-8')
);

// Create a new package.json for publishing
const distPackageJson = {
  ...rootPackageJson,
  main: 'lib/index.js',
  module: 'es/index.js',
  types: 'es/index.d.ts',
  // Remove scripts and dev dependencies
  scripts: undefined,
  devDependencies: undefined,
  pnpm: undefined,
  // Ensure private is false so you can publish
  private: false,
};

// Write the new package.json to dist/
fs.writeFileSync(
  path.resolve(rootDir, 'dist/package.json'),
  JSON.stringify(distPackageJson, null, 2)
);

console.log('✅ Generated clean package.json in dist/');