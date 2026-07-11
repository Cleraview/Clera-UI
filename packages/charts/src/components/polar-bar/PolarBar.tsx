'use client'

import React, { useCallback, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import {
  PolarComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import type { EChartEventParams, EChartEvents } from '@/hooks'
import { buildPolarBarOption } from './buildOption'
import { styles } from './styles'
import type { PolarBarProps, PolarBarDatum } from './types'

export type {
  PolarBarProps,
  PolarBarDatum,
  PolarBarSeries,
  PolarBarOrientation,
  PolarBarPalette,
} from './types'

echarts.use([
  EBarChart,
  PolarComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
])

function resolveDatum(
  params: EChartEventParams,
  data: PolarBarDatum[]
): [PolarBarDatum, number] {
  const name = params.name ?? ''
  const index = data.findIndex(d => d.label === name)
  if (index >= 0) return [data[index], index]
  const value = typeof params.value === 'number' ? params.value : 0
  return [{ label: name, value }, params.dataIndex ?? -1]
}

export const PolarBar: React.FC<PolarBarProps> = ({
  data = [],
  categories,
  series,
  orientation = 'angular',
  height = 360,
  stacked = false,
  highlightSeries = false,
  max,
  min,
  showValues = false,
  showTooltip = true,
  showLegend,
  legendPosition = 'top',
  legendIcon,
  legendAlign,
  legendStyle,
  palette = 'brand',
  barRadius = 4,
  roundCap = true,
  startAngle = 90,
  endAngle,
  formatValue = v => String(v),
  labelFormatter,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onBarClick,
  onReady,
  className,
  style,
}) => {
  const buildOption = useCallback(
    () =>
      buildPolarBarOption({
        data,
        categories,
        series,
        orientation,
        stacked,
        highlightSeries,
        max,
        min,
        showValues,
        showTooltip,
        showLegend,
        legendPosition,
        legendIcon,
        legendAlign,
        legendStyle,
        palette,
        barRadius,
        roundCap,
        startAngle,
        endAngle,
        formatValue,
        labelFormatter,
        animate,
        emptyMessage,
      }),
    [
      data,
      categories,
      series,
      orientation,
      stacked,
      highlightSeries,
      max,
      min,
      showValues,
      showTooltip,
      showLegend,
      legendPosition,
      legendIcon,
      legendAlign,
      legendStyle,
      palette,
      barRadius,
      roundCap,
      startAngle,
      endAngle,
      formatValue,
      labelFormatter,
      animate,
      emptyMessage,
    ]
  )

  const events = useMemo<EChartEvents>(
    () => ({
      click: params => {
        const [datum, index] = resolveDatum(params, data)
        onBarClick?.(datum, index)
      },
    }),
    [data, onBarClick]
  )

  const { containerRef } = useEChart({
    buildOption,
    loading,
    loadingColor: resolveVariant('primary'),
    events,
    onReady,
  })

  return (
    <div
      role="img"
      aria-label="Polar bar chart"
      data-testid="polar-bar-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

PolarBar.displayName = 'PolarBar'
