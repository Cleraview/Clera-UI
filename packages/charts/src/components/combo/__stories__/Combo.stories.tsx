import type { Meta, StoryObj } from '@storybook/nextjs'
import { Combo } from '../Combo'

const meta: Meta<typeof Combo> = {
  title: 'Charts/Combo',
  component: Combo,
  tags: ['dev', 'status:new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A cartesian chart that mixes `bar`, `line`, and `area` series on a shared category axis, with an optional second (right) value axis for a different unit/scale. Colors, axes, legend, and tooltip resolve from `@clera/tokens` and adapt to light/dark mode. Built on the same `useEChart` runtime as `Bar`.',
      },
    },
  },
  argTypes: {
    categories: {
      control: 'object',
      description: 'Shared category labels for the x-axis.',
      table: { type: { summary: 'string[]' } },
    },
    series: {
      control: 'object',
      description:
        'Mixed series, each `{ name, type, data, axis?, variant?, color?, smooth?, stack? }`. `type` is `bar`, `line`, or `area`; `axis` (`left`|`right`) selects the value axis.',
      table: { type: { summary: 'ComboSeries[]' } },
    },
    showValues: {
      control: 'boolean',
      description: 'Show value labels on each point/bar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show the shared axis tooltip listing every series.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showLegend: {
      control: 'boolean',
      description: 'Show the legend (one entry per series).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
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
    gridLines: {
      control: 'boolean',
      description: 'Show dashed grid lines from the left value axis.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    barRadius: {
      control: 'number',
      description: 'Corner radius for bar series.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    axisLabelRotate: {
      control: { type: 'range', min: -90, max: 90, step: 15 },
      description: 'Rotate the category-axis labels.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    categoryAxisName: {
      control: 'text',
      description: 'Axis title for the category axis.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    leftAxis: {
      control: 'object',
      description:
        'Left value axis config: `{ name?, min?, max?, format? }`. `format` is applied to its ticks and tooltip rows.',
      table: {
        type: { summary: 'ComboAxisConfig' },
        defaultValue: { summary: '-' },
      },
    },
    rightAxis: {
      control: 'object',
      description: 'Right value axis config (same shape as `leftAxis`).',
      table: {
        type: { summary: 'ComboAxisConfig' },
        defaultValue: { summary: '-' },
      },
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
        'Play the grow-in animation. Auto-disabled under reduced-motion.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
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
    onReady: {
      action: 'ready',
      description: 'Called once with the ECharts instance (escape hatch).',
      table: { type: { summary: '(chart: ECharts) => void' } },
    },
  },
}

export default meta

type Story = StoryObj<typeof Combo>

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

export const LineAndBar: Story = {
  name: 'Mixed line + bar',
  parameters: {
    docs: {
      description: {
        story:
          'Revenue as bars on the left axis and orders as a line on the right axis — two units, one chart. Each axis formats its own values (currency vs. count) in both the ticks and the shared tooltip.',
      },
    },
  },
  args: {
    height: 340,
    categories: months,
    leftAxis: { name: 'Revenue', format: v => `$${(v / 1000).toFixed(0)}k` },
    rightAxis: { name: 'Orders', format: v => `${v}` },
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        data: [42000, 38500, 51200, 47800, 63400, 72100],
        variant: 'primary',
      },
      {
        name: 'Orders',
        type: 'line',
        axis: 'right',
        smooth: true,
        data: [320, 290, 410, 380, 520, 610],
        variant: 'warning',
      },
    ],
  },
  render: args => (
    <div className="w-[600px]">
      <Combo {...args} />
    </div>
  ),
}

export const Rainfall: Story = {
  name: 'Rainfall & evaporation',
  parameters: {
    docs: {
      description: {
        story:
          'The classic weather combo: rainfall and evaporation as bars (mm, left axis) with temperature as a line (°C, right axis). Two bar series share the left scale while the line tracks a separate unit on the right.',
      },
    },
  },
  args: {
    height: 360,
    categories: months,
    leftAxis: { name: 'mm', format: v => `${v}` },
    rightAxis: { name: '°C', format: v => `${v}°` },
    series: [
      {
        name: 'Rainfall',
        type: 'bar',
        data: [26, 59, 90, 264, 287, 707],
        variant: 'info',
      },
      {
        name: 'Evaporation',
        type: 'bar',
        data: [20, 41, 78, 110, 142, 251],
        variant: 'success',
      },
      {
        name: 'Temperature',
        type: 'line',
        axis: 'right',
        smooth: true,
        data: [6, 9, 14, 21, 25, 28],
        variant: 'destructive',
      },
    ],
  },
  render: args => (
    <div className="w-[620px]">
      <Combo {...args} />
    </div>
  ),
}

export const AreaAndBar: Story = {
  name: 'Area + bar',
  parameters: {
    docs: {
      description: {
        story:
          'An `area` series (a line with a translucent fill) layered with a bar series on a single axis — handy for showing a cumulative trend against discrete values.',
      },
    },
  },
  args: {
    height: 320,
    categories: months,
    leftAxis: { name: 'Users' },
    series: [
      {
        name: 'New',
        type: 'bar',
        data: [120, 160, 140, 210, 260, 300],
        variant: 'primary',
      },
      {
        name: 'Active',
        type: 'area',
        smooth: true,
        data: [400, 520, 610, 760, 980, 1180],
        variant: 'info',
      },
    ],
  },
  render: args => (
    <div className="w-[600px]">
      <Combo {...args} />
    </div>
  ),
}
