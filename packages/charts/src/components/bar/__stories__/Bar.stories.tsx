import type { Meta, StoryObj } from '@storybook/nextjs'
import { Bar } from '../Bar'
import { useBarDrilldown, type BarDrilldownDatum } from '../useDrilldown'

const meta: Meta<typeof Bar> = {
  title: 'Charts/Bar',
  component: Bar,
  tags: ['dev', 'status:new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A responsive bar chart powered by Apache ECharts. Colors, labels, axes, and the tooltip all resolve from `@clera/tokens`, so the chart adapts to light/dark mode automatically. On hover, only the hovered bar lightens — there is no shadow band behind it.',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description:
        'The series to plot. Each datum is `{ label, value, variant? }`, where `variant` recolors that single bar regardless of the active palette.',
      table: {
        type: { summary: 'BarDatum[]' },
        defaultValue: { summary: '[]' },
      },
    },
    direction: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description:
        'Chart orientation. `vertical` renders columns (category on the x-axis, value on the y-axis); `horizontal` renders bars (category on the y-axis, value on the x-axis).',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    palette: {
      control: { type: 'radio' },
      options: ['brand', 'categorical'],
      description:
        'Default coloring for bars without an explicit `variant`. `brand` paints every bar with the primary color; `categorical` cycles through the eight design-system categorical colors.',
      table: {
        type: { summary: "'brand' | 'categorical'" },
        defaultValue: { summary: 'brand' },
      },
    },
    sort: {
      control: { type: 'radio' },
      options: ['none', 'asc', 'desc'],
      description:
        'Order the bars by value before rendering. `none` keeps the original data order.',
      table: {
        type: { summary: "'none' | 'asc' | 'desc'" },
        defaultValue: { summary: 'none' },
      },
    },
    showValueAxis: {
      control: 'boolean',
      description:
        'Show the numeric value axis (a `formatValue`-formatted scale plus axis line). The category axis is always shown.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    showValues: {
      control: 'boolean',
      description:
        'Show the value label on each bar. Usually turned off when `showValueAxis` is on, to avoid repeating the number.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description:
        'Show a tooltip for the hovered bar. Content is rendered with `formatValue`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    tooltipTrigger: {
      control: { type: 'radio' },
      options: ['item', 'axis'],
      description:
        'Tooltip mode. `item` shows just the hovered bar; `axis` lists every series in the hovered category, each with its color marker — useful for grouped/stacked charts.',
      table: {
        type: { summary: "'item' | 'axis'" },
        defaultValue: { summary: 'item' },
      },
    },
    showLegend: {
      control: 'boolean',
      description:
        'Show the legend. Only applies in grouped mode (when `categories` and `series` are provided); defaults to on there.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true (grouped)' },
      },
    },
    legendPosition: {
      control: { type: 'radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description:
        'Where to place the legend relative to the chart. `top`/`bottom` lay the entries out horizontally; `left`/`right` stack them vertically. Margin is reserved automatically so the legend never overlaps the plot.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: 'top' },
      },
    },
    stacked: {
      control: 'boolean',
      description:
        'Stack grouped `series` on top of each other instead of placing them side by side. Only the outer segment is rounded; labels move inside the segments.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    highlightSeries: {
      control: 'boolean',
      description:
        'On hover, highlight the whole series the bar belongs to (every same-colored bar) and dim the other series. Grouped mode only; off by default (plain per-bar hover).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTrack: {
      control: 'boolean',
      description:
        'Render a faint full-length background rail behind each bar. Best with single-series or stacked charts; pair with `max` for a meaningful "100%" rail.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    trackColor: {
      control: 'color',
      description:
        'Custom color for the track rail. Defaults to the `--background-color-ds-neutral` token (theme-aware).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'token' },
      },
    },
    categories: {
      control: 'object',
      description:
        'Shared category labels for grouped mode. Pair with `series` to render grouped bars with a legend.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '-' } },
    },
    series: {
      control: 'object',
      description:
        'Grouped series, each `{ name, data, variant?, color?, silent?, stack? }`, where `data` aligns to `categories`. Give series a shared `stack` name to stack them together; different `stack` names sit side by side and series without one are standalone bars (so you can mix several stacks in one chart). A `silent` series (e.g. a waterfall base) is excluded from the tooltip, labels, and legend.',
      table: {
        type: { summary: 'BarSeries[]' },
        defaultValue: { summary: '-' },
      },
    },
    referenceLine: {
      control: 'object',
      description:
        "Draw a dashed reference line on the value axis. `{ value, label? }` for a fixed line (a pill on the first series), or the string `'average'` for a per-series average line.",
      table: {
        type: { summary: "{ value: number; label?: string } | 'average'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    markPoints: {
      control: { type: 'check' },
      options: ['max', 'min'],
      description:
        'Pin the `max` and/or `min` value of each series with a labelled marker (like the ECharts rainfall example).',
      table: {
        type: { summary: "('max' | 'min')[]" },
        defaultValue: { summary: '[]' },
      },
    },
    axisBreaks: {
      control: 'object',
      description:
        'Collapse one or more ranges of the value axis with a zig-zag break — useful when a few bars dwarf the rest. Each break is `{ start, end, gap? }`.',
      table: {
        type: {
          summary: '{ start: number; end: number; gap?: number | string }[]',
        },
        defaultValue: { summary: '[]' },
      },
    },
    axisBreakExpandable: {
      control: 'boolean',
      description:
        'When `true` (default), clicking a break area expands that range and a "Collapse breaks" button appears to restore it. Set to `false` for a static, non-interactive break.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    axisBreakCollapse: {
      control: 'object',
      description:
        'Customise the "Collapse breaks" button that appears while a break is expanded. `text` sets the label, `offset` is `[left, top]` in px, `textStyle` ({ color, fontSize, fontWeight }) and `buttonStyle` ({ fill, stroke, borderRadius, paddingX }) override the theme-aware defaults.',
      table: {
        type: {
          summary:
            '{ text?; offset?: [number, number]; textStyle?; buttonStyle? }',
        },
        defaultValue: { summary: "{ text: 'Collapse breaks' }" },
      },
    },
    max: {
      control: 'number',
      description:
        'Force the value-axis maximum. When omitted, the axis auto-scales with headroom so the tallest bar and its label are never clipped.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    min: {
      control: 'number',
      description:
        'Force the value-axis minimum (e.g. to anchor at 0 or include negative space). Auto when omitted.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    stackMode: {
      control: { type: 'radio' },
      options: ['normal', 'percent'],
      description:
        "Stacking mode for grouped series. `percent` normalizes each category to 100% (implies stacking). Pair with a percent `formatValue` like `v => Math.round(v) + '%'`.",
      table: {
        type: { summary: "'normal' | 'percent'" },
        defaultValue: { summary: 'normal' },
      },
    },
    zoom: {
      control: { type: 'select' },
      options: [false, true, 'category', 'value'],
      description:
        'Add a dataZoom slider + inside (scroll/drag) zoom. `true`/`category` zooms the category axis (page through many bars); `value` zooms the value axis.',
      table: {
        type: { summary: "boolean | 'category' | 'value'" },
        defaultValue: { summary: 'false' },
      },
    },
    selectable: {
      control: 'boolean',
      description:
        'Enable brush selection via a toolbox button. Drag across the chart to select a band of bars; results come back through `onBrushSelect`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    axisLabelRotate: {
      control: { type: 'range', min: -90, max: 90, step: 15 },
      description:
        'Rotate the category-axis labels by this many degrees — useful when labels are long or crowded.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    valueAxisName: {
      control: 'text',
      description: 'Axis title for the value axis.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    categoryAxisName: {
      control: 'text',
      description: 'Axis title for the category axis.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    onBrushSelect: {
      action: 'bar:brush',
      description:
        'Called when a brush selection changes, with `{ indices, labels }` for the selected bars (requires `selectable`).',
      table: {
        type: {
          summary:
            '(selection: { indices: number[]; labels: string[] }) => void',
        },
      },
    },
    barRadius: {
      control: 'number',
      description:
        'Corner radius applied to the leading edge of each bar (top corners for columns, right corners for bars).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    barWidth: {
      control: 'number',
      description:
        'Maximum bar thickness in pixels. When omitted, the chart picks a sensible default per orientation.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    formatValue: {
      control: false,
      description:
        'Formats numbers for bar labels, value-axis ticks, the reference line, and the tooltip. e.g. `` v => `$${v}` ``.',
      table: {
        type: { summary: '(value: number) => string' },
        defaultValue: { summary: 'String(value)' },
      },
    },
    loading: {
      control: 'boolean',
      description:
        'Show a loading spinner overlay and keep the canvas in place.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    animate: {
      control: 'boolean',
      description:
        'Play the bar grow-in animation on load and updates. Automatically disabled when the OS requests reduced motion.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'Centered message shown when `data` is empty.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'No data'" },
      },
    },
    height: {
      control: 'number',
      description:
        'Chart height as a pixel number or any valid CSS length string.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '300' },
      },
    },
    onBarClick: {
      action: 'bar:click',
      description:
        'Called with `(datum, index)` when a bar is clicked, mapped back to the original (unsorted) datum.',
      table: { type: { summary: '(datum: BarDatum, index: number) => void' } },
    },
    onBarHover: {
      action: 'bar:hover',
      description:
        'Called with `(datum, index)` when a bar is hovered. Useful for syncing external UI.',
      table: { type: { summary: '(datum: BarDatum, index: number) => void' } },
    },
    onBarLeave: {
      action: 'bar:leave',
      description: 'Called when the pointer leaves a bar.',
      table: { type: { summary: '() => void' } },
    },
    onReady: {
      action: 'ready',
      description:
        'Escape hatch — called once on mount with the ECharts instance, so you can wire up dataZoom, brush, drilldown, or any ECharts API directly.',
      table: { type: { summary: '(chart: ECharts) => void' } },
    },
    className: {
      control: 'text',
      description: 'Class name merged onto the chart container.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
  },
  args: {
    direction: 'vertical',
    height: 360,
    palette: 'brand',
    sort: 'none',
    showValueAxis: true,
    showValues: false,
    showTooltip: true,
    barRadius: 6,
    loading: false,
    emptyMessage: 'No data',
    referenceLine: { value: 55000, label: 'Target' },
    formatValue: (v: number) => `$${(v / 1000).toFixed(1)}k`,
    data: [
      { label: 'Jan', value: 42000 },
      { label: 'Feb', value: 38500 },
      { label: 'Mar', value: 51200 },
      { label: 'Apr', value: 47800 },
      { label: 'May', value: 63400 },
      { label: 'Jun', value: 72100 },
    ],
  },
}

export default meta

type Story = StoryObj<typeof Bar>

export const Basic: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'Monthly gross revenue as columns with a "Target" reference line. `direction="vertical"` puts months on the x-axis and revenue on the y-axis; `showValueAxis` renders the y-axis scale and grid lines; `formatValue` formats ticks, labels, and the tooltip as currency. Use the Controls panel to flip orientation, switch the palette, sort bars, toggle the value axis/labels, or simulate the loading and empty states.',
      },
    },
  },
  render: args => (
    <div className="w-[560px]">
      <Bar {...args} />
    </div>
  ),
}

export const WithLegend: Story = {
  name: 'Grouped with legend',
  parameters: {
    docs: {
      description: {
        story:
          'Grouped bars driven by `categories` + `series`. Each series becomes a legend entry (click to toggle) and gets its own categorical color. Use this when you need to compare more than one measure per category — here, new vs. returning customer revenue per quarter.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 360,
    showLegend: true,
    legendPosition: 'top',
    showValueAxis: true,
    showValues: false,
    barRadius: 6,
    referenceLine: undefined,
    data: undefined,
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'New', data: [28000, 24500, 31200, 40100] },
      { name: 'Returning', data: [14000, 14000, 20000, 32000] },
    ],
  },
  render: args => (
    <div className="w-[560px]">
      <Bar {...args} />
    </div>
  ),
}

export const Stacked: Story = {
  name: 'Stacked column',
  parameters: {
    docs: {
      description: {
        story:
          'A recreation of the ECharts "Stacked Bar" example — `stacked` columns of traffic sources per weekday. Each series is one color, the legend toggles them, and only the outer segment is rounded.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 360,
    stacked: true,
    showLegend: true,
    legendPosition: 'top',
    showValueAxis: true,
    showValues: false,
    barRadius: 4,
    referenceLine: undefined,
    data: undefined,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Direct', data: [320, 332, 301, 334, 390, 330, 320] },
      { name: 'Email', data: [120, 132, 101, 134, 90, 230, 210] },
      { name: 'Union Ads', data: [220, 182, 191, 234, 290, 330, 310] },
      { name: 'Video Ads', data: [150, 232, 201, 154, 190, 330, 410] },
      { name: 'Search Engine', data: [820, 932, 901, 934, 1290, 1330, 1320] },
    ],
  },
  render: args => (
    <div className="w-[600px]">
      <Bar {...args} />
    </div>
  ),
}

export const MultipleStacks: Story = {
  name: 'Multiple stacks',
  parameters: {
    docs: {
      description: {
        story:
          'Several independent stacks in one chart, à la the advanced ECharts "Stacked Bar" example. Give a `stack` name to series that should stack together; series with different `stack` names (or none) sit side by side — here a standalone "Direct" bar, an "Ad" stack, and a "Search Engine" stack per weekday. `highlightSeries` lights up the hovered series (and dims the rest), and `tooltipTrigger="axis"` lists every series in the hovered weekday with its color.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 380,
    showLegend: true,
    showValueAxis: true,
    showValues: false,
    barRadius: 4,
    highlightSeries: true,
    tooltipTrigger: 'axis',
    referenceLine: undefined,
    data: undefined,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Direct', data: [320, 332, 301, 334, 390, 330, 320] },
      { name: 'Email', stack: 'Ad', data: [120, 132, 101, 134, 90, 230, 210] },
      {
        name: 'Union Ads',
        stack: 'Ad',
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: 'Video Ads',
        stack: 'Ad',
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: 'Baidu',
        stack: 'Search Engine',
        data: [620, 732, 701, 734, 1090, 1130, 1120],
      },
      {
        name: 'Google',
        stack: 'Search Engine',
        data: [120, 132, 101, 134, 290, 230, 220],
      },
      {
        name: 'Bing',
        stack: 'Search Engine',
        data: [60, 72, 71, 74, 190, 130, 110],
      },
      {
        name: 'Others',
        stack: 'Search Engine',
        data: [62, 82, 91, 84, 109, 110, 120],
      },
    ],
  },
  render: args => (
    <div className="w-[680px]">
      <Bar {...args} />
    </div>
  ),
}

export const WithTrack: Story = {
  name: 'Track background',
  parameters: {
    docs: {
      description: {
        story:
          'Set `showTrack` to render a faint full-length rail behind each bar — useful for showing progress toward a ceiling. Pairing it with an explicit `max` makes the rail represent a meaningful 100%. The track color defaults to a theme token and can be overridden with `trackColor`.',
      },
    },
  },
  args: {
    direction: 'horizontal',
    height: 240,
    showTrack: true,
    showValues: true,
    showValueAxis: false,
    max: 100,
    referenceLine: undefined,
    formatValue: v => `${v}%`,
    data: [
      { label: 'Storage', value: 82, variant: 'warning' },
      { label: 'Bandwidth', value: 47, variant: 'info' },
      { label: 'Seats', value: 95, variant: 'destructive' },
      { label: 'API calls', value: 61, variant: 'success' },
    ],
  },
  render: args => (
    <div className="w-[480px]">
      <Bar {...args} />
    </div>
  ),
}

export const SingleBarStyle: Story = {
  name: 'Single bar style',
  parameters: {
    docs: {
      description: {
        story:
          'Give one datum its own `variant` (or `color`) to make a single bar stand out from the rest. Here every bar uses the muted `neutral` variant except the peak month, which uses `primary`.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 300,
    showValues: true,
    showValueAxis: false,
    referenceLine: undefined,
    formatValue: v => String(v),
    data: [
      { label: 'Jan', value: 320, variant: 'neutral' },
      { label: 'Feb', value: 280, variant: 'neutral' },
      { label: 'Mar', value: 410, variant: 'neutral' },
      { label: 'Apr', value: 380, variant: 'neutral' },
      { label: 'May', value: 520, variant: 'primary' },
      { label: 'Jun', value: 470, variant: 'neutral' },
    ],
  },
  render: args => (
    <div className="w-[520px]">
      <Bar {...args} />
    </div>
  ),
}

export const NegativeValues: Story = {
  name: 'Negative values',
  parameters: {
    docs: {
      description: {
        story:
          'Bars render above and below the zero baseline automatically. Color each bar by sign with a per-datum `variant`; the corner radius flips to the correct end for negative bars.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 320,
    showValueAxis: true,
    showValues: false,
    referenceLine: undefined,
    formatValue: v => `${v > 0 ? '+' : ''}${v}%`,
    data: [
      { label: 'Jan', value: 12, variant: 'success' },
      { label: 'Feb', value: -8, variant: 'destructive' },
      { label: 'Mar', value: 5, variant: 'success' },
      { label: 'Apr', value: -14, variant: 'destructive' },
      { label: 'May', value: 9, variant: 'success' },
      { label: 'Jun', value: 18, variant: 'success' },
    ],
  },
  render: args => (
    <div className="w-[520px]">
      <Bar {...args} />
    </div>
  ),
}

const waterfallSteps = [
  { label: 'Open', delta: 3200 },
  { label: 'Sales', delta: 4800 },
  { label: 'Refunds', delta: -1500 },
  { label: 'Payroll', delta: -2600 },
  { label: 'Marketing', delta: -1100 },
  { label: 'Net', delta: 900 },
]

const waterfallCategories = waterfallSteps.map(s => s.label)
const waterfallChange = waterfallSteps.map(s => Math.abs(s.delta))
let waterfallRunning = 0
const waterfallBase = waterfallSteps.map(s => {
  const before = waterfallRunning
  waterfallRunning += s.delta
  return Math.min(before, waterfallRunning)
})

export const Waterfall: Story = {
  name: 'Waterfall',
  parameters: {
    docs: {
      description: {
        story:
          'A waterfall is a stacked chart with a transparent "base" series carrying the running offset and a visible "change" series on top. Mark the base series `silent` so it stays out of the tooltip, labels, and legend.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 340,
    stacked: true,
    showLegend: false,
    showValueAxis: true,
    showValues: false,
    barRadius: 4,
    referenceLine: undefined,
    data: undefined,
    formatValue: v => `$${(v / 1000).toFixed(1)}k`,
    categories: waterfallCategories,
    series: [
      { name: 'base', data: waterfallBase, color: 'transparent', silent: true },
      { name: 'Change', data: waterfallChange, variant: 'primary' },
    ],
  },
  render: args => (
    <div className="w-[560px]">
      <Bar {...args} />
    </div>
  ),
}

export const PercentStacked: Story = {
  name: '100% stacked',
  parameters: {
    docs: {
      description: {
        story:
          'A recreation of the ECharts "Stacked Bar Normalization" example. `stackMode="percent"` normalizes each category to 100% (stacking is implied), and `showValues` prints each segment’s share inside the bar — pass the raw values and a percent `formatValue`; the component does the normalization.',
      },
    },
  },
  args: {
    direction: 'horizontal',
    height: 380,
    stackMode: 'percent',
    showLegend: true,
    showValueAxis: false,
    showValues: true,
    referenceLine: undefined,
    data: undefined,
    formatValue: v => `${Math.round(v)}%`,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Direct', data: [100, 302, 301, 334, 390, 330, 320] },
      { name: 'Mail Ad', data: [320, 132, 101, 134, 90, 230, 210] },
      { name: 'Affiliate Ad', data: [220, 182, 191, 234, 290, 330, 310] },
      { name: 'Video Ad', data: [150, 212, 201, 154, 190, 330, 410] },
      { name: 'Search Engine', data: [820, 832, 901, 934, 1290, 1330, 1320] },
    ],
  },
  render: args => (
    <div className="w-[640px]">
      <Bar {...args} />
    </div>
  ),
}

const zoomData = Array.from({ length: 24 }, (_, i) => ({
  label: `2024-${String(i + 1).padStart(2, '0')}`,
  value: Math.round(120 + Math.sin(i / 2) * 60 + i * 4),
}))

export const Zoom: Story = {
  name: 'Zoom & rotated labels',
  parameters: {
    docs: {
      description: {
        story:
          'With many categories, set `zoom` for a dataZoom slider + scroll/drag zoom, and `axisLabelRotate` to keep long labels readable. `categoryAxisName`/`valueAxisName` add axis titles. Switch `zoom="value"` to zoom the value axis instead.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 340,
    zoom: 'category',
    axisLabelRotate: 45,
    showValueAxis: true,
    showValues: false,
    categoryAxisName: 'Month',
    valueAxisName: 'Units',
    referenceLine: undefined,
    formatValue: v => String(v),
    data: zoomData,
  },
  render: args => (
    <div className="w-[640px]">
      <Bar {...args} />
    </div>
  ),
}

export const BrushSelect: Story = {
  name: 'Brush select',
  parameters: {
    docs: {
      description: {
        story:
          'Set `selectable` to add a brush toolbox button (top-right). Activate it, then drag across the bars to select a band — the selected `{ indices, labels }` come back through `onBrushSelect` (see the Actions panel).',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 320,
    selectable: true,
    showValueAxis: true,
    showValues: false,
    referenceLine: undefined,
    formatValue: v => String(v),
    data: [
      { label: 'Jan', value: 320 },
      { label: 'Feb', value: 280 },
      { label: 'Mar', value: 410 },
      { label: 'Apr', value: 380 },
      { label: 'May', value: 520 },
      { label: 'Jun', value: 470 },
    ],
  },
  render: args => (
    <div className="w-[560px]">
      <Bar {...args} />
    </div>
  ),
}

export const RainfallVsEvaporation: Story = {
  name: 'Rainfall vs evaporation',
  parameters: {
    docs: {
      description: {
        story:
          'A recreation of the classic ECharts "Rainfall vs Evaporation" example with our `Bar`: two grouped series, `markPoints={["max", "min"]}` to pin each series’ extremes, and `referenceLine="average"` to draw each series’ own average line.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 380,
    showValueAxis: true,
    showValues: false,
    showLegend: true,
    markPoints: ['max', 'min'],
    referenceLine: 'average',
    formatValue: v => `${v}`,
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
    data: undefined,
    series: [
      {
        name: 'Rainfall',
        variant: 'info',
        data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3],
      },
      {
        name: 'Evaporation',
        variant: 'success',
        data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3],
      },
    ],
  },
  render: args => (
    <div className="w-[720px]">
      <Bar {...args} />
    </div>
  ),
}

const drilldownTree: BarDrilldownDatum[] = [
  {
    label: 'Americas',
    value: 2260,
    variant: 'info',
    children: [
      {
        label: 'USA',
        value: 1500,
        children: [
          { label: 'New York', value: 620 },
          { label: 'San Francisco', value: 480 },
          { label: 'Austin', value: 240 },
          { label: 'Chicago', value: 160 },
        ],
      },
      {
        label: 'Canada',
        value: 420,
        children: [
          { label: 'Toronto', value: 240 },
          { label: 'Vancouver', value: 180 },
        ],
      },
      {
        label: 'Brazil',
        value: 340,
        children: [
          { label: 'São Paulo', value: 210 },
          { label: 'Rio', value: 130 },
        ],
      },
    ],
  },
  {
    label: 'EMEA',
    value: 1830,
    variant: 'success',
    children: [
      {
        label: 'UK',
        value: 700,
        children: [
          { label: 'London', value: 520 },
          { label: 'Manchester', value: 180 },
        ],
      },
      {
        label: 'Germany',
        value: 560,
        children: [
          { label: 'Berlin', value: 300 },
          { label: 'Munich', value: 260 },
        ],
      },
      {
        label: 'France',
        value: 370,
        children: [{ label: 'Paris', value: 370 }],
      },
      { label: 'UAE', value: 200, children: [{ label: 'Dubai', value: 200 }] },
    ],
  },
  {
    label: 'APAC',
    value: 2010,
    variant: 'warning',
    children: [
      {
        label: 'China',
        value: 900,
        children: [
          { label: 'Shanghai', value: 520 },
          { label: 'Beijing', value: 380 },
        ],
      },
      {
        label: 'Japan',
        value: 620,
        children: [
          { label: 'Tokyo', value: 440 },
          { label: 'Osaka', value: 180 },
        ],
      },
      {
        label: 'India',
        value: 490,
        children: [
          { label: 'Mumbai', value: 300 },
          { label: 'Bengaluru', value: 190 },
        ],
      },
    ],
  },
  {
    label: 'Africa',
    value: 540,
    variant: 'destructive',
    children: [
      {
        label: 'Nigeria',
        value: 300,
        children: [{ label: 'Lagos', value: 300 }],
      },
      {
        label: 'South Africa',
        value: 240,
        children: [
          { label: 'Cape Town', value: 140 },
          { label: 'Johannesburg', value: 100 },
        ],
      },
    ],
  },
]

export const Drilldown: Story = {
  name: 'Drilldown (multi-level)',
  parameters: {
    docs: {
      description: {
        story:
          'Click a bar to drill into its children, and use the breadcrumb to jump back up — regions → countries → cities. Powered by the `useBarDrilldown` helper feeding `data` + `onBarClick`; the chart itself stays declarative. Leaf bars (no children) simply do nothing.',
      },
    },
  },
  render: () => {
    const { data, path, depth, onBarClick, drillTo } =
      useBarDrilldown(drilldownTree)
    return (
      <div className="w-[640px]">
        <div className="mb-3 flex items-center gap-2 text-body-sm">
          {path.map((label, i) => {
            const isCurrent = i === path.length - 1
            return (
              <span key={`${label}-${i}`} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-ds-subtlest">
                    /
                  </span>
                )}
                {isCurrent ? (
                  <span className="font-medium text-ds-default">{label}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => drillTo(i)}
                    className="cursor-pointer text-ds-subtle hover:text-ds-default"
                  >
                    {label}
                  </button>
                )}
              </span>
            )
          })}
          {depth === 0 && (
            <span className="text-ds-subtlest">— click a bar to drill in</span>
          )}
        </div>
        <Bar
          data={data}
          direction="vertical"
          showValueAxis
          formatValue={v => `$${v}`}
          height={320}
          onBarClick={onBarClick}
        />
      </div>
    )
  },
}

const compact = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
      ? `${(v / 1_000).toFixed(1)}k`
      : String(v)

export const AxisBreaks: Story = {
  name: 'Axis breaks',
  parameters: {
    docs: {
      description: {
        story:
          'When some series dwarf the rest, `axisBreaks` collapses ranges of the value axis with a zig-zag break so small and large series stay readable together. Each break is `{ start, end, gap? }` and you can pass several. With `axisBreakExpandable` (on by default), **clicking a break area expands that range** to inspect it, and a **“Collapse breaks” button** appears to restore the view — exactly like the official ECharts demo.',
      },
    },
  },
  args: {
    direction: 'vertical',
    height: 380,
    showValueAxis: true,
    showValues: false,
    showLegend: true,
    tooltipTrigger: 'axis',
    referenceLine: undefined,
    axisBreaks: [
      { start: 5000, end: 100000, gap: '1.5%' },
      { start: 105000, end: 3100000, gap: '1.5%' },
    ],
    axisBreakExpandable: true,
    formatValue: compact,
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { name: 'Data A', data: [1500, 2032, 2001, 3154, 2190, 4330, 2410] },
      { name: 'Data B', data: [1200, 1320, 1010, 1340, 900, 2300, 2100] },
      {
        name: 'Data C',
        data: [103200, 100320, 103010, 102340, 103900, 103300, 103200],
      },
      {
        name: 'Data D',
        data: [3106212, 3102118, 3102643, 3104631, 3106679, 3100130, 3107022],
      },
    ],
  },
  render: args => (
    <div className="w-[640px]">
      <Bar {...args} />
    </div>
  ),
}
