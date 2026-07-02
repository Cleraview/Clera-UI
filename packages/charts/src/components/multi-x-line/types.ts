import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type { LineVariant, LineCurve } from '../line/types'

export type { LineVariant, LineCurve }

export type MultiXSeries = {
  name: string
  data: number[]
  variant?: LineVariant
  color?: string
  /** Fill under the line. Overrides the chart-level `area`. */
  area?: boolean | 'gradient'
}

export type MultiXAxis = {
  /** Category labels for this x-axis. */
  categories: (string | number)[]
  /** Axis title; also used in the crosshair readout. */
  name?: string
  /** Axis + default series color. Falls back to the series variant, then the palette. */
  color?: string
  /** Series plotted against this x-axis (usually one). */
  series: MultiXSeries[]
}

export interface MultiXLineProps {
  /**
   * The x-axes to overlay on a shared value axis. The first sits on the bottom,
   * the second on top, and any further axes alternate (offset outward). Each
   * carries its own categories, color, and series.
   */
  axes: MultiXAxis[]
  height?: number | string
  curve?: LineCurve
  /** Default fill under each line; override per series. */
  area?: boolean | 'gradient'
  showLegend?: boolean
  /** Force the value-axis minimum / maximum. */
  min?: number
  max?: number
  valueAxisName?: string
  /** Show the hover crosshair with a per-axis value readout. */
  showTooltip?: boolean
  formatValue?: (value: number) => string
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}
