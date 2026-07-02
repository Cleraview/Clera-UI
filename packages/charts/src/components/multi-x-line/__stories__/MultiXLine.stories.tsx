import type { Meta, StoryObj, Decorator } from '@storybook/nextjs'
import { MultiXLine } from '../MultiXLine'

const centerStory: Decorator = (Story, { viewMode }) => {
  if (viewMode === 'docs') {
    return (
      <div className="mx-auto w-full max-w-[820px]">
        <Story />
      </div>
    )
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-[820px]">
        <Story />
      </div>
    </div>
  )
}

const meta: Meta<typeof MultiXLine> = {
  title: 'Charts/Multi-X Line',
  component: MultiXLine,
  tags: [],
  decorators: [centerStory],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Overlays series that have *different* x categories on one shared value axis, each with its own x-axis (bottom, then top). Ideal for period-over-period comparisons — e.g. this year vs. last year — where the months line up index-by-index but belong to different scales. Each axis is colored to match its series, and a cross crosshair reads out both at once. Colors resolve from `@clera/tokens` and it rides the same `useEChart` runtime as the other charts.',
      },
    },
  },
  argTypes: {
    axes: {
      control: 'object',
      description:
        'The x-axes to overlay, each `{ categories, name?, color?, series }`. The first sits on the bottom, the second on top.',
      table: { type: { summary: 'MultiXAxis[]' } },
    },
    curve: {
      control: { type: 'radio' },
      options: ['straight', 'smooth', 'stepped'],
      description: 'Line shape for every series.',
      table: {
        type: { summary: "'straight' | 'smooth' | 'stepped'" },
        defaultValue: { summary: 'smooth' },
      },
    },
    area: {
      control: { type: 'select' },
      options: [false, true, 'gradient'],
      description: 'Default fill under each line; override per series.',
      table: {
        type: { summary: "boolean | 'gradient'" },
        defaultValue: { summary: 'false' },
      },
    },
    showLegend: {
      control: 'boolean',
      description: 'Show the legend.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    valueAxisName: {
      control: 'text',
      description: 'Axis title for the shared value axis.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show the hover crosshair with the per-axis readout.',
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
        defaultValue: { summary: '360' },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof MultiXLine>

const months = (year: number) =>
  Array.from({ length: 12 }, (_, i) => `${year}-${i + 1}`)

export const Precipitation: Story = {
  name: 'Precipitation year over year',
  args: {
    height: 380,
    curve: 'smooth',
    valueAxisName: 'Precipitation (mm)',
    axes: [
      {
        name: '2016',
        categories: months(2016),
        series: [
          {
            name: 'Precipitation (2016)',
            variant: 'info',
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3,
              0.7,
            ],
          },
        ],
      },
      {
        name: '2015',
        categories: months(2015),
        series: [
          {
            name: 'Precipitation (2015)',
            variant: 'destructive',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
        ],
      },
    ],
  },
  render: args => <MultiXLine {...args} />,
}

export const WithArea: Story = {
  name: 'With gradient fill',
  args: {
    height: 380,
    curve: 'smooth',
    area: 'gradient',
    valueAxisName: 'Precipitation (mm)',
    axes: [
      {
        name: '2016',
        categories: months(2016),
        series: [
          {
            name: 'Precipitation (2016)',
            variant: 'info',
            data: [
              3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3,
              0.7,
            ],
          },
        ],
      },
      {
        name: '2015',
        categories: months(2015),
        series: [
          {
            name: 'Precipitation (2015)',
            variant: 'destructive',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0,
              2.3,
            ],
          },
        ],
      },
    ],
  },
  render: args => <MultiXLine {...args} />,
}
