import {
  readCssColor,
  resolveVariant,
  resolveCategoricalPalette,
  prefersReducedMotion,
  buildLegendOption,
  buildSelfHighlight,
  buildSelfHoverStyle,
  withAlpha,
} from '@/utils'
import type {
  LegendPosition,
  LegendIcon,
  LegendAlign,
  LegendStyleOverrides,
} from '@/utils'
import type {
  RadarIndicator,
  RadarSeries,
  RadarPalette,
  RadarShape,
} from './types'

export interface BuildRadarOptionParams {
  indicators: RadarIndicator[]
  series: RadarSeries[]
  title?: string
  subtitle?: string
  palette: RadarPalette
  shape: RadarShape
  max?: number
  radius: number | string
  area: boolean
  lineWidth: number
  showSymbol: boolean
  symbolSize: number
  gridLines: boolean
  splitArea: boolean
  showTooltip: boolean
  showLegend?: boolean
  legendPosition: LegendPosition
  legendIcon?: LegendIcon
  legendAlign?: LegendAlign
  legendStyle?: LegendStyleOverrides
  highlightOnHover: boolean
  formatValue: (value: number) => string
  animate: boolean
  emptyMessage: string
}

export function buildRadarOption(params: BuildRadarOptionParams) {
  const {
    indicators,
    series,
    title,
    subtitle,
    palette,
    shape,
    max,
    radius,
    area,
    lineWidth,
    showSymbol,
    symbolSize,
    gridLines,
    splitArea,
    showTooltip,
    showLegend,
    legendPosition,
    legendIcon,
    legendAlign,
    legendStyle,
    highlightOnHover,
    formatValue,
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

  const hasData = indicators.length > 0 && series.some(s => s.data.length > 0)
  if (!hasData) {
    return {
      title: {
        text: emptyMessage,
        left: 'center' as const,
        top: 'middle' as const,
        textStyle: {
          color: subtleColor,
          fontSize: 13,
          fontWeight: 'normal' as const,
        },
      },
    }
  }

  const categorical = resolveCategoricalPalette()
  const colorFor = (s: RadarSeries, i: number) =>
    s.color ??
    (s.variant
      ? resolveVariant(s.variant)
      : palette === 'brand'
        ? resolveVariant('primary')
        : categorical[i % categorical.length])

  const legendShown = showLegend ?? series.length > 1
  const titleReserve = title ? (subtitle ? 46 : 28) : 0
  const legendReserve = legendShown && legendPosition === 'top' ? 32 : 0

  return {
    animation: animate && !prefersReducedMotion(),
    animationDuration: 600,
    animationEasing: 'cubicOut' as const,
    ...(title
      ? {
          title: {
            text: title,
            ...(subtitle ? { subtext: subtitle } : {}),
            left: 'center' as const,
            top: 0,
            textStyle: { color: labelColor },
            subtextStyle: { color: subtleColor },
          },
        }
      : {}),
    legend: buildLegendOption({
      shown: legendShown,
      data: series.map(s => s.name),
      position: legendPosition,
      icon: legendIcon,
      align: legendAlign,
      topOffset: legendPosition === 'top' ? titleReserve : 0,
      colors: { label: labelColor, subtle: subtleColor, line: lineColor },
      style: legendStyle,
    }),
    radar: {
      shape,
      radius,
      center: ['50%', `${50 + (titleReserve + legendReserve) / 10}%`],
      indicator: indicators.map(i => ({
        name: i.name,
        ...((i.max ?? max) ? { max: i.max ?? max } : {}),
        ...(i.min !== undefined ? { min: i.min } : {}),
      })),
      axisName: { color: subtleColor, fontSize: 11 },
      axisLine: { show: gridLines, lineStyle: { color: lineColor } },
      splitLine: { show: gridLines, lineStyle: { color: lineColor } },
      splitArea: splitArea
        ? {
            show: true,
            areaStyle: {
              color: [withAlpha(lineColor, 0.12), withAlpha(lineColor, 0.04)],
            },
          }
        : { show: false },
    },
    tooltip: {
      show: showTooltip,
      trigger: 'item' as const,
      backgroundColor: surface,
      borderColor: lineColor,
      borderWidth: 1,
      padding: [4, 8] as [number, number],
      textStyle: { color: labelColor, fontSize: 11 },
      extraCssText: 'border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.08);',
      formatter: (p: { name: string; value: number[] }) => {
        const rows = indicators
          .map((ind, i) => `${ind.name}: ${formatValue(p.value[i] ?? 0)}`)
          .join('<br/>')
        return `${p.name}<br/>${rows}`
      },
    },
    // ECharts models a radar as one series holding one polygon per group, so
    // the legend and hover focus work per data item rather than per series —
    // hence `buildSelfHighlight` on each item rather than on the series.
    series: [
      {
        type: 'radar' as const,
        symbol: showSymbol ? ('circle' as const) : ('none' as const),
        symbolSize,
        ...buildSelfHighlight({ enabled: highlightOnHover }),
        data: series.map((s, i) => {
          const color = colorFor(s, i)
          const filled = s.area ?? area
          return {
            name: s.name,
            value: s.data,
            lineStyle: { color, width: lineWidth },
            itemStyle: { color },
            ...(filled
              ? { areaStyle: { color: withAlpha(color, 0.25) } }
              : { areaStyle: { opacity: 0 } }),
            // Hovering always lightens the fill and bolds the line, whether or
            // not `highlightOnHover` dims the others.
            emphasis: buildSelfHoverStyle(color, {
              lineWidth,
              ...(filled ? { areaOpacity: 0.4 } : {}),
            }),
          }
        }),
      },
    ],
  }
}
