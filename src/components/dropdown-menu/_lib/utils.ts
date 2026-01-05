export function parseWidth(value: string | number): number {
  if (typeof value === 'number') return value
  const parsed = parseInt(String(value), 10)
  return Number.isFinite(parsed) ? parsed : 240
}

export function estimateMenuHeight(
  itemCount: number,
  hasHeader: boolean
): number {
  const approxItem = 40
  const header = hasHeader ? 48 : 0
  const estimated = approxItem * Math.max(itemCount, 1) + header
  const max = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 400
  return Math.min(Math.max(estimated, 120), max)
}
