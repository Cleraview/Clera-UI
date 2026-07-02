'use client'

import React, { useCallback } from 'react'
import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  AxisPointerComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import { buildLinePanelsOption } from './buildOption'
import { styles } from './styles'
import type { LinePanelsProps } from './types'

export type { LinePanelsProps, LinePanel, LinePanelSeries } from './types'

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  AxisPointerComponent,
  DataZoomComponent,
  CanvasRenderer,
])

export const LinePanels: React.FC<LinePanelsProps> = ({
  categories,
  xAxisType = 'category',
  panels,
  height = 420,
  area = false,
  curve = 'straight',
  zoom = false,
  zoomSlider = true,
  xAxisPerPanel = false,
  showTooltip = true,
  axisPointerLabel = true,
  formatValue = v => String(v),
  formatX,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onReady,
  className,
  style,
}) => {
  const buildOption = useCallback(
    () =>
      buildLinePanelsOption({
        categories,
        xAxisType,
        panels,
        area,
        curve,
        zoom,
        zoomSlider,
        xAxisPerPanel,
        showTooltip,
        axisPointerLabel,
        formatValue,
        formatX,
        animate,
        emptyMessage,
      }) as unknown as EChartsCoreOption,
    [
      categories,
      xAxisType,
      panels,
      area,
      curve,
      zoom,
      zoomSlider,
      xAxisPerPanel,
      showTooltip,
      axisPointerLabel,
      formatValue,
      formatX,
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
      aria-label="Stacked line panels chart"
      data-testid="line-panels-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

LinePanels.displayName = 'LinePanels'
