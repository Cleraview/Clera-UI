'use client'

import React, { useCallback } from 'react'
import * as echarts from 'echarts/core'
import type { EChartsCoreOption } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  MatrixComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { useEChart } from '@/hooks'
import { buildLineMatrixOption } from './buildOption'
import { styles } from './styles'
import type { LineMatrixProps } from './types'

export type { LineMatrixProps, LineMatrixRow, LineMatrixCell } from './types'

echarts.use([
  LineChart,
  MatrixComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  CanvasRenderer,
])

export const LineMatrix: React.FC<LineMatrixProps> = ({
  columns,
  rows,
  cells,
  height = 520,
  cornerLabel,
  area = true,
  curve = 'straight',
  colorByTrend = false,
  zoom = false,
  zoomSlider = true,
  showCellLabel = true,
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
      buildLineMatrixOption({
        columns,
        rows,
        cells,
        cornerLabel,
        area,
        curve,
        colorByTrend,
        zoom,
        zoomSlider,
        showCellLabel,
        formatValue,
        formatX,
        animate,
        emptyMessage,
      }) as unknown as EChartsCoreOption,
    [
      columns,
      rows,
      cells,
      cornerLabel,
      area,
      curve,
      colorByTrend,
      zoom,
      zoomSlider,
      showCellLabel,
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
      aria-label="Line matrix chart"
      data-testid="line-matrix-chart"
      ref={containerRef}
      className={cn(styles.root, className)}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

LineMatrix.displayName = 'LineMatrix'
