import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type { ChartVariant } from '@/utils'

export type BarVariant = ChartVariant

export type BarPalette = 'brand' | 'categorical'

export type BarSort = 'none' | 'asc' | 'desc'

export type BarStackMode = 'normal' | 'percent'

export type BarZoom = boolean | 'category' | 'value'

export type BarBrushSelection = {
  indices: number[]
  labels: string[]
}

export type BarLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type BarReferenceLine = {
  value: number
  label?: string
}

export type BarMarkPoint = 'max' | 'min'

export type BarDatum = {
  label: string
  value: number
  variant?: BarVariant
  color?: string
}

export type BarSeries = {
  name: string
  data: number[]
  variant?: BarVariant
  color?: string
  silent?: boolean
}

export interface BarProps {
  data?: BarDatum[]
  categories?: string[]
  series?: BarSeries[]
  max?: number
  min?: number
  showValues?: boolean
  formatValue?: (value: number) => string
  direction?: 'horizontal' | 'vertical'
  height?: number | string
  showTooltip?: boolean
  showValueAxis?: boolean
  showLegend?: boolean
  legendPosition?: BarLegendPosition
  stacked?: boolean
  stackMode?: BarStackMode
  showTrack?: boolean
  trackColor?: string
  gridLines?: boolean
  palette?: BarPalette
  barRadius?: number
  barWidth?: number
  sort?: BarSort
  referenceLine?: BarReferenceLine | 'average'
  markPoints?: BarMarkPoint[]
  zoom?: BarZoom
  selectable?: boolean
  axisLabelRotate?: number
  valueAxisName?: string
  categoryAxisName?: string
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onBarClick?: (datum: BarDatum, index: number) => void
  onBarHover?: (datum: BarDatum, index: number) => void
  onBarLeave?: () => void
  onBrushSelect?: (selection: BarBrushSelection) => void
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}
