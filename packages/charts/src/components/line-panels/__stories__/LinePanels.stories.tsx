import type { Meta, StoryObj, Decorator } from '@storybook/nextjs'
import { LinePanels } from '../LinePanels'
import type { LinePanel, LinePoint } from '../types'

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

const meta: Meta<typeof LinePanels> = {
  title: 'Charts/Line Panels',
  component: LinePanels,
  tags: [],
  decorators: [centerStory],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Two or more line charts stacked as synced panels on a shared x-axis — each panel is its own grid and value axis, with a linked crosshair, one dataZoom spanning all panels, and optional per-panel inverted axes. Colors resolve from `@clera/tokens` and it rides the same `useEChart` runtime as the other charts. Great for correlating series on different scales (rainfall vs. flow, CPU vs. memory vs. network).',
      },
    },
  },
  argTypes: {
    panels: {
      control: 'object',
      description:
        'The stacked panels, top to bottom. Each is `{ label?, series, inverse?, min?, max?, formatValue? }`.',
      table: { type: { summary: 'LinePanel[]' } },
    },
    categories: {
      control: 'object',
      description: 'Shared x-axis labels for `xAxisType="category"`.',
      table: { type: { summary: '(string | number)[]' } },
    },
    xAxisType: {
      control: { type: 'radio' },
      options: ['category', 'time'],
      description:
        'Category labels, or a real time axis (pass `[x, y]` pairs).',
      table: {
        type: { summary: "'category' | 'time'" },
        defaultValue: { summary: 'category' },
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
    curve: {
      control: { type: 'radio' },
      options: ['straight', 'smooth', 'stepped'],
      description: 'Default line shape for every panel.',
      table: {
        type: { summary: "'straight' | 'smooth' | 'stepped'" },
        defaultValue: { summary: 'straight' },
      },
    },
    zoom: {
      control: 'boolean',
      description: 'A single dataZoom that scrubs every panel together.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    zoomSlider: {
      control: 'boolean',
      description: 'Show the draggable slider; `false` keeps inside-only zoom.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    xAxisPerPanel: {
      control: 'boolean',
      description:
        'Show the x-axis labels on every panel, not just the bottom.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    axisPointerLabel: {
      control: 'boolean',
      description:
        'Show the sticky value tag on the x-axis under the hover crosshair.',
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
        defaultValue: { summary: '420' },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof LinePanels>

function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const DAY = 24 * 60 * 60 * 1000
const HYDRO_START = new Date('2009-06-12T00:00:00Z').getTime()
const HYDRO_DAYS = 30

function buildHydro(): { flow: LinePoint[]; rain: LinePoint[] } {
  const rnd = lcg(612)
  const flow: LinePoint[] = []
  const rain: LinePoint[] = []
  let f = 180
  for (let i = 0; i < HYDRO_DAYS; i++) {
    const t = HYDRO_START + i * DAY
    f += (rnd() - 0.5) * 40 + Math.sin(i / 5) * 12
    f = Math.max(20, Math.min(480, f))
    flow.push([t, Math.round(f)])
    const storm = rnd() > 0.7 ? rnd() * 60 : 0
    rain.push([t, Math.round(storm + rnd() * 4)])
  }
  return { flow, rain }
}
const hydro = buildHydro()

const hourLabel = (v: string | number) =>
  new Date(v).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

export const RainfallVsEvaporation: Story = {
  name: 'Rainfall vs evaporation',
  args: {
    height: 460,
    xAxisType: 'time',
    curve: 'straight',
    area: 'gradient',
    zoom: true,
    xAxisPerPanel: true,
    axisPointerLabel: false,
    formatX: hourLabel,
    panels: [
      {
        label: 'Flow (m³/s)',
        max: 500,
        series: [
          { name: 'Flow', variant: 'info', showSymbol: true, data: hydro.flow },
        ],
      },
      {
        label: 'Rainfall (mm)',
        inverse: true,
        min: 0,
        series: [{ name: 'Rainfall', variant: 'primary', data: hydro.rain }],
      },
    ],
  },
  render: args => <LinePanels {...args} />,
}

const MIN = 60 * 1000
const MON_START = new Date('2024-03-14T13:00:00Z').getTime()

function buildMetric(seed: number, base: number, spread: number): LinePoint[] {
  const rnd = lcg(seed)
  const out: LinePoint[] = []
  let v = base
  for (let i = 0; i < 60; i++) {
    v += (rnd() - 0.5) * spread
    out.push([MON_START + i * MIN, Math.max(0, Math.round(v))])
  }
  return out
}

const clock = (v: string | number) =>
  new Date(v).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

export const ServerMetrics: Story = {
  name: 'Server metrics',
  args: {
    height: 480,
    xAxisType: 'time',
    curve: 'smooth',
    area: true,
    zoom: true,
    formatX: clock,
    panels: [
      {
        label: 'CPU %',
        min: 0,
        max: 100,
        formatValue: (v: number) => `${v}%`,
        series: [
          { name: 'CPU', variant: 'warning', data: buildMetric(1, 42, 8) },
        ],
      },
      {
        label: 'Memory %',
        min: 0,
        max: 100,
        formatValue: (v: number) => `${v}%`,
        series: [
          { name: 'Memory', variant: 'info', data: buildMetric(2, 61, 5) },
        ],
      },
      {
        label: 'Network (MB/s)',
        min: 0,
        formatValue: (v: number) => `${v}`,
        series: [
          {
            name: 'Network',
            variant: 'success',
            data: buildMetric(3, 120, 40),
          },
        ],
      },
    ] as LinePanel[],
  },
  render: args => <LinePanels {...args} />,
}
