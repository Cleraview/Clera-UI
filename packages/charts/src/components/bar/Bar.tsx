'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import * as echarts from 'echarts/core'
import type { ECharts } from 'echarts/core'
import { BarChart as EBarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@clera/ui/utils'
import { resolveVariant } from '@/utils'
import { buildBarOption } from './buildOption'
import { styles } from './styles'
import type { BarProps } from './types'

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
  CanvasRenderer,
])

export const Bar: React.FC<BarProps> = ({
  data = [],
  categories,
  series,
  max,
  showValues = true,
  formatValue = v => String(v),
  direction = 'horizontal',
  height = 300,
  showTooltip = true,
  showValueAxis = false,
  showLegend,
  legendPosition = 'top',
  stacked = false,
  showTrack = false,
  trackColor,
  gridLines,
  palette = 'brand',
  barRadius = 4,
  barWidth,
  sort = 'none',
  referenceLine,
  loading = false,
  animate = true,
  emptyMessage = 'No data',
  onBarClick,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)
  const isHorizontal = direction === 'horizontal'

  const buildOption = useCallback(
    () =>
      buildBarOption({
        data,
        categories,
        series,
        max,
        isHorizontal,
        showValues,
        formatValue,
        showTooltip,
        showValueAxis,
        showLegend,
        legendPosition,
        stacked,
        showTrack,
        trackColor,
        gridLines,
        palette,
        barRadius,
        barWidth,
        sort,
        referenceLine,
        animate,
        emptyMessage,
      }),
    [
      data,
      categories,
      series,
      max,
      isHorizontal,
      showValues,
      formatValue,
      showTooltip,
      showValueAxis,
      showLegend,
      legendPosition,
      stacked,
      showTrack,
      trackColor,
      gridLines,
      palette,
      barRadius,
      barWidth,
      sort,
      referenceLine,
      animate,
      emptyMessage,
    ]
  )

  const buildOptionRef = useRef(buildOption)
  useEffect(() => {
    buildOptionRef.current = buildOption
  }, [buildOption])

  const dataRef = useRef(data)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const onBarClickRef = useRef(onBarClick)
  useEffect(() => {
    onBarClickRef.current = onBarClick
  }, [onBarClick])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = echarts.init(el, undefined, { renderer: 'canvas' })
    chartRef.current = chart

    const handleClick = (params: {
      name?: string
      value?: unknown
      dataIndex?: number
    }) => {
      const name = params.name ?? ''
      const index = dataRef.current.findIndex(d => d.label === name)
      if (index >= 0) {
        onBarClickRef.current?.(dataRef.current[index], index)
        return
      }
      const value = typeof params.value === 'number' ? params.value : 0
      onBarClickRef.current?.({ label: name, value }, params.dataIndex ?? -1)
    }
    chart.on('click', handleClick)

    const observer = new ResizeObserver(() => chart.resize())
    observer.observe(el)

    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const apply = () =>
      chartRef.current?.setOption(buildOptionRef.current(), true)

    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    const media =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null
    media?.addEventListener('change', apply)

    return () => {
      observer.disconnect()
      media?.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    if (loading) {
      chart.showLoading('default', {
        text: '',
        color: resolveVariant('primary'),
        maskColor: 'rgba(0, 0, 0, 0)',
        spinnerRadius: 8,
        lineWidth: 2,
      })
    } else {
      chart.hideLoading()
    }
  }, [loading])

  useEffect(() => {
    chartRef.current?.setOption(buildOption(), true)
  }, [buildOption])

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
