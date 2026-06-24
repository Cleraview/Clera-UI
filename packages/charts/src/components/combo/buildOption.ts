import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
} from '@/utils'
import type { ComboSeries, ComboAxisConfig, ComboLegendPosition } from './types'

export interface BuildComboOptionParams {
  categories: string[]
  series: ComboSeries[]
  showValues: boolean
  showTooltip: boolean
  showLegend: boolean
  legendPosition: ComboLegendPosition
  gridLines: boolean
  barRadius: number
  axisLabelRotate: number
  categoryAxisName?: string
  leftAxis?: ComboAxisConfig
  rightAxis?: ComboAxisConfig
  animate: boolean
  emptyMessage: string
}

const identity = (value: number) => String(value)

export function buildComboOption(params: BuildComboOptionParams) {
  const {
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
  } = params

  const labelColor = readCssColor('--text-color-ds-default', 'rgb(23, 23, 23)')
  const subtleColor = readCssColor('--text-color-ds-subtle', 'rgb(82, 82, 82)')
  const lineColor = readCssColor(
    '--border-color-ds-default',
    'rgb(229, 229, 229)'
  )
  const surface = readCssColor(
    '--background-color-ds-elevation-surface-raised',
    'rgb(255, 255, 255)'
  )

  if (!series.length || !categories.length) {
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

  const categorical = resolveCategoricalPalette()
  const hasRightAxis = series.some(s => s.axis === 'right')

  const colorFor = (s: ComboSeries, i: number): string =>
    s.color ??
    (s.variant
      ? resolveVariant(s.variant)
      : categorical[i % categorical.length])

  const formatLeft = leftAxis?.format ?? identity
  const formatRight = rightAxis?.format ?? identity
  const formatFor = (axis?: string) =>
    axis === 'right' ? formatRight : formatLeft

  const seriesList = series.map((s, i) => {
    const color = colorFor(s, i)
    const yAxisIndex = s.axis === 'right' ? 1 : 0
    const label = {
      show: showValues,
      position: 'top' as const,
      color: labelColor,
      fontSize: 11,
      textBorderWidth: 0,
      formatter: (p: { value: number }) => formatFor(s.axis)(p.value),
    }

    if (s.type === 'bar') {
      return {
        name: s.name,
        type: 'bar',
        yAxisIndex,
        stack: s.stack,
        data: s.data,
        barMaxWidth: 32,
        itemStyle: {
          color,
          borderRadius: [barRadius, barRadius, 0, 0],
        },
        emphasis: { focus: 'series', itemStyle: { color: lighten(color) } },
        blur: { itemStyle: { opacity: 1 } },
        label,
      }
    }

    const hover = lighten(color)
    return {
      name: s.name,
      type: 'line',
      yAxisIndex,
      data: s.data,
      smooth: s.smooth ?? false,
      symbol: 'circle',
      symbolSize: 6,
      showSymbol: false,
      lineStyle: { color, width: 2 },
      itemStyle: { color },
      emphasis: {
        focus: 'series',
        itemStyle: { color: hover },
        lineStyle: { color: hover, width: 2 },
        ...(s.type === 'area'
          ? { areaStyle: { color: hover, opacity: 0.25 } }
          : {}),
      },
      blur: {
        lineStyle: { opacity: 1 },
        itemStyle: { opacity: 1 },
        ...(s.type === 'area' ? { areaStyle: { opacity: 0.15 } } : {}),
      },
      ...(s.type === 'area' ? { areaStyle: { color, opacity: 0.15 } } : {}),
      label,
    }
  })

  const buildValueAxis = (
    cfg: ComboAxisConfig | undefined,
    showGrid: boolean
  ) => ({
    type: 'value' as const,
    name: cfg?.name,
    min: cfg?.min,
    max: cfg?.max,
    nameTextStyle: { color: subtleColor, fontSize: 11 },
    splitLine: {
      show: showGrid,
      lineStyle: { color: lineColor, type: 'dashed' as const },
    },
    axisLabel: {
      color: labelColor,
      fontSize: 12,
      formatter: (value: number) => (cfg?.format ?? identity)(value),
    },
    axisTick: { show: false },
    axisLine: { show: false },
  })

  const yAxis = hasRightAxis
    ? [buildValueAxis(leftAxis, gridLines), buildValueAxis(rightAxis, false)]
    : [buildValueAxis(leftAxis, gridLines)]

  const legendVertical = legendPosition === 'left' || legendPosition === 'right'

  return {
    animation: animate && !prefersReducedMotion(),
    animationDuration: 600,
    animationEasing: 'cubicOut' as const,
    legend: {
      show: showLegend,
      data: series.map(s => s.name),
      orient: (legendVertical ? 'vertical' : 'horizontal') as
        | 'vertical'
        | 'horizontal',
      top:
        legendPosition === 'bottom' ? undefined : legendVertical ? 'middle' : 0,
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
      left: legendVertical && legendPosition === 'left' ? 96 : 8,
      right: legendVertical && legendPosition === 'right' ? 96 : 8,
      top: Math.max(showLegend && legendPosition === 'top' ? 36 : 0, 12),
      bottom: Math.max(
        showLegend && legendPosition === 'bottom' ? 36 : 0,
        axisLabelRotate ? 24 : 0,
        8
      ),
      containLabel: true,
    },
    tooltip: {
      show: showTooltip,
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: lineColor } },
      backgroundColor: surface,
      borderColor: lineColor,
      borderWidth: 1,
      padding: [6, 10],
      textStyle: { color: labelColor, fontSize: 11 },
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter: (
        args: Array<{
          axisValueLabel?: string
          name?: string
          seriesName?: string
          value: number
          marker?: string
        }>
      ) => {
        const arr = Array.isArray(args) ? args : [args]
        const head = arr[0]?.axisValueLabel ?? arr[0]?.name ?? ''
        const rows = arr
          .map(p => {
            const s = series.find(item => item.name === p.seriesName)
            const fmt = formatFor(s?.axis)
            return `${p.marker ?? ''}${p.seriesName}: ${fmt(p.value)}`
          })
          .join('<br/>')
        return `${head}<br/>${rows}`
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
      name: categoryAxisName,
      nameTextStyle: { color: subtleColor, fontSize: 11 },
      axisLine: { show: true, lineStyle: { color: lineColor } },
      axisTick: { show: false },
      axisLabel: { color: labelColor, fontSize: 12, rotate: axisLabelRotate },
    },
    yAxis,
    series: seriesList,
  }
}
