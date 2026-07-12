import type { Meta, StoryObj } from '@storybook/nextjs'
import { Scatter } from '../Scatter'
import type { ScatterTrendLine } from '../types'
import {
  lcg,
  anscombeData,
  clusteringData,
  clusterSeries,
  clusteringSteps,
  gdpData,
  exponentialRegression,
  femaleHeightWeight,
  maleHeightWeight,
} from './fixtures'

const meta: Meta<typeof Scatter> = {
  title: 'Charts/Scatter',
  component: Scatter,
  tags: [],
  parameters: {
    layout: 'fullscreen',
    chartLayout: { maxWidth: 720, padding: 4 },
    docs: {
      description: {
        component:
          'A scatter chart for plotting `[x, y]` points — correlations, distributions, clusters. Both axes are numeric. Shares the `useEChart` runtime, `@clera/tokens` colors, and legend/hover-highlight behavior with the other charts.',
      },
    },
  },
  argTypes: {
    series: {
      control: 'object',
      description:
        'One or more series: `{ name, data, variant?, color?, symbolSize?, trendLine? }[]`, where `data` is `[x, y][]`. `trendLine` draws a straight reference line from `{ from, to, label? }`.',
      table: { type: { summary: 'ScatterSeries[]' } },
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
    symbolSize: {
      control: 'number',
      description: "Marker size (px) for series that don't set their own.",
      table: { type: { summary: 'number' }, defaultValue: { summary: '10' } },
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle shown beneath the title in a subtle color.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    showCrosshair: {
      control: 'boolean',
      description:
        'Show a crosshair (`axisPointer`) tracking the hovered point.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    xAxis: {
      control: 'object',
      description:
        'The x-axis: `{ name?, min?, max?, position?, orientation?, format? }`.',
      table: {
        type: { summary: 'ScatterXAxis' },
        defaultValue: { summary: '-' },
      },
    },
    yAxis: {
      control: 'object',
      description:
        'The y-axis: `{ name?, min?, max?, side?, position?, orientation?, format? }`.',
      table: {
        type: { summary: 'ScatterYAxis' },
        defaultValue: { summary: '-' },
      },
    },
    gridLines: {
      control: 'boolean',
      description: 'Show the dashed axis grid lines.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show a tooltip for the hovered point.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    highlightOnHover: {
      control: 'boolean',
      description:
        'When `true`, hovering a point highlights its whole series and dims the rest. When `false` (default), only the hovered point lightens.',
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
    loadingColor: {
      control: 'color',
      description:
        'Spinner color. A single string applies to both themes, or pass `{ light, dark }` to vary it. Defaults to the chart primary token.',
      table: {
        type: { summary: 'string | { light?: string; dark?: string }' },
        defaultValue: { summary: '-' },
      },
    },
    loadingMask: {
      control: 'color',
      description:
        'Overlay/mask behind the spinner. A single string applies to both themes, or pass `{ light, dark }` to vary it. Defaults to the themed surface at 65% — a light veil on light, a dark veil on dark.',
      table: {
        type: { summary: 'string | { light?: string; dark?: string }' },
        defaultValue: { summary: '-' },
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
    onPointClick: {
      action: 'point:click',
      description: 'Called with the clicked point when a marker is clicked.',
      table: { type: { summary: '(point: ScatterPointClick) => void' } },
    },
    steps: {
      control: false,
      description:
        'Renders a timeline instead of a static chart: `{ series, boundary? }[]`, one frame per step. Ignores `series`/`columns` when set.',
      table: { type: { summary: 'ScatterStep[]' } },
    },
    autoPlay: {
      control: 'boolean',
      description: 'Autoplay the `steps` timeline on mount.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    playInterval: {
      control: 'number',
      description: 'Milliseconds between autoplay frames.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2500' },
      },
    },
    aggregate: {
      control: false,
      description:
        'Enables morphing to a bar of per-series averages: `{ dimension?: 0 | 1, formatValue? }`. Drive `view` to switch.',
      table: { type: { summary: 'ScatterAggregate' } },
    },
    view: {
      control: { type: 'radio' },
      options: ['scatter', 'bar'],
      description:
        'Which view to show when `aggregate` is set — the points or the aggregate bars. Ignored when `autoToggle` is on.',
      table: {
        type: { summary: "'scatter' | 'bar'" },
        defaultValue: { summary: 'scatter' },
      },
    },
    autoToggle: {
      control: 'boolean',
      description:
        'Auto-cycle between the scatter and aggregate bar views on a timer (needs `aggregate`).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    holdDuration: {
      control: 'number',
      description:
        'How long (ms) each view rests after its morph before `autoToggle` flips it.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1500' },
      },
    },
    transitionDuration: {
      control: 'number',
      description:
        'Duration (ms) of the scatter↔bar morph and other update transitions.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1000' },
      },
    },
  },
  args: {
    animate: true,
  },
}

export default meta

type Story = StoryObj<typeof Scatter>

export const Basic: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'A single series of `[x, y]` points — height vs. weight for a sample of people.',
      },
    },
  },
  args: {
    height: 380,
    xAxis: { name: 'Height (cm)' },
    yAxis: { name: 'Weight (kg)' },
    series: (() => {
      const rand = lcg(7)
      const data: [number, number][] = Array.from({ length: 40 }, () => {
        const height = 150 + rand() * 45
        const weight = height * 0.55 + rand() * 20 - 10
        return [Math.round(height), Math.round(weight)]
      })
      return [{ name: 'Sample', data }]
    })(),
  },
}

export const MultipleSeries: Story = {
  name: 'Multiple series',
  parameters: {
    docs: {
      description: {
        story:
          'Two clusters as separate series, colored by the categorical palette. `highlightOnHover` dims the other cluster while one is hovered.',
      },
    },
  },
  args: {
    height: 380,
    highlightOnHover: true,
    xAxis: { name: 'Score A' },
    yAxis: { name: 'Score B' },
    series: (() => {
      const rand = lcg(42)
      const cluster = (cx: number, cy: number, name: string) => ({
        name,
        data: Array.from({ length: 24 }, () => [
          Math.round(cx + (rand() - 0.5) * 30),
          Math.round(cy + (rand() - 0.5) * 30),
        ]) as [number, number][],
      })
      return [cluster(30, 70, 'Group A'), cluster(65, 35, 'Group B')]
    })(),
  },
}

const anscombeTrend: ScatterTrendLine = {
  from: [0, 3],
  to: [20, 13],
  label: 'y = 0.5 * x + 3',
}

export const AnscombesQuartet: Story = {
  name: "Anscombe's quartet",
  parameters: {
    docs: {
      description: {
        story:
          'The classic statistics demo: four datasets with nearly identical mean, variance, and trend line, but wildly different distributions — a reminder to always plot data rather than trust summary stats alone. A single `Scatter` lays the four panels out with `columns`; each series binds to a panel with `gridIndex` and draws its own `trendLine`. The panels reflow to a single column on narrow screens.',
      },
    },
  },
  args: {
    title: "Anscombe's quartet",
    columns: 2,
    showLegend: false,
    xAxis: { min: 0, max: 20 },
    yAxis: { min: 0, max: 15 },
    series: [
      {
        name: 'I',
        data: anscombeData[0],
        variant: 'info',
        gridIndex: 0,
        trendLine: anscombeTrend,
      },
      {
        name: 'II',
        data: anscombeData[1],
        variant: 'success',
        gridIndex: 1,
        trendLine: anscombeTrend,
      },
      {
        name: 'III',
        data: anscombeData[2],
        variant: 'neutral',
        gridIndex: 2,
        trendLine: anscombeTrend,
      },
      {
        name: 'IV',
        data: anscombeData[3],
        variant: 'warning',
        gridIndex: 3,
        trendLine: anscombeTrend,
      },
    ],
  },
}

export const Clustering: Story = {
  name: 'Clustering',
  parameters: {
    docs: {
      description: {
        story:
          'Points grouped into six clusters with a small k-means pass over the raw `[x, y]` data (the ECharts demo uses the `ecStat:clustering` transform for the same effect), then rendered as one series per cluster so the legend, categorical palette, and hover behavior all come from the component. `legendPosition="left"` matches the reference layout.',
      },
    },
  },
  args: {
    height: 480,
    symbolSize: 15,
    showLegend: true,
    legendPosition: 'left',
    highlightOnHover: true,
    series: clusterSeries(clusteringData, 6),
  },
}

export const ClusteringProcess: Story = {
  name: 'Clustering process',
  parameters: {
    docs: {
      description: {
        story:
          "A timeline walkthrough of bisecting k-means on the same points as the Clustering story, matching ECharts' `scatter-clustering-process` example: each step splits the highest-variance cluster in two, and a dashed circle traces the newest cluster's spread. Drive it with the timeline scrubber or `autoPlay`.",
      },
    },
  },
  args: {
    height: 480,
    symbolSize: 12,
    autoPlay: true,
    steps: clusteringSteps(clusteringData, 6),
  },
}

export const ExponentialRegression: Story = {
  name: 'Exponential regression',
  parameters: {
    docs: {
      description: {
        story:
          "China's GDP from 1981–1998 with an exponential regression fit drawn over the points, matching ECharts' `scatter-exponential-regression` example. The regression is fitted from the raw `[x, y]` data (the ECharts demo uses the `ecStat:regression` transform) and passed to the series as a `regression` curve, so the smooth line and its formula label render through the component.",
      },
    },
  },
  args: {
    height: 420,
    title: '1981–1998 GDP (trillion yuan)',
    subtitle: 'Exponential regression fit',
    showCrosshair: true,
    symbolSize: 12,
    xAxis: { name: 'Year' },
    yAxis: { name: 'GDP' },
    series: [
      {
        name: 'GDP',
        variant: 'info',
        data: gdpData,
        regression: exponentialRegression(gdpData),
      },
    ],
  },
}

export const Loading: Story = {
  name: 'Loading',
  parameters: {
    docs: {
      description: {
        story:
          'The loading overlay dims the chart with a themed mask and a spinner. Pick the spinner style with `loadingVariant` (`spinner` | `dots` | `bars` | `pulse`), the size with `loadingSize` (`sm` | `md` | `lg`), and override `loadingColor`/`loadingMask` for full control. Both default to design tokens and adapt to light/dark. Toggle `loading` in the controls to compare styles.',
      },
    },
  },
  args: {
    height: 380,
    loading: true,
    loadingVariant: 'dots',
    loadingSize: 'md',
    xAxis: { name: 'Score A' },
    yAxis: { name: 'Score B' },
    series: (() => {
      const rand = lcg(11)
      return [
        {
          name: 'Sample',
          data: Array.from(
            { length: 30 },
            () =>
              [Math.round(rand() * 100), Math.round(rand() * 100)] as [
                number,
                number,
              ]
          ),
        },
      ]
    })(),
  },
}

export const AggregateTransition: Story = {
  name: 'Aggregate transition',
  parameters: {
    docs: {
      description: {
        story:
          "Height/weight points for two groups that morph into a bar of each group's average height, matching ECharts' `scatter-aggregate-bar` example. Set `aggregate` to enable the morph, then either drive `view` (`'scatter' | 'bar'`) yourself or turn on `autoToggle` to let the component cycle the views for you — no timers or hooks needed. `transitionDuration` controls the morph speed; `holdDuration` is how long each view rests after its morph before flipping.",
      },
    },
  },
  argTypes: {
    transitionDuration: {
      control: { type: 'range', min: 200, max: 3000, step: 100 },
    },
    holdDuration: {
      control: { type: 'range', min: 0, max: 5000, step: 250 },
    },
  },
  args: {
    height: 440,
    autoToggle: true,
    transitionDuration: 1000,
    holdDuration: 1500,
    aggregate: { dimension: 0, formatValue: v => `${v.toFixed(1)} cm` },
    title: 'Average height by group',
    subtitle: 'scatter ↔ aggregate bar',
    xAxis: { name: 'Height (cm)' },
    yAxis: { name: 'Weight (kg)' },
    series: [
      { name: 'Female', variant: 'destructive', data: femaleHeightWeight },
      { name: 'Male', variant: 'info', data: maleHeightWeight },
    ],
  },
}
