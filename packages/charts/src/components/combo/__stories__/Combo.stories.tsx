import { useEffect, useRef, useState } from 'react'
import type { ECharts } from 'echarts/core'
import type { Meta, StoryObj, Decorator } from '@storybook/nextjs'
import { Combo } from '../Combo'

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

const meta: Meta<typeof Combo> = {
  title: 'Charts/Combo',
  component: Combo,
  tags: [],
  decorators: [centerStory],
  parameters: {
    layout: 'fullscreen',
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
        'Mixed series, each `{ name, type, data, yAxis?, variant?, color?, smooth?, stack? }`. `type` is `bar`, `line`, or `area`; `yAxis` binds to an axis in `yAxes` by `id` or index (or the shorthand `left`/`right`).',
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
    gridLines: {
      control: 'boolean',
      description: 'Show dashed grid lines from the left value axis.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    highlightOnHover: {
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
    yAxes: {
      control: 'object',
      description:
        'The y-axes — one or more, each `{ id?, name?, side?, min?, max?, inverse?, position?, orientation?, format?, color? }`. `name` is the axis title; `position` (top/middle/bottom) and `orientation` place it. Bind series with `series[].yAxis` (id or index). With two+ axes each gets its series’ color and stacks outward automatically.',
      table: {
        type: { summary: 'ComboYAxis[]' },
        defaultValue: { summary: '-' },
      },
    },
    xAxis: {
      control: 'object',
      description:
        'The x-axis — `{ name?, position?, orientation? }`. `name` is its title; `position` is `left`/`middle`/`right` (default `right`).',
      table: {
        type: { summary: 'ComboXAxis' },
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
    yAxes: [
      { name: 'Revenue', format: v => `$${(v / 1000).toFixed(0)}k` },
      { name: 'Orders', side: 'right', format: v => `${v}` },
    ],
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
        yAxis: 'right',
        smooth: true,
        data: [320, 290, 410, 380, 520, 610],
        variant: 'warning',
      },
    ],
  },
  render: args => (
    <div className="w-full">
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
    yAxes: [
      { name: 'mm', format: v => `${v}` },
      { name: '°C', side: 'right', format: v => `${v}°` },
    ],
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
        yAxis: 'right',
        smooth: true,
        data: [6, 9, 14, 21, 25, 28],
        variant: 'destructive',
      },
    ],
  },
  render: args => (
    <div className="w-full">
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
    <div className="w-full">
      <Combo
        height={360}
        categories={seed.categories}
        yAxes={[
          { name: 'Price', min: 0, max: 30 },
          { name: 'Orders', side: 'right', min: 0, max: 1200 },
        ]}
        series={[
          {
            name: 'Dynamic Bar',
            type: 'bar',
            yAxis: 'right',
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
    yAxes: [{ name: 'Users' }],
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
    <div className="w-full">
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
          'Three value axes in one chart via `yAxes`. Evaporation and Precipitation each get their own right-hand axis (same-side axes auto-stack outward), while Temperature keeps the left. Series point at an axis by index with `yAxis: <n>`, and each axis takes on its series’ color. `highlightOnHover` focuses the hovered series and dims the others.',
      },
    },
  },
  args: {
    height: 380,
    highlightOnHover: true,
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
    yAxes: [
      { name: 'Evaporation', side: 'right', format: v => `${v} ml` },
      { name: 'Precipitation', side: 'right', format: v => `${v} ml` },
      { name: 'Temperature', side: 'left', format: v => `${v} °C` },
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        yAxis: 0,
        variant: 'info',
        data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3],
      },
      {
        name: 'Precipitation',
        type: 'bar',
        yAxis: 1,
        variant: 'success',
        data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3],
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxis: 2,
        variant: 'destructive',
        smooth: true,
        data: [2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23, 16.5, 12, 6.2],
      },
    ],
  },
  render: args => (
    <div className="w-full">
      <Combo {...args} />
    </div>
  ),
}

export const AxisTitles: Story = {
  name: 'Axis titles (position)',
  parameters: {
    docs: {
      description: {
        story:
          'Each axis places its own title: the left value axis uses `position: "middle"` (a rotated, centered title), the right axis keeps the default `top`, and the x-axis title tucks after the last label with `position: "right"`. Same `position` / `orientation` knobs as the other charts.',
      },
    },
  },
  args: {
    height: 360,
    categories: months,
    xAxis: { name: 'Month', position: 'right' },
    yAxes: [
      {
        name: 'Revenue (Rp)',
        position: 'middle',
        format: v => `${(v / 1000).toFixed(0)}k`,
      },
      { name: 'Orders', side: 'right', position: 'middle' },
    ],
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
        yAxis: 'right',
        smooth: true,
        data: [320, 290, 410, 380, 520, 610],
        variant: 'warning',
      },
    ],
  },
  render: args => (
    <div className="w-full">
      <Combo {...args} />
    </div>
  ),
}
