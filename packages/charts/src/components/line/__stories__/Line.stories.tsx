import { useEffect, useRef, useState } from 'react'
import type { ECharts } from 'echarts/core'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { Line } from '../Line'
import {
  lcg,
  PREV_CLOSE,
  intraday,
  trendVariant,
  timeOfDay,
  dailyYear,
  dayMonth,
  MINUTE,
  MONITOR_START,
  cpuSeries,
  memSeries,
  clock,
  rainfallFlow,
  rainDay,
  RAIN_START,
  LIVE_WINDOW,
  liveLabel,
  PLAY_ICON,
} from './fixtures'

const meta: Meta<typeof Line> = {
  title: 'Charts/Line',
  component: Line,
  tags: [],
  parameters: {
    layout: 'fullscreen',
    chartLayout: { maxWidth: 720, padding: 4 },
    docs: {
      description: {
        component:
          'A line chart for trends over time, powered by Apache ECharts. Plots one or more series on a shared `category` or true `time` axis, with optional gradient area fills, threshold (above/below) coloring, reference lines, shaded mark areas, zoom, and a minimal sparkline preset. Every color resolves from `@clera/tokens`, so it adapts to light/dark mode automatically. Built on the same `useEChart` runtime as `Bar` and `Combo`.',
      },
    },
  },
  argTypes: {
    series: {
      control: 'object',
      description:
        'One or more lines, each `{ name, data, variant?, color?, curve?, area?, stack?, dashed?, showSymbol?, width? }`. `data` is plain values aligned to `categories`, or `[x, y]` pairs when `xAxisType="time"`.',
      table: { type: { summary: 'LineSeries[]' } },
    },
    categories: {
      control: 'object',
      description:
        'Shared x-axis labels for `xAxisType="category"`. Ignored on a time axis (each series carries its own `[x, y]` pairs).',
      table: { type: { summary: '(string | number)[]' } },
    },
    xAxisType: {
      control: { type: 'radio' },
      options: ['category', 'time'],
      description:
        'Evenly spaced `category` labels, or a real `time` axis that positions points by their timestamp (pass `[x, y]` pairs).',
      table: {
        type: { summary: "'category' | 'time'" },
        defaultValue: { summary: 'category' },
      },
    },
    curve: {
      control: { type: 'radio' },
      options: ['straight', 'smooth', 'stepped'],
      description:
        'Line shape between points. `straight` connects with segments, `smooth` uses a spline, `stepped` holds each value until the next.',
      table: {
        type: { summary: "'straight' | 'smooth' | 'stepped'" },
        defaultValue: { summary: 'straight' },
      },
    },
    area: {
      control: { type: 'select' },
      options: [false, true, 'gradient'],
      description:
        'Fill under every line. `true` is a flat tint; `gradient` fades the line color down to transparent. Override per series with `series[].area`.',
      table: {
        type: { summary: "boolean | 'gradient'" },
        defaultValue: { summary: 'false' },
      },
    },
    palette: {
      control: { type: 'radio' },
      options: ['categorical', 'brand'],
      description:
        'Default coloring for series without a `variant`/`color`. `categorical` cycles the eight design-system colors; `brand` paints every line with the primary color.',
      table: {
        type: { summary: "'categorical' | 'brand'" },
        defaultValue: { summary: 'categorical' },
      },
    },
    showSymbol: {
      control: 'boolean',
      description:
        'Show the point marker on every data point. Off by default (clean trend lines); the marker still appears on hover.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    symbolSize: {
      control: { type: 'range', min: 0, max: 16, step: 1 },
      description: 'Diameter of the point markers in px.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '6' } },
    },
    lineWidth: {
      control: { type: 'range', min: 1, max: 6, step: 0.5 },
      description:
        'Default line thickness in px (override per series with `series[].width`).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '2' } },
    },
    connectNulls: {
      control: 'boolean',
      description:
        'Bridge gaps in the data (`null` points) instead of breaking the line.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showValueAxis: {
      control: 'boolean',
      description:
        'Show the numeric value axis with formatted ticks. The axis auto-scales (it does not force a zero baseline).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    gridLines: {
      control: 'boolean',
      description:
        'Toggle the dashed value-axis grid lines independently. Defaults to whatever `showValueAxis` is.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'showValueAxis' },
      },
    },
    threshold: {
      control: 'object',
      description:
        'Color the first series by where each point sits relative to a baseline — `{ value, above?, below? }`. `above`/`below` take a token variant (e.g. `success`) or a raw color. The classic green-above / red-below look.',
      table: {
        type: { summary: '{ value: number; above?: string; below?: string }' },
        defaultValue: { summary: 'undefined' },
      },
    },
    referenceLine: {
      control: 'object',
      description:
        'One or more dashed reference lines: `{ value, label?, axis?, color? }` (or an array). Defaults to the value (`y`) axis — e.g. a previous close, target, or SLA line.',
      table: {
        type: { summary: 'LineReferenceLine | LineReferenceLine[]' },
        defaultValue: { summary: 'undefined' },
      },
    },
    markArea: {
      control: 'object',
      description:
        'Shade one or more bands: `{ from, to, label?, color?, axis? }` (or an array). Defaults to a vertical band over the x-axis — e.g. an incident window or after-hours range.',
      table: {
        type: { summary: 'LineMarkArea | LineMarkArea[]' },
        defaultValue: { summary: 'undefined' },
      },
    },
    markPoints: {
      control: { type: 'check' },
      options: ['max', 'min'],
      description:
        'Pin the `max` and/or `min` of the first series with a labelled marker.',
      table: {
        type: { summary: "('max' | 'min')[]" },
        defaultValue: { summary: '[]' },
      },
    },
    zoom: {
      control: 'boolean',
      description:
        'Add a dataZoom slider plus scroll/drag zoom on the x-axis — for paging through long time series.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    zoomSlider: {
      control: 'boolean',
      description:
        'Show the draggable zoom slider. Set to `false` to keep only inside (scroll/drag) zoom.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    sparkline: {
      control: 'boolean',
      description:
        'Minimal axis-less trend line — no axes, grid, legend, or tooltip. For KPI cards and inline sparklines.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    tooltipTrigger: {
      control: { type: 'radio' },
      options: ['axis', 'item'],
      description:
        '`axis` shows a crosshair listing every series at the hovered x; `item` shows just the hovered point.',
      table: {
        type: { summary: "'axis' | 'item'" },
        defaultValue: { summary: 'axis' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show the tooltip on hover.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showLegend: {
      control: 'boolean',
      description:
        'Show the legend. Defaults to on when there is more than one series.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'multi-series' },
      },
    },
    legendPosition: {
      control: { type: 'radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Legend placement; margin is reserved automatically.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: 'top' },
      },
    },
    legendIcon: {
      control: { type: 'select' },
      options: [
        'circle',
        'rect',
        'roundRect',
        'triangle',
        'diamond',
        'pin',
        'arrow',
        'none',
      ],
      description:
        'Marker shape for each legend entry, or a custom `path://…`/`image://…` icon string.',
      table: {
        type: { summary: 'LegendIcon' },
        defaultValue: { summary: 'roundRect' },
      },
    },
    legendAlign: {
      control: { type: 'radio' },
      options: ['start', 'center', 'end'],
      description:
        'Where along its edge the legend sits, e.g. `left`/`center`/`right` when `legendPosition` is `top`/`bottom`.',
      table: {
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: 'center' },
      },
    },
    legendStyle: {
      control: false,
      description:
        'Fine-grained legend styling: `itemWidth`/`itemHeight`/`itemGap`, `fontSize`/`fontWeight`/`textColor`, `inactiveColor`, `backgroundColor`/`borderColor`/`borderWidth`/`borderRadius`/`padding`.',
      table: { type: { summary: 'LegendStyleOverrides' } },
    },
    highlightOnHover: {
      control: 'boolean',
      description:
        'On hover, focus the hovered series and dim the others. Off by default — hovering just lightens the line, like Bar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    axisLabelRotate: {
      control: { type: 'range', min: -90, max: 90, step: 15 },
      description: 'Rotate the x-axis labels by this many degrees.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    min: {
      control: 'number',
      description:
        'Force the single y-axis minimum (ignored when `yAxes` is set). Auto when omitted.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    max: {
      control: 'number',
      description:
        'Force the single y-axis maximum (ignored when `yAxes` is set).',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    yAxes: {
      control: 'object',
      description:
        'The y-axes — one or more, each `{ id?, name?, side?, min?, max?, inverse?, position?, orientation?, format? }`. `name` is the axis title; `position` (top/middle/bottom) and `orientation` place it. Bind series with `series[].yAxis` (the axis id or index).',
      table: {
        type: { summary: 'LineYAxis[]' },
        defaultValue: { summary: '-' },
      },
    },
    xAxis: {
      control: 'object',
      description:
        'The x-axis — `{ name?, position?, orientation? }`. `name` is its title; `position` is `left`/`middle`/`right` (default `right`).',
      table: {
        type: { summary: 'LineXAxis' },
        defaultValue: { summary: '-' },
      },
    },
    toolbox: {
      control: 'boolean',
      description:
        'Show the ECharts toolbox: box-zoom, restore, and save-as-image, styled to the theme.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    zoomWindow: {
      control: 'object',
      description:
        'Initial zoom window as `[startPercent, endPercent]` (0–100). Requires `zoom`.',
      table: {
        type: { summary: '[number, number]' },
        defaultValue: { summary: '-' },
      },
    },
    xAxisLabel: {
      control: false,
      description:
        'Escape hatch for the x-axis labels. Pass a `formatter` (return text or ECharts rich-text markup) plus `rich` style blocks to render icons/images on each label.',
      table: { type: { summary: 'AxisLabelOverride' } },
    },
    formatValue: {
      control: false,
      description:
        'Formats numbers for value-axis ticks, the tooltip, and reference labels. e.g. `` v => `$${v}` ``.',
      table: {
        type: { summary: '(value: number) => string' },
        defaultValue: { summary: 'String(value)' },
      },
    },
    formatX: {
      control: false,
      description:
        'Formats x-axis ticks and the tooltip header — handy for time axes (e.g. format a timestamp).',
      table: { type: { summary: '(value: string | number) => string' } },
    },
    loading: {
      control: 'boolean',
      description: 'Show a loading spinner overlay.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    animate: {
      control: 'boolean',
      description:
        'Play the line draw-in animation. Auto-disabled under reduced-motion.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Centered message shown when there is no data.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'No data'" },
      },
    },
    height: {
      control: 'number',
      description: 'Chart height in px or any CSS length.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '320' },
      },
    },
    onPointClick: {
      action: 'line:click',
      description:
        'Called with `{ seriesName, x, value, index }` when a point is clicked.',
      table: { type: { summary: '(point: LinePointClick) => void' } },
    },
    onReady: {
      action: 'ready',
      description:
        'Escape hatch — called once on mount with the ECharts instance.',
      table: { type: { summary: '(chart: ECharts) => void' } },
    },
    className: {
      control: 'text',
      description: 'Class name merged onto the chart container.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
  },
  args: {
    height: 340,
    xAxisType: 'category',
    curve: 'smooth',
    area: false,
    showSymbol: false,
    showValueAxis: true,
    tooltipTrigger: 'axis',
    legendPosition: 'top',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    formatValue: (v: number) => `${(v / 1000).toFixed(1)}k`,
    series: [
      { name: 'Sessions', data: [5200, 6100, 5800, 6800, 7400, 4200, 3600] },
      { name: 'Users', data: [3800, 4400, 4100, 4900, 5300, 3100, 2700] },
    ],
  },
}

export default meta

type Story = StoryObj<typeof Line>

export const StockPrice: Story = {
  name: 'Stock price (intraday)',
  parameters: {
    docs: {
      description: {
        story:
          'A Google-Finance-style intraday chart on a real `time` axis. A single line with a gradient area fill, a dashed **previous close** reference line, and a color driven by whether the last price is up or down on the day. Points are hidden until you hover; the crosshair tooltip shows the price and the time of day.',
      },
    },
  },
  args: {
    height: 360,
    xAxisType: 'time',
    curve: 'straight',
    area: 'gradient',
    showValueAxis: true,
    categories: undefined,
    formatValue: (v: number) => `$${v.toFixed(2)}`,
    formatX: timeOfDay,
    referenceLine: {
      value: PREV_CLOSE,
      label: `Prev close $${PREV_CLOSE.toFixed(2)}`,
    },
    series: [{ name: 'ACME', variant: trendVariant, data: intraday }],
  },
  render: args => <Line {...args} />,
}

export const ThresholdSplit: Story = {
  name: 'Threshold (above / below)',
  parameters: {
    docs: {
      description: {
        story:
          'Color the line by where each point sits relative to a baseline with `threshold`. Here daily net P&L is drawn green above the break-even line and red below it — the segments switch color as the line crosses zero. `above`/`below` accept a token variant or a raw color.',
      },
    },
  },
  args: {
    height: 320,
    curve: 'straight',
    showValueAxis: true,
    tooltipTrigger: 'axis',
    xAxis: { name: 'Trading day' },
    formatValue: (v: number) => `${v > 0 ? '+' : ''}$${(v / 1000).toFixed(1)}k`,
    threshold: { value: 0, above: 'success', below: 'destructive' },
    referenceLine: { value: 0, label: 'Break-even' },
    categories: Array.from({ length: 21 }, (_, i) => `D${i + 1}`),
    series: [
      {
        name: 'Net P&L',
        data: [
          1.2, 2.4, 1.8, -0.6, -2.1, -1.4, 0.8, 2.6, 3.4, 2.1, -0.9, -2.8, -3.6,
          -1.2, 1.4, 3.1, 4.2, 2.8, 1.1, -0.4, 1.9,
        ].map(v => v * 1000),
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const MultiTicker: Story = {
  name: 'Multi-ticker comparison',
  parameters: {
    docs: {
      description: {
        story:
          'Compare several instruments by **normalized return** — each line starts at 0% so different price levels become comparable. A dashed line marks flat (0%), and the axis tooltip lists every ticker at the hovered month.',
      },
    },
  },
  args: {
    height: 360,
    curve: 'smooth',
    showValueAxis: true,
    legendPosition: 'top',
    yAxes: [{ name: 'Return' }],
    formatValue: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(0)}%`,
    referenceLine: { value: 0, label: 'Flat' },
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    series: [
      {
        name: 'NVDA',
        variant: 'success',
        data: [
          0, 8.4, 15.2, 11.8, 22.5, 35.1, 41.8, 38.2, 52.6, 68.3, 61.5, 84.2,
        ],
      },
      {
        name: 'AAPL',
        variant: 'info',
        data: [0, 3.2, 5.1, 2.8, 7.4, 11.2, 9.8, 14.5, 12.1, 18.3, 22.6, 26.4],
      },
      {
        name: 'MSFT',
        variant: 'primary',
        data: [0, 2.1, 4.8, 6.2, 5.5, 8.9, 12.4, 11.0, 15.7, 19.2, 17.8, 24.1],
      },
      {
        name: 'SPY',
        variant: 'neutral',
        data: [0, 1.5, 2.8, 1.2, 3.6, 5.1, 4.4, 6.8, 5.9, 8.2, 7.5, 10.3],
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const WebTraffic: Story = {
  name: 'Web traffic',
  parameters: {
    docs: {
      description: {
        story:
          'A web-analytics view: sessions and users over the week as two smooth lines with translucent area fills and a legend (click an entry to toggle it). `formatValue` renders the counts in compact `k` form across the axis and tooltip.',
      },
    },
  },
  args: {
    height: 340,
    curve: 'smooth',
    area: true,
    showValueAxis: true,
    min: 0,
    legendPosition: 'top',
    formatValue: (v: number) => `${(v / 1000).toFixed(1)}k`,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      {
        name: 'Sessions',
        variant: 'primary',
        data: [5200, 6100, 5800, 6800, 7400, 4200, 3600],
      },
      {
        name: 'Users',
        variant: 'info',
        data: [3800, 4400, 4100, 4900, 5300, 3100, 2700],
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const RightAxisIcons: Story = {
  name: 'Right axis & label icons',
  parameters: {
    docs: {
      description: {
        story:
          'Two axis escape hatches: `yAxes={[{ side: "right" }]}` moves the y-axis to the right (common in analytics/finance dashboards), and `xAxisLabel` renders **rich labels** — here a small image icon above each weekday via an ECharts rich-text formatter. Point `xAxisLabel.rich.<name>.backgroundColor.image` at any URL (e.g. a channel/video thumbnail) for the YouTube-analytics look.',
      },
    },
  },
  args: {
    height: 320,
    yAxes: [{ side: 'right', min: 0 }],
    curve: 'smooth',
    area: 'gradient',
    showValueAxis: true,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    formatValue: (v: number) => `${(v / 1000).toFixed(0)}k`,
    xAxisLabel: {
      margin: 12,
      formatter: (value: string) => `{icon|}\n{label|${value}}`,
      rich: {
        icon: { height: 16, width: 16, backgroundColor: { image: PLAY_ICON } },
        label: { fontSize: 12, color: '#71717a', padding: [4, 0, 0, 0] },
      },
    },
    series: [
      {
        name: 'Views',
        stack: 'rev',
        variant: 'info',
        data: [42000, 51000, 47000, 63000, 72000, 38000, 31000],
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const ServerMonitoring: Story = {
  name: 'Server monitoring',
  parameters: {
    docs: {
      description: {
        story:
          'An observability panel on a `time` axis: CPU and memory over the last hour, an **SLA reference line** at 80%, and a shaded **`markArea`** marking an incident window. The value axis is pinned to 0–100% so the SLA line stays meaningful.',
      },
    },
  },
  args: {
    height: 360,
    xAxisType: 'time',
    curve: 'smooth',
    showValueAxis: true,
    min: 0,
    max: 100,
    legendPosition: 'top',
    categories: undefined,
    formatValue: (v: number) => `${v}%`,
    formatX: clock,
    referenceLine: { value: 80, label: 'SLA 80%', color: 'rgb(220, 38, 38)' },
    markArea: {
      from: MONITOR_START + 30 * MINUTE,
      to: MONITOR_START + 39 * MINUTE,
      label: 'Incident',
    },
    series: [
      { name: 'CPU', variant: 'warning', data: cpuSeries },
      { name: 'Memory', variant: 'info', data: memSeries },
    ],
  },
  render: args => <Line {...args} />,
}

export const StackedArea: Story = {
  name: 'Stacked area',
  parameters: {
    docs: {
      description: {
        story:
          'Give series a shared `stack` name and an `area` fill to stack them into a cumulative composition — here monthly revenue split across product lines. The top edge is the total; each band is one product’s contribution.',
      },
    },
  },
  args: {
    height: 340,
    curve: 'smooth',
    area: true,
    showValueAxis: true,
    min: 0,
    legendPosition: 'top',
    formatValue: (v: number) => `$${v}k`,
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Core',
        stack: 'rev',
        variant: 'primary',
        data: [42, 45, 48, 52, 58, 64],
      },
      {
        name: 'Add-ons',
        stack: 'rev',
        variant: 'info',
        data: [12, 14, 13, 18, 22, 28],
      },
      {
        name: 'Services',
        stack: 'rev',
        variant: 'success',
        data: [8, 9, 11, 10, 14, 19],
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const Stepped: Story = {
  name: 'Stepped line',
  parameters: {
    docs: {
      description: {
        story:
          'A `stepped` line holds each value until the next reading — the right shape for things that change in discrete jumps and stay put, like a benchmark interest rate.',
      },
    },
  },
  args: {
    height: 320,
    curve: 'stepped',
    area: true,
    showValueAxis: true,
    showSymbol: true,
    yAxes: [{ name: 'Rate' }],
    formatValue: (v: number) => `${v.toFixed(2)}%`,
    categories: [
      'Jan 22',
      'Mar 22',
      'Jun 22',
      'Sep 22',
      'Dec 22',
      'Mar 23',
      'May 23',
      'Jul 23',
      'Now',
    ],
    series: [
      {
        name: 'Policy rate',
        variant: 'destructive',
        data: [0.25, 0.5, 1.75, 3.25, 4.5, 5.0, 5.25, 5.5, 5.5],
      },
    ],
  },
  render: args => <Line {...args} />,
}

export const Sparkline: Story = {
  name: 'Sparkline (KPI card)',
  parameters: {
    docs: {
      description: {
        story:
          'The `sparkline` preset strips the axes, grid, legend, and tooltip down to a pure trend line — ideal inside a KPI card or a table cell. Pair it with a gradient `area` fill and a fixed, short `height`.',
      },
    },
  },
  render: () => (
    <div className="grid w-full grid-cols-3 gap-4">
      {[
        {
          label: 'MRR',
          value: '$64.2k',
          variant: 'success' as const,
          delta: '+8.4%',
          data: [38, 40, 39, 42, 45, 44, 48, 52, 51, 55, 60, 64],
        },
        {
          label: 'Active users',
          value: '12,840',
          variant: 'info' as const,
          delta: '+3.1%',
          data: [
            9.2, 9.6, 9.4, 10.1, 10.8, 10.4, 11.2, 11.0, 11.8, 12.1, 12.4, 12.8,
          ],
        },
        {
          label: 'Churn',
          value: '2.1%',
          variant: 'destructive' as const,
          delta: '-0.4%',
          data: [3.1, 2.9, 3.0, 2.8, 2.6, 2.7, 2.5, 2.4, 2.5, 2.3, 2.2, 2.1],
        },
      ].map(card => (
        <div
          key={card.label}
          className="rounded-lg border border-ds-default bg-ds-surface p-4"
        >
          <div className="text-body-sm text-ds-subtle">{card.label}</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-heading-sm font-semibold text-ds-default">
              {card.value}
            </span>
            <span className="text-body-sm text-ds-subtle">{card.delta}</span>
          </div>
          <div className="mt-3">
            <Line
              sparkline
              height={48}
              area
              series={[
                { name: card.label, variant: card.variant, data: card.data },
              ]}
            />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const ZoomPan: Story = {
  name: 'Zoom & pan',
  parameters: {
    docs: {
      description: {
        story:
          'A full year of daily readings on a `time` axis. `zoom` adds a bottom slider plus scroll-to-zoom and grab-to-pan, so a long series stays explorable without crowding. The down-sampling (LTTB) keeps rendering smooth at hundreds of points.',
      },
    },
  },
  args: {
    height: 360,
    xAxisType: 'time',
    curve: 'straight',
    area: 'gradient',
    showValueAxis: true,
    zoom: true,
    yAxes: [{ name: 'Daily active', min: 0 }],
    categories: undefined,
    formatValue: (v: number) => `${(v / 1000).toFixed(1)}k`,
    formatX: dayMonth,
    series: [{ name: 'DAU', variant: 'primary', data: dailyYear }],
  },
  render: args => <Line {...args} />,
}

export const RainfallAndFlow: Story = {
  name: 'Rainfall & flow (dual axis)',
  parameters: {
    docs: {
      description: {
        story:
          'Two gradient area-lines on opposing value axes: flow reads off the left axis (`Flow (m³/s)`), while the rainfall axis on the right (`Rainfall (mm)`) is `inverse`d so showers fall from the top and visibly precede the flow response. The one light-gray vertical band is a `markArea` highlighting a storm window; `zoomWindow` opens pre-zoomed on it, and the `toolbox` adds box-zoom / restore / save-as-image.',
      },
    },
  },
  args: {
    height: 420,
    xAxisType: 'time',
    curve: 'smooth',
    area: 'gradient',
    zoom: true,
    zoomWindow: [60, 85],
    toolbox: true,
    categories: undefined,
    formatX: rainDay,
    yAxes: [
      {
        id: 'flow',
        name: 'Flow (m³/s)',
        side: 'left',
        format: (v: number) => `${v}`,
      },
      {
        id: 'rain',
        name: 'Rainfall (mm)',
        side: 'right',
        inverse: true,
        min: 0,
        format: (v: number) => `${v}`,
      },
    ],
    markArea: {
      from: RAIN_START + 20.5 * 24 * 3600 * 1000,
      to: RAIN_START + 21.25 * 24 * 3600 * 1000,
    },
    series: [
      { name: 'Flow', variant: 'info', yAxis: 'flow', data: rainfallFlow.flow },
      {
        name: 'Rainfall',
        variant: 'primary',
        yAxis: 'rain',
        data: rainfallFlow.rainfall,
      },
    ],
  },
  render: args => (
    <div className="w-full">
      <div className="mb-3 text-center text-heading-sm font-semibold text-ds-default">
        Rainfall and Flow Relationship
      </div>
      <Line {...args} />
    </div>
  ),
}

const weatherMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

export const MultipleAxes: Story = {
  name: 'Multiple value axes (left + right)',
  parameters: {
    docs: {
      description: {
        story:
          'The `yAxes` array is the general model: any number of axes on either side, each self-describing its `side`, scale, `format`, and its own title `position` / `orientation`. Series bind to an axis by its `id`. Here two axes stack on the left (temperature, rainfall) and one sits on the right (pressure) — each title placed separately, and gutters sized so nothing overlaps.',
      },
    },
  },
  args: {
    height: 420,
    categories: weatherMonths,
    curve: 'smooth',
    formatX: (v: string | number) => String(v),
    yAxes: [
      {
        id: 'temp',
        name: 'Temp (°C)',
        side: 'left',
        position: 'middle',
        format: (v: number) => `${v}°`,
      },
      {
        id: 'pressure',
        name: 'Pressure (hPa)',
        side: 'right',
        position: 'middle',
        format: (v: number) => `${v}`,
      },
    ],
    series: [
      {
        name: 'Temperature',
        yAxis: 'temp',
        variant: 'destructive',
        data: [4, 6, 10, 15, 20, 24, 27, 26],
      },
      {
        name: 'Rainfall',
        yAxis: 'rain',
        variant: 'info',
        area: true,
        data: [78, 62, 55, 48, 60, 40, 35, 44],
      },
      {
        name: 'Pressure',
        yAxis: 'pressure',
        variant: 'warning',
        data: [1018, 1016, 1013, 1011, 1009, 1012, 1014, 1015],
      },
    ],
  },
  render: args => <Line {...args} />,
}

function LiveLineDemo() {
  const chartRef = useRef<ECharts | null>(null)
  const [seed] = useState(() => {
    const rnd = lcg(99)
    const categories: string[] = []
    const values: number[] = []
    let now = Date.now()
    let v = 60
    for (let i = 0; i < LIVE_WINDOW; i++) {
      categories.unshift(liveLabel(new Date(now)))
      now -= 1000
    }
    for (let i = 0; i < LIVE_WINDOW; i++) {
      v += (rnd() - 0.5) * 12
      values.push(Math.round(Math.max(10, Math.min(120, v))))
    }
    return { categories, values }
  })

  useEffect(() => {
    const live = {
      categories: [...seed.categories],
      values: [...seed.values],
    }
    const rnd = lcg(Date.now() & 0xffff)
    const id = setInterval(() => {
      const last = live.values[live.values.length - 1]
      const next = Math.round(
        Math.max(10, Math.min(120, last + (rnd() - 0.5) * 16))
      )
      live.categories = [...live.categories.slice(1), liveLabel(new Date())]
      live.values = [...live.values.slice(1), next]
      chartRef.current?.setOption({
        xAxis: { data: live.categories },
        series: [{ data: live.values }],
      })
    }, 1100)
    return () => clearInterval(id)
  }, [seed])

  return (
    <Line
      curve="smooth"
      area
      showValueAxis
      yAxes={[{ name: 'req/s', min: 0, max: 130 }]}
      categories={seed.categories}
      series={[{ name: 'Throughput', variant: 'primary', data: seed.values }]}
      onReady={chart => {
        chartRef.current = chart
      }}
    />
  )
}

export const LiveStreaming: Story = {
  name: 'Live streaming',
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'Streaming data: a new reading arrives every ~1s and the oldest drops off. Grab the chart with `onReady` and push just the changed `xAxis.data` / `series.data` on an interval — ECharts merges and animates each point to its new slot, so the line slides smoothly to the left.',
      },
    },
  },
  render: () => <LiveLineDemo />,
}
