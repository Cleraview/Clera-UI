import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type {
  ChartVariant,
  AxisLabelOverride,
  ValueAxisPosition,
  ValueAxisNamePosition,
  CategoryAxisNamePosition,
  AxisNameOrientation,
} from '@/utils'

export type {
  AxisLabelOverride,
  ValueAxisPosition,
  ValueAxisNamePosition,
  CategoryAxisNamePosition,
  AxisNameOrientation,
}

export type ComboSeriesType = 'bar' | 'line' | 'area'

export type ComboLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type ComboSeries = {
  name: string
  type: ComboSeriesType
  data: number[]
  variant?: ChartVariant
  color?: string
  /**
   * Which y-axis this series is plotted against — an axis `id` or index from
   * `yAxes` (or `'left'`/`'right'`). Defaults to the first axis.
   */
  yAxis?: string | number
  smooth?: boolean
  stack?: string
}

/**
 * A y-axis. Pass one or more to `yAxes` — several on the left and/or right, each
 * with its own title and scale. Series bind to an axis via `series[].yAxis`.
 */
export type ComboYAxis = {
  /** Stable id to bind series to this axis. Falls back to the array index. */
  id?: string | number
  /** The axis title text. */
  name?: string
  /** Which side this axis sits on. Defaults to `'left'`. */
  side?: ValueAxisPosition
  min?: number
  max?: number
  /** Flip the axis so values grow downward. */
  inverse?: boolean
  /** Where the title sits along the axis: `top` (default), `middle`, or `bottom`. */
  position?: ValueAxisNamePosition
  /** Title text direction: `horizontal` or `vertical` (rotated 90°). */
  orientation?: AxisNameOrientation
  /** Format for this axis's tick labels and tooltip values. */
  format?: (value: number) => string
  /** Accent color for this axis's line, labels, and title. */
  color?: string
}

/** The x-axis. */
export type ComboXAxis = {
  /** The axis title text. */
  name?: string
  /** Where the title sits along the axis: `left`, `middle`, or `right` (default). */
  position?: CategoryAxisNamePosition
  /** Title text direction: `horizontal` (default) or `vertical` (rotated 90°). */
  orientation?: AxisNameOrientation
}

export interface ComboProps {
  categories: string[]
  series: ComboSeries[]
  height?: number | string
  showValues?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  legendPosition?: ComboLegendPosition
  gridLines?: boolean
  highlightSeries?: boolean
  barRadius?: number
  axisLabelRotate?: number
  /**
   * The y-axes: one or more, each `{ id?, name?, side?, min?, max?, inverse?,
   * position?, orientation?, format?, color? }`. `name` is the axis title;
   * `position`/`orientation` place it. Bind series with `series[].yAxis`.
   */
  yAxes?: ComboYAxis[]
  /** The x-axis: `{ name?, position?, orientation? }` — `name` is its title. */
  xAxis?: ComboXAxis
  /** Escape hatch to customize the x-axis labels — e.g. rich labels with icons. */
  xAxisLabel?: AxisLabelOverride
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}
