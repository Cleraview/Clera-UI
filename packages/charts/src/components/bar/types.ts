import type { CSSProperties } from 'react'
import type { ChartVariant } from '@/utils'

export type BarVariant = ChartVariant

export type BarPalette = 'brand' | 'categorical'

export type BarSort = 'none' | 'asc' | 'desc'

export type BarLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type BarReferenceLine = {
  value: number
  label?: string
}

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
  showValues?: boolean
  formatValue?: (value: number) => string
  direction?: 'horizontal' | 'vertical'
  height?: number | string
  showTooltip?: boolean
  showValueAxis?: boolean
  showLegend?: boolean
  legendPosition?: BarLegendPosition
  stacked?: boolean
  showTrack?: boolean
  trackColor?: string
  gridLines?: boolean
  palette?: BarPalette
  barRadius?: number
  barWidth?: number
  sort?: BarSort
  referenceLine?: BarReferenceLine
  loading?: boolean
  animate?: boolean
  emptyMessage?: string
  onBarClick?: (datum: BarDatum, index: number) => void
  className?: string
  style?: CSSProperties
}
