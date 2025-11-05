module.exports = {
  'src/**/*.{ts,tsx}': () => ['pnpm type-check', 'pnpm test'],
  '*.{mjs,js,ts,tsx}': () => 'pnpm lint',
}