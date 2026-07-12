import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { Pie } from '../Pie'
import { registerGeoMap } from '../registerGeoMap'
import { registerCalendar } from '../registerCalendar'
import { Combo } from '../../combo'
import type { PieDatum } from '../types'
import { resolveCategoricalPalette } from '@/utils'
import {
  trafficSources,
  spend,
  cityTraffic,
  auroraDevices,
  sentiment,
  access,
  roseRadius,
  roseArea,
  languages,
  nestedInner,
  nestedOuter,
  regions,
  partitionA,
  partitionB,
  singaporeRegions,
  singaporeMap,
  calendarDays,
  productYears,
  productRows,
} from './fixtures'

registerCalendar()
registerGeoMap('singapore', singaporeMap)

const caption =
  'mb-2 text-center text-[13px] font-medium text-neutral-500 dark:text-neutral-400'

const meta: Meta<typeof Pie> = {
  title: 'Charts/Pie',
  component: Pie,
  tags: [],
  parameters: {
    layout: 'fullscreen',
    chartLayout: { maxWidth: 760, padding: 4 },
    docs: {
      description: {
        component:
          'A pie / doughnut chart for part-to-whole breakdowns, powered by Apache ECharts. Supports doughnuts, half doughnuts, `padAngle` gaps, rounded corners, the Nightingale (rose) layout, label alignment, scrollable legends, and multiple pies in one chart (nested, partitioned, per-facet). Every color resolves from `@clera/tokens`, so it adapts to light/dark mode automatically. Shares the same `useEChart` runtime and hover/emphasis behavior as `Bar`, `Combo`, and `PolarBar`.',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description:
        'Single-series slices: `{ label, value, variant?, color? }[]`. Use `series` for multiple pies in one chart.',
      table: { type: { summary: 'PieDatum[]' } },
    },
    series: {
      control: 'object',
      description:
        'Multiple pies in one chart, each `{ name?, data, innerRadius?, outerRadius?, center?, roseType?, ... }`. Powers nested, partitioned, and faceted layouts. Overrides `data` when set.',
      table: {
        type: { summary: 'PieSeries[]' },
        defaultValue: { summary: '-' },
      },
    },
    geo: {
      control: 'object',
      description:
        'Lay the chart out on a map: `{ map, roam?, layoutCenter?, layoutSize?, aspectScale?, areaColor?, borderColor? }`. Each series `center` becomes a `[lng, lat]` coordinate and `outerRadius` a pixel radius. Register the map first with `registerGeoMap`.',
      table: { type: { summary: 'PieGeo' }, defaultValue: { summary: '-' } },
    },
    calendar: {
      control: 'object',
      description:
        'Lay the chart out on a date grid: `{ range, cellSize?, orient?, firstDay?, showDayNumbers?, ... }`. Each series names the `date` cell it sits in. Call `registerCalendar()` first.',
      table: {
        type: { summary: 'PieCalendar' },
        defaultValue: { summary: '-' },
      },
    },
    innerRadius: {
      control: 'text',
      description:
        'Inner hole radius (a number in px or a `%` string). Set it to turn the pie into a doughnut.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '0' },
      },
    },
    outerRadius: {
      control: 'text',
      description: 'Outer radius in px or a `%` string.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: "'75%'" },
      },
    },
    roseType: {
      control: { type: 'select' },
      options: [false, 'radius', 'area'],
      description:
        "Nightingale (rose) layout. `'radius'` varies each slice's radius by value while keeping equal angles; `'area'` varies the area. `false` is a normal pie.",
      table: {
        type: { summary: "'radius' | 'area' | false" },
        defaultValue: { summary: 'false' },
      },
    },
    startAngle: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description: 'Starting angle (degrees).',
      table: { type: { summary: 'number' }, defaultValue: { summary: '90' } },
    },
    endAngle: {
      control: { type: 'range', min: 0, max: 360, step: 15 },
      description:
        'Ending angle (degrees). Pair with `startAngle` (e.g. `180`/`360`) for a half doughnut.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'full circle' },
      },
    },
    padAngle: {
      control: { type: 'range', min: 0, max: 12, step: 1 },
      description: 'Gap (degrees) between adjacent slices.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    borderRadius: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Corner radius for each slice.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    palette: {
      control: { type: 'radio' },
      options: ['categorical', 'brand'],
      description:
        'Fallback coloring for slices without a `variant`/`color`. `categorical` cycles distinct colors; `brand` is a violet monochrome ramp.',
      table: {
        type: { summary: "'categorical' | 'brand'" },
        defaultValue: { summary: 'categorical' },
      },
    },
    showLabels: {
      control: 'boolean',
      description: 'Show the per-slice labels at rest.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    labelOnHover: {
      control: 'boolean',
      description:
        'When labels are hidden (`showLabels={false}`), reveal a slice’s label while it is hovered. Good for a clean rose/pie that only labels the section under the cursor.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    labelOnClick: {
      control: 'boolean',
      description:
        'Reveal a slice’s label (incl. `detail` / `richLabel` cards) only while it is selected — click to show, click another to switch, click empty space to dismiss. Implies `selectedMode: "single"`, and clamps any revealed card that would cross the canvas edge back inside.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    labelPosition: {
      control: { type: 'radio' },
      options: ['outside', 'inside', 'center'],
      description: 'Where slice labels sit.',
      table: {
        type: { summary: "'outside' | 'inside' | 'center'" },
        defaultValue: { summary: 'outside' },
      },
    },
    labelAlignTo: {
      control: { type: 'radio' },
      options: ['none', 'labelLine', 'edge'],
      description:
        "Line up outside labels. `'labelLine'` aligns text to the label-line elbow; `'edge'` flushes text to the chart edge.",
      table: {
        type: { summary: "'none' | 'labelLine' | 'edge'" },
        defaultValue: { summary: 'none' },
      },
    },
    showLabelLine: {
      control: 'boolean',
      description: 'Draw the leader line to outside labels.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    labelFormatter: {
      control: false,
      description:
        'Customize each label from `{ name, value, percent }`. Multiline strings (with `\\n`) are supported.',
      table: {
        type: {
          summary:
            '(d: { name: string; value: number; percent: number }) => string',
        },
        defaultValue: { summary: '-' },
      },
    },
    highlightOnHover: {
      control: 'boolean',
      description:
        'When `true`, hovering a slice dims the rest (`focus: self`). Either way the hovered slice lifts and lightens, matching the other charts.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selectedMode: {
      control: { type: 'select' },
      options: [false, 'single', 'multiple'],
      description: 'Let slices be clicked out (offset) — single or multiple.',
      table: {
        type: { summary: "false | 'single' | 'multiple'" },
        defaultValue: { summary: 'false' },
      },
    },
    showLegend: {
      control: 'boolean',
      description:
        'Show the legend. Defaults on for a single pie, off for multiple pies.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'single pie' },
      },
    },
    legendPosition: {
      control: { type: 'radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Legend placement.',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: 'bottom' },
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
        defaultValue: { summary: 'circle' },
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
    scrollableLegend: {
      control: 'boolean',
      description:
        'Page long legends instead of wrapping — good with many slices down the side.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show a tooltip for the hovered slice.',
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
    stackDetailBelow: {
      control: 'number',
      description:
        'Container width (px) below which `detail` labels leave the pie and re-render as a stacked HTML table beneath it. The component owns this, so any consumer gets it for free. Set `false` to disable. (`richLabel` is an opaque escape hatch and is not auto-stacked.)',
      table: {
        type: { summary: 'number | false' },
        defaultValue: { summary: '520' },
      },
    },
    onReady: {
      action: 'ready',
      description: 'Called once with the ECharts instance (escape hatch).',
      table: { type: { summary: '(chart: ECharts) => void' } },
    },
    onSliceClick: {
      action: 'slice:click',
      description: 'Called with `(datum, index)` when a slice is clicked.',
      table: {
        type: { summary: '(datum: PieDatum, index: number) => void' },
      },
    },
  },
  args: {
    animate: true,
  },
}

export default meta

type Story = StoryObj<typeof Pie>

export const Basic: Story = {
  name: 'Basic',
  parameters: {
    docs: {
      description: {
        story:
          'The default pie — one slice per datum, outside labels with leader lines, and a legend below. A `labelFormatter` prints the share as a percentage.',
      },
    },
  },
  args: {
    height: 400,
    data: trafficSources,
    labelFormatter: ({ name, percent }) => `${name}  ${percent}%`,
  },
}

export const Doughnut: Story = {
  name: 'Doughnut (sharp & rounded)',
  parameters: {
    docs: {
      description: {
        story:
          'Set `innerRadius` to cut a hole and turn the pie into a doughnut. Add `borderRadius` (and a little `padAngle`) to round the slice corners.',
      },
    },
  },
  args: {
    data: trafficSources,
    innerRadius: '55%',
    height: 300,
    showLegend: false,
  },
  render: args => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <p className={caption}>Sharp corners</p>
        <Pie {...args} />
      </div>
      <div>
        <p className={caption}>Rounded corners</p>
        <Pie
          {...args}
          borderRadius={args.borderRadius ?? 10}
          padAngle={args.padAngle ?? 2}
        />
      </div>
    </div>
  ),
}

export const HalfDoughnut: Story = {
  name: 'Half doughnut',
  parameters: {
    docs: {
      description: {
        story:
          'Sweep only the top half with `startAngle={180}` and `endAngle={360}`. Handy for gauge-like sentiment or budget-remaining readouts.',
      },
    },
  },
  args: {
    height: 340,
    data: sentiment,
    innerRadius: '50%',
    outerRadius: '90%',
    startAngle: 180,
    endAngle: 360,
    center: ['50%', '72%'],
    legendPosition: 'bottom',
    labelFormatter: ({ name, percent }) => `${name} ${percent}%`,
  },
}

export const PadAngle: Story = {
  name: 'With padAngle',
  parameters: {
    docs: {
      description: {
        story:
          '`padAngle` inserts an even gap between slices; pair it with `borderRadius` for a clean segmented ring.',
      },
    },
  },
  args: {
    height: 400,
    data: access,
    innerRadius: '45%',
    padAngle: 3,
    borderRadius: 8,
    labelFormatter: ({ name, percent }) => `${name} ${percent}%`,
  },
}

export const Nightingale: Story = {
  name: 'Nightingale (rose)',
  parameters: {
    docs: {
      description: {
        story:
          'The Nightingale rose, in both modes side by side (the ECharts `pie-roseType` demo). `roseType="radius"` keeps equal angles and grows each slice by radius; `roseType="area"` grows the area. Whether each slice shows its label + leader line at rest is a prop: **Radius mode** uses `showLabels={false} labelOnHover` (clean, reveals on hover), while **Area mode** uses `showLabels` (each label + leader line is drawn on load, no hover needed). Rounded corners come from `borderRadius`.',
      },
    },
  },
  args: {
    innerRadius: '15%',
    outerRadius: '72%',
    borderRadius: 5,
    height: 360,
    showLabels: false,
    labelOnHover: true,
    legendPosition: 'bottom',
  },
  render: args => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <p className={caption}>Radius mode · labels on hover</p>
        <Pie data={roseRadius} roseType="radius" {...args} />
      </div>
      <div>
        <p className={caption}>Area mode · labels always shown</p>
        <Pie
          data={roseArea}
          roseType="area"
          {...args}
          outerRadius="60%"
          showLabels
          showLabelLine
          showLegend={false}
          labelFormatter={({ name }) => name}
        />
      </div>
    </div>
  ),
}

export const LabelAlign: Story = {
  name: 'Pie label align',
  parameters: {
    docs: {
      description: {
        story:
          '`labelAlignTo` tidies outside labels. `"labelLine"` aligns the text to the leader-line elbow; `"edge"` flushes every label to the chart edge for a clean column.',
      },
    },
  },
  args: {
    data: access,
    innerRadius: '40%',
    showLegend: false,
    height: 320,
    labelFormatter: ({ name, percent }) => `${name} ${percent}%`,
  },
  render: args => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <p className={caption}>alignTo: labelLine</p>
        <Pie {...args} labelAlignTo="labelLine" />
      </div>
      <div>
        <p className={caption}>alignTo: edge</p>
        <Pie {...args} labelAlignTo="edge" />
      </div>
    </div>
  ),
}

export const LabelAlignAdjust: Story = {
  name: 'Pie label align adjust',
  parameters: {
    docs: {
      description: {
        story:
          'Flush labels to the edge and stack a bold name over a muted value line with a multiline `labelFormatter` — a compact, aligned label block.',
      },
    },
  },
  args: {
    height: 420,
    data: spend,
    innerRadius: '42%',
    labelAlignTo: 'edge',
    formatValue: v => `$${(v / 1000).toFixed(1)}k`,
    labelFormatter: ({ name, value, percent }) =>
      `${name}\n$${(value / 1000).toFixed(1)}k · ${percent}%`,
    showLegend: false,
  },
}

export const ScrollableLegend: Story = {
  name: 'Scrollable legend',
  parameters: {
    docs: {
      description: {
        story:
          'With many slices, put the legend down the side and set `scrollableLegend` so it pages instead of wrapping into a wall of text.',
      },
    },
  },
  args: {
    height: 460,
    data: languages,
    innerRadius: '40%',
    showLabels: false,
    showLegend: true,
    legendPosition: 'right',
    scrollableLegend: true,
    highlightOnHover: true,
  },
}

const deviceIcon = (glyph: string, color: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="22" viewBox="0 0 64 22" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(1 1) scale(0.83)" fill="none">${glyph}</g></svg>`
  )

const DEVICE_GLYPH: Record<string, string> = {
  Mobile:
    '<rect x="6" y="2" width="12" height="20" rx="2" fill="none"/><line x1="11" y1="18" x2="13" y2="18"/>',
  Desktop:
    '<rect x="2" y="3" width="20" height="14" rx="2" fill="none"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  Tablet:
    '<rect x="4" y="2" width="16" height="20" rx="2" fill="none"/><line x1="11" y1="18" x2="13" y2="18"/>',
}

const sparklineImage = (points: number[], color: string) => {
  const w = 88
  const h = 26
  const pad = 2
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const step = (w - pad * 2) / (points.length - 1)
  const y = (p: number) =>
    (h - pad - ((p - min) / span) * (h - pad * 2)).toFixed(1)
  const pts = points
    .map((p, i) => `${(pad + i * step).toFixed(1)},${y(p)}`)
    .join(' ')
  const lastX = (pad + (points.length - 1) * step).toFixed(1)
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${lastX}" cy="${y(points[points.length - 1])}" r="2" fill="${color}"/></svg>`
    )
  )
}

const cedarTrend = [12, 18, 14, 22, 19, 26, 24, 30]

const specialLabelData: PieDatum[] = cityTraffic.map((c, i) => {
  if (i === 0) {
    return {
      ...c,
      detail: {
        title: c.label,
        columns: ['Device', 'Sessions', 'Share'],
        rows: auroraDevices.map(d => ({
          icon: deviceIcon(DEVICE_GLYPH[d.name], 'rgb(115, 115, 115)'),
          label: d.name,
          cells: [d.value, d.rate],
        })),
      },
    }
  }
  if (i === 2) {
    return {
      ...c,
      richLabel: {
        formatter: ['{title|Cedar}', '{spark|}', '{value|4,300 sessions}'].join(
          '\n'
        ),
        padding: [8, 10, 8, 10],
        rich: {
          title: {
            fontSize: 12,
            fontWeight: 700,
            align: 'left',
            lineHeight: 18,
            padding: [0, 0, 4, 0],
          },
          spark: {
            height: 26,
            width: 88,
            align: 'left',
            backgroundColor: {
              image: sparklineImage(cedarTrend, 'rgb(124, 58, 237)'),
            },
          },
          value: {
            fontSize: 11,
            align: 'left',
            lineHeight: 16,
            padding: [4, 0, 0, 0],
          },
        },
      },
    }
  }
  return c
})

export const SpecialLabel: Story = {
  name: 'Pie special label',
  parameters: {
    docs: {
      description: {
        story:
          'Two custom labels, both injected through the data — no `onReady`, no overlay. **Aurora** uses a structured `detail` table (title, header, a row per device with an inline icon, count, and share). **Cedar** uses a raw `richLabel` — an ECharts `formatter` + `rich` config with an inline SVG sparkline image. Both are drawn at rest, toggled by `showLabels`, and revealed on hover when hidden — the Pie owns all of that. **Responsive, in the component:** as the container narrows the Pie tightens the cards to a `compact` density; below `stackDetailBelow` (default 520px) the cards can no longer fit, so the Pie itself drops them and re-renders every `detail` as a plain HTML table beneath the pie — so any consumer of the package gets it for free with no extra markup. Because `richLabel` is an opaque escape hatch, its narrow presentation is the consumer’s to own (Cedar simply falls back to an inside label). Icons/sparkline are self-contained inline SVG data URIs; colors resolve from `@clera/tokens`.',
      },
    },
  },
  args: {
    height: 480,
    data: specialLabelData,
    showLabels: true,
    legendPosition: 'bottom',
    selectedMode: 'single',
    outerRadius: '46%',
  },
}

function TotalCenterCard({ total, top }: { total: number; top: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/90 px-5 py-3 text-center shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
        {total.toLocaleString()}
      </div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        total sessions
      </div>
      <div className="mt-1 text-xs font-medium text-violet-600 dark:text-violet-400">
        Top: {top}
      </div>
    </div>
  )
}

function CustomLabelDemo(args: ComponentProps<typeof Pie>) {
  const total = trafficSources.reduce((sum, d) => sum + d.value, 0)
  const top = [...trafficSources].sort((a, b) => b.value - a.value)[0].label
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <Pie {...args} />
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ top: '46%' }}
      >
        <TotalCenterCard total={total} top={top} />
      </div>
    </div>
  )
}

export const CustomLabel: Story = {
  name: 'Custom label (component)',
  parameters: {
    docs: {
      description: {
        story:
          'When you want full control, skip the rich-text label and attach your own React component. Here a doughnut leaves a hole (`innerRadius`), and a `TotalCenterCard` component is absolutely centered over it — a live React node (any markup, links, buttons) rather than a canvas label. Slice labels reveal on hover (`labelOnHover`), so the center card stays the focus.',
      },
    },
  },
  args: {
    data: trafficSources,
    innerRadius: '66%',
    showLabels: false,
    labelOnHover: true,
    showLegend: true,
    legendPosition: 'bottom',
    height: 420,
  },
  render: args => <CustomLabelDemo {...args} />,
}

export const Nested: Story = {
  name: 'Nested pies',
  parameters: {
    docs: {
      description: {
        story:
          'Two `series` sharing a center (the ECharts nested-pies demo). The outer ring shows a series-level `richLabel` card (name / value / percent) on every slice, and the inner ring uses `selectedMode: "single"` — click an inner slice to pop it out (Marketing starts `selected`). This mirrors the official ECharts nested-pies example: the eight cards fit on a wide canvas and, like the demo, get tight on very narrow widths. The legend is plain HTML **outside** the chart, driven by the `showLegend` / `legendPosition` controls.',
      },
    },
  },
  args: {
    height: 480,
    showLegend: true,
    legendPosition: 'bottom',
    labelFormatter: (d: { name: string }) => d.name.split(' ')[0],
    series: [
      {
        name: 'Access From',
        data: nestedInner,
        innerRadius: 0,
        outerRadius: '30%',
        center: ['50%', '46%'],
        labelPosition: 'inside',
        showLabelLine: false,
        selectedMode: 'single',
      },
      {
        name: 'Access From',
        data: nestedOuter,
        innerRadius: '40%',
        outerRadius: '50%',
        center: ['50%', '46%'],
        richLabel: {
          formatter: ['{a|{a}}', '{hr|}', '{b|{b}}{c|{c}}{per|{d}%}'].join(
            '\n'
          ),
          rich: {
            a: {
              color: '#9ca3af',
              fontSize: 11,
              lineHeight: 18,
              align: 'left',
            },
            hr: {
              borderColor: '#d4d4d8',
              width: '100%',
              borderWidth: 1,
              height: 0,
              lineHeight: 12,
            },
            b: { fontSize: 13, fontWeight: 'bold', lineHeight: 22 },
            c: { fontSize: 12, padding: [0, 10, 0, 6] },
            per: {
              color: '#fff',
              backgroundColor: '#7c3aed',
              padding: [3, 6],
              borderRadius: 4,
              fontSize: 11,
            },
          },
        },
      },
    ],
  },
  render: (args: ComponentProps<typeof Pie>) => {
    const palette = resolveCategoricalPalette()
    const pos = args.legendPosition ?? 'bottom'
    const vertical = pos === 'left' || pos === 'right'
    const legend =
      args.showLegend === false ? null : (
        <div
          className={
            vertical
              ? 'flex flex-col justify-center gap-2'
              : 'flex flex-wrap justify-center gap-x-4 gap-y-1.5'
          }
        >
          {nestedOuter.map((d, i) => (
            <span
              key={d.label}
              className="flex items-center gap-1.5 text-[12px] text-neutral-600 dark:text-neutral-300"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: palette[i % palette.length] }}
              />
              {d.label}
            </span>
          ))}
        </div>
      )
    return (
      <div
        className={vertical ? 'flex items-center gap-5' : 'flex flex-col gap-2'}
      >
        {(pos === 'top' || pos === 'left') && legend}
        <div className={vertical ? 'min-w-0 flex-1' : 'min-w-0'}>
          <Pie {...args} showLegend={false} />
        </div>
        {(pos === 'bottom' || pos === 'right') && legend}
      </div>
    )
  },
}

export const Partition: Story = {
  name: 'Partition data to pies',
  parameters: {
    docs: {
      description: {
        story:
          'Split a big breakdown into a pie per group so each stays readable. On a responsive grid they sit side by side on desktop and stack on mobile — here operating spend and marketing spend.',
      },
    },
  },
  args: {
    innerRadius: '45%',
    labelPosition: 'inside',
    showLabelLine: false,
    legendPosition: 'bottom',
    height: 320,
    labelFormatter: ({ percent }) => `${percent}%`,
  },
  render: args => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <p className={caption}>Operating</p>
        <Pie data={partitionA} {...args} />
      </div>
      <div>
        <p className={caption}>Marketing</p>
        <Pie data={partitionB} {...args} />
      </div>
    </div>
  ),
}

export const Arrangement: Story = {
  name: 'Default arrangement',
  parameters: {
    docs: {
      description: {
        story:
          'One small pie per facet on a responsive grid — four regions with the same categories. It reflows from four-up on desktop to two-up on mobile, so every pie stays legible. Hover any slice to compare the mix across regions.',
      },
    },
  },
  args: {
    innerRadius: '35%',
    showLegend: false,
    highlightOnHover: true,
    height: 200,
  },
  render: args => {
    const palette = resolveCategoricalPalette()
    const cats = ['Cloud', 'License', 'Services']
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regions.map(r => (
            <div key={r.name}>
              <p className={caption}>{r.name}</p>
              <Pie data={r.data} {...args} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {cats.map((label, i) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-[13px] text-neutral-600 dark:text-neutral-300"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: palette[i] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    )
  },
}

const singaporeSeries = singaporeRegions.map(r => ({
  name: r.name,
  data: r.data,
  center: r.coord,
  outerRadius: 22,
}))

export const GeoMap: Story = {
  name: 'Pie charts on Geo map',
  parameters: {
    docs: {
      description: {
        story:
          'Pass a `geo` prop to place every series on a map instead of the chart box: each series `center` becomes a `[lng, lat]` coordinate and `outerRadius` a pixel radius. Here a **Singapore** map carries a pie per region (Central / East / West / North) showing its retail / office / dining mix. Register the map once with `registerGeoMap(name, geoJson)` — the outline is a small inline GeoJSON, so nothing is fetched.',
      },
    },
  },
  args: {
    geo: { map: 'singapore' },
    series: singaporeSeries,
    height: 460,
    showLabels: false,
    showLabelLine: false,
    showLegend: true,
    highlightOnHover: true,
  },
}

const calendarSeries = calendarDays.map(day => ({
  name: day.date,
  date: day.date,
  data: day.data,
}))

export const CalendarPie: Story = {
  name: 'Calendar pie',
  parameters: {
    docs: {
      description: {
        story:
          'Pass a `calendar` prop to lay the chart out on a date grid. Each series names the `date` cell it sits in, so a pie lands on every day of March showing how those 24 hours were spent. Day-of-month numbers are drawn in the cell corners, and the pie radius defaults to the cell size.',
      },
    },
  },
  args: {
    calendar: { range: '2024-03', orient: 'vertical' },
    series: calendarSeries,
    height: 520,
    labelPosition: 'inside',
    showLabelLine: false,
    showLegend: true,
    highlightOnHover: true,
    labelFormatter: d => String(d.value),
    formatValue: v => `${v}h`,
  },
}

export const ShareDataset: Story = {
  name: 'Share dataset',
  parameters: {
    docs: {
      description: {
        story:
          'One dataset drives two charts in a single canvas: a pie on top and a line chart below. Hover any point on the line and the pie re-encodes to that year, so the part-to-whole view follows the trend view. Because the pie slices and the lines are the same four products, one legend toggles both. This story renders `Combo`, not `Pie`, so the Pie controls do not apply.',
      },
    },
  },
  args: {
    height: 620,
    categories: productYears,
    series: productRows.map(r => ({
      name: r.name,
      type: 'line' as const,
      data: r.values,
      variant: r.variant,
      smooth: true,
    })),
    summaryPie: true,
    highlightOnHover: true,
    legendPosition: 'bottom',
  },
  render: args => <Combo {...args} />,
}
