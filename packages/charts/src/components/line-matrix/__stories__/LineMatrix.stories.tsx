import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Meta, StoryObj, Decorator } from '@storybook/nextjs'
import { Badge, Button, Dropdown } from '@clera/ui'
import type { DropdownItemDef } from '@clera/ui'
import { LineMatrix } from '../LineMatrix'
import type {
  LineMatrixCell,
  LineMatrixRow,
  LineCurve,
  LinePoint,
} from '../types'

const centerStory: Decorator = (Story, { viewMode }) => {
  if (viewMode === 'docs') {
    return (
      <div className="mx-auto w-full max-w-[960px]">
        <Story />
      </div>
    )
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-[960px]">
        <Story />
      </div>
    </div>
  )
}

const meta: Meta<typeof LineMatrix> = {
  title: 'Charts/Line Matrix',
  component: LineMatrix,
  tags: [],
  decorators: [centerStory],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A small-multiples grid built on the ECharts matrix coordinate system: a single chart lays out one tiny line per cell, with row/column headers, an optional merged divider row, a per-cell value label, and a shared dataZoom that scrubs every cell’s x range at once. Colors resolve from `@clera/tokens`, so it adapts to light/dark mode. Built on the same `useEChart` runtime as the other charts.',
      },
    },
  },
  argTypes: {
    columns: {
      control: 'object',
      description: 'Column labels — the matrix x dimension.',
      table: { type: { summary: '(string | number)[]' } },
    },
    rows: {
      control: 'object',
      description:
        'Row labels — the matrix y dimension. A string, or `{ label, divider }` where a `divider` row spans the full width as a group header.',
      table: { type: { summary: '(string | LineMatrixRow)[]' } },
    },
    cells: {
      control: 'object',
      description:
        'The cells to plot, each `{ col, row, data, variant?, color? }`. `data` is plain values or `[x, y]` pairs; the cell is placed at its (`col`, `row`).',
      table: { type: { summary: 'LineMatrixCell[]' } },
    },
    colorByTrend: {
      control: 'boolean',
      description:
        'Color each cell green/red by whether its line ended up or down over the data.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    area: {
      control: 'boolean',
      description: 'Fill under each cell line.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    curve: {
      control: { type: 'radio' },
      options: ['straight', 'smooth', 'stepped'],
      description: 'Line shape inside every cell.',
      table: {
        type: { summary: "'straight' | 'smooth' | 'stepped'" },
        defaultValue: { summary: 'straight' },
      },
    },
    zoom: {
      control: 'boolean',
      description:
        'Add a shared dataZoom that scrubs every cell’s x range together.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    zoomSlider: {
      control: 'boolean',
      description:
        'Show the draggable zoom slider. Set to `false` to keep only inside (scroll/drag) zoom.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showCellLabel: {
      control: 'boolean',
      description: 'Show the per-cell max value label on the y axis.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    cornerLabel: {
      control: 'text',
      description: 'Label shown in the top-left corner cell.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '-' } },
    },
    height: {
      control: 'number',
      description: 'Chart height in px or any CSS length.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '520' },
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof LineMatrix>

type Pair = { label: string; base: number; vol: number }

const PAIRS: Pair[] = [
  { label: 'EUR/USD', base: 1.085, vol: 0.004 },
  { label: 'GBP/USD', base: 1.272, vol: 0.005 },
  { label: 'USD/JPY', base: 149.3, vol: 0.55 },
  { label: 'AUD/USD', base: 0.659, vol: 0.004 },
  { label: 'USD/CHF', base: 0.88, vol: 0.004 },
  { label: 'USD/CAD', base: 1.358, vol: 0.004 },
]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const POINTS = 156

function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const WEEK = 7 * 24 * 3600 * 1000
const START = Date.parse('2022-01-03T00:00:00Z')

function fmtDate(t: number): string {
  const d = new Date(t)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`
}

function cellData(dayIdx: number, pairIdx: number, pair: Pair): LinePoint[] {
  const rnd = lcg((dayIdx + 1) * 131 + (pairIdx + 1) * 977)
  const dayStart = START + dayIdx * 24 * 3600 * 1000
  let v = pair.base
  const out: LinePoint[] = []
  for (let i = 0; i < POINTS; i++) {
    v += (rnd() - 0.5) * pair.vol * 2 + Math.sin(i / 11) * pair.vol * 0.15
    out.push([
      fmtDate(dayStart + i * WEEK),
      Number(v.toFixed(pair.base >= 10 ? 3 : 5)),
    ])
  }
  return out
}

const ROWS = [
  PAIRS[0].label,
  PAIRS[1].label,
  PAIRS[2].label,
  { label: 'Commodity & safe-haven', divider: true },
  PAIRS[3].label,
  PAIRS[4].label,
  PAIRS[5].label,
]

const CELLS: LineMatrixCell[] = PAIRS.flatMap((pair, pairIdx) =>
  DAYS.map((day, dayIdx) => ({
    col: day,
    row: pair.label,
    data: cellData(dayIdx, pairIdx, pair),
  }))
)

const fmtRate = (v: number) => (v >= 10 ? v.toFixed(2) : v.toFixed(4))

export const FxRates: Story = {
  name: 'FX rates (weekday seasonality)',
  args: {
    columns: DAYS,
    rows: ROWS,
    cells: CELLS,
    cornerLabel: 'Pair / Day',
    colorByTrend: true,
    area: true,
    zoom: true,
    height: 560,
    formatValue: fmtRate,
  },
  render: args => (
    <div className="w-full rounded-xl border border-ds-default bg-ds-surface p-5">
      <div className="mb-1 text-heading-sm font-semibold text-ds-default">
        FX rates · weekday seasonality
      </div>
      <p className="mb-4 max-w-[60ch] text-body-sm text-ds-subtle">
        Each cell trends a pair’s weekly mid-rate sampled on that weekday —
        green when it closed up over the window, red when it closed down. Drag
        the slider to zoom the date range across every cell at once.
      </p>
      <LineMatrix {...args} />
    </div>
  ),
}

const SECTORS = ['Tech', 'Energy', 'Financials', 'Health']
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

const SECTOR_CELLS: LineMatrixCell[] = SECTORS.flatMap((sector, sIdx) =>
  QUARTERS.map((q, qIdx) => {
    const rnd = lcg((sIdx + 3) * 53 + (qIdx + 7) * 101)
    let v = 100
    const data: number[] = []
    for (let i = 0; i < 24; i++) {
      v += (rnd() - 0.45) * 6
      data.push(Number(v.toFixed(1)))
    }
    return { col: q, row: sector, data }
  })
)

export const SectorReturns: Story = {
  name: 'Sector returns by quarter',
  args: {
    columns: QUARTERS,
    rows: SECTORS,
    cells: SECTOR_CELLS,
    cornerLabel: 'Sector / Q',
    colorByTrend: true,
    area: true,
    curve: 'smooth',
    height: 420,
    formatValue: (v: number) => v.toFixed(0),
  },
  render: args => (
    <div className="w-full rounded-xl border border-ds-default bg-ds-surface p-5">
      <div className="mb-1 text-heading-sm font-semibold text-ds-default">
        Sector performance
      </div>
      <p className="mb-4 max-w-[60ch] text-body-sm text-ds-subtle">
        Indexed return per sector across the four quarters — a compact way to
        scan many series at once without a wall of legends.
      </p>
      <LineMatrix {...args} />
    </div>
  ),
}

const CRYPTO: Pair[] = [
  { label: 'BTC', base: 64000, vol: 1800 },
  { label: 'ETH', base: 3400, vol: 120 },
  { label: 'SOL', base: 148, vol: 9 },
  { label: 'XRP', base: 0.58, vol: 0.03 },
  { label: 'BNB', base: 590, vol: 22 },
]

const CRYPTO_CELLS: LineMatrixCell[] = CRYPTO.flatMap((coin, coinIdx) =>
  DAYS.map((day, dayIdx) => ({
    col: day,
    row: coin.label,
    data: cellData(dayIdx, coinIdx + 20, coin),
  }))
)

const compact = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v >= 1 ? v.toFixed(0) : v.toFixed(2)

type Dataset = {
  key: string
  label: string
  columns: (string | number)[]
  rows: (string | LineMatrixRow)[]
  cells: LineMatrixCell[]
  cornerLabel: string
  formatValue: (v: number) => string
  instruments: string[]
}

const DATASETS: Dataset[] = [
  {
    key: 'fx',
    label: 'FX rates',
    columns: DAYS,
    rows: ROWS,
    cells: CELLS,
    cornerLabel: 'Pair / Day',
    formatValue: fmtRate,
    instruments: PAIRS.map(p => p.label),
  },
  {
    key: 'crypto',
    label: 'Crypto',
    columns: DAYS,
    rows: CRYPTO.map(c => c.label),
    cells: CRYPTO_CELLS,
    cornerLabel: 'Coin / Day',
    formatValue: compact,
    instruments: CRYPTO.map(c => c.label),
  },
  {
    key: 'sectors',
    label: 'Sector returns',
    columns: QUARTERS,
    rows: SECTORS,
    cells: SECTOR_CELLS,
    cornerLabel: 'Sector / Q',
    formatValue: (v: number) => v.toFixed(0),
    instruments: SECTORS,
  },
]

const CURVES: LineCurve[] = ['straight', 'smooth', 'stepped']

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      size="sm"
      variant={active ? 'primary' : 'outlineLight'}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function PlaygroundDemo() {
  const [datasetKey, setDatasetKey] = useState('fx')
  const [curve, setCurve] = useState<LineCurve>('straight')
  const [area, setArea] = useState(true)
  const [trend, setTrend] = useState(true)
  const [zoom, setZoom] = useState(true)
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const dataset = DATASETS.find(d => d.key === datasetKey) ?? DATASETS[0]

  const selectDataset = (key: string) => {
    setDatasetKey(key)
    setHidden(new Set())
  }

  const toggleRow = (label: string) =>
    setHidden(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })

  const rows = useMemo(
    () =>
      dataset.rows.filter(r => (typeof r === 'string' ? !hidden.has(r) : true)),
    [dataset, hidden]
  )
  const cells = useMemo(
    () => dataset.cells.filter(c => !hidden.has(c.row)),
    [dataset, hidden]
  )

  const datasetItems: DropdownItemDef[] = [
    { type: 'label', label: 'Dataset' },
    ...DATASETS.map(d => ({
      type: 'radio' as const,
      label: d.label,
      value: d.key,
      checked: d.key === datasetKey,
    })),
  ]
  const curveItems: DropdownItemDef[] = [
    { type: 'label', label: 'Curve' },
    ...CURVES.map(c => ({
      type: 'radio' as const,
      label: c,
      value: c,
      checked: c === curve,
    })),
  ]

  return (
    <div className="w-full rounded-xl border border-ds-default bg-ds-surface p-5">
      <div className="mb-1 text-heading-sm font-semibold text-ds-default">
        Market matrix
      </div>
      <p className="mb-4 text-body-sm text-ds-subtle">
        Switch datasets, tweak the rendering, and click an instrument chip to
        show or hide its row.
      </p>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Dropdown
          align="start"
          trigger={
            <Button size="sm" variant="outlineSecondary">
              {dataset.label}
              <span aria-hidden className="ml-1.5 text-ds-subtle">
                ▾
              </span>
            </Button>
          }
          items={datasetItems}
          onSelect={selectDataset}
        />

        <Dropdown
          align="start"
          trigger={
            <Button size="sm" variant="outlineSecondary">
              Curve: {curve}
              <span aria-hidden className="ml-1.5 text-ds-subtle">
                ▾
              </span>
            </Button>
          }
          items={curveItems}
          onSelect={value => setCurve(value as LineCurve)}
        />

        <span className="mx-1 h-5 w-px bg-ds-default" aria-hidden />

        <Toggle active={area} onClick={() => setArea(a => !a)}>
          Area
        </Toggle>
        <Toggle active={trend} onClick={() => setTrend(t => !t)}>
          Trend colors
        </Toggle>
        <Toggle active={zoom} onClick={() => setZoom(z => !z)}>
          Zoom
        </Toggle>

        {trend && (
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="success" size="sm">
              Up
            </Badge>
            <Badge variant="destructive" size="sm">
              Down
            </Badge>
          </div>
        )}
      </div>

      {/* Instrument filter chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {dataset.instruments.map(label => {
          const isHidden = hidden.has(label)
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleRow(label)}
              className="cursor-pointer"
              aria-pressed={!isHidden}
            >
              <Badge
                variant={isHidden ? 'outlineLight' : 'outlineSecondary'}
                size="sm"
                className={isHidden ? 'opacity-50' : undefined}
              >
                {label}
              </Badge>
            </button>
          )
        })}
      </div>

      {cells.length ? (
        <LineMatrix
          columns={dataset.columns}
          rows={rows}
          cells={cells}
          cornerLabel={dataset.cornerLabel}
          formatValue={dataset.formatValue}
          colorByTrend={trend}
          area={area}
          curve={curve}
          zoom={zoom}
          height={dataset.key === 'sectors' ? 380 : 520}
        />
      ) : (
        <div className="flex h-[200px] items-center justify-center text-body-sm text-ds-subtle">
          All rows hidden — click a chip to bring one back.
        </div>
      )}
    </div>
  )
}

export const Playground: Story = {
  name: 'Interactive playground',
  parameters: {
    controls: { disable: true },
    options: { showPanel: false },
  },
  render: () => <PlaygroundDemo />,
}
