import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type { ChartVariant } from '@/utils'

export type ComboSeriesType = 'bar' | 'line' | 'area'

export type ComboAxis = 'left' | 'right'

export type ComboLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type ComboSeries = {
  name: string
  type: ComboSeriesType
  data: number[]
  variant?: ChartVariant
  color?: string
  axis?: ComboAxis | number
  smooth?: boolean
  stack?: string
}

export type ComboAxisConfig = {
  name?: string
  min?: number
  max?: number
  format?: (value: number) => string
}

export type ComboValueAxis = {
  name?: string
  position?: ComboAxis
  offset?: number
  min?: number
  max?: number
  format?: (value: number) => string
  color?: string
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
  barRadius?: number
  axisLabelRotate?: number
  categoryAxisName?: string
  leftAxis?: ComboAxisConfig
  rightAxis?: ComboAxisConfig
  valueAxes?: ComboValueAxis[]
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}
