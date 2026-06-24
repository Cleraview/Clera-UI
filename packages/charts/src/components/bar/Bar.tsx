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
import { styles } from './styles'

echarts.use([
  EBarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
])

export type BarVariant =
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'destructive'

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
}

export type BarSeries = {
  name: string
  data: number[]
  variant?: BarVariant
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
  style?: React.CSSProperties
}

const VARIANT_VAR: Record<BarVariant, string> = {
  primary: '--chart-ds-violet-bold',
  success: '--chart-ds-success-bold',
  info: '--chart-ds-info-bold',
  warning: '--chart-ds-warning-bold',
  destructive: '--chart-ds-destructive-bold',
}

const VARIANT_FALLBACK: Record<BarVariant, string> = {
  primary: 'rgb(124, 58, 237)',
  success: 'rgb(21, 128, 61)',
  info: 'rgb(29, 78, 216)',
  warning: 'rgb(253, 186, 116)',
  destructive: 'rgb(185, 28, 28)',
}

const CATEGORICAL_VAR = [
  '--chart-ds-categorical-1',
  '--chart-ds-categorical-2',
  '--chart-ds-categorical-3',
  '--chart-ds-categorical-4',
  '--chart-ds-categorical-5',
  '--chart-ds-categorical-6',
  '--chart-ds-categorical-7',
  '--chart-ds-categorical-8',
]

const CATEGORICAL_FALLBACK = [
  'rgb(37, 99, 235)',
  'rgb(132, 204, 22)',
  'rgb(139, 92, 246)',
  'rgb(249, 115, 22)',
  'rgb(30, 64, 175)',
  'rgb(109, 40, 217)',
  'rgb(20, 184, 166)',
  'rgb(194, 65, 12)',
]

function readCssColor(varName: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const probe = document.createElement('span')
  probe.style.color = `var(${varName})`
  probe.style.position = 'absolute'
  probe.style.opacity = '0'
  probe.style.pointerEvents = 'none'
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color || fallback
}

function lighten(color: string, amount = 0.25): string {
  const m = color.match(/(\d+\.?\d*)/g)
  if (color.startsWith('rgb') && m && m.length >= 3) {
    const [r, g, b] = m.map(Number)
    const mix = (c: number) => Math.round(c + (255 - c) * amount)
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
  }
  return `color-mix(in srgb, ${color} ${(1 - amount) * 100}%, white)`
}

function resolveVariant(variant: BarVariant = 'primary'): string {
  return readCssColor(VARIANT_VAR[variant], VARIANT_FALLBACK[variant])
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

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

  const buildOption = useCallback(() => {
    const labelColor = readCssColor(
      '--text-color-ds-default',
      'rgb(23, 23, 23)'
    )
    const subtleColor = readCssColor(
      '--text-color-ds-subtle',
      'rgb(82, 82, 82)'
    )
    const lineColor = readCssColor(
      '--border-color-ds-default',
      'rgb(229, 229, 229)'
    )
    const surface = readCssColor(
      '--background-color-ds-elevation-surface-raised',
      'rgb(255, 255, 255)'
    )

    const grouped = Boolean(series?.length && categories?.length)

    if (!grouped && !data.length) {
      return {
        title: {
          text: emptyMessage,
          left: 'center',
          top: 'middle',
          textStyle: {
            color: subtleColor,
            fontSize: 13,
            fontWeight: 'normal' as const,
          },
        },
      }
    }

    const categorical = CATEGORICAL_VAR.map((v, i) =>
      readCssColor(v, CATEGORICAL_FALLBACK[i])
    )

    const borderRadius = isHorizontal
      ? [0, barRadius, barRadius, 0]
      : [barRadius, barRadius, 0, 0]

    const labelStyle = {
      show: showValues,
      position: (isHorizontal ? 'right' : 'top') as 'right' | 'top',
      formatter: (params: { value: number }) => formatValue(params.value),
      color: labelColor,
      textBorderWidth: 0,
      fontSize: 12,
    }

    const markLine = referenceLine
      ? {
          silent: true,
          symbol: 'none' as const,
          lineStyle: { color: subtleColor, type: 'dashed' as const, width: 1 },
          label: {
            show: true,
            position: 'end' as const,
            distance: 8,
            rotate: 0,
            color: subtleColor,
            fontSize: 11,
            backgroundColor: surface,
            borderColor: lineColor,
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 6] as [number, number],
            formatter: () =>
              referenceLine.label ?? formatValue(referenceLine.value),
          },
          data: [
            isHorizontal
              ? { xAxis: referenceLine.value }
              : { yAxis: referenceLine.value },
          ],
        }
      : undefined

    let cats: string[]
    let seriesList: unknown[]

    if (grouped) {
      cats = categories as string[]
      seriesList = (series as BarSeries[]).map((s, i) => {
        const color = s.variant
          ? resolveVariant(s.variant)
          : categorical[i % categorical.length]
        return {
          name: s.name,
          type: 'bar',
          data: isHorizontal ? [...s.data].reverse() : s.data,
          itemStyle: { color, borderRadius },
          emphasis: { itemStyle: { color: lighten(color) } },
          barMaxWidth: barWidth ?? 28,
          label: labelStyle,
          markLine: i === 0 ? markLine : undefined,
        }
      })
    } else {
      const ordered =
        sort === 'none'
          ? data
          : [...data].sort((a, b) =>
              sort === 'asc' ? a.value - b.value : b.value - a.value
            )
      cats = ordered.map(d => d.label)
      const seriesData = ordered.map((datum, index) => {
        const color = datum.variant
          ? resolveVariant(datum.variant)
          : palette === 'categorical'
            ? categorical[index % categorical.length]
            : resolveVariant('primary')
        return {
          value: datum.value,
          itemStyle: { color, borderRadius },
          emphasis: { itemStyle: { color: lighten(color) } },
        }
      })
      seriesList = [
        {
          type: 'bar',
          data: isHorizontal ? [...seriesData].reverse() : seriesData,
          barMaxWidth: barWidth ?? (isHorizontal ? 12 : 40),
          label: labelStyle,
          markLine,
        },
      ]
    }

    const legendShown = grouped && (showLegend ?? true)
    const showGrid = gridLines ?? showValueAxis
    const legendVertical =
      legendPosition === 'left' || legendPosition === 'right'

    const valueAxis = {
      type: 'value' as const,
      max,
      splitLine: {
        show: showGrid,
        lineStyle: { color: lineColor, type: 'dashed' as const },
      },
      axisLabel: showValueAxis
        ? {
            color: labelColor,
            fontSize: 12,
            formatter: (value: number) => formatValue(value),
          }
        : { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    }

    const categoryAxis = {
      type: 'category' as const,
      data: isHorizontal ? [...cats].reverse() : cats,
      axisLine: { show: showValueAxis, lineStyle: { color: lineColor } },
      axisTick: { show: false },
      axisLabel: {
        color: labelColor,
        fontSize: 12,
        ...(isHorizontal ? { width: 80, overflow: 'truncate' as const } : {}),
      },
    }

    return {
      animation: animate && !prefersReducedMotion(),
      animationDuration: 600,
      animationEasing: 'cubicOut' as const,
      legend: {
        show: legendShown,
        data: grouped ? (series as BarSeries[]).map(s => s.name) : undefined,
        orient: (legendVertical ? 'vertical' : 'horizontal') as
          | 'vertical'
          | 'horizontal',
        top:
          legendPosition === 'bottom'
            ? undefined
            : legendVertical
              ? 'middle'
              : 0,
        bottom: legendPosition === 'bottom' ? 0 : undefined,
        left:
          legendPosition === 'left'
            ? 0
            : legendPosition === 'right'
              ? undefined
              : 'center',
        right: legendPosition === 'right' ? 0 : undefined,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        textStyle: { color: labelColor, fontSize: 12 },
      },
      grid: {
        left: legendShown && legendPosition === 'left' ? 96 : 8,
        right: Math.max(
          legendShown && legendPosition === 'right' ? 96 : 0,
          referenceLine && !isHorizontal ? 72 : 0,
          isHorizontal && showValues ? 56 : 0,
          8
        ),
        top: Math.max(
          legendShown && legendPosition === 'top' ? 36 : 0,
          referenceLine && isHorizontal ? 30 : 0,
          showValues && !isHorizontal ? 28 : 12
        ),
        bottom: legendShown && legendPosition === 'bottom' ? 36 : 8,
        containLabel: true,
      },
      tooltip: {
        show: showTooltip,
        trigger: 'item',
        backgroundColor: surface,
        borderColor: lineColor,
        borderWidth: 1,
        padding: [4, 8],
        textStyle: { color: labelColor, fontSize: 11 },
        extraCssText:
          'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
        formatter: (
          params:
            | { name: string; value: number; seriesName?: string }
            | { name: string; value: number; seriesName?: string }[]
        ) => {
          const p = Array.isArray(params) ? params[0] : params
          const head = p.seriesName ? `${p.name} · ${p.seriesName}` : p.name
          return `${head}: ${formatValue(p.value)}`
        },
      },
      xAxis: isHorizontal ? valueAxis : categoryAxis,
      yAxis: isHorizontal ? categoryAxis : valueAxis,
      series: seriesList,
    }
  }, [
    data,
    categories,
    series,
    max,
    showValues,
    formatValue,
    isHorizontal,
    showTooltip,
    showValueAxis,
    showLegend,
    legendPosition,
    gridLines,
    palette,
    barRadius,
    barWidth,
    sort,
    referenceLine,
    animate,
    emptyMessage,
  ])

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
