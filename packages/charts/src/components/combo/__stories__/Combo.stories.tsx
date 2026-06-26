import { useEffect, useRef, useState } from 'react'
import type { ECharts } from 'echarts/core'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { Combo } from '../Combo'

const meta: Meta<typeof Combo> = {
  title: 'Charts/Combo',
  component: Combo,
  tags: ['dev', 'status:new'],
  parameters: {
    layout: 'padded',
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
        'Mixed series, each `{ name, type, data, axis?, variant?, color?, smooth?, stack? }`. `type` is `bar`, `line`, or `area`; `axis` is `left`|`right`, or a number to target an entry in `valueAxes` (multiple Y axes).',
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
    highlightSeries: {
      control: 'boolean',
      description:
        'On hover, focus the whole hovered series and dim the others. Off by default, where hovering a series highlights it without fading the rest.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    valueAxes: {
      control: 'object',
      description:
        'For three or more value axes. Each is `{ name?, position?: left|right, offset?, min?, max?, format?, color? }`; series target one by index via `axis: <n>`. `offset` (px) stacks extra axes on the same side, and each axis auto-colors to match its series unless you set `color`. Overrides `leftAxis`/`rightAxis` when present.',
      table: {
        type: { summary: 'ComboValueAxis[]' },
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

const WINDOW = 10
const clockLabel = (d: Date) =>
  d.toLocaleTimeString(undefined, { hour12: false })
const randomPrice = () => +(Math.random() * 10 + 5).toFixed(1)
const randomOrders = () => Math.round(Math.random() * 1000)

function DynamicComboDemo() {
  const chartRef = useRef<ECharts | null>(null)
  const [seed] = useState(() => {
    const categories: string[] = []
    let now = Date.now()
    for (let i = 0; i < WINDOW; i++) {
      categories.unshift(clockLabel(new Date(now)))
      now -= 2000
    }
    return {
      categories,
      price: Array.from({ length: WINDOW }, randomPrice),
      orders: Array.from({ length: WINDOW }, randomOrders),
    }
  })

  useEffect(() => {
    const live = {
      categories: [...seed.categories],
      price: [...seed.price],
      orders: [...seed.orders],
    }
    const id = setInterval(() => {
      live.categories = [...live.categories.slice(1), clockLabel(new Date())]
      live.price = [...live.price.slice(1), randomPrice()]
      live.orders = [...live.orders.slice(1), randomOrders()]
      chartRef.current?.setOption({
        xAxis: { data: live.categories },
        series: [{ data: live.orders }, { data: live.price }],
      })
    }, 2100)
    return () => clearInterval(id)
  }, [seed])

  return (
    <div className="w-[640px]">
      <Combo
        height={360}
        categories={seed.categories}
        leftAxis={{ name: 'Price', min: 0, max: 30 }}
        rightAxis={{ name: 'Orders', min: 0, max: 1200 }}
        series={[
          {
            name: 'Dynamic Bar',
            type: 'bar',
            axis: 'right',
            data: seed.orders,
            variant: 'primary',
          },
          {
            name: 'Dynamic Line',
            type: 'line',
            data: seed.price,
            variant: 'warning',
          },
        ]}
        onReady={chart => {
          chartRef.current = chart
        }}
      />
    </div>
  )
}

export const DynamicData: Story = {
  name: 'Dynamic data',
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'Streaming data: a bar (orders, right axis) and a line (price, left axis) where a new reading arrives every ~2s and the oldest drops off. Grab the chart with `onReady` and push just the changed `xAxis.data` / `series.data` on an interval — ECharts merges and animates each bar and point to its new slot, so the whole series slides smoothly to the left.',
      },
    },
  },
  render: () => <DynamicComboDemo />,
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

export const MultipleYAxes: Story = {
  name: 'Multiple Y axes',
  parameters: {
    docs: {
      description: {
        story:
          'Three value axes in one chart via `valueAxes`. Evaporation and Precipitation each get their own right-hand axis (the second pushed out with `offset`), while Temperature keeps the left axis. Series point at an axis by index with `axis: <n>`, and each axis takes on its series’ color. `highlightSeries` focuses the hovered series and dims the others.',
      },
    },
  },
  args: {
    height: 380,
    highlightSeries: true,
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
    valueAxes: [
      { name: 'Evaporation', position: 'right', format: v => `${v} ml` },
      {
        name: 'Precipitation',
        position: 'right',
        offset: 80,
        format: v => `${v} ml`,
      },
      { name: 'Temperature', position: 'left', format: v => `${v} °C` },
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        axis: 0,
        variant: 'info',
        data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3],
      },
      {
        name: 'Precipitation',
        type: 'bar',
        axis: 1,
        variant: 'success',
        data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3],
      },
      {
        name: 'Temperature',
        type: 'line',
        axis: 2,
        variant: 'destructive',
        smooth: true,
        data: [2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23, 16.5, 12, 6.2],
      },
    ],
  },
  render: args => (
    <div className="w-[720px]">
      <Combo {...args} />
    </div>
  ),
}
