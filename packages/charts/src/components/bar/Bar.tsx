'use client'

import React, { useCallback, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import type { EChartEventParams, EChartEvents } from '@/hooks'
import { buildBarOption, getBarCategories } from './buildOption'
import { styles } from './styles'
import type { BarProps, BarDatum } from './types'

export type {
  BarProps,
  BarDatum,
  BarSeries,
  BarVariant,
  BarPalette,
  BarSort,
  BarLegendPosition,
  BarReferenceLine,
} from './types'

echarts.use([
  EBarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
  BrushComponent,
  ToolboxComponent,
  CanvasRenderer,
])

function resolveBarDatum(
  params: EChartEventParams,
  data: BarDatum[]
): [BarDatum, number] {
  const name = params.name ?? ''
  const index = data.findIndex(d => d.label === name)
  if (index >= 0) return [data[index], index]
  const value = typeof params.value === 'number' ? params.value : 0
  return [{ label: name, value }, params.dataIndex ?? -1]
}

export const Bar: React.FC<BarProps> = ({
  data = [],
  categories,
  series,
  max,
  min,
  showValues = true,
  formatValue = v => String(v),
  direction = 'horizontal',
  height = 300,
  showTooltip = true,
  showValueAxis = false,
  showLegend,
  legendPosition = 'top',
  stacked = false,
  stackMode = 'normal',
  showTrack = false,
  trackColor,
  gridLines,
  palette = 'brand',
  barRadius = 4,
  barWidth,
  sort = 'none',
  referenceLine,
  markPoints = [],
  zoom = false,
  selectable = false,
  axisLabelRotate = 0,
  valueAxisName,
  categoryAxisName,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onBarClick,
  onBarHover,
  onBarLeave,
  onBrushSelect,
  onReady,
  className,
  style,
}) => {
  const isHorizontal = direction === 'horizontal'

  const buildOption = useCallback(
    () =>
      buildBarOption({
        data,
        categories,
        series,
        max,
        min,
        isHorizontal,
        showValues,
        formatValue,
        showTooltip,
        showValueAxis,
        showLegend,
        legendPosition,
        stacked,
        stackMode,
        showTrack,
        trackColor,
        gridLines,
        palette,
        barRadius,
        barWidth,
        sort,
        referenceLine,
        markPoints,
        zoom,
        selectable,
        axisLabelRotate,
        valueAxisName,
        categoryAxisName,
        animate,
        emptyMessage,
      }),
    [
      data,
      categories,
      series,
      max,
      min,
      isHorizontal,
      showValues,
      formatValue,
      showTooltip,
      showValueAxis,
      showLegend,
      legendPosition,
      stacked,
      stackMode,
      showTrack,
      trackColor,
      gridLines,
      palette,
      barRadius,
      barWidth,
      sort,
      referenceLine,
      markPoints,
      zoom,
      selectable,
      axisLabelRotate,
      valueAxisName,
      categoryAxisName,
      animate,
      emptyMessage,
    ]
  )

  const events = useMemo<EChartEvents>(
    () => ({
      click: params => {
        const [datum, index] = resolveBarDatum(params, data)
        onBarClick?.(datum, index)
      },
      mouseover: params => {
        if (params.componentType !== 'series') return
        const [datum, index] = resolveBarDatum(params, data)
        onBarHover?.(datum, index)
      },
      mouseout: () => onBarLeave?.(),
      brushselected: params => {
        if (!onBrushSelect) return
        const selected = params.batch?.[0]?.selected ?? []
        const indices = Array.from(
          new Set(selected.flatMap(s => s.dataIndex ?? []))
        )
        const display = getBarCategories({
          data,
          categories,
          series,
          sort,
          isHorizontal,
        })
        const labels = indices
          .map(i => display[i])
          .filter((label): label is string => Boolean(label))
        onBrushSelect({ indices, labels })
      },
    }),
    [
      data,
      categories,
      series,
      sort,
      isHorizontal,
      onBarClick,
      onBarHover,
      onBarLeave,
      onBrushSelect,
    ]
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
      aria-label="Bar chart"
      data-testid="bar-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

Bar.displayName = 'Bar'
