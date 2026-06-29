import {
  readCssColor,
  lighten,
  resolveVariant,
  resolveVariantOrColor,
  resolveCategoricalPalette,
  prefersReducedMotion,
  withAlpha,
} from '@/utils'
import type { AxisLabelOverride, ValueAxisPosition } from '@/utils'
import { gradientFill, curveProps, toArray, valueOf } from './helpers'
import type {
  LineSeries,
  LinePalette,
  LineCurve,
  LineXAxisType,
  LineLegendPosition,
  LineMarkPoint,
  LineReferenceLine,
  LineMarkArea,
  LineThreshold,
} from './types'

export interface BuildLineOptionParams {
  categories?: (string | number)[]
  series: LineSeries[]
  xAxisType: LineXAxisType
  curve: LineCurve
  area?: boolean | 'gradient'
  palette: LinePalette
  showSymbol: boolean
  symbolSize: number
  lineWidth: number
  connectNulls: boolean
  min?: number
  max?: number
  showValueAxis: boolean
  gridLines?: boolean
  valueAxisName?: string
  categoryAxisName?: string
  valueAxisPosition: ValueAxisPosition
  axisLabelRotate: number
  xAxisLabel?: AxisLabelOverride
  showTooltip: boolean
  tooltipTrigger: 'item' | 'axis'
  showLegend?: boolean
  legendPosition: LineLegendPosition
  highlightSeries: boolean
  threshold?: LineThreshold
  referenceLine?: LineReferenceLine | LineReferenceLine[]
  markArea?: LineMarkArea | LineMarkArea[]
  markPoints: LineMarkPoint[]
  zoom: boolean
  zoomSlider: boolean
  sparkline: boolean
  formatValue: (value: number) => string
  formatX?: (value: string | number) => string
  animate: boolean
  emptyMessage: string
}

export function buildLineOption(params: BuildLineOptionParams) {
  const {
    categories,
    series,
    xAxisType,
    curve,
    area,
    palette,
    showSymbol,
    symbolSize,
    lineWidth,
    connectNulls,
    min,
    max,
    showValueAxis,
    gridLines,
    valueAxisName,
    categoryAxisName,
    valueAxisPosition,
    axisLabelRotate,
    xAxisLabel,
    showTooltip,
    tooltipTrigger,
    showLegend,
    legendPosition,
    highlightSeries,
    threshold,
    referenceLine,
    markArea,
    markPoints,
    zoom,
    zoomSlider,
    sparkline,
    formatValue,
    formatX,
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
  const inverseColor = readCssColor(
    '--text-color-ds-inverse',
    'rgb(250, 250, 250)'
  )

  const maxLen = series.reduce((m, s) => Math.max(m, s.data.length), 0)

  if (!series.length || maxLen === 0) {
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

  // On a category axis, fall back to numeric indices when no labels are given
  // (e.g. sparklines), so the line still renders from the series data alone.
  const cats =
    xAxisType === 'category'
      ? categories?.length
        ? categories
        : Array.from({ length: maxLen }, (_, i) => i)
      : undefined

  const categorical = resolveCategoricalPalette()
  const fmtX = formatX ?? ((v: string | number) => String(v))

  const colorFor = (s: LineSeries, i: number): string =>
    s.color ??
    (s.variant
      ? resolveVariant(s.variant)
      : palette === 'brand'
        ? resolveVariant('primary')
        : categorical[i % categorical.length])

  const seriesColors = series.map((s, i) => colorFor(s, i))

  const multi = series.length > 1
  // Gradient fills can't be interpolated cheaply between hover states, so state
  // changes switch instantly for them; flat fills brighten smoothly like Combo.
  const anyGradient = series.some(s => (s.area ?? area) === 'gradient')
  const legendShown = !sparkline && (showLegend ?? multi)
  const legendVertical = legendPosition === 'left' || legendPosition === 'right'

  const seriesList = series.map((s, i) => {
    const color = seriesColors[i]
    const hover = lighten(color)
    const areaMode = s.area ?? area
    const symbolOn = s.showSymbol ?? showSymbol
    const width = s.width ?? lineWidth

    // The threshold series is colored per-segment by the piecewise visualMap.
    // ECharts throws when that runs over a smooth line, so it stays straight,
    // skips LTTB sampling, and keeps its mapped colors on hover.
    const isThreshold = Boolean(threshold) && i === 0
    const shape = isThreshold
      ? { smooth: false as const }
      : curveProps(s.curve ?? curve)

    const isGradient = areaMode === 'gradient'
    const fill = areaMode
      ? isGradient
        ? { color: gradientFill(color), opacity: 1 }
        : { color, opacity: 0.15 }
      : undefined

    // Hover state for the fill — reuses Combo's area emphasis. A flat fill
    // brightens to the lightened color (a smooth flat→flat transition); a
    // gradient fill can't be interpolated, so it stays put and only the line
    // lightens (the chart also drops state animation when a gradient is present).
    const emphasisArea = fill
      ? isGradient
        ? fill
        : { color: hover, opacity: 0.25 }
      : undefined

    const annotations = i === 0 ? buildAnnotations() : {}

    return {
      name: s.name,
      type: 'line' as const,
      data: s.data,
      stack: s.stack,
      ...shape,
      connectNulls,
      showSymbol: symbolOn,
      symbol: 'circle' as const,
      symbolSize,
      // Down-sample only very dense series; LTTB is needless for short data and
      // conflicts with the threshold visualMap.
      ...(s.data.length > 200 && !isThreshold
        ? { sampling: 'lttb' as const }
        : {}),
      lineStyle: {
        color,
        width,
        type: s.dashed ? ('dashed' as const) : ('solid' as const),
      },
      itemStyle: { color, borderColor: surface, borderWidth: 1.5 },
      // Hover lightens the line and its points via the same `lighten` helper Bar
      // uses, and brightens a flat fill the same way Combo does. `focus` dims the
      // other series only when `highlightSeries` is on. The threshold series is
      // colored per-segment by the visualMap, so its emphasis is disabled
      // entirely — any hover state fights the visualMap and drops the line.
      emphasis: isThreshold
        ? { disabled: true }
        : {
            focus: (highlightSeries ? 'series' : 'none') as 'series' | 'none',
            lineStyle: { color: hover, width },
            itemStyle: { color: hover },
            ...(emphasisArea ? { areaStyle: emphasisArea } : {}),
          },
      blur:
        highlightSeries && !isThreshold
          ? {
              lineStyle: { opacity: 0.2 },
              itemStyle: { opacity: 0.2 },
              ...(fill ? { areaStyle: { opacity: 0.06 } } : {}),
            }
          : undefined,
      ...(fill ? { areaStyle: fill } : {}),
      ...annotations,
    }
  })

  function buildAnnotations() {
    const refs = toArray(referenceLine)
    const areas = toArray(markArea)

    const markLine = refs.length
      ? {
          silent: true,
          symbol: 'none' as const,
          data: refs.map(r => ({
            [r.axis === 'x' ? 'xAxis' : 'yAxis']: r.value,
            lineStyle: {
              color: r.color ?? subtleColor,
              type: 'dashed' as const,
              width: 1.5,
            },
            label: {
              show: Boolean(r.label),
              position: 'insideEndTop' as const,
              color: r.color ?? subtleColor,
              fontSize: 11,
              backgroundColor: surface,
              borderColor: lineColor,
              borderWidth: 1,
              borderRadius: 4,
              padding: [2, 6] as [number, number],
              formatter: () => r.label ?? formatValue(r.value),
            },
          })),
        }
      : undefined

    const markAreaOpt = areas.length
      ? {
          silent: true,
          data: areas.map(a => {
            const dim = (a.axis ?? 'x') === 'y' ? 'yAxis' : 'xAxis'
            return [
              {
                [dim]: a.from,
                itemStyle: { color: withAlpha(a.color ?? subtleColor, 0.1) },
                label: {
                  show: Boolean(a.label),
                  position: 'insideTop' as const,
                  color: subtleColor,
                  fontSize: 11,
                  formatter: () => a.label ?? '',
                },
              },
              { [dim]: a.to },
            ]
          }),
        }
      : undefined

    const markPointOpt = markPoints.length
      ? {
          symbol: 'pin' as const,
          symbolSize: 42,
          data: markPoints.map(type => ({ type })),
          itemStyle: { color: seriesColors[0] },
          emphasis: { disabled: true },
          label: {
            color: inverseColor,
            fontSize: 11,
            formatter: (p: { value: number | unknown[] }) =>
              formatValue(valueOf(p.value)),
          },
        }
      : undefined

    return {
      ...(markLine ? { markLine } : {}),
      ...(markAreaOpt ? { markArea: markAreaOpt } : {}),
      ...(markPointOpt ? { markPoint: markPointOpt } : {}),
    }
  }

  // Green-above / red-below baseline coloring for the first series. The pieces
  // are bounded by the series' own value range and the visualMap is given an
  // explicit min/max — open-ended pieces leave the range ill-defined, which
  // makes ECharts' line-gradient builder throw (`colorStopsInRange[0].coord`).
  // `dimension` is left to its default (the value dimension) like the official
  // ECharts demos.
  const visualMap = threshold
    ? (() => {
        const values = series[0].data.map(valueOf).filter(Number.isFinite)
        const dataMin = values.length ? Math.min(...values) : threshold.value
        const dataMax = values.length ? Math.max(...values) : threshold.value
        const lo = Math.min(dataMin, threshold.value)
        const hi = Math.max(dataMax, threshold.value)
        return {
          show: false,
          type: 'piecewise' as const,
          seriesIndex: 0,
          min: lo,
          max: hi,
          pieces: [
            {
              gte: threshold.value,
              lte: hi,
              color:
                resolveVariantOrColor(threshold.above) ??
                resolveVariant('success'),
            },
            {
              gte: lo,
              lt: threshold.value,
              color:
                resolveVariantOrColor(threshold.below) ??
                resolveVariant('destructive'),
            },
          ],
        }
      })()
    : undefined

  const showGrid = !sparkline && (gridLines ?? showValueAxis)

  const valueAxis = {
    type: 'value' as const,
    min,
    max,
    name: sparkline ? undefined : valueAxisName,
    position: valueAxisPosition,
    scale: true,
    nameTextStyle: { color: subtleColor, fontSize: 11 },
    splitLine: {
      show: showGrid,
      lineStyle: { color: lineColor, type: 'dashed' as const },
    },
    axisLabel:
      sparkline || !showValueAxis
        ? { show: false }
        : {
            color: labelColor,
            fontSize: 12,
            formatter: (value: number) => formatValue(value),
          },
    axisTick: { show: false },
    axisLine: { show: false },
  }

  const xAxis = {
    type: xAxisType,
    ...(xAxisType === 'category' ? { data: cats, boundaryGap: false } : {}),
    name: sparkline ? undefined : categoryAxisName,
    nameTextStyle: { color: subtleColor, fontSize: 11 },
    axisLine: {
      show: !sparkline,
      lineStyle: { color: lineColor },
    },
    axisTick: { show: false },
    axisLabel: sparkline
      ? { show: false }
      : {
          color: labelColor,
          fontSize: 12,
          rotate: axisLabelRotate,
          hideOverlap: true,
          formatter:
            xAxisType === 'time' ? (value: number) => fmtX(value) : undefined,
          // Escape hatch: a custom formatter (rich text + icons) / styling wins.
          ...xAxisLabel,
        },
  }

  // Floor the zoom window at ~4 points so scrolling in can never collapse the
  // line to an empty range (which leaves nothing to draw and no way to wheel
  // back out).
  const minSpan = Math.min(100, Math.max(2, (4 / maxLen) * 100))

  const dataZoom =
    zoom && !sparkline
      ? [
          {
            type: 'inside' as const,
            xAxisIndex: 0,
            minSpan,
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            moveOnMouseWheel: false,
          },
          ...(zoomSlider
            ? [
                {
                  type: 'slider' as const,
                  xAxisIndex: 0,
                  minSpan,
                  height: 18,
                  bottom: 8,
                  left: 8,
                  right: 8,
                  brushSelect: false,
                },
              ]
            : []),
        ]
      : undefined

  const showHSlider = Boolean(dataZoom && zoomSlider)

  const grid = sparkline
    ? { left: 2, right: 2, top: 2, bottom: 2, containLabel: false }
    : {
        left: legendVertical && legendPosition === 'left' ? 96 : 8,
        right: legendVertical && legendPosition === 'right' ? 96 : 12,
        top: Math.max(
          legendShown && legendPosition === 'top' ? 32 : 0,
          valueAxisName ? 24 : 0,
          12
        ),
        bottom: Math.max(
          legendShown && legendPosition === 'bottom' ? 32 : 0,
          showHSlider ? 36 : 0,
          axisLabelRotate ? 24 : 0,
          8
        ),
        containLabel: true,
      }

  return {
    animation: animate && !prefersReducedMotion(),
    animationDuration: 600,
    animationEasing: 'cubicOut' as const,
    // Hover/blur state changes animate (a smooth lighten/brighten, like Combo
    // and Bar), but switch instantly when a gradient fill is present —
    // interpolating an area gradient between states every frame froze the canvas.
    stateAnimation: {
      duration: anyGradient ? 0 : 300,
      easing: 'cubicOut' as const,
    },
    ...(visualMap ? { visualMap } : {}),
    ...(dataZoom ? { dataZoom } : {}),
    legend: {
      show: legendShown,
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
    grid,
    tooltip: {
      show: showTooltip && !sparkline,
      trigger: tooltipTrigger,
      axisPointer:
        tooltipTrigger === 'axis'
          ? {
              type: 'cross' as const,
              triggerEmphasis: false,
              crossStyle: { color: subtleColor, type: 'dashed' as const },
              lineStyle: { color: subtleColor, type: 'dashed' as const },
              label: {
                backgroundColor: surface,
                color: labelColor,
                borderColor: lineColor,
                borderWidth: 1,
                shadowBlur: 0,
                fontSize: 11,
                formatter: (p: { axisDimension?: string; value: number }) =>
                  p.axisDimension === 'y'
                    ? formatValue(Math.round(p.value))
                    : fmtX(p.value),
              },
            }
          : undefined,
      backgroundColor: surface,
      borderColor: lineColor,
      borderWidth: 1,
      padding: [6, 10],
      textStyle: { color: labelColor, fontSize: 11 },
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter:
        tooltipTrigger === 'axis'
          ? (
              args: Array<{
                axisValue?: string | number
                axisValueLabel?: string
                seriesName?: string
                value: number | unknown[]
                marker?: string
              }>
            ) => {
              const arr = Array.isArray(args) ? args : [args]
              const head = fmtX(
                arr[0]?.axisValue ?? arr[0]?.axisValueLabel ?? ''
              )
              const rows = arr
                .map(
                  p =>
                    `${p.marker ?? ''}${p.seriesName}: ${formatValue(valueOf(p.value))}`
                )
                .join('<br/>')
              return `${head}<br/>${rows}`
            }
          : (p: {
              name?: string
              seriesName?: string
              value: number | unknown[]
              marker?: string
              data?: unknown
            }) => {
              const item = Array.isArray(p) ? p[0] : p
              const x = Array.isArray(item.value)
                ? fmtX(item.value[0] as string | number)
                : (item.name ?? '')
              const head =
                multi && item.seriesName ? `${x} · ${item.seriesName}` : x
              return `${item.marker ?? ''}${head}: ${formatValue(valueOf(item.value))}`
            },
    },
    xAxis,
    yAxis: valueAxis,
    series: seriesList,
  }
}
