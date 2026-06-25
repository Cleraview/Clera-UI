import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
} from '@/utils'
import type {
  PolarBarDatum,
  PolarBarSeries,
  PolarBarOrientation,
  PolarBarPalette,
  PolarBarLegendPosition,
} from './types'

export interface BuildPolarBarOptionParams {
  data: PolarBarDatum[]
  categories?: string[]
  series?: PolarBarSeries[]
  orientation: PolarBarOrientation
  stacked: boolean
  highlightSeries: boolean
  max?: number
  min?: number
  showValues: boolean
  showTooltip: boolean
  showLegend?: boolean
  legendPosition: PolarBarLegendPosition
  palette: PolarBarPalette
  barRadius: number
  roundCap: boolean
  startAngle: number
  endAngle?: number
  formatValue: (value: number) => string
  labelFormatter?: (datum: { name: string; value: number }) => string
  animate: boolean
  emptyMessage: string
}

export function buildPolarBarOption(params: BuildPolarBarOptionParams) {
  const {
    data,
    categories,
    series,
    orientation,
    stacked,
    highlightSeries,
    max,
    min,
    showValues,
    showTooltip,
    showLegend,
    legendPosition,
    palette,
    barRadius,
    roundCap,
    startAngle,
    endAngle,
    formatValue,
    labelFormatter,
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

  const grouped = Boolean(series?.length && categories?.length)

  if (grouped ? !categories?.length : !data.length) {
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

  const isAngular = orientation === 'angular'
  const categorical = resolveCategoricalPalette()
  const cats = grouped ? (categories as string[]) : data.map(d => d.label)

  const label = {
    show: showValues || Boolean(labelFormatter),
    position: 'middle' as const,
    color: readCssColor('--text-color-ds-inverse', 'rgb(250, 250, 250)'),
    fontSize: 11,
    textBorderWidth: 0,
    formatter: (p: { name: string; value: number }) =>
      labelFormatter
        ? labelFormatter({ name: p.name, value: p.value })
        : formatValue(p.value),
  }

  let seriesList: unknown[]
  if (grouped) {
    const list = series as PolarBarSeries[]
    seriesList = list.map((s, i) => {
      const color =
        s.color ??
        (s.variant
          ? resolveVariant(s.variant)
          : categorical[i % categorical.length])
      return {
        name: s.name,
        type: 'bar',
        coordinateSystem: 'polar',
        stack: stacked ? 'total' : undefined,
        roundCap,
        data: s.data,
        itemStyle: { color, borderRadius: barRadius },
        emphasis: highlightSeries
          ? { focus: 'series', itemStyle: { color: lighten(color) } }
          : { itemStyle: { color: lighten(color) } },
        blur: highlightSeries ? { itemStyle: { opacity: 0.2 } } : undefined,
        label,
      }
    })
  } else {
    seriesList = [
      {
        type: 'bar',
        coordinateSystem: 'polar',
        roundCap,
        data: data.map((d, i) => {
          const color =
            d.color ??
            (d.variant
              ? resolveVariant(d.variant)
              : palette === 'categorical'
                ? categorical[i % categorical.length]
                : resolveVariant('primary'))
          return {
            value: d.value,
            itemStyle: { color, borderRadius: barRadius },
            emphasis: { itemStyle: { color: lighten(color) } },
          }
        }),
        label,
      },
    ]
  }

  const categoryAxis = {
    type: 'category' as const,
    data: cats,
    z: isAngular ? 0 : 60,
    axisLine: { lineStyle: { color: lineColor } },
    axisTick: { show: false },
    axisLabel: {
      color: labelColor,
      fontSize: 12,
      ...(isAngular
        ? {}
        : {
            backgroundColor: surface,
            borderColor: lineColor,
            borderWidth: 1,
            borderRadius: 4,
            padding: [2, 6] as [number, number],
          }),
    },
  }

  const valueAxis = {
    type: 'value' as const,
    max,
    min,
    axisLabel: {
      color: subtleColor,
      fontSize: 11,
      formatter: (value: number) => formatValue(value),
      ...(isAngular
        ? {
            backgroundColor: surface,
            borderColor: lineColor,
            borderWidth: 1,
            borderRadius: 4,
            padding: [1, 5] as [number, number],
          }
        : {}),
    },
    splitLine: {
      show: true,
      lineStyle: { color: lineColor, type: 'dashed' as const },
    },
    axisLine: { show: false },
  }

  const legendShown = grouped && (showLegend ?? true)
  const legendVertical = legendPosition === 'left' || legendPosition === 'right'

  return {
    animation: animate && !prefersReducedMotion(),
    animationDuration: 600,
    animationEasing: 'cubicOut' as const,
    polar: { radius: ['20%', '75%'] },
    angleAxis: isAngular
      ? { ...categoryAxis, startAngle, endAngle }
      : { ...valueAxis, startAngle, endAngle },
    radiusAxis: isAngular ? valueAxis : categoryAxis,
    legend: {
      show: legendShown,
      data: grouped ? (series as PolarBarSeries[]).map(s => s.name) : undefined,
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
    tooltip: {
      show: showTooltip,
      trigger: 'item',
      backgroundColor: surface,
      borderColor: lineColor,
      borderWidth: 1,
      padding: [4, 8],
      textStyle: { color: labelColor, fontSize: 11 },
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter: (
        p:
          | { name: string; value: number; seriesName?: string }
          | { name: string; value: number; seriesName?: string }[]
      ) => {
        const item = Array.isArray(p) ? p[0] : p
        const head =
          grouped && item.seriesName
            ? `${item.name} · ${item.seriesName}`
            : item.name
        return `${head}: ${formatValue(item.value)}`
      },
    },
    series: seriesList,
  }
}
