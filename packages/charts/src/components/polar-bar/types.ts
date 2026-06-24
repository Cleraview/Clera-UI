import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type { ChartVariant } from '@/utils'

export type PolarBarOrientation = 'angular' | 'radial'

export type PolarBarPalette = 'brand' | 'categorical'

export type PolarBarLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type PolarBarDatum = {
  label: string
  value: number
  variant?: ChartVariant
  color?: string
}

export type PolarBarSeries = {
  name: string
  data: number[]
  variant?: ChartVariant
  color?: string
}

export interface PolarBarProps {
  data?: PolarBarDatum[]
  categories?: string[]
  series?: PolarBarSeries[]
  orientation?: PolarBarOrientation
  height?: number | string
  stacked?: boolean
  max?: number
  min?: number
  showValues?: boolean
  showTooltip?: boolean
  showLegend?: boolean
  legendPosition?: PolarBarLegendPosition
  palette?: PolarBarPalette
  barRadius?: number
  roundCap?: boolean
  startAngle?: number
  formatValue?: (value: number) => string
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onBarClick?: (datum: PolarBarDatum, index: number) => void
  onReady?: (chart: ECharts) => void
  className?: string
  style?: CSSProperties
}
