import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
} from '@/utils'
import type {
  BarDatum,
  BarSeries,
  BarPalette,
  BarSort,
  BarLegendPosition,
  BarReferenceLine,
} from './types'

export interface BuildBarOptionParams {
  data: BarDatum[]
  categories?: string[]
  series?: BarSeries[]
  max?: number
  isHorizontal: boolean
  showValues: boolean
  formatValue: (value: number) => string
  showTooltip: boolean
  showValueAxis: boolean
  showLegend?: boolean
  legendPosition: BarLegendPosition
  stacked: boolean
  showTrack: boolean
  trackColor?: string
  gridLines?: boolean
  palette: BarPalette
  barRadius: number
  barWidth?: number
  sort: BarSort
  referenceLine?: BarReferenceLine
  animate: boolean
  emptyMessage: string
}

export function buildBarOption(params: BuildBarOptionParams) {
  const {
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

  const categorical = resolveCategoricalPalette()

  const borderRadius = isHorizontal
    ? [0, barRadius, barRadius, 0]
    : [barRadius, barRadius, 0, 0]
  const flatRadius = [0, 0, 0, 0]

  const trackFill =
    trackColor ??
    readCssColor('--background-color-ds-neutral', 'rgb(245, 245, 245)')

  const labelStyle = {
    show: showValues,
    position: (stacked ? 'inside' : isHorizontal ? 'right' : 'top') as
      | 'inside'
      | 'right'
      | 'top',
    formatter: (p: { value: number }) => formatValue(p.value),
    color: stacked
      ? readCssColor('--text-color-ds-inverse', 'rgb(250, 250, 250)')
      : labelColor,
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

  const stack = grouped && stacked ? 'total' : undefined

  let cats: string[]
  let seriesList: unknown[]

  if (grouped) {
    cats = categories as string[]
    const list = series as BarSeries[]
    const groupWidth = barWidth ?? (stacked ? (isHorizontal ? 12 : 40) : 28)
    seriesList = list.map((s, i) => {
      const color =
        s.color ??
        (s.variant
          ? resolveVariant(s.variant)
          : categorical[i % categorical.length])
      const isOuter = i === list.length - 1
      const radius = stacked
        ? isOuter
          ? borderRadius
          : flatRadius
        : borderRadius
      const withTrack = showTrack && i === 0
      return {
        name: s.name,
        type: 'bar',
        stack,
        silent: s.silent ?? false,
        data: isHorizontal ? [...s.data].reverse() : s.data,
        itemStyle: { color, borderRadius: radius },
        emphasis: { itemStyle: { color: lighten(color) } },
        barMaxWidth: groupWidth,
        label: s.silent ? { show: false } : labelStyle,
        markLine: i === 0 ? markLine : undefined,
        showBackground: withTrack,
        backgroundStyle: withTrack
          ? { color: trackFill, borderRadius: barRadius }
          : undefined,
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
    const negativeRadius = isHorizontal
      ? [barRadius, 0, 0, barRadius]
      : [0, 0, barRadius, barRadius]
    const seriesData = ordered.map((datum, index) => {
      const color =
        datum.color ??
        (datum.variant
          ? resolveVariant(datum.variant)
          : palette === 'categorical'
            ? categorical[index % categorical.length]
            : resolveVariant('primary'))
      return {
        value: datum.value,
        itemStyle: {
          color,
          borderRadius: datum.value < 0 ? negativeRadius : borderRadius,
        },
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
        showBackground: showTrack,
        backgroundStyle: showTrack
          ? { color: trackFill, borderRadius: barRadius }
          : undefined,
      },
    ]
  }

  const legendShown = grouped && (showLegend ?? true)
  const showGrid = gridLines ?? showValueAxis
  const legendVertical = legendPosition === 'left' || legendPosition === 'right'

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
      data: grouped
        ? (series as BarSeries[]).filter(s => !s.silent).map(s => s.name)
        : undefined,
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
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter: (
        p:
          | { name: string; value: number; seriesName?: string }
          | { name: string; value: number; seriesName?: string }[]
      ) => {
        const item = Array.isArray(p) ? p[0] : p
        const head = item.seriesName
          ? `${item.name} · ${item.seriesName}`
          : item.name
        return `${head}: ${formatValue(item.value)}`
      },
    },
    xAxis: isHorizontal ? valueAxis : categoryAxis,
    yAxis: isHorizontal ? categoryAxis : valueAxis,
    series: seriesList,
  }
}
