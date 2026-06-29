'use client'

import React, { useCallback, useMemo } from 'react'
import * as echarts from 'echarts/core'
import { LineChart as ELineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import type { EChartEvents } from '@/hooks'
import { buildLineOption } from './buildOption'
import { resolvePoint } from './helpers'
import { styles } from './styles'
import type { LineProps } from './types'

export type {
  LineProps,
  LineSeries,
  LinePoint,
  LineVariant,
  LinePalette,
  LineCurve,
  LineXAxisType,
  LineLegendPosition,
  LineMarkPoint,
  LineReferenceLine,
  LineMarkArea,
  LineThreshold,
  LinePointClick,
} from './types'

echarts.use([
  ELineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
  CanvasRenderer,
])

export const Line: React.FC<LineProps> = ({
  categories,
  series,
  xAxisType = 'category',
  height = 320,
  curve = 'straight',
  area = false,
  palette = 'categorical',
  showSymbol = false,
  symbolSize = 6,
  lineWidth = 2,
  connectNulls = false,
  min,
  max,
  showValueAxis = true,
  gridLines,
  valueAxisName,
  categoryAxisName,
  valueAxisPosition = 'left',
  axisLabelRotate = 0,
  xAxisLabel,
  showTooltip = true,
  tooltipTrigger = 'axis',
  showLegend,
  legendPosition = 'top',
  highlightSeries = false,
  threshold,
  referenceLine,
  markArea,
  markPoints = [],
  zoom = false,
  zoomSlider = true,
  sparkline = false,
  formatValue = v => String(v),
  formatX,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onPointClick,
  onReady,
  className,
  style,
}) => {
  const buildOption = useCallback(
    () =>
      buildLineOption({
        categories,
        series,
        xAxisType,
        curve,
        area,
        palette,
        showSymbol,
        symbolSize,
        lineWidth,
        connectNulls,
        min,
        max,
        showValueAxis,
        gridLines,
        valueAxisName,
        categoryAxisName,
        valueAxisPosition,
        axisLabelRotate,
        xAxisLabel,
        showTooltip,
        tooltipTrigger,
        showLegend,
        legendPosition,
        highlightSeries,
        threshold,
        referenceLine,
        markArea,
        markPoints,
        zoom,
        zoomSlider,
        sparkline,
        formatValue,
        formatX,
        animate,
        emptyMessage,
      }),
    [
      categories,
      series,
      xAxisType,
      curve,
      area,
      palette,
      showSymbol,
      symbolSize,
      lineWidth,
      connectNulls,
      min,
      max,
      showValueAxis,
      gridLines,
      valueAxisName,
      categoryAxisName,
      valueAxisPosition,
      axisLabelRotate,
      xAxisLabel,
      showTooltip,
      tooltipTrigger,
      showLegend,
      legendPosition,
      highlightSeries,
      threshold,
      referenceLine,
      markArea,
      markPoints,
      zoom,
      zoomSlider,
      sparkline,
      formatValue,
      formatX,
      animate,
      emptyMessage,
    ]
  )

  const events = useMemo<EChartEvents>(
    () => ({
      click: params => {
        if (params.componentType !== 'series') return
        onPointClick?.(resolvePoint(params))
      },
    }),
    [onPointClick]
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
      aria-label="Line chart"
      data-testid="line-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

Line.displayName = 'Line'
