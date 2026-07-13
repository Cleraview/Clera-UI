import type { Meta, StoryObj } from '@storybook/nextjs'
import { Radar } from '../Radar'
import {
  skillIndicators,
  vehicleSeries,
  budgetIndicators,
  budgetSeries,
} from './fixtures'

const meta: Meta<typeof Radar> = {
  title: 'Charts/Radar',
  component: Radar,
  tags: [],
  parameters: {
    layout: 'fullscreen',
    chartLayout: { maxWidth: 720, padding: 4 },
    docs: {
      description: {
        component:
          'A radar (spider) chart for comparing several series across the same set of axes. Shares the `useEChart` runtime, `@clera/tokens` colors, and the legend/hover/loading behavior of the other charts.',
      },
    },
  },
  argTypes: {
    indicators: {
      control: 'object',
      description:
        'The axes of the web: `{ name, max?, min? }[]`. Each series supplies one value per indicator, in the same order.',
      table: { type: { summary: 'RadarIndicator[]' } },
    },
    series: {
      control: 'object',
      description:
        'One or more series: `{ name, data, variant?, color?, area? }[]`, where `data` is one number per indicator.',
      table: { type: { summary: 'RadarSeries[]' } },
    },
    palette: {
      control: { type: 'radio' },
      options: ['brand', 'categorical'],
      description:
        'Coloring for series without a `variant`. `categorical` cycles the design-system colors.',
      table: {
        type: { summary: "'brand' | 'categorical'" },
        defaultValue: { summary: 'categorical' },
      },
    },
    shape: {
      control: { type: 'radio' },
      options: ['polygon', 'circle'],
      description: 'The outline of the web.',
      table: {
        type: { summary: "'polygon' | 'circle'" },
        defaultValue: { summary: 'polygon' },
      },
    },
    max: {
      control: 'number',
      description:
        "Scale applied to every indicator that doesn't set its own `max`.",
      table: { type: { summary: 'number' }, defaultValue: { summary: '-' } },
    },
    radius: {
      control: 'text',
      description: "Size of the web, e.g. `'65%'` or a px number.",
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: "'65%'" },
      },
    },
    area: {
      control: 'boolean',
      description:
        'Fill every polygon. Override per series with `series[].area`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    lineWidth: {
      control: 'number',
      description: 'Outline width of each web.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '2' } },
    },
    showSymbol: {
      control: 'boolean',
      description: 'Show a marker at each vertex.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    symbolSize: {
      control: 'number',
      description: 'Marker size (px).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    gridLines: {
      control: 'boolean',
      description: "Show the web's rings and spokes.",
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    splitArea: {
      control: 'boolean',
      description: 'Shade alternate rings for readability.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description:
        'Show a tooltip listing every indicator for the hovered web.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    highlightOnHover: {
      control: 'boolean',
      description:
        'When `true`, hovering a web highlights it and dims the rest.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
      description: 'Legend placement.',
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
      description: 'Marker shape for each legend entry.',
      table: {
        type: { summary: 'LegendIcon' },
        defaultValue: { summary: 'roundRect' },
      },
    },
    legendAlign: {
      control: { type: 'radio' },
      options: ['start', 'center', 'end'],
      description: 'Where along its edge the legend sits.',
      table: {
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: 'center' },
      },
    },
    legendStyle: {
      control: false,
      description: 'Fine-grained legend styling.',
      table: { type: { summary: 'LegendStyleOverrides' } },
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
    loadingVariant: {
      control: { type: 'radio' },
      options: ['spinner', 'dots', 'bars', 'pulse'],
      description: 'Spinner style for the loading overlay.',
      table: {
        type: { summary: "'spinner' | 'dots' | 'bars' | 'pulse'" },
        defaultValue: { summary: 'spinner' },
      },
    },
    loadingSize: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size for the loading overlay.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
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
    onSeriesClick: {
      action: 'series:click',
      description: 'Called with the clicked web.',
      table: { type: { summary: '(payload: RadarSeriesClick) => void' } },
    },
  },
  args: {
    animate: true,
  },
}

export default meta

type Story = StoryObj<typeof Radar>

export const Basic: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'Two vehicles scored across the same six attributes. Each series supplies one value per indicator.',
      },
    },
  },
  args: {
    height: 420,
    indicators: skillIndicators,
    series: vehicleSeries,
  },
}

export const Filled: Story = {
  name: 'Filled',
  parameters: {
    docs: {
      description: {
        story:
          'Set `area` to fill each web. `highlightOnHover` brings the hovered one forward and dims the rest, which keeps overlapping fills readable.',
      },
    },
  },
  args: {
    height: 420,
    area: true,
    highlightOnHover: true,
    title: 'Budget vs. spending',
    subtitle: 'Allocated against actual, by department',
    legendPosition: 'bottom',
    indicators: budgetIndicators,
    series: budgetSeries,
    formatValue: v => `$${v.toLocaleString()}`,
  },
}

export const CircleShape: Story = {
  name: 'Circle shape',
  parameters: {
    docs: {
      description: {
        story:
          'Set `shape="circle"` for a round web instead of the straight-edged polygon. `max` scales every indicator that doesn\'t set its own.',
      },
    },
  },
  args: {
    height: 420,
    shape: 'circle',
    max: 100,
    area: true,
    indicators: skillIndicators.map(i => ({ name: i.name })),
    series: vehicleSeries,
  },
}

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    docs: {
      description: {
        story:
          'The same themed loading overlay as every other chart — pick the spinner with `loadingVariant` and its size with `loadingSize`.',
      },
    },
  },
  args: {
    height: 420,
    loading: true,
    loadingVariant: 'bars',
    indicators: skillIndicators,
    series: vehicleSeries,
  },
}
