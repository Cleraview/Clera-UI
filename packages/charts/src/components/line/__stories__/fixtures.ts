import type { LinePoint, LineVariant } from '../types'

/** Tiny seeded PRNG so generated demo data is identical on every render. */
export function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export const PREV_CLOSE = 178.6
const SESSION_OPEN = new Date('2024-03-14T09:30:00').getTime()
const FIVE_MIN = 5 * 60 * 1000

function buildIntraday(): LinePoint[] {
  const rnd = lcg(7)
  const points: LinePoint[] = []
  let price = 179.1
  for (let i = 0; i <= 78; i++) {
    price += (rnd() - 0.47) * 0.8
    points.push([SESSION_OPEN + i * FIVE_MIN, Number(price.toFixed(2))])
  }
  return points
}
export const intraday = buildIntraday()
export const trendVariant: LineVariant =
  intraday[intraday.length - 1][1] >= PREV_CLOSE ? 'success' : 'destructive'

export const timeOfDay = (v: string | number) =>
  new Date(v).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

const DAY = 24 * 60 * 60 * 1000
const YEAR_START = new Date('2023-07-01T00:00:00').getTime()

function buildDailyYear(): LinePoint[] {
  const rnd = lcg(21)
  const points: LinePoint[] = []
  let value = 1200
  for (let i = 0; i < 365; i++) {
    value += (rnd() - 0.485) * 60 + Math.sin(i / 18) * 8
    points.push([YEAR_START + i * DAY, Math.max(0, Math.round(value))])
  }
  return points
}
export const dailyYear = buildDailyYear()

export const dayMonth = (v: string | number) =>
  new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const MINUTE = 60 * 1000
export const MONITOR_START = new Date('2024-03-14T13:00:00').getTime()

function buildMonitor(
  seed: number,
  base: number,
  spikeAt: number
): LinePoint[] {
  const rnd = lcg(seed)
  const points: LinePoint[] = []
  let value = base
  for (let i = 0; i < 60; i++) {
    const spike = i >= spikeAt && i < spikeAt + 9 ? 26 : 0
    value += (rnd() - 0.5) * 6
    const v = Math.min(99, Math.max(8, value + spike))
    points.push([MONITOR_START + i * MINUTE, Math.round(v)])
  }
  return points
}
export const cpuSeries = buildMonitor(3, 38, 30)
export const memSeries = buildMonitor(9, 52, 32)

export const clock = (v: string | number) =>
  new Date(v).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

export const LIVE_WINDOW = 40
export const liveLabel = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour12: false })

/** A small play-button icon (data URI) for the rich x-axis label demo. */
export const PLAY_ICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="11" fill="red"/><path d="M9.5 7.5v9l8-4.5z" fill="white"/></svg>'
  )
