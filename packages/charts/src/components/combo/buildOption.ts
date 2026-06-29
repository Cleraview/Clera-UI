import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
} from '@/utils'
import type { AxisLabelOverride } from '@/utils'
import type {
  ComboSeries,
  ComboAxisConfig,
  ComboValueAxis,
  ComboLegendPosition,
} from './types'

export interface BuildComboOptionParams {
  categories: string[]
  series: ComboSeries[]
  showValues: boolean
  showTooltip: boolean
  showLegend: boolean
  legendPosition: ComboLegendPosition
  gridLines: boolean
  highlightSeries: boolean
  barRadius: number
  axisLabelRotate: number
  categoryAxisName?: string
  xAxisLabel?: AxisLabelOverride
  leftAxis?: ComboAxisConfig
  rightAxis?: ComboAxisConfig
  valueAxes?: ComboValueAxis[]
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
    highlightSeries,
    barRadius,
    axisLabelRotate,
    categoryAxisName,
    xAxisLabel,
    leftAxis,
    rightAxis,
    valueAxes,
    animate,
    emptyMessage,
  } = params

  const multiAxis = (valueAxes?.length ?? 0) > 0

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

  const seriesColors = series.map((s, i) => colorFor(s, i))

  const formatLeft = leftAxis?.format ?? identity
  const formatRight = rightAxis?.format ?? identity

  const yAxisIndexFor = (s: ComboSeries) =>
    multiAxis
      ? typeof s.axis === 'number'
        ? s.axis
        : 0
      : s.axis === 'right'
        ? 1
        : 0

  const formatForSeries = (s?: ComboSeries) => {
    if (!s) return identity
    if (multiAxis)
      return (
        (valueAxes as ComboValueAxis[])[yAxisIndexFor(s)]?.format ?? identity
      )
    return s.axis === 'right' ? formatRight : formatLeft
  }

  const blurOpacity = highlightSeries ? 0.2 : 1
  const areaBlurOpacity = highlightSeries ? 0.06 : 0.15

  const seriesList = series.map((s, i) => {
    const color = seriesColors[i]
    const yAxisIndex = yAxisIndexFor(s)
    const label = {
      show: showValues,
      position: 'top' as const,
      color: labelColor,
      fontSize: 11,
      textBorderWidth: 0,
      formatter: (p: { value: number }) => formatForSeries(s)(p.value),
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
        blur: { itemStyle: { opacity: blurOpacity } },
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
      showSymbol: true,
      lineStyle: { color, width: 2 },
      itemStyle: { color, borderColor: surface, borderWidth: 1.5 },
      emphasis: {
        focus: 'series',
        itemStyle: { color: hover },
        lineStyle: { color: hover, width: 2 },
        ...(s.type === 'area'
          ? { areaStyle: { color: hover, opacity: 0.25 } }
          : {}),
      },
      blur: {
        lineStyle: { opacity: blurOpacity },
        itemStyle: { opacity: blurOpacity },
        ...(s.type === 'area'
          ? { areaStyle: { opacity: areaBlurOpacity } }
          : {}),
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
    axisPointer: {
      label: {
        formatter: (p: { value: number }) =>
          (cfg?.format ?? identity)(Math.round(p.value)),
        backgroundColor: surface,
        color: labelColor,
        borderColor: lineColor,
        borderWidth: 1,
        shadowBlur: 0,
      },
    },
  })

  const colorForAxisIndex = (idx: number) => {
    const si = series.findIndex(s => yAxisIndexFor(s) === idx)
    return si >= 0 ? seriesColors[si] : undefined
  }

  const buildMultiAxis = (cfg: ComboValueAxis, idx: number) => {
    const accent = cfg.color ?? colorForAxisIndex(idx) ?? subtleColor
    return {
      type: 'value' as const,
      name: cfg.name,
      min: cfg.min,
      max: cfg.max,
      position: cfg.position ?? 'left',
      offset: cfg.offset ?? 0,
      alignTicks: true,
      nameTextStyle: { color: accent, fontSize: 11 },
      splitLine: {
        show: idx === 0 && gridLines,
        lineStyle: { color: lineColor, type: 'dashed' as const },
      },
      axisLine: { show: true, lineStyle: { color: accent } },
      axisTick: { show: false },
      axisLabel: {
        color: accent,
        fontSize: 12,
        formatter: (value: number) => (cfg.format ?? identity)(value),
      },
      axisPointer: {
        label: {
          formatter: (p: { value: number }) =>
            (cfg.format ?? identity)(Math.round(p.value)),
          backgroundColor: surface,
          color: labelColor,
          borderColor: lineColor,
          borderWidth: 1,
          shadowBlur: 0,
        },
      },
    }
  }

  const yAxis = multiAxis
    ? (valueAxes as ComboValueAxis[]).map(buildMultiAxis)
    : hasRightAxis
      ? [buildValueAxis(leftAxis, gridLines), buildValueAxis(rightAxis, false)]
      : [buildValueAxis(leftAxis, gridLines)]

  const axisExtent = (side: 'left' | 'right') => {
    if (!multiAxis) return 0
    const on = (valueAxes as ComboValueAxis[]).filter(
      a => (a.position ?? 'left') === side
    )
    if (!on.length) return 0
    return Math.max(...on.map(a => a.offset ?? 0)) + 56
  }

  const hasTopAxisName = multiAxis
    ? (valueAxes as ComboValueAxis[]).some(a => a.name)
    : Boolean(leftAxis?.name || rightAxis?.name)

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
      left: Math.max(
        legendVertical && legendPosition === 'left' ? 96 : 8,
        axisExtent('left')
      ),
      right: Math.max(
        legendVertical && legendPosition === 'right' ? 96 : 8,
        axisExtent('right')
      ),
      top: Math.max(
        (showLegend && legendPosition === 'top' ? 36 : 0) +
          (hasTopAxisName ? 24 : 0),
        hasTopAxisName ? 28 : 0,
        12
      ),
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
      axisPointer: {
        type: 'cross',
        triggerEmphasis: false,
        crossStyle: { color: subtleColor, type: 'dashed' },
        lineStyle: { color: subtleColor, type: 'dashed' },
        label: {
          backgroundColor: surface,
          color: labelColor,
          borderColor: lineColor,
          borderWidth: 1,
          shadowBlur: 0,
        },
      },
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
            const fmt = formatForSeries(s)
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
      axisLabel: {
        color: labelColor,
        fontSize: 12,
        rotate: axisLabelRotate,
        // Escape hatch: a custom formatter (rich text + icons) / styling wins.
        ...xAxisLabel,
      },
      axisPointer: { type: 'shadow' },
    },
    yAxis,
    series: seriesList,
  }
}
