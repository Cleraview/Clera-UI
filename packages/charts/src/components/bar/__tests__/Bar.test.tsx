import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Bar } from '../Bar'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ BarChart: {} }))
jest.mock('echarts/components', () => ({
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
  LegendComponent: {},
  MarkLineComponent: {},
  MarkPointComponent: {},
  DataZoomComponent: {},
  BrushComponent: {},
  ToolboxComponent: {},
  GraphicComponent: {},
}))
jest.mock('echarts/features', () => ({ AxisBreak: {} }))
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
    dispatchAction: jest.fn(),
    getOption: jest.fn(() => ({ dataZoom: [] })),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  }
}

const sample = [
  { label: 'Mobile', value: 80 },
  { label: 'Desktop', value: 40 },
  { label: 'Tablet', value: 20 },
]

describe('components/charts/Bar', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container div with correct aria attributes', () => {
    render(<Bar data={sample} />)
    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('aria-label', 'Bar chart')
    expect(container).toHaveAttribute('data-testid', 'bar-chart')
  })

  it('initialises echarts on mount with the container element', () => {
    render(<Bar data={sample} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
    const [el] = (echarts.init as jest.Mock).mock.calls[0]
    expect(el).toBeInstanceOf(HTMLDivElement)
  })

  it('calls setOption with bar series data on mount', () => {
    render(<Bar data={sample} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('bar')
    expect(option.series[0].data).toHaveLength(3)
  })

  it('disposes the chart and disconnects the observer on unmount', () => {
    const { unmount } = render(<Bar data={sample} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('updates chart options when data prop changes', () => {
    const { rerender } = render(<Bar data={sample} />)
    rerender(<Bar data={[{ label: 'New', value: 100 }]} />)
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('re-resolves colors and re-applies options on a theme change', () => {
    render(<Bar data={sample} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('hides labels when showValues is false', () => {
    render(<Bar data={sample} showValues={false} />)
    expect(lastOption().series[0].label.show).toBe(false)
  })

  it('shows labels when showValues is true (default)', () => {
    render(<Bar data={sample} />)
    expect(lastOption().series[0].label.show).toBe(true)
  })

  it('reserves headroom for the top label in vertical direction', () => {
    render(<Bar data={sample} direction="vertical" showValues />)
    expect(lastOption().grid.top).toBeGreaterThan(12)
  })

  it('does not force a max by default so the axis keeps headroom', () => {
    render(<Bar data={sample} />)
    expect(lastOption().xAxis.max).toBeUndefined()
  })

  it('applies a custom formatter to labels', () => {
    render(
      <Bar
        data={[{ label: 'Revenue', value: 1234 }]}
        formatValue={v => `$${v}`}
      />
    )
    const formatted = lastOption().series[0].label.formatter({ value: 1234 })
    expect(formatted).toBe('$1234')
  })

  it('removes the white label stroke (textBorderWidth 0)', () => {
    render(<Bar data={sample} />)
    expect(lastOption().series[0].label.textBorderWidth).toBe(0)
  })

  it('colors the label using a resolved theme color', () => {
    render(<Bar data={sample} />)
    expect(lastOption().series[0].label.color).toMatch(/^rgb/)
  })

  it('gives each datum a lighter emphasis (hover) color', () => {
    render(<Bar data={[{ label: 'A', value: 10, variant: 'destructive' }]} />)
    const item = lastOption().series[0].data[0]
    const base = item.itemStyle.color
    const hover = item.emphasis.itemStyle.color
    expect(base).toMatch(/^rgb/)
    expect(hover).not.toBe(base)
    const sum = (c: string) =>
      (c.match(/\d+/g) ?? []).slice(0, 3).reduce((a, n) => a + Number(n), 0)
    expect(sum(hover)).toBeGreaterThan(sum(base))
  })

  it('rounds bar corners using barRadius', () => {
    render(<Bar data={sample} barRadius={8} direction="vertical" />)
    expect(lastOption().series[0].data[0].itemStyle.borderRadius).toEqual([
      8, 8, 0, 0,
    ])
  })

  it('applies an explicit barWidth as barMaxWidth', () => {
    render(<Bar data={sample} barWidth={24} />)
    expect(lastOption().series[0].barMaxWidth).toBe(24)
  })

  it('assigns distinct categorical colors when palette is categorical', () => {
    render(<Bar data={sample} palette="categorical" />)
    const [a, b] = lastOption().series[0].data
    expect(a.itemStyle.color).not.toBe(b.itemStyle.color)
  })

  it('uses a single brand color by default', () => {
    render(<Bar data={sample} />)
    const colors = lastOption().series[0].data.map(
      (d: { itemStyle: { color: string } }) => d.itemStyle.color
    )
    expect(new Set(colors).size).toBe(1)
  })

  it('sorts bars descending when sort is desc', () => {
    render(<Bar data={sample} direction="vertical" sort="desc" />)
    expect(lastOption().xAxis.data).toEqual(['Mobile', 'Desktop', 'Tablet'])
  })

  it('sorts bars ascending when sort is asc', () => {
    render(<Bar data={sample} direction="vertical" sort="asc" />)
    expect(lastOption().xAxis.data).toEqual(['Tablet', 'Desktop', 'Mobile'])
  })

  it('draws a reference line on the value axis', () => {
    render(
      <Bar data={sample} direction="vertical" referenceLine={{ value: 50 }} />
    )
    const { markLine } = lastOption().series[0]
    expect(markLine.data[0]).toEqual({ yAxis: 50 })
  })

  it('labels the reference line when a label is given', () => {
    render(<Bar data={sample} referenceLine={{ value: 50, label: 'Target' }} />)
    const { markLine } = lastOption().series[0]
    expect(markLine.label.formatter()).toBe('Target')
  })

  it('renders the reference label as a pill at the line end so it clears bars', () => {
    render(<Bar data={sample} referenceLine={{ value: 50, label: 'Target' }} />)
    const { label } = lastOption().series[0].markLine
    expect(label.position).toBe('end')
    expect(label.backgroundColor).toMatch(/^rgb/)
    expect(label.borderColor).toMatch(/^rgb/)
  })

  it('keeps the reference label horizontal in horizontal direction', () => {
    render(
      <Bar
        data={sample}
        direction="horizontal"
        referenceLine={{ value: 50, label: 'Target' }}
      />
    )
    expect(lastOption().series[0].markLine.label.rotate).toBe(0)
  })

  it('reserves right margin for the reference label in vertical direction', () => {
    render(
      <Bar
        data={sample}
        direction="vertical"
        referenceLine={{ value: 50, label: 'Target' }}
      />
    )
    expect(lastOption().grid.right).toBeGreaterThanOrEqual(64)
  })

  it('reserves top margin for the reference label in horizontal direction', () => {
    render(
      <Bar
        data={sample}
        direction="horizontal"
        referenceLine={{ value: 50, label: 'Target' }}
      />
    )
    expect(lastOption().grid.top).toBeGreaterThanOrEqual(28)
  })

  it('renders one series per entry with a legend when grouped', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Q1', 'Q2']}
        series={[
          { name: 'New', data: [10, 20] },
          { name: 'Returning', data: [5, 8] },
        ]}
      />
    )
    const option = lastOption()
    expect(option.series).toHaveLength(2)
    expect(option.legend.show).toBe(true)
    expect(option.legend.data).toEqual(['New', 'Returning'])
  })

  it('gives grouped series distinct colors', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Q1']}
        series={[
          { name: 'New', data: [10] },
          { name: 'Returning', data: [5] },
        ]}
      />
    )
    const [a, b] = lastOption().series
    expect(a.itemStyle.color).not.toBe(b.itemStyle.color)
  })

  it('hides the legend when showLegend is false', () => {
    render(
      <Bar
        direction="vertical"
        showLegend={false}
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    expect(lastOption().legend.show).toBe(false)
  })

  it('places the legend on top by default and reserves top margin', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    const option = lastOption()
    expect(option.legend.orient).toBe('horizontal')
    expect(option.legend.top).toBe(0)
    expect(option.grid.top).toBeGreaterThanOrEqual(36)
  })

  it('places the legend at the bottom and reserves bottom margin', () => {
    render(
      <Bar
        direction="vertical"
        legendPosition="bottom"
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    const option = lastOption()
    expect(option.legend.orient).toBe('horizontal')
    expect(option.legend.bottom).toBe(0)
    expect(option.grid.bottom).toBeGreaterThanOrEqual(36)
  })

  it('places the legend on the left as a vertical list and reserves left margin', () => {
    render(
      <Bar
        direction="vertical"
        legendPosition="left"
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    const option = lastOption()
    expect(option.legend.orient).toBe('vertical')
    expect(option.legend.left).toBe(0)
    expect(option.legend.top).toBe('middle')
    expect(option.grid.left).toBeGreaterThanOrEqual(64)
  })

  it('places the legend on the right as a vertical list and reserves right margin', () => {
    render(
      <Bar
        direction="vertical"
        legendPosition="right"
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    const option = lastOption()
    expect(option.legend.orient).toBe('vertical')
    expect(option.legend.right).toBe(0)
    expect(option.grid.right).toBeGreaterThanOrEqual(64)
  })

  it('stacks grouped series onto a shared stack when stacked', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        categories={['Q1', 'Q2']}
        series={[
          { name: 'New', data: [10, 20] },
          { name: 'Returning', data: [5, 8] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].stack).toBe('total')
    expect(series[1].stack).toBe('total')
  })

  it('rounds only the outer segment of a stack', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        barRadius={8}
        categories={['Q1']}
        series={[
          { name: 'New', data: [10] },
          { name: 'Returning', data: [5] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].itemStyle.borderRadius).toEqual([0, 0, 0, 0])
    expect(series[1].itemStyle.borderRadius).toEqual([8, 8, 0, 0])
  })

  it('does not stack grouped series by default', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    expect(lastOption().series[0].stack).toBeUndefined()
  })

  it('places stacked value labels inside the segments', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        showValues
        categories={['Q1']}
        series={[{ name: 'New', data: [10] }]}
      />
    )
    expect(lastOption().series[0].label.position).toBe('inside')
  })

  it('renders a track background behind bars when showTrack is set', () => {
    render(<Bar data={sample} showTrack />)
    const s = lastOption().series[0]
    expect(s.showBackground).toBe(true)
    expect(s.backgroundStyle.color).toMatch(/^rgb/)
  })

  it('uses a custom track color when provided', () => {
    render(<Bar data={sample} showTrack trackColor="#abcdef" />)
    expect(lastOption().series[0].backgroundStyle.color).toBe('#abcdef')
  })

  it('omits the track background by default', () => {
    render(<Bar data={sample} />)
    expect(lastOption().series[0].showBackground).toBe(false)
  })

  it('honors a per-datum custom color over the palette', () => {
    render(
      <Bar
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

  it('honors a per-series custom color over the palette', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Q1']}
        series={[{ name: 'New', data: [10], color: '#00ff00' }]}
      />
    )
    expect(lastOption().series[0].itemStyle.color).toBe('#00ff00')
  })

  it('flips the corner radius to the far end for negative bars', () => {
    render(
      <Bar
        direction="vertical"
        barRadius={6}
        data={[
          { label: 'Up', value: 10 },
          { label: 'Down', value: -10 },
        ]}
      />
    )
    const items = lastOption().series[0].data
    const up = items.find((d: { value: number }) => d.value === 10)
    const down = items.find((d: { value: number }) => d.value === -10)
    expect(up.itemStyle.borderRadius).toEqual([6, 6, 0, 0])
    expect(down.itemStyle.borderRadius).toEqual([0, 0, 6, 6])
  })

  it('marks a silent series non-interactive and hides its label', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        categories={['Q1', 'Q2']}
        series={[
          { name: 'base', data: [0, 5], color: 'transparent', silent: true },
          { name: 'Change', data: [10, 8] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].silent).toBe(true)
    expect(series[0].label.show).toBe(false)
    expect(series[1].silent).toBe(false)
  })

  it('excludes silent series from the legend (waterfall base)', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        categories={['Q1', 'Q2']}
        series={[
          { name: 'base', data: [0, 5], color: 'transparent', silent: true },
          { name: 'Change', data: [10, 8] },
        ]}
      />
    )
    expect(lastOption().legend.data).toEqual(['Change'])
  })

  it('animates on load by default', () => {
    render(<Bar data={sample} />)
    expect(lastOption().animation).toBe(true)
  })

  it('disables animation when animate is false', () => {
    render(<Bar data={sample} animate={false} />)
    expect(lastOption().animation).toBe(false)
  })

  it('adds max/min markPoints to each series', () => {
    render(
      <Bar
        direction="vertical"
        markPoints={['max', 'min']}
        categories={['Q1', 'Q2']}
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [3, 4] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].markPoint.data).toEqual([{ type: 'max' }, { type: 'min' }])
    expect(series[1].markPoint.data).toEqual([{ type: 'max' }, { type: 'min' }])
    // markPoints stay put on hover (no emphasis state)
    expect(series[0].markPoint.emphasis.disabled).toBe(true)
  })

  it('draws a per-series average line colored to match each bar', () => {
    render(
      <Bar
        direction="vertical"
        referenceLine="average"
        categories={['Q1', 'Q2']}
        series={[
          { name: 'A', data: [1, 2], variant: 'info' },
          { name: 'B', data: [3, 4], variant: 'success' },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].markLine.data[0].type).toBe('average')
    expect(series[1].markLine.data[0].type).toBe('average')
    // each average line follows its series color
    expect(series[0].markLine.lineStyle.color).not.toBe(
      series[1].markLine.lineStyle.color
    )
    expect(series[0].markLine.lineStyle.color).toBe(series[0].itemStyle.color)
  })

  it('adds a markPoint to a single-series chart', () => {
    render(<Bar data={sample} markPoints={['max']} />)
    expect(lastOption().series[0].markPoint.data).toEqual([{ type: 'max' }])
  })

  it('supports multiple independent stack groups via per-series stack', () => {
    render(
      <Bar
        direction="vertical"
        categories={['Mon', 'Tue']}
        series={[
          { name: 'Direct', data: [10, 12] },
          { name: 'Email', stack: 'Ad', data: [5, 6] },
          { name: 'Union', stack: 'Ad', data: [3, 4] },
          { name: 'Baidu', stack: 'Search', data: [8, 9] },
          { name: 'Google', stack: 'Search', data: [2, 1] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].stack).toBeUndefined()
    expect(series[1].stack).toBe('Ad')
    expect(series[2].stack).toBe('Ad')
    expect(series[3].stack).toBe('Search')
    expect(series[4].stack).toBe('Search')
    // only the outer (last) segment of each stack is rounded
    expect(series[1].itemStyle.borderRadius).toEqual([0, 0, 0, 0])
    expect(series[2].itemStyle.borderRadius).toEqual([4, 4, 0, 0])
    // a standalone bar keeps full rounding
    expect(series[0].itemStyle.borderRadius).toEqual([4, 4, 0, 0])
  })

  it('lightens only the hovered bar on hover by default (no series-wide focus)', () => {
    render(
      <Bar
        direction="vertical"
        stacked
        categories={['Q1', 'Q2']}
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [3, 4] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].emphasis.itemStyle.color).toMatch(/^rgb/)
    expect(series[0].emphasis.focus).toBeUndefined()
    expect(series[0].blur).toBeUndefined()
  })

  it('highlights the whole series and dims the rest when highlightSeries is set', () => {
    render(
      <Bar
        direction="vertical"
        highlightSeries
        categories={['Mon', 'Tue']}
        series={[
          { name: 'Blue', data: [3, 4] },
          { name: 'Red', data: [2, 1] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].emphasis.focus).toBe('series')
    expect(series[1].emphasis.focus).toBe('series')
    expect(series[0].blur.itemStyle.opacity).toBeLessThan(1)
  })

  it('applies axis breaks to the value axis', () => {
    render(
      <Bar
        direction="vertical"
        showValueAxis
        axisBreaks={[{ start: 200, end: 760, gap: '2%' }]}
        data={sample}
      />
    )
    const option = lastOption()
    expect(option.yAxis.breaks).toEqual([{ start: 200, end: 760, gap: '2%' }])
    expect(option.yAxis.breakArea.show).toBe(true)
    expect(option.yAxis.breakArea.expandOnClick).toBe(true)
  })

  it('disables break expand when axisBreakExpandable is false', () => {
    render(
      <Bar
        direction="vertical"
        showValueAxis
        axisBreakExpandable={false}
        axisBreaks={[{ start: 200, end: 760, gap: '2%' }]}
        data={sample}
      />
    )
    expect(lastOption().yAxis.breakArea.expandOnClick).toBe(false)
  })

  it('omits axis breaks when none are given', () => {
    render(<Bar data={sample} direction="vertical" />)
    expect(lastOption().yAxis.breaks).toBeUndefined()
  })

  it('drops the top legend down to share the collapse button row', () => {
    render(
      <Bar
        direction="vertical"
        showValueAxis
        showLegend
        legendPosition="top"
        axisBreaks={[{ start: 200, end: 760, gap: '2%' }]}
        categories={['A', 'B']}
        series={[{ name: 'X', data: [1, 2] }]}
      />
    )
    expect(lastOption().legend.top).toBe(12)
  })

  it('draws a collapse button when a break expands and collapses it on click', () => {
    render(
      <Bar
        direction="vertical"
        showValueAxis
        axisBreaks={[{ start: 200, end: 760, gap: '2%' }]}
        data={sample}
      />
    )

    const onBreakChange = mockChart.on.mock.calls.find(
      c => c[0] === 'axisbreakchanged'
    )?.[1]
    act(() => onBreakChange?.({ breaks: [{ isExpanded: true }] }))

    const graphicCall = mockChart.setOption.mock.calls
      .map(c => c[0])
      .reverse()
      .find(o => o.graphic)
    const button = graphicCall.graphic[0]
    expect(button.ignore).toBe(false)
    const textEl = button.children.find(
      (c: { type: string }) => c.type === 'text'
    )
    expect(textEl.style.text).toBe('Collapse breaks')

    const click = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    act(() => click?.({ name: 'cleraCollapseAxisBreak' }))
    expect(mockChart.dispatchAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'collapseAxisBreak',
        yAxisIndex: 0,
        breaks: [{ start: 200, end: 760, gap: '2%' }],
      })
    )
  })

  it('honors a custom collapse-button label and styles', () => {
    render(
      <Bar
        direction="vertical"
        showValueAxis
        axisBreaks={[{ start: 200, end: 760, gap: '2%' }]}
        axisBreakCollapse={{
          text: 'Reset axis',
          textStyle: { color: 'rgb(1, 2, 3)' },
          buttonStyle: { fill: 'rgb(4, 5, 6)' },
        }}
        data={sample}
      />
    )

    const onBreakChange = mockChart.on.mock.calls.find(
      c => c[0] === 'axisbreakchanged'
    )?.[1]
    act(() => onBreakChange?.({ breaks: [{ isExpanded: true }] }))

    const button = mockChart.setOption.mock.calls
      .map(c => c[0])
      .reverse()
      .find(o => o.graphic).graphic[0]
    const rectEl = button.children.find(
      (c: { type: string }) => c.type === 'rect'
    )
    const textEl = button.children.find(
      (c: { type: string }) => c.type === 'text'
    )
    expect(textEl.style.text).toBe('Reset axis')
    expect(textEl.style.fill).toBe('rgb(1, 2, 3)')
    expect(rectEl.style.fill).toBe('rgb(4, 5, 6)')
  })

  it('renders an empty-state title when data is empty', () => {
    render(<Bar data={[]} emptyMessage="Nothing here" />)
    const option = lastOption()
    expect(option.title.text).toBe('Nothing here')
    expect(option.series).toBeUndefined()
  })

  it('registers a click handler that maps back to the datum', () => {
    const onBarClick = jest.fn()
    render(<Bar data={sample} onBarClick={onBarClick} />)
    expect(mockChart.on).toHaveBeenCalledWith('click', expect.any(Function))
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ name: 'Desktop' })
    expect(onBarClick).toHaveBeenCalledWith(sample[1], 1)
  })

  it('calls onReady with the chart instance on mount', () => {
    const onReady = jest.fn()
    render(<Bar data={sample} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledTimes(1)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('registers hover handlers that map back to the datum', () => {
    const onBarHover = jest.fn()
    const onBarLeave = jest.fn()
    render(
      <Bar data={sample} onBarHover={onBarHover} onBarLeave={onBarLeave} />
    )
    const over = mockChart.on.mock.calls.find(c => c[0] === 'mouseover')?.[1]
    const out = mockChart.on.mock.calls.find(c => c[0] === 'mouseout')?.[1]
    over?.({ componentType: 'series', name: 'Desktop' })
    expect(onBarHover).toHaveBeenCalledWith(sample[1], 1)
    out?.()
    expect(onBarLeave).toHaveBeenCalledTimes(1)
  })

  it('ignores hover events that are not on a bar', () => {
    const onBarHover = jest.fn()
    render(<Bar data={sample} onBarHover={onBarHover} />)
    const over = mockChart.on.mock.calls.find(c => c[0] === 'mouseover')?.[1]
    over?.({ componentType: 'xAxis', name: 'Desktop' })
    expect(onBarHover).not.toHaveBeenCalled()
  })

  it('shows the loading overlay when loading is true', () => {
    render(<Bar data={sample} loading />)
    expect(mockChart.showLoading).toHaveBeenCalled()
    expect(mockChart.hideLoading).not.toHaveBeenCalled()
  })

  it('hides the loading overlay by default', () => {
    render(<Bar data={sample} />)
    expect(mockChart.hideLoading).toHaveBeenCalled()
  })

  it('uses horizontal layout by default (yAxis is category)', () => {
    render(<Bar data={sample} />)
    const option = lastOption()
    expect(option.yAxis.type).toBe('category')
    expect(option.xAxis.type).toBe('value')
  })

  it('uses vertical layout when direction is vertical (xAxis is category)', () => {
    render(<Bar data={sample} direction="vertical" />)
    const option = lastOption()
    expect(option.xAxis.type).toBe('category')
    expect(option.yAxis.type).toBe('value')
  })

  it('applies an explicit max to the value axis', () => {
    render(<Bar data={sample} max={200} />)
    expect(lastOption().xAxis.max).toBe(200)
  })

  it('applies an explicit max in vertical direction', () => {
    render(<Bar data={sample} max={200} direction="vertical" />)
    expect(lastOption().yAxis.max).toBe(200)
  })

  it('hides tooltip when showTooltip is false', () => {
    render(<Bar data={sample} showTooltip={false} />)
    expect(lastOption().tooltip.show).toBe(false)
  })

  it('styles the tooltip with small theme-aware text and a border', () => {
    render(<Bar data={sample} />)
    const { tooltip } = lastOption()
    expect(tooltip.textStyle.fontSize).toBe(11)
    expect(tooltip.textStyle.color).toMatch(/^rgb/)
    expect(tooltip.backgroundColor).toMatch(/^rgb/)
    expect(tooltip.borderColor).toMatch(/^rgb/)
    expect(tooltip.borderWidth).toBe(1)
  })

  it('triggers the tooltip per-bar (item), with no axis-band shadow', () => {
    render(<Bar data={sample} />)
    const { tooltip } = lastOption()
    expect(tooltip.trigger).toBe('item')
    expect(tooltip.axisPointer).toBeUndefined()
  })

  it('formats tooltip content using formatValue', () => {
    render(<Bar data={sample} formatValue={v => `${v}%`} />)
    const { tooltip } = lastOption()
    expect(tooltip.formatter({ name: 'Mobile', value: 80 })).toBe('Mobile: 80%')
  })

  it('lists every series in the tooltip when tooltipTrigger is axis', () => {
    render(
      <Bar
        direction="vertical"
        tooltipTrigger="axis"
        categories={['Mon', 'Tue']}
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [3, 4] },
        ]}
      />
    )
    const { tooltip } = lastOption()
    expect(tooltip.trigger).toBe('axis')
    const html = tooltip.formatter([
      { name: 'Mon', seriesName: 'A', value: 1, marker: '' },
      { name: 'Mon', seriesName: 'B', value: 3, marker: '' },
    ])
    expect(html).toContain('A: 1')
    expect(html).toContain('B: 3')
  })

  it('uses a shadow group band for the axis tooltip (no emphasis on hover-near)', () => {
    render(
      <Bar
        direction="vertical"
        tooltipTrigger="axis"
        categories={['Mon', 'Tue']}
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [3, 4] },
        ]}
      />
    )
    const { axisPointer } = lastOption().tooltip
    expect(axisPointer.type).toBe('shadow')
    expect(axisPointer.triggerEmphasis).toBe(false)
  })

  it('keeps the axis pointer hidden when highlightSeries is on', () => {
    render(
      <Bar
        direction="vertical"
        tooltipTrigger="axis"
        highlightSeries
        categories={['Mon', 'Tue']}
        series={[
          { name: 'A', data: [1, 2] },
          { name: 'B', data: [3, 4] },
        ]}
      />
    )
    expect(lastOption().tooltip.axisPointer.type).toBe('none')
  })

  it('shows a sticky category label on the axis pointer for the axis tooltip', () => {
    render(
      <Bar
        direction="vertical"
        tooltipTrigger="axis"
        categories={['Mon', 'Tue']}
        series={[{ name: 'A', data: [1, 2] }]}
      />
    )
    expect(lastOption().tooltip.axisPointer.label.show).toBe(true)
  })

  it('hides overlapping category labels so dense axes stay readable', () => {
    render(<Bar data={sample} direction="vertical" />)
    expect(lastOption().xAxis.axisLabel.hideOverlap).toBe(true)
  })

  it('hides the value axis by default', () => {
    render(<Bar data={sample} />)
    const option = lastOption()
    expect(option.xAxis.axisLabel.show).toBe(false)
    expect(option.xAxis.splitLine.show).toBe(false)
  })

  it('shows the value axis with formatted ticks when showValueAxis is true', () => {
    render(<Bar data={sample} showValueAxis formatValue={v => `$${v}`} />)
    const option = lastOption()
    expect(option.xAxis.splitLine.show).toBe(true)
    expect(typeof option.xAxis.axisLabel.formatter).toBe('function')
    expect(option.xAxis.axisLabel.formatter(50)).toBe('$50')
  })

  it('can toggle grid lines independently of the value axis', () => {
    render(<Bar data={sample} showValueAxis gridLines={false} />)
    expect(lastOption().xAxis.splitLine.show).toBe(false)
  })

  it('rotates category axis labels with axisLabelRotate', () => {
    render(<Bar data={sample} direction="vertical" axisLabelRotate={45} />)
    expect(lastOption().xAxis.axisLabel.rotate).toBe(45)
  })

  it('applies an explicit value-axis min', () => {
    render(<Bar data={sample} direction="vertical" min={-20} />)
    expect(lastOption().yAxis.min).toBe(-20)
  })

  it('sets axis titles from valueAxisName and categoryAxisName', () => {
    render(
      <Bar
        data={sample}
        direction="vertical"
        valueAxisName="Revenue"
        categoryAxisName="Month"
      />
    )
    expect(lastOption().yAxis.name).toBe('Revenue')
    expect(lastOption().xAxis.name).toBe('Month')
  })

  it('normalizes stacked series to 100% with stackMode="percent"', () => {
    render(
      <Bar
        direction="vertical"
        stackMode="percent"
        categories={['Q1', 'Q2']}
        series={[
          { name: 'A', data: [1, 3] },
          { name: 'B', data: [1, 1] },
        ]}
      />
    )
    const option = lastOption()
    expect(option.series[0].stack).toBe('total')
    expect(option.series[0].data[0]).toBe(50)
    expect(option.series[0].data[1]).toBe(75)
    expect(option.yAxis.max).toBe(100)
  })

  it('adds dataZoom on the category axis when zoom is enabled', () => {
    render(<Bar data={sample} direction="vertical" zoom />)
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(2)
    expect(dataZoom[0].xAxisIndex).toBe(0)
  })

  it('targets the value axis when zoom="value"', () => {
    render(<Bar data={sample} direction="vertical" zoom="value" />)
    expect(lastOption().dataZoom[0].yAxisIndex).toBe(0)
  })

  it('left-aligns the vertical value-axis name so a long title is not clipped', () => {
    render(
      <Bar
        data={sample}
        direction="vertical"
        showValueAxis
        valueAxisName="Budget (USD)"
      />
    )
    expect(lastOption().yAxis.nameTextStyle.align).toBe('left')
  })

  it('puts scroll (inside) zoom on the category axis only for zoom="both"', () => {
    render(<Bar data={sample} direction="vertical" zoom="both" />)
    const insides = lastOption().dataZoom.filter(
      (d: { type: string }) => d.type === 'inside'
    )
    expect(insides).toHaveLength(1)
    expect(insides[0].xAxisIndex).toBe(0)
    expect(insides[0].yAxisIndex).toBeUndefined()
  })

  it('configures inside zoom to zoom-on-wheel and pan-on-drag (no wheel pan)', () => {
    render(<Bar data={sample} direction="vertical" zoom="both" />)
    const inside = lastOption().dataZoom.find(
      (d: { type: string }) => d.type === 'inside'
    )
    expect(inside.zoomOnMouseWheel).toBe(true)
    expect(inside.moveOnMouseMove).toBe(true)
    expect(inside.moveOnMouseWheel).toBe(false)
  })

  it('marks the container as grab-pannable when zoom is enabled', () => {
    const { container } = render(
      <Bar data={sample} direction="vertical" zoom="both" />
    )
    expect(container.firstChild).toHaveClass('[&_canvas]:!cursor-grab')
  })

  const fireWheelIn = (el: HTMLElement) => {
    const evt = new Event('wheel', { cancelable: true, bubbles: true })
    Object.defineProperty(evt, 'deltaY', { value: -100 })
    return !el.dispatchEvent(evt)
  }

  it('swallows zoom-in wheel events when already at the minimum span', () => {
    mockChart.getOption.mockReturnValue({
      dataZoom: [{ type: 'inside', start: 0, end: 4, minSpan: 4 }],
    })
    const { container } = render(
      <Bar data={sample} direction="vertical" zoom="both" />
    )
    expect(fireWheelIn(container.firstChild as HTMLElement)).toBe(true)
  })

  it('lets zoom-in wheel events through when not at the minimum span', () => {
    mockChart.getOption.mockReturnValue({
      dataZoom: [{ type: 'inside', start: 0, end: 60, minSpan: 4 }],
    })
    const { container } = render(
      <Bar data={sample} direction="vertical" zoom="both" />
    )
    expect(fireWheelIn(container.firstChild as HTMLElement)).toBe(false)
  })

  it('zooms both axes with a slider each when zoom="both"', () => {
    render(<Bar data={sample} direction="vertical" zoom="both" />)
    const { dataZoom } = lastOption()
    const sliders = dataZoom.filter(
      (d: { type: string }) => d.type === 'slider'
    )
    expect(sliders).toHaveLength(2)
    expect(
      sliders.some((s: { xAxisIndex?: number }) => s.xAxisIndex === 0)
    ).toBe(true)
    expect(
      sliders.some((s: { yAxisIndex?: number }) => s.yAxisIndex === 0)
    ).toBe(true)
  })

  it('sets a minSpan floor so zoom cannot shrink to nothing', () => {
    render(<Bar data={sample} direction="vertical" zoom="both" />)
    const { dataZoom } = lastOption()
    expect(
      dataZoom.every((d: { minSpan?: number }) => (d.minSpan ?? 0) > 0)
    ).toBe(true)
  })

  it('keeps bars when zooming the value axis (filterMode none, no empty slots)', () => {
    render(<Bar data={sample} direction="vertical" zoom="both" />)
    const { dataZoom } = lastOption()
    const valueZooms = dataZoom.filter(
      (d: { yAxisIndex?: number }) => d.yAxisIndex === 0
    )
    const categoryZooms = dataZoom.filter(
      (d: { xAxisIndex?: number }) => d.xAxisIndex === 0
    )
    expect(valueZooms.length).toBeGreaterThan(0)
    expect(
      valueZooms.every((d: { filterMode: string }) => d.filterMode === 'none')
    ).toBe(true)
    expect(
      categoryZooms.every(
        (d: { filterMode: string }) => d.filterMode === 'filter'
      )
    ).toBe(true)
  })

  it('hides the sliders but keeps inside zoom when zoomSlider is false', () => {
    render(
      <Bar data={sample} direction="vertical" zoom="both" zoomSlider={false} />
    )
    const { dataZoom } = lastOption()
    expect(dataZoom.every((d: { type: string }) => d.type === 'inside')).toBe(
      true
    )
    expect(dataZoom).toHaveLength(2)
  })

  it('enables a brush toolbox when selectable is set', () => {
    render(<Bar data={sample} direction="vertical" selectable />)
    const option = lastOption()
    expect(option.toolbox.feature.brush).toBeDefined()
    expect(option.brush.xAxisIndex).toBe(0)
  })

  it('maps a brush selection back to category labels', () => {
    const onBrushSelect = jest.fn()
    render(
      <Bar
        data={sample}
        direction="vertical"
        selectable
        onBrushSelect={onBrushSelect}
      />
    )
    const handler = mockChart.on.mock.calls.find(
      c => c[0] === 'brushselected'
    )?.[1]
    handler?.({ batch: [{ selected: [{ dataIndex: [0, 2] }] }] })
    expect(onBrushSelect).toHaveBeenCalledWith({
      indices: [0, 2],
      labels: ['Mobile', 'Tablet'],
    })
  })

  it('applies numeric height as inline px style', () => {
    render(<Bar data={sample} height={400} />)
    expect(screen.getByTestId('bar-chart')).toHaveStyle({ height: '400px' })
  })

  it('applies string height as inline style', () => {
    render(<Bar data={sample} height="50vh" />)
    expect(screen.getByTestId('bar-chart')).toHaveStyle({ height: '50vh' })
  })

  it('merges extra className onto the container', () => {
    render(<Bar data={sample} className="my-custom-class" />)
    expect(screen.getByTestId('bar-chart')).toHaveClass('my-custom-class')
  })

  it('observes the container for resize', () => {
    render(<Bar data={sample} />)
    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })

  it('reverses horizontal series data to match top-down label order', () => {
    render(<Bar data={sample} />)
    const yLabels: string[] = lastOption().yAxis.data
    expect(yLabels[0]).toBe(sample[sample.length - 1].label)
  })
})
