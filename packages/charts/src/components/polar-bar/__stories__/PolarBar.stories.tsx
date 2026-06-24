import type { Meta, StoryObj } from '@storybook/nextjs'
import { PolarBar } from '../PolarBar'

const meta: Meta<typeof PolarBar> = {
  title: 'Charts/PolarBar',
  component: PolarBar,
  tags: ['dev', 'status:new'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A bar chart on a polar coordinate system. `angular` bars sweep around the circle (category = angle, value = radius); `radial` bars are concentric rings (category = radius, value = angle). Best for cyclical data (hours, weekdays, compass) where the round layout is meaningful. Shares the `useEChart` runtime and `@clera/tokens` colors with the other charts.',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description:
        'Single-series data: `{ label, value, variant?, color? }[]`. Use `categories` + `series` for grouped/stacked instead.',
      table: { type: { summary: 'PolarBarDatum[]' } },
    },
    categories: {
      control: 'object',
      description: 'Category labels for grouped mode (pair with `series`).',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '-' } },
    },
    series: {
      control: 'object',
      description:
        'Grouped series `{ name, data, variant?, color? }[]`, aligned to `categories`. Combine with `stacked` for stacked polar bars.',
      table: {
        type: { summary: 'PolarBarSeries[]' },
        defaultValue: { summary: '-' },
      },
    },
    orientation: {
      control: { type: 'radio' },
      options: ['angular', 'radial'],
      description:
        '`angular`: bars sweep around the circle. `radial`: bars are concentric rings.',
      table: {
        type: { summary: "'angular' | 'radial'" },
        defaultValue: { summary: 'angular' },
      },
    },
    stacked: {
      control: 'boolean',
      description: 'Stack grouped series on top of each other.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    highlightSeries: {
      control: 'boolean',
      description:
        'Grouped mode only. When `true`, hovering any segment highlights its entire series (every same-colored segment around the circle) and dims the others. When `false` (default), only the hovered segment lightens.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    palette: {
      control: { type: 'radio' },
      options: ['brand', 'categorical'],
      description:
        'Coloring for single-series bars without a `variant`. `categorical` cycles the design-system colors (nice for distinct slices).',
      table: {
        type: { summary: "'brand' | 'categorical'" },
        defaultValue: { summary: 'brand' },
      },
    },
    roundCap: {
      control: 'boolean',
      description: 'Round the ends of the bars.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    barRadius: {
      control: 'number',
      description: 'Corner radius for the bar sectors.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    startAngle: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Starting angle (degrees) of the angle axis.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '90' } },
    },
    max: {
      control: 'number',
      description: 'Force the value-axis maximum.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    min: {
      control: 'number',
      description: 'Force the value-axis minimum.',
      table: { type: { summary: 'number' }, defaultValue: { summary: 'auto' } },
    },
    showValues: {
      control: 'boolean',
      description: 'Show value labels inside the bars.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show a tooltip for the hovered bar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showLegend: {
      control: 'boolean',
      description: 'Show the legend (grouped mode only).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true (grouped)' },
      },
    },
    legendPosition: {
      control: { type: 'radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Legend placement.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: 'top' },
      },
    },
    height: {
      control: 'number',
      description: 'Chart height in px or any CSS length.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '360' },
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
      description: 'Grow-in animation; auto-disabled under reduced-motion.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    onReady: {
      action: 'ready',
      description: 'Called once with the ECharts instance (escape hatch).',
      table: { type: { summary: '(chart: ECharts) => void' } },
    },
    onBarClick: {
      action: 'bar:click',
      description: 'Called with `(datum, index)` when a bar is clicked.',
      table: {
        type: { summary: '(datum: PolarBarDatum, index: number) => void' },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof PolarBar>

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const Angular: Story = {
  name: 'Bar on polar',
  parameters: {
    docs: {
      description: {
        story:
          'Single-series bars sweeping around the circle — here, commits per weekday. `palette="categorical"` gives each slice its own color.',
      },
    },
  },
  args: {
    height: 380,
    orientation: 'angular',
    palette: 'categorical',
    showValues: true,
    data: weekdays.map((label, i) => ({
      label,
      value: [42, 58, 51, 64, 70, 22, 18][i],
    })),
  },
  render: args => (
    <div className="w-[440px]">
      <PolarBar {...args} />
    </div>
  ),
}

export const Stacked: Story = {
  name: 'Stacked on polar',
  parameters: {
    docs: {
      description: {
        story:
          'Grouped series stacked around the circle. Each ring segment is a series; the legend toggles them. With `highlightSeries`, hovering one segment lights up its whole series around the circle and dims the rest.',
      },
    },
  },
  args: {
    height: 420,
    orientation: 'angular',
    stacked: true,
    highlightSeries: true,
    showLegend: true,
    categories: weekdays,
    series: [
      { name: 'Direct', data: [20, 28, 24, 30, 34, 10, 8], variant: 'primary' },
      { name: 'Search', data: [14, 18, 16, 20, 22, 8, 6], variant: 'info' },
      { name: 'Social', data: [8, 12, 11, 14, 14, 4, 4], variant: 'success' },
    ],
  },
  render: args => (
    <div className="w-[460px]">
      <PolarBar {...args} />
    </div>
  ),
}

export const Radial: Story = {
  name: 'Radial (concentric)',
  parameters: {
    docs: {
      description: {
        story:
          'Set `orientation="radial"` for concentric rings — category on the radius axis, value sweeping around. Reads like a set of progress rings.',
      },
    },
  },
  args: {
    height: 400,
    orientation: 'radial',
    palette: 'categorical',
    max: 100,
    showValues: true,
    formatValue: v => `${v}%`,
    data: [
      { label: 'Storage', value: 82 },
      { label: 'Bandwidth', value: 47 },
      { label: 'Seats', value: 95 },
      { label: 'API', value: 61 },
    ],
  },
  render: args => (
    <div className="w-[460px]">
      <PolarBar {...args} />
    </div>
  ),
}
