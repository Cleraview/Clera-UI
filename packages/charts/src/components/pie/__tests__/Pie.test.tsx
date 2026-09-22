import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Pie } from '../Pie'
import { buildPieOption } from '../buildOption'

const baseParams = {
  startAngle: 90,
  padAngle: 0,
  borderRadius: 0,
  roseType: false as const,
  palette: 'categorical' as const,
  showLabels: true,
  labelOnHover: false,
  labelOnClick: false,
  labelPosition: 'outside' as const,
  labelAlignTo: 'none' as const,
  showLabelLine: true,
  showTooltip: true,
  legendPosition: 'bottom' as const,
  scrollableLegend: false,
  highlightOnHover: false,
  selectedMode: false as const,
  formatValue: (v: number) => String(v),
  animate: false,
  emptyMessage: 'No data',
}

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ PieChart: {} }))
jest.mock('echarts/components', () => ({
  TooltipComponent: {},
  TitleComponent: {},
  LegendComponent: {},
}))
jest.mock('echarts/renderers', () => ({ CanvasRenderer: {} }))

const mockObserve = jest.fn()
const mockDisconnect = jest.fn()
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
}))

let mutationCallback: (() => void) | undefined
global.MutationObserver = jest.fn().mockImplementation(cb => {
  mutationCallback = cb
  return { observe: jest.fn(), disconnect: jest.fn(), takeRecords: jest.fn() }
}) as unknown as typeof MutationObserver

function makeMockChart() {
  return {
    setOption: jest.fn(),
    dispose: jest.fn(),
    resize: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
    getZr: jest.fn(() => ({ on: jest.fn(), off: jest.fn() })),
    dispatchAction: jest.fn(),
    getWidth: jest.fn(() => 480),
    getHeight: jest.fn(() => 360),
    getOption: jest.fn(() => ({ series: [] })),
  }
}

const sample = [
  { label: 'Search', value: 40 },
  { label: 'Direct', value: 35 },
  { label: 'Email', value: 25 },
]

describe('components/charts/Pie', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with pie aria attributes', () => {
    render(<Pie data={sample} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Pie chart')
    expect(container).toHaveAttribute('data-testid', 'pie-chart')
  })

  it('initialises echarts on mount', () => {
    render(<Pie data={sample} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
  })

  it('renders a pie series', () => {
    render(<Pie data={sample} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('pie')
    expect(option.series[0].data).toHaveLength(3)
  })

  it('turns into a doughnut with innerRadius', () => {
    render(<Pie data={sample} innerRadius="55%" />)
    expect(lastOption().series[0].radius).toEqual(['55%', '75%'])
  })

  it('defaults to a full pie (no hole)', () => {
    render(<Pie data={sample} />)
    expect(lastOption().series[0].radius).toEqual([0, '75%'])
  })

  it('sweeps a half doughnut with startAngle/endAngle', () => {
    render(<Pie data={sample} startAngle={180} endAngle={360} />)
    const { series } = lastOption()
    expect(series[0].startAngle).toBe(180)
    expect(series[0].endAngle).toBe(360)
  })

  it('applies padAngle and rounded, separated slices', () => {
    render(<Pie data={sample} padAngle={3} borderRadius={8} />)
    const { series } = lastOption()
    expect(series[0].padAngle).toBe(3)
    expect(series[0].itemStyle.borderRadius).toBe(8)
    expect(series[0].itemStyle.borderWidth).toBe(2)
  })

  it('keeps slices flush by default (no border)', () => {
    render(<Pie data={sample} />)
    expect(lastOption().series[0].itemStyle.borderWidth).toBe(0)
  })

  it('enables the Nightingale rose with roseType', () => {
    render(<Pie data={sample} roseType="area" />)
    expect(lastOption().series[0].roseType).toBe('area')
  })

  it('omits roseType for a normal pie', () => {
    render(<Pie data={sample} />)
    expect(lastOption().series[0].roseType).toBeUndefined()
  })

  it('positions labels inside when asked', () => {
    render(<Pie data={sample} labelPosition="inside" />)
    expect(lastOption().series[0].label.position).toBe('inside')
  })

  it('aligns outside labels to the edge', () => {
    render(<Pie data={sample} labelAlignTo="edge" />)
    expect(lastOption().series[0].label.alignTo).toBe('edge')
  })

  it('renders a label from labelFormatter (name + percent)', () => {
    render(
      <Pie
        data={sample}
        labelFormatter={({ name, percent }) => `${name} ${percent}%`}
      />
    )
    const { label } = lastOption().series[0]
    expect(label.formatter({ name: 'Search', value: 40, percent: 40 })).toBe(
      'Search 40%'
    )
  })

  it('keeps labels hidden at rest and off on hover by default', () => {
    render(<Pie data={sample} showLabels={false} />)
    const { series } = lastOption()
    expect(series[0].label.show).toBe(false)
    expect(series[0].emphasis.label).toBeUndefined()
  })

  it('reveals a slice label on hover when labelOnHover and labels are hidden', () => {
    render(<Pie data={sample} showLabels={false} labelOnHover />)
    const { series } = lastOption()
    expect(series[0].label.show).toBe(false)
    expect(series[0].emphasis.label.show).toBe(true)
  })

  it('renders a datum detail as a rich table label', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions', 'Share'],
      rows: [{ icon: 'data:image/svg+xml,x', cells: ['10', '50%'] }],
    }
    render(
      <Pie
        data={[
          { label: 'Aurora', value: 10, detail },
          { label: 'Belmont', value: 5 },
        ]}
      />
    )
    const { label } = lastOption().series[0].data[0]
    expect(typeof label.formatter).toBe('string')
    expect(label.formatter).toContain('{title|Aurora}')
    expect(label.rich.ic0.backgroundColor.image).toBe('data:image/svg+xml,x')
    expect(label.show).toBe(true)
    expect(lastOption().series[0].data[1].label).toBeUndefined()
  })

  it('hides a detail label when showLabels is false', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions'],
      rows: [{ icon: 'data:x', cells: ['10'] }],
    }
    render(
      <Pie data={[{ label: 'Aurora', value: 10, detail }]} showLabels={false} />
    )
    expect(lastOption().series[0].data[0].label.show).toBe(false)
  })

  it('reveals a hidden detail table on hover', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions'],
      rows: [{ icon: 'data:x', cells: ['10'] }],
    }
    render(
      <Pie data={[{ label: 'Aurora', value: 10, detail }]} showLabels={false} />
    )
    const item = lastOption().series[0].data[0]
    expect(item.label.show).toBe(false)
    expect(item.emphasis.label.show).toBe(true)
  })

  it('lets rich cards use the default layout so ECharts keeps them on-screen', () => {
    const richLabel = { formatter: '{x|Access From}' }
    const data = [{ label: 'A', value: 1, richLabel }]
    const { rerender } = render(<Pie data={data} />)
    const full = lastOption().series[0].data[0].label
    rerender(<Pie data={data} compact />)
    const compact = lastOption().series[0].data[0].label
    expect(compact.width).toBeUndefined()
    expect(compact.alignTo).toBeUndefined()
    expect(compact.overflow).toBeUndefined()
    expect(compact.padding).toEqual(full.padding)
  })

  it('drops the detail card for a plain inside label when stacked', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions'],
      rows: [{ icon: 'data:x', label: 'Mobile', cells: ['10'] }],
    }
    const opt = buildPieOption({
      ...baseParams,
      data: [{ label: 'Aurora', value: 10, detail }],
      stacked: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
    const series = opt.series[0]
    expect(series.label.position).toBe('inside')
    expect(series.data[0].label.rich).toBeUndefined()
    expect(series.data[0].label.formatter).toBeUndefined()
    expect(series.data[0].emphasis.label).toBeUndefined()
  })

  it('keeps the detail card when not stacked', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions'],
      rows: [{ icon: 'data:x', label: 'Mobile', cells: ['10'] }],
    }
    render(<Pie data={[{ label: 'Aurora', value: 10, detail }]} />)
    expect(screen.queryByTestId('pie-detail-panel')).toBeNull()
    expect(lastOption().series[0].data[0].label.rich).toBeDefined()
  })

  it('reveals labels only on select (click) when labelOnClick', () => {
    render(
      <Pie
        data={[
          { label: 'A', value: 1, richLabel: { formatter: '{x|A}' } },
          { label: 'B', value: 2 },
        ]}
        labelOnClick
      />
    )
    const series = lastOption().series[0]
    expect(series.selectedMode).toBe('single')
    expect(series.data[0].label.show).toBe(false)
    expect(series.data[0].labelLine.show).toBe(false)
    expect(series.data[0].emphasis.label).toBeUndefined()
  })

  it('keeps an explicit selectedMode under labelOnClick', () => {
    render(
      <Pie
        series={[
          {
            name: 'Inner',
            data: [{ label: 'A', value: 1 }],
            selectedMode: 'multiple',
          },
        ]}
        labelOnClick
      />
    )
    expect(lastOption().series[0].selectedMode).toBe('multiple')
  })

  it('unselects other series on a slice click under labelOnClick', () => {
    mockChart.getOption.mockReturnValue({
      series: [{ data: [{}] }, { data: [{}, {}] }],
    })
    render(
      <Pie
        series={[
          { name: 'Inner', data: [{ label: 'A', value: 1 }] },
          {
            name: 'Outer',
            data: [
              { label: 'B', value: 2 },
              { label: 'C', value: 3 },
            ],
          },
        ]}
        labelOnClick
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ seriesIndex: 0, name: 'A', dataIndex: 0 })
    const actions = mockChart.dispatchAction.mock.calls.map(c => c[0])
    expect(actions).toContainEqual(
      expect.objectContaining({ type: 'unselect', seriesIndex: 1 })
    )
    expect(actions.some(a => a.seriesIndex === 0)).toBe(false)
  })

  it('shrinks a detail table in compact mode', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions', 'Share'],
      rows: [{ icon: 'data:x', cells: ['10', '50%'] }],
    }
    const data = [{ label: 'Aurora', value: 10, detail }]
    const { rerender } = render(<Pie data={data} />)
    const full = lastOption().series[0].data[0].label
    rerender(<Pie data={data} compact />)
    const compact = lastOption().series[0].data[0].label
    expect(compact.rich.h0.width).toBeLessThan(full.rich.h0.width)
    expect(compact.rich.h0.fontSize).toBeLessThan(full.rich.h0.fontSize)
    expect(compact.rich.ic0.height).toBeLessThan(full.rich.ic0.height)
    // uniform card padding on all four sides, in both densities
    expect(full.padding).toEqual([8, 10, 8, 10])
    expect(compact.padding).toEqual([6, 8, 6, 8])
  })

  it('honors an explicit detail.padding as the card padding', () => {
    const detail = {
      title: 'Aurora',
      columns: ['Device', 'Sessions'],
      rows: [{ label: 'Mobile', cells: ['10'] }],
      padding: [12, 14, 12, 14],
    }
    render(<Pie data={[{ label: 'Aurora', value: 10, detail }]} />)
    expect(lastOption().series[0].data[0].label.padding).toEqual([
      12, 14, 12, 14,
    ])
  })

  it('injects a raw richLabel and joins an array formatter', () => {
    const richLabel = {
      formatter: ['{title|Cedar}', '{spark|}'],
      rich: { spark: { backgroundColor: { image: 'data:img' } } },
    }
    render(<Pie data={[{ label: 'Cedar', value: 10, richLabel }]} />)
    const item = lastOption().series[0].data[0]
    expect(item.label.formatter).toBe('{title|Cedar}\n{spark|}')
    expect(item.label.rich.spark.backgroundColor.image).toBe('data:img')
    expect(item.label.show).toBe(true)
    expect(item.emphasis.label.show).toBe(true)
  })

  it('ties a richLabel to showLabels and reveals it on hover', () => {
    const richLabel = { formatter: '{title|Cedar}' }
    render(
      <Pie
        data={[{ label: 'Cedar', value: 10, richLabel }]}
        showLabels={false}
      />
    )
    const item = lastOption().series[0].data[0]
    expect(item.label.show).toBe(false)
    expect(item.emphasis.label.show).toBe(true)
  })

  it('applies per-series selectedMode and pre-selects a datum (nested)', () => {
    render(
      <Pie
        series={[
          {
            name: 'Inner',
            data: [
              { label: 'X', value: 1, selected: true },
              { label: 'Y', value: 2 },
            ],
            selectedMode: 'single',
          },
          { name: 'Outer', data: [{ label: 'Z', value: 3 }] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].selectedMode).toBe('single')
    expect(series[0].data[0].selected).toBe(true)
    expect(series[1].selectedMode).toBe(false)
  })

  it('applies a series-level richLabel and joins its formatter', () => {
    render(
      <Pie
        series={[
          {
            name: 'Access',
            data: [{ label: 'X', value: 1 }],
            richLabel: { formatter: ['{a|{a}}', '{b|{b}}'] },
          },
        ]}
      />
    )
    expect(lastOption().series[0].label.formatter).toBe('{a|{a}}\n{b|{b}}')
  })

  it('gives inside labels a text color that contrasts the slice fill', () => {
    render(
      <Pie
        labelPosition="inside"
        data={[
          { label: 'Light', value: 1, color: 'rgb(240, 240, 240)' },
          { label: 'Dark', value: 1, color: 'rgb(20, 20, 60)' },
        ]}
      />
    )
    const { data } = lastOption().series[0]
    expect(data[0].label.color).toBe('rgb(23, 23, 23)')
    expect(data[1].label.color).toBe('rgb(250, 250, 250)')
  })

  it('makes the legend scrollable when scrollableLegend', () => {
    render(<Pie data={sample} scrollableLegend />)
    expect(lastOption().legend.type).toBe('scroll')
  })

  it('shows the legend for a single pie by default', () => {
    render(<Pie data={sample} />)
    expect(lastOption().legend.show).toBe(true)
  })

  it('hides the legend for multiple pies by default', () => {
    render(
      <Pie
        series={[
          { name: 'A', data: sample },
          { name: 'B', data: sample },
        ]}
      />
    )
    const option = lastOption()
    expect(option.series).toHaveLength(2)
    expect(option.legend.show).toBe(false)
  })

  it('includes the percent in single-pie tooltips', () => {
    render(<Pie data={sample} />)
    expect(
      lastOption().tooltip.formatter({ name: 'Search', value: 40, percent: 40 })
    ).toBe('Search: 40 (40%)')
  })

  it('prefixes the series name in multi-pie tooltips', () => {
    render(
      <Pie
        series={[
          { name: 'Q1', data: sample },
          { name: 'Q2', data: sample },
        ]}
      />
    )
    expect(
      lastOption().tooltip.formatter({
        name: 'Search',
        value: 40,
        percent: 40,
        seriesName: 'Q1',
      })
    ).toBe('Q1 · Search: 40 (40%)')
  })

  it('dims other slices on hover when highlightOnHover', () => {
    render(<Pie data={sample} highlightOnHover />)
    expect(lastOption().series[0].emphasis.focus).toBe('self')
  })

  it('keeps other slices visible on hover by default', () => {
    render(<Pie data={sample} />)
    expect(lastOption().series[0].emphasis.focus).toBeUndefined()
  })

  it('honors a per-datum custom color', () => {
    render(
      <Pie
        data={[
          { label: 'A', value: 10, color: '#ff0000' },
          { label: 'B', value: 20 },
        ]}
      />
    )
    const colors = lastOption().series[0].data.map(
      (d: { itemStyle: { color: string } }) => d.itemStyle.color
    )
    expect(colors).toContain('#ff0000')
  })

  it('resolves a variant to a token color', () => {
    render(<Pie data={[{ label: 'A', value: 10, variant: 'success' }]} />)
    expect(lastOption().series[0].data[0].itemStyle.color).toMatch(/^rgb/)
  })

  it('renders an empty-state title when there is no data', () => {
    render(<Pie data={[]} emptyMessage="Nothing" />)
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('maps a click back to the datum', () => {
    const onSliceClick = jest.fn()
    render(<Pie data={sample} onSliceClick={onSliceClick} />)
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ name: 'Direct' })
    expect(onSliceClick).toHaveBeenCalledWith(sample[1], 1)
  })

  it('maps a click across multiple pie series', () => {
    const onSliceClick = jest.fn()
    render(
      <Pie
        series={[
          { name: 'A', data: [{ label: 'One', value: 1 }] },
          { name: 'B', data: [{ label: 'Two', value: 2 }] },
        ]}
        onSliceClick={onSliceClick}
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ name: 'Two' })
    expect(onSliceClick).toHaveBeenCalledWith({ label: 'Two', value: 2 }, 1)
  })

  it('re-applies options on a theme change', () => {
    render(<Pie data={sample} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('calls onReady with the chart instance', () => {
    const onReady = jest.fn()
    render(<Pie data={sample} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('shows the loading overlay when loading', () => {
    render(<Pie data={sample} loading />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('disposes on unmount', () => {
    const { unmount } = render(<Pie data={sample} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
