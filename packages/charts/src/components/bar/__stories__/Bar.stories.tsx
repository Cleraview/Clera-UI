import type { Meta, StoryObj } from '@storybook/nextjs'
import { Bar } from '../Bar'

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
    categories: {
      control: 'object',
      description:
        'Shared category labels for grouped mode. Pair with `series` to render grouped bars with a legend.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '-' } },
    },
    series: {
      control: 'object',
      description:
        'Grouped series, each `{ name, data, variant? }`, where `data` aligns to `categories`. Renders a legend keyed by series name.',
      table: {
        type: { summary: 'BarSeries[]' },
        defaultValue: { summary: '-' },
      },
    },
    referenceLine: {
      control: 'object',
      description:
        'Draw a dashed reference line across the value axis, e.g. a target or average. Shape is `{ value, label? }`.',
      table: {
        type: { summary: '{ value: number; label?: string }' },
        defaultValue: { summary: 'undefined' },
      },
    },
    max: {
      control: 'number',
      description:
        'Force the value-axis maximum. When omitted, the axis auto-scales with headroom so the tallest bar and its label are never clipped.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
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
    formatValue: v => `$${(v / 1000).toFixed(1)}k`,
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

export const Ecommerce: Story = {
  name: 'E-commerce revenue',
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
