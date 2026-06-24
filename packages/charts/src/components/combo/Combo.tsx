'use client'

import React, { useCallback } from 'react'
import * as echarts from 'echarts/core'
import { BarChart as EBarChart, LineChart as ELineChart } from 'echarts/charts'
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
import { buildComboOption } from './buildOption'
import { styles } from './styles'
import type { ComboProps } from './types'

export type {
  ComboProps,
  ComboSeries,
  ComboSeriesType,
  ComboAxis,
  ComboAxisConfig,
  ComboLegendPosition,
} from './types'

echarts.use([
  EBarChart,
  ELineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  AxisPointerComponent,
  CanvasRenderer,
])

export const Combo: React.FC<ComboProps> = ({
  categories,
  series,
  height = 320,
  showValues = false,
  showTooltip = true,
  showLegend = true,
  legendPosition = 'top',
  gridLines = true,
  barRadius = 4,
  axisLabelRotate = 0,
  categoryAxisName,
  leftAxis,
  rightAxis,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onReady,
  className,
  style,
}) => {
  const buildOption = useCallback(
    () =>
      buildComboOption({
        categories,
        series,
        showValues,
        showTooltip,
        showLegend,
        legendPosition,
        gridLines,
        barRadius,
        axisLabelRotate,
        categoryAxisName,
        leftAxis,
        rightAxis,
        animate,
        emptyMessage,
      }),
    [
      categories,
      series,
      showValues,
      showTooltip,
      showLegend,
      legendPosition,
      gridLines,
      barRadius,
      axisLabelRotate,
      categoryAxisName,
      leftAxis,
      rightAxis,
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
      aria-label="Combo chart"
      data-testid="combo-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

Combo.displayName = 'Combo'
