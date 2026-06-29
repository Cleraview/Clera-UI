import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
} from '@/utils'
import type { AxisLabelOverride, ValueAxisPosition } from '@/utils'
import type {
  BarDatum,
  BarSeries,
  BarPalette,
  BarSort,
  BarStackMode,
  BarZoom,
  BarMarkPoint,
  BarAxisBreak,
  BarLegendPosition,
  BarReferenceLine,
} from './types'

export interface BuildBarOptionParams {
  data: BarDatum[]
  categories?: string[]
  series?: BarSeries[]
  max?: number
  min?: number
  isHorizontal: boolean
  showValues: boolean
  formatValue: (value: number) => string
  showTooltip: boolean
  tooltipTrigger: 'item' | 'axis'
  axisPointerLabel: boolean
  showValueAxis: boolean
  showLegend?: boolean
  legendPosition: BarLegendPosition
  stacked: boolean
  stackMode: BarStackMode
  highlightSeries: boolean
  showTrack: boolean
  trackColor?: string
  gridLines?: boolean
  palette: BarPalette
  barRadius: number
  barWidth?: number
  sort: BarSort
  referenceLine?: BarReferenceLine | 'average'
  markPoints: BarMarkPoint[]
  axisBreaks: BarAxisBreak[]
  axisBreakExpandable: boolean
  zoom: BarZoom
  zoomSlider: boolean
  selectable: boolean
  axisLabelRotate: number
  valueAxisName?: string
  categoryAxisName?: string
  valueAxisPosition: ValueAxisPosition
  xAxisLabel?: AxisLabelOverride
  animate: boolean
  emptyMessage: string
}

/** Sorts a copy of the data by value when requested. */
export function orderBarData(data: BarDatum[], sort: BarSort): BarDatum[] {
  if (sort === 'none') return data
  return [...data].sort((a, b) =>
    sort === 'asc' ? a.value - b.value : b.value - a.value
  )
}

/** The category labels in the exact order ECharts renders them. */
export function getBarCategories(p: {
  data: BarDatum[]
  categories?: string[]
  series?: BarSeries[]
  sort: BarSort
  isHorizontal: boolean
}): string[] {
  const grouped = Boolean(p.series?.length && p.categories?.length)
  const cats = grouped
    ? (p.categories as string[])
    : orderBarData(p.data, p.sort).map(d => d.label)
  return p.isHorizontal ? [...cats].reverse() : cats
}

export function buildBarOption(params: BuildBarOptionParams) {
  const {
    data,
    categories,
    series,
    max,
    min,
    isHorizontal,
    showValues,
    formatValue,
    showTooltip,
    tooltipTrigger,
    axisPointerLabel,
    showValueAxis,
    showLegend,
    legendPosition,
    stacked,
    stackMode,
    highlightSeries,
    showTrack,
    trackColor,
    gridLines,
    palette,
    barRadius,
    barWidth,
    sort,
    referenceLine,
    markPoints,
    axisBreaks,
    axisBreakExpandable,
    zoom,
    zoomSlider,
    selectable,
    axisLabelRotate,
    valueAxisName,
    categoryAxisName,
    valueAxisPosition,
    xAxisLabel,
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

  const percent = stackMode === 'percent'
  const stacking = stacked || percent
  const categorical = resolveCategoricalPalette()

  const borderRadius = isHorizontal
    ? [0, barRadius, barRadius, 0]
    : [barRadius, barRadius, 0, 0]
  const flatRadius = [0, 0, 0, 0]

  const trackFill =
    trackColor ??
    readCssColor('--background-color-ds-neutral', 'rgb(245, 245, 245)')

  const inverseColor = readCssColor(
    '--text-color-ds-inverse',
    'rgb(250, 250, 250)'
  )

  const labelBase = {
    show: showValues,
    formatter: (p: { value: number }) => formatValue(p.value),
    textBorderWidth: 0,
    fontSize: 12,
  }
  const labelOutside = {
    ...labelBase,
    position: (isHorizontal ? 'right' : 'top') as 'right' | 'top',
    color: labelColor,
  }
  const labelInside = {
    ...labelBase,
    position: 'inside' as const,
    color: inverseColor,
  }

  const isAverage = referenceLine === 'average'
  const fixedRef =
    referenceLine && referenceLine !== 'average' ? referenceLine : undefined

  const fixedMarkLine = fixedRef
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
          formatter: () => fixedRef.label ?? formatValue(fixedRef.value),
        },
        data: [
          isHorizontal ? { xAxis: fixedRef.value } : { yAxis: fixedRef.value },
        ],
      }
    : undefined

  const makeAverageMarkLine = (color: string) => ({
    silent: true,
    symbol: 'none' as const,
    lineStyle: { color, type: 'dashed' as const, width: 1.5 },
    label: {
      position: 'end' as const,
      color,
      fontSize: 11,
      formatter: (p: { value: number }) => formatValue(Math.round(p.value)),
    },
    data: [{ type: 'average' as const, name: 'Avg' }],
  })

  const singleAverageColor =
    palette === 'categorical' ? subtleColor : resolveVariant('primary')

  const markPointData = markPoints.map(type => ({ type }))
  const makeMarkPoint = (color: string) =>
    markPoints.length
      ? {
          symbol: 'pin' as const,
          symbolSize: 42,
          data: markPointData,
          itemStyle: { color },
          emphasis: { disabled: true },
          label: {
            color: inverseColor,
            fontSize: 11,
            formatter: (p: { value: number }) => formatValue(p.value),
          },
        }
      : undefined

  let cats: string[]
  let seriesList: unknown[]

  if (grouped) {
    cats = categories as string[]
    const list = series as BarSeries[]
    const defaultStack = stacking ? 'total' : undefined
    const stackOf = (s: BarSeries) => s.stack ?? defaultStack
    const anyStacked = list.some(s => Boolean(stackOf(s)))
    const groupWidth = barWidth ?? (anyStacked ? (isHorizontal ? 12 : 40) : 28)
    const lastInStack = new Map<string, number>()
    list.forEach((s, i) => {
      const sk = stackOf(s)
      if (sk) lastInStack.set(sk, i)
    })
    const totals = percent
      ? cats.map((_, ci) => list.reduce((sum, s) => sum + (s.data[ci] ?? 0), 0))
      : []
    seriesList = list.map((s, i) => {
      const color =
        s.color ??
        (s.variant
          ? resolveVariant(s.variant)
          : categorical[i % categorical.length])
      const seriesStack = stackOf(s)
      const isInnerStacked = Boolean(
        seriesStack && lastInStack.get(seriesStack) !== i
      )
      const radius = isInnerStacked ? flatRadius : borderRadius
      const withTrack = showTrack && i === 0
      const values = percent
        ? s.data.map((v, ci) => (totals[ci] > 0 ? (v / totals[ci]) * 100 : 0))
        : s.data
      return {
        name: s.name,
        type: 'bar',
        stack: seriesStack,
        silent: s.silent ?? false,
        data: isHorizontal ? [...values].reverse() : values,
        itemStyle: { color, borderRadius: radius },
        emphasis: highlightSeries
          ? { focus: 'series', itemStyle: { color: lighten(color) } }
          : { itemStyle: { color: lighten(color) } },
        blur: highlightSeries ? { itemStyle: { opacity: 0.2 } } : undefined,
        barMaxWidth: groupWidth,
        label: s.silent
          ? { show: false }
          : seriesStack
            ? labelInside
            : labelOutside,
        markLine: s.silent
          ? undefined
          : isAverage
            ? makeAverageMarkLine(color)
            : i === 0
              ? fixedMarkLine
              : undefined,
        markPoint: s.silent ? undefined : makeMarkPoint(color),
        showBackground: withTrack,
        backgroundStyle: withTrack
          ? { color: trackFill, borderRadius: barRadius }
          : undefined,
      }
    })
  } else {
    const ordered = orderBarData(data, sort)
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
        label: labelOutside,
        markLine: isAverage
          ? makeAverageMarkLine(singleAverageColor)
          : fixedMarkLine,
        markPoint: makeMarkPoint(resolveVariant('primary')),
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
    max: percent ? 100 : max,
    min: percent ? 0 : min,
    name: valueAxisName,
    // Side only applies when the value axis is vertical (column charts).
    position: isHorizontal ? undefined : valueAxisPosition,
    nameTextStyle: {
      color: subtleColor,
      fontSize: 11,
      align: 'right' as const,
      padding: [0, 8, 0, 0] as [number, number, number, number],
    },
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
    breaks: axisBreaks.length ? axisBreaks : undefined,
    breakArea: axisBreaks.length
      ? {
          show: true,
          expandOnClick: axisBreakExpandable,
          zigzagZ: 200,
          itemStyle: {
            color: surface,
            borderColor: subtleColor,
            borderType: 'dashed' as const,
            borderWidth: 1,
            opacity: 1,
          },
        }
      : undefined,
  }

  const categoryAxis = {
    type: 'category' as const,
    data: isHorizontal ? [...cats].reverse() : cats,
    name: categoryAxisName,
    nameTextStyle: { color: subtleColor, fontSize: 11 },
    axisLine: { show: showValueAxis, lineStyle: { color: lineColor } },
    axisTick: { show: false },
    axisLabel: {
      color: labelColor,
      fontSize: 12,
      rotate: axisLabelRotate,
      hideOverlap: true,
    },
  }

  const categoryZoomDim = isHorizontal ? 'yAxisIndex' : 'xAxisIndex'
  const valueZoomDim = isHorizontal ? 'xAxisIndex' : 'yAxisIndex'
  const zoomCategory = zoom === true || zoom === 'category' || zoom === 'both'
  const zoomValue = zoom === 'value' || zoom === 'both'
  const zoomDims = [
    ...(zoomCategory ? [categoryZoomDim] : []),
    ...(zoomValue ? [valueZoomDim] : []),
  ]
  const showVSlider = zoomSlider && zoomDims.includes('yAxisIndex')
  const showHSlider = zoomSlider && zoomDims.includes('xAxisIndex')

  const filterModeFor = (dim: string) =>
    dim === valueZoomDim ? ('none' as const) : ('filter' as const)

  const catCount = Math.max(cats.length, 1)
  const categoryMinSpan = Math.max(0.5, (1 / catCount) * 100 * 0.8)
  const minSpanFor = (dim: string) =>
    dim === valueZoomDim ? 2 : categoryMinSpan

  const makeSlider = (dim: string) =>
    dim === 'xAxisIndex'
      ? {
          type: 'slider' as const,
          [dim]: 0,
          filterMode: filterModeFor(dim),
          minSpan: minSpanFor(dim),
          brushSelect: false,
          bottom: 8,
          height: 16,
          left: 8,
          right: showVSlider ? 30 : 8,
        }
      : {
          type: 'slider' as const,
          [dim]: 0,
          filterMode: filterModeFor(dim),
          minSpan: minSpanFor(dim),
          width: 14,
          right: 8,
          top: legendShown && legendPosition === 'top' ? 40 : 16,
          bottom: showHSlider ? 34 : 16,
        }

  const insideDims = [
    ...(zoomCategory ? [categoryZoomDim] : []),
    ...(zoomValue && (!zoomCategory || !zoomSlider) ? [valueZoomDim] : []),
  ]

  const dataZoom = zoomDims.length
    ? [
        ...insideDims.map(dim => ({
          type: 'inside' as const,
          [dim]: 0,
          filterMode: filterModeFor(dim),
          minSpan: minSpanFor(dim),
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        })),
        ...(zoomSlider ? zoomDims.map(makeSlider) : []),
      ]
    : undefined

  const brushDim = isHorizontal ? 'yAxisIndex' : 'xAxisIndex'
  const brushType = isHorizontal ? 'lineY' : 'lineX'
  const brushConfig = selectable
    ? {
        toolbox: {
          show: true,
          top: 0,
          right: 8,
          itemSize: 13,
          feature: { brush: { type: [brushType, 'clear'] } },
          iconStyle: { borderColor: subtleColor },
        },
        brush: {
          [brushDim]: 0,
          brushType,
          brushMode: 'single',
          throttleType: 'debounce',
          throttleDelay: 80,
          brushStyle: {
            borderWidth: 1,
            borderColor: lineColor,
            color: 'rgba(124, 58, 237, 0.12)',
          },
        },
      }
    : null

  const topLegendY = axisBreaks.length && axisBreakExpandable ? 12 : 0

  const valueNameWidth =
    !isHorizontal && valueAxisName
      ? Math.min(168, Math.ceil(valueAxisName.length * 6.5) + 14)
      : 0

  // The x-axis label escape hatch (rich labels / icons) merges over whichever
  // axis is horizontal — the category axis for column charts.
  const xAxisBase = isHorizontal ? valueAxis : categoryAxis
  const yAxisBase = isHorizontal ? categoryAxis : valueAxis
  const xAxisFinal = xAxisLabel
    ? { ...xAxisBase, axisLabel: { ...xAxisBase.axisLabel, ...xAxisLabel } }
    : xAxisBase

  return {
    animation: animate && !prefersReducedMotion(),
    animationDuration: 600,
    animationEasing: 'cubicOut' as const,
    ...(brushConfig ?? {}),
    ...(dataZoom ? { dataZoom } : {}),
    legend: {
      show: legendShown,
      data: grouped
        ? (series as BarSeries[]).filter(s => !s.silent).map(s => s.name)
        : undefined,
      orient: (legendVertical ? 'vertical' : 'horizontal') as
        | 'vertical'
        | 'horizontal',
      top:
        legendPosition === 'bottom'
          ? undefined
          : legendVertical
            ? 'middle'
            : topLegendY,
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
        legendShown && legendPosition === 'left' ? 96 : 8,
        valueNameWidth
      ),
      right: Math.max(
        legendShown && legendPosition === 'right' ? 96 : 0,
        referenceLine && !isHorizontal ? 72 : 0,
        isHorizontal && showValues ? 56 : 0,
        showVSlider ? 40 : 0,
        8
      ),
      top: Math.max(
        legendShown && legendPosition === 'top' ? 36 : 0,
        referenceLine && isHorizontal ? 30 : 0,
        selectable ? 26 : 0,
        markPoints.length && !isHorizontal ? 32 : 0,
        axisBreaks.length && axisBreakExpandable ? 44 : 0,
        !isHorizontal && valueAxisName ? 24 : 0,
        showValues && !isHorizontal ? 28 : 12
      ),
      bottom: Math.max(
        legendShown && legendPosition === 'bottom' ? 36 : 0,
        (showHSlider ? 26 : 0) + (axisLabelRotate ? 34 : showHSlider ? 16 : 8),
        8
      ),
      containLabel: true,
    },
    tooltip: {
      show: showTooltip,
      trigger: tooltipTrigger,
      axisPointer:
        tooltipTrigger === 'axis'
          ? {
              type: highlightSeries ? ('none' as const) : ('shadow' as const),
              triggerEmphasis: false,
              shadowStyle: { color: 'rgba(127, 127, 127, 0.12)' },
              label: {
                show: axisPointerLabel,
                backgroundColor: surface,
                color: labelColor,
                borderColor: lineColor,
                borderWidth: 1,
                shadowBlur: 0,
                fontSize: 11,
              },
            }
          : undefined,
      backgroundColor: surface,
      borderColor: lineColor,
      borderWidth: 1,
      padding: tooltipTrigger === 'axis' ? [6, 10] : [4, 8],
      textStyle: { color: labelColor, fontSize: 11 },
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter:
        tooltipTrigger === 'axis'
          ? (
              params: Array<{
                name?: string
                seriesName?: string
                value: number
                marker?: string
              }>
            ) => {
              const arr = Array.isArray(params) ? params : [params]
              const head = arr[0]?.name ?? ''
              const rows = arr
                .map(
                  p =>
                    `${p.marker ?? ''}${p.seriesName}: ${formatValue(p.value)}`
                )
                .join('<br/>')
              return `${head}<br/>${rows}`
            }
          : (
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
    xAxis: xAxisFinal,
    yAxis: yAxisBase,
    series: seriesList,
  }
}
