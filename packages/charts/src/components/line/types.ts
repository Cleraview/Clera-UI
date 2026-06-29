import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type {
  ChartVariant,
  AxisLabelOverride,
  ValueAxisPosition,
} from '@/utils'

export type { AxisLabelOverride, ValueAxisPosition }

export type LineVariant = ChartVariant

export type LinePalette = 'brand' | 'categorical'

/** Line shape between points. */
export type LineCurve = 'smooth' | 'straight' | 'stepped'

/** Category x-axis (evenly spaced labels) or a true time axis. */
export type LineXAxisType = 'category' | 'time'

export type LineLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type LineMarkPoint = 'max' | 'min'

/** An `[x, y]` pair — required when `xAxisType="time"` (x is a timestamp or date string). */
export type LinePoint = [number | string, number]

export type LineSeries = {
  name: string
  /** Plain values aligned to `categories`, or `[x, y]` pairs for a time axis. */
  data: number[] | LinePoint[]
  variant?: LineVariant
  color?: string
  /** Per-series override of the chart-level `curve`. */
  curve?: LineCurve
  /** Fill under the line. `true` is a flat tint; `'gradient'` fades to transparent. */
  area?: boolean | 'gradient'
  /** Give two or more series the same `stack` name to stack their areas. */
  stack?: string
  /** Render the line dashed. */
  dashed?: boolean
  /** Show the point markers for this series (overrides the chart-level `showSymbol`). */
  showSymbol?: boolean
  /** Per-series line thickness in px. */
  width?: number
}

export type LineReferenceLine = {
  value: number
  label?: string
  /** Which axis the line sits on. Defaults to the value (`y`) axis. */
  axis?: 'x' | 'y'
  color?: string
}

export type LineMarkArea = {
  from: number | string
  to: number | string
  label?: string
  color?: string
  /** Band orientation. Defaults to a vertical band over the `x` axis (e.g. a time window). */
  axis?: 'x' | 'y'
}

/**
 * Color the line by where each point sits relative to a baseline — e.g. green
 * above the previous close, red below it. Applies to the first series.
 */
export type LineThreshold = {
  value: number
  /** Color (or variant) for segments at/above the baseline. Defaults to `success`. */
  above?: LineVariant | string
  /** Color (or variant) for segments below the baseline. Defaults to `destructive`. */
  below?: LineVariant | string
}

export interface LineProps {
  categories?: (string | number)[]
  series: LineSeries[]
  xAxisType?: LineXAxisType
  height?: number | string
  curve?: LineCurve
  area?: boolean | 'gradient'
  palette?: LinePalette
  showSymbol?: boolean
  symbolSize?: number
  lineWidth?: number
  connectNulls?: boolean
  min?: number
  max?: number
  showValueAxis?: boolean
  gridLines?: boolean
  valueAxisName?: string
  categoryAxisName?: string
  /** Which side the value (y) axis sits on. */
  valueAxisPosition?: ValueAxisPosition
  axisLabelRotate?: number
  /** Escape hatch to customize the x-axis labels — e.g. rich labels with icons. */
  xAxisLabel?: AxisLabelOverride
  showTooltip?: boolean
  tooltipTrigger?: 'item' | 'axis'
  showLegend?: boolean
  legendPosition?: LineLegendPosition
  /** On hover, focus the hovered series and dim the rest. Off by default. */
  highlightSeries?: boolean
  threshold?: LineThreshold
  referenceLine?: LineReferenceLine | LineReferenceLine[]
  markArea?: LineMarkArea | LineMarkArea[]
  markPoints?: LineMarkPoint[]
  zoom?: boolean
  zoomSlider?: boolean
  /** Minimal axis-less trend line for KPI cards and inline sparklines. */
  sparkline?: boolean
  formatValue?: (value: number) => string
  /** Formats x-axis ticks and the tooltip header — handy for time axes. */
  formatX?: (value: string | number) => string
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onPointClick?: (point: LinePointClick) => void
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}

export type LinePointClick = {
  seriesName: string
  x: string | number
  value: number
  index: number
}
