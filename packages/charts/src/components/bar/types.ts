import type { CSSProperties } from 'react'
import type { ECharts } from 'echarts/core'
import type { ChartVariant } from '@/utils'

export type BarVariant = ChartVariant

export type BarPalette = 'brand' | 'categorical'

export type BarSort = 'none' | 'asc' | 'desc'

export type BarStackMode = 'normal' | 'percent'

export type BarZoom = boolean | 'category' | 'value' | 'both'

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

export type BarAxisBreak = {
  start: number
  end: number
  gap?: number | string
}

export type BarAxisBreakCollapse = {
  text?: string
  offset?: [number, number]
  textStyle?: {
    color?: string
    fontSize?: number
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number
  }
  buttonStyle?: {
    fill?: string
    stroke?: string
    borderRadius?: number
    paddingX?: number
  }
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
  stack?: string
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
  tooltipTrigger?: 'item' | 'axis'
  showValueAxis?: boolean
  showLegend?: boolean
  legendPosition?: BarLegendPosition
  stacked?: boolean
  stackMode?: BarStackMode
  highlightSeries?: boolean
  showTrack?: boolean
  trackColor?: string
  gridLines?: boolean
  palette?: BarPalette
  barRadius?: number
  barWidth?: number
  sort?: BarSort
  referenceLine?: BarReferenceLine | 'average'
  markPoints?: BarMarkPoint[]
  axisBreaks?: BarAxisBreak[]
  axisBreakExpandable?: boolean
  axisBreakCollapse?: BarAxisBreakCollapse
  zoom?: BarZoom
  zoomSlider?: boolean
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
