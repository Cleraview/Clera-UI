'use client'

import React, { useCallback } from 'react'
import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  AxisPointerComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import { buildMultiXLineOption } from './buildOption'
import { styles } from './styles'
import type { MultiXLineProps } from './types'

export type {
  MultiXLineProps,
  MultiXLineXAxis,
  MultiXLineYAxis,
  MultiXSeries,
} from './types'

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  AxisPointerComponent,
  CanvasRenderer,
])

export const MultiXLine: React.FC<MultiXLineProps> = ({
  xAxes,
  yAxis,
  height = 360,
  curve = 'smooth',
  area = false,
  showLegend = true,
  min,
  max,
  showTooltip = true,
  formatValue = v => String(v),
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onReady,
  className,
  style,
}) => {
  const buildOption = useCallback(
    () =>
      buildMultiXLineOption({
        xAxes,
        curve,
        area,
        showLegend,
        min,
        max,
        yAxis,
        showTooltip,
        formatValue,
        animate,
        emptyMessage,
      }) as unknown as EChartsCoreOption,
    [
      xAxes,
      curve,
      area,
      showLegend,
      min,
      max,
      yAxis,
      showTooltip,
      formatValue,
      animate,
      emptyMessage,
    ]
  )

  const { containerRef } = useEChart({
    buildOption,
    loading,
    loadingColor: resolveVariant('primary'),
    onReady,
  })

  return (
    <div
      role="img"
      aria-label="Multiple x-axis line chart"
      data-testid="multi-x-line-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

MultiXLine.displayName = 'MultiXLine'
