import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Line } from '../Line'
import type { LinePoint } from '../types'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ LineChart: {} }))
jest.mock('echarts/components', () => ({
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
  LegendComponent: {},
  MarkLineComponent: {},
  MarkAreaComponent: {},
  MarkPointComponent: {},
  DataZoomComponent: {},
  VisualMapComponent: {},
  AxisPointerComponent: {},
  ToolboxComponent: {},
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
    dispatchAction: jest.fn(),
    getOption: jest.fn(() => ({})),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  }
}

const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const single = [{ name: 'Visits', data: [10, 20, 15, 30, 25] }]
const dual = [
  { name: 'Sessions', data: [10, 20, 15, 30, 25] },
  { name: 'Users', data: [8, 14, 12, 22, 19] },
]

describe('components/charts/Line', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container div with correct aria attributes', () => {
    render(<Line categories={categories} series={single} />)
    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
    expect(container).toHaveAttribute('aria-label', 'Line chart')
    expect(container).toHaveAttribute('data-testid', 'line-chart')
  })

  it('initialises echarts on mount with the container element', () => {
    render(<Line categories={categories} series={single} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
    const [el] = (echarts.init as jest.Mock).mock.calls[0]
    expect(el).toBeInstanceOf(HTMLDivElement)
  })

  it('calls setOption with line series on mount', () => {
    render(<Line categories={categories} series={single} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('line')
    expect(option.series[0].data).toHaveLength(5)
  })

  it('disposes the chart and disconnects the observer on unmount', () => {
    const { unmount } = render(<Line categories={categories} series={single} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('updates chart options when series prop changes', () => {
    const { rerender } = render(
      <Line categories={categories} series={single} />
    )
    rerender(
      <Line
        categories={categories}
        series={[{ name: 'X', data: [1, 2, 3, 4, 5] }]}
      />
    )
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('re-resolves colors and re-applies options on a theme change', () => {
    render(<Line categories={categories} series={single} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('renders an empty-state title when there is no data', () => {
    render(
      <Line categories={categories} series={[]} emptyMessage="Nothing yet" />
    )
    const option = lastOption()
    expect(option.title.text).toBe('Nothing yet')
    expect(option.series).toBeUndefined()
  })

  it('derives index labels and still renders when categories are missing (e.g. sparkline)', () => {
    render(<Line series={single} />)
    const option = lastOption()
    expect(option.title).toBeUndefined()
    expect(option.series[0].data).toHaveLength(5)
    expect(option.xAxis.data).toEqual([0, 1, 2, 3, 4])
  })

  it('uses a category x-axis by default with the given labels', () => {
    render(<Line categories={categories} series={single} />)
    const option = lastOption()
    expect(option.xAxis.type).toBe('category')
    expect(option.xAxis.data).toEqual(categories)
  })

  it('uses a time x-axis when xAxisType is time', () => {
    const points: LinePoint[] = [
      [1710420600000, 179.1],
      [1710420900000, 179.4],
    ]
    render(<Line xAxisType="time" series={[{ name: 'Price', data: points }]} />)
    const option = lastOption()
    expect(option.xAxis.type).toBe('time')
    expect(option.xAxis.data).toBeUndefined()
  })

  it('draws a straight line by default (no smooth, no step)', () => {
    render(<Line categories={categories} series={single} />)
    const s = lastOption().series[0]
    expect(s.smooth).toBe(false)
    expect(s.step).toBeUndefined()
  })

  it('smooths the line when curve is smooth', () => {
    render(<Line categories={categories} series={single} curve="smooth" />)
    expect(lastOption().series[0].smooth).toBe(true)
  })

  it('steps the line when curve is stepped', () => {
    render(<Line categories={categories} series={single} curve="stepped" />)
    expect(lastOption().series[0].step).toBe('end')
  })

  it('lets a series override the chart-level curve', () => {
    render(
      <Line
        categories={categories}
        curve="straight"
        series={[{ name: 'A', data: [1, 2, 3, 4, 5], curve: 'smooth' }]}
      />
    )
    expect(lastOption().series[0].smooth).toBe(true)
  })

  it('hides point symbols by default', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().series[0].showSymbol).toBe(false)
  })

  it('shows point symbols when showSymbol is true', () => {
    render(<Line categories={categories} series={single} showSymbol />)
    expect(lastOption().series[0].showSymbol).toBe(true)
  })

  it('adds a flat area fill when area is true', () => {
    render(<Line categories={categories} series={single} area />)
    const s = lastOption().series[0]
    expect(s.areaStyle).toBeDefined()
    expect(typeof s.areaStyle.color).toBe('string')
  })

  it('adds a gradient area fill when area is "gradient"', () => {
    render(<Line categories={categories} series={single} area="gradient" />)
    const s = lastOption().series[0]
    expect(s.areaStyle.color.type).toBe('linear')
    expect(s.areaStyle.color.colorStops).toHaveLength(2)
  })

  it('omits the area fill by default', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().series[0].areaStyle).toBeUndefined()
  })

  it('stacks series that share a stack name', () => {
    render(
      <Line
        categories={categories}
        area
        series={[
          { name: 'A', stack: 'rev', data: [1, 2, 3, 4, 5] },
          { name: 'B', stack: 'rev', data: [2, 3, 4, 5, 6] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].stack).toBe('rev')
    expect(series[1].stack).toBe('rev')
  })

  it('honors a per-series custom color over the palette', () => {
    render(
      <Line
        categories={categories}
        series={[{ name: 'A', data: [1, 2, 3, 4, 5], color: '#ff0000' }]}
      />
    )
    expect(lastOption().series[0].lineStyle.color).toBe('#ff0000')
  })

  it('gives multiple series distinct categorical colors by default', () => {
    render(<Line categories={categories} series={dual} />)
    const [a, b] = lastOption().series
    expect(a.lineStyle.color).not.toBe(b.lineStyle.color)
  })

  it('paints every line with the brand color when palette is brand', () => {
    render(<Line categories={categories} series={dual} palette="brand" />)
    const [a, b] = lastOption().series
    expect(a.lineStyle.color).toBe(b.lineStyle.color)
  })

  it('dashes a series when dashed is set', () => {
    render(
      <Line
        categories={categories}
        series={[{ name: 'A', data: [1, 2, 3, 4, 5], dashed: true }]}
      />
    )
    expect(lastOption().series[0].lineStyle.type).toBe('dashed')
  })

  it('colors above/below a threshold with a piecewise visualMap on the first series', () => {
    render(
      <Line
        categories={categories}
        threshold={{ value: 0, above: 'success', below: 'destructive' }}
        series={[{ name: 'P&L', data: [1, -2, 3, -1, 2] }]}
      />
    )
    const { visualMap } = lastOption()
    expect(visualMap.type).toBe('piecewise')
    expect(visualMap.seriesIndex).toBe(0)
    expect(visualMap.pieces[0].gte).toBe(0)
    expect(visualMap.pieces[1].lt).toBe(0)
    expect(visualMap.pieces[0].color).toMatch(/^rgb/)
  })

  it('omits the visualMap when no threshold is set', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().visualMap).toBeUndefined()
  })

  it('draws a reference line on the value axis with a label', () => {
    render(
      <Line
        categories={categories}
        series={single}
        referenceLine={{ value: 20, label: 'Target' }}
      />
    )
    const { markLine } = lastOption().series[0]
    expect(markLine.data[0].yAxis).toBe(20)
    expect(markLine.data[0].label.formatter()).toBe('Target')
  })

  it('supports multiple reference lines', () => {
    render(
      <Line
        categories={categories}
        series={single}
        referenceLine={[{ value: 10 }, { value: 20 }]}
      />
    )
    expect(lastOption().series[0].markLine.data).toHaveLength(2)
  })

  it('shades a markArea band over the x-axis by default', () => {
    render(
      <Line
        categories={categories}
        series={single}
        markArea={{ from: 'Tue', to: 'Thu', label: 'Window' }}
      />
    )
    const { markArea } = lastOption().series[0]
    expect(markArea.data[0][0].xAxis).toBe('Tue')
    expect(markArea.data[0][1].xAxis).toBe('Thu')
  })

  it('attaches annotations only to the first series', () => {
    render(
      <Line
        categories={categories}
        referenceLine={{ value: 20 }}
        series={dual}
      />
    )
    const { series } = lastOption()
    expect(series[0].markLine).toBeDefined()
    expect(series[1].markLine).toBeUndefined()
  })

  it('adds max/min markPoints to the first series', () => {
    render(
      <Line
        categories={categories}
        series={single}
        markPoints={['max', 'min']}
      />
    )
    expect(lastOption().series[0].markPoint.data).toEqual([
      { type: 'max' },
      { type: 'min' },
    ])
  })

  it('adds dataZoom (inside + slider) when zoom is enabled', () => {
    render(<Line categories={categories} series={single} zoom />)
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(2)
    expect(dataZoom[0].type).toBe('inside')
    expect(dataZoom[1].type).toBe('slider')
  })

  it('keeps only inside zoom when zoomSlider is false', () => {
    render(
      <Line categories={categories} series={single} zoom zoomSlider={false} />
    )
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(1)
    expect(dataZoom[0].type).toBe('inside')
  })

  it('omits dataZoom by default', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().dataZoom).toBeUndefined()
  })

  it('floors the zoom window with a minSpan so it cannot collapse to empty', () => {
    render(<Line categories={categories} series={single} zoom />)
    const { dataZoom } = lastOption()
    expect(
      dataZoom.every((d: { minSpan?: number }) => (d.minSpan ?? 0) > 0)
    ).toBe(true)
  })

  it('draws the threshold series straight even when curve is smooth (avoids the visualMap crash)', () => {
    render(
      <Line
        categories={categories}
        curve="smooth"
        threshold={{ value: 0 }}
        series={[{ name: 'P&L', data: [1, -2, 3, -1, 2] }]}
      />
    )
    expect(lastOption().series[0].smooth).toBe(false)
  })

  it('lightens the line on hover without dimming others by default (no focus/blur)', () => {
    render(<Line categories={categories} series={dual} />)
    const s = lastOption().series[0]
    expect(s.emphasis.focus).toBe('none')
    expect(s.emphasis.lineStyle.color).toMatch(/^rgb/)
    expect(s.blur).toBeUndefined()
  })

  it('brightens a flat area on hover like Combo (lightened color, animated)', () => {
    render(
      <Line
        categories={categories}
        series={[{ name: 'A', data: [1, 2, 3, 4, 5], area: true }]}
      />
    )
    const option = lastOption()
    const s = option.series[0]
    expect(s.areaStyle.color).toBe(s.lineStyle.color)
    expect(s.emphasis.areaStyle.color).not.toBe(s.areaStyle.color)
    expect(s.emphasis.areaStyle.opacity).toBe(0.25)
    expect(option.stateAnimation.duration).toBeGreaterThan(0)
  })

  it('keeps a gradient fill stable on hover and switches state instantly (no flicker, no freeze)', () => {
    render(<Line categories={categories} series={single} area="gradient" />)
    const option = lastOption()
    const s = option.series[0]
    expect(s.emphasis.areaStyle).toEqual(s.areaStyle)
    expect(option.stateAnimation.duration).toBe(0)
  })

  it('keeps animated hover transitions for plain (non-area) lines, like Bar', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().stateAnimation.duration).toBeGreaterThan(0)
  })

  it('lightens the line and its points on hover using the shared lighten helper (like Bar)', () => {
    render(<Line categories={categories} series={single} />)
    const s = lastOption().series[0]
    const base = s.lineStyle.color
    const hover = s.emphasis.lineStyle.color
    expect(hover).not.toBe(base)
    expect(s.emphasis.itemStyle.color).toBe(hover)
    const sum = (c: string) =>
      (c.match(/\d+/g) ?? []).slice(0, 3).reduce((a, n) => a + Number(n), 0)
    expect(sum(hover)).toBeGreaterThan(sum(base))
  })

  it('focuses the hovered series and dims the rest when highlightOnHover is set', () => {
    render(<Line categories={categories} series={dual} highlightOnHover />)
    const s = lastOption().series[0]
    expect(s.emphasis.focus).toBe('series')
    expect(s.blur.lineStyle.opacity).toBeLessThan(1)
  })

  it('down-samples only very dense series (LTTB)', () => {
    const dense = Array.from({ length: 250 }, (_, i) => i)
    render(<Line categories={dense} series={[{ name: 'D', data: dense }]} />)
    expect(lastOption().series[0].sampling).toBe('lttb')
  })

  it('does not down-sample short series', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().series[0].sampling).toBeUndefined()
  })

  it('shows the legend for multiple series and reserves top margin', () => {
    render(<Line categories={categories} series={dual} />)
    const option = lastOption()
    expect(option.legend.show).toBe(true)
    expect(option.legend.data).toEqual(['Sessions', 'Users'])
    expect(option.grid.top).toBeGreaterThanOrEqual(32)
  })

  it('hides the legend for a single series by default', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().legend.show).toBe(false)
  })

  it('can force the legend on for a single series', () => {
    render(<Line categories={categories} series={single} showLegend />)
    expect(lastOption().legend.show).toBe(true)
  })

  it('strips axes, grid, legend, and tooltip in sparkline mode', () => {
    render(
      <Line categories={categories} series={single} sparkline area="gradient" />
    )
    const option = lastOption()
    expect(option.xAxis.axisLabel.show).toBe(false)
    expect(option.yAxis.axisLabel.show).toBe(false)
    expect(option.legend.show).toBe(false)
    expect(option.tooltip.show).toBe(false)
    expect(option.grid.containLabel).toBe(false)
  })

  it('uses an axis tooltip with a crosshair by default', () => {
    render(<Line categories={categories} series={single} />)
    const { tooltip } = lastOption()
    expect(tooltip.trigger).toBe('axis')
    expect(tooltip.axisPointer.type).toBe('cross')
  })

  it('uses an item tooltip when tooltipTrigger is item', () => {
    render(
      <Line categories={categories} series={single} tooltipTrigger="item" />
    )
    const { tooltip } = lastOption()
    expect(tooltip.trigger).toBe('item')
    expect(tooltip.axisPointer).toBeUndefined()
  })

  it('formats axis-tooltip rows with formatValue', () => {
    render(
      <Line
        categories={categories}
        series={single}
        formatValue={v => `$${v}`}
      />
    )
    const html = lastOption().tooltip.formatter([
      { axisValue: 'Mon', seriesName: 'Visits', value: 10, marker: '' },
    ])
    expect(html).toContain('Visits: $10')
  })

  it('extracts the y-value from [x, y] pairs in the tooltip', () => {
    render(
      <Line
        xAxisType="time"
        series={[{ name: 'Price', data: [[1710420600000, 179.1]] }]}
        formatValue={v => v.toFixed(2)}
      />
    )
    const html = lastOption().tooltip.formatter([
      {
        axisValue: 1710420600000,
        seriesName: 'Price',
        value: [1710420600000, 179.1],
        marker: '',
      },
    ])
    expect(html).toContain('Price: 179.10')
  })

  it('hides the value axis labels when showValueAxis is false', () => {
    render(
      <Line categories={categories} series={single} showValueAxis={false} />
    )
    expect(lastOption().yAxis.axisLabel.show).toBe(false)
  })

  it('can toggle grid lines independently of the value axis', () => {
    render(
      <Line
        categories={categories}
        series={single}
        showValueAxis
        gridLines={false}
      />
    )
    expect(lastOption().yAxis.splitLine.show).toBe(false)
  })

  it('applies explicit min/max to the value axis', () => {
    render(<Line categories={categories} series={single} min={0} max={100} />)
    const { yAxis } = lastOption()
    expect(yAxis.min).toBe(0)
    expect(yAxis.max).toBe(100)
  })

  it('sets axis titles from yAxes[].name and xAxis.name', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[{ name: 'Revenue' }]}
        xAxis={{ name: 'Day' }}
      />
    )
    expect(lastOption().yAxis.name).toBe('Revenue')
    expect(lastOption().xAxis.name).toBe('Day')
  })

  it('puts the value axis on the left by default', () => {
    render(<Line categories={categories} series={single} />)
    expect(lastOption().yAxis.position).toBe('left')
  })

  it('moves the y-axis to the right via yAxes[].side', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[{ side: 'right' }]}
      />
    )
    expect(lastOption().yAxis.position).toBe('right')
  })

  it('merges the xAxisLabel escape hatch (custom formatter + rich) onto the x-axis', () => {
    const formatter = (v: string | number) => `icon ${v}`
    const rich = { icon: { height: 12 } }
    render(
      <Line
        categories={categories}
        series={single}
        xAxisLabel={{ formatter, rich }}
      />
    )
    const { axisLabel } = lastOption().xAxis
    expect(axisLabel.formatter).toBe(formatter)
    expect(axisLabel.rich).toBe(rich)
  })

  it('animates on load by default and disables on demand', () => {
    const { rerender } = render(
      <Line categories={categories} series={single} />
    )
    expect(lastOption().animation).toBe(true)
    rerender(<Line categories={categories} series={single} animate={false} />)
    expect(lastOption().animation).toBe(false)
  })

  it('shows the loading overlay when loading is true', () => {
    render(<Line categories={categories} series={single} loading />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('registers a click handler that maps back to a point payload', () => {
    const onPointClick = jest.fn()
    render(
      <Line
        categories={categories}
        series={single}
        onPointClick={onPointClick}
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({
      componentType: 'series',
      seriesName: 'Visits',
      name: 'Wed',
      value: 15,
      dataIndex: 2,
    })
    expect(onPointClick).toHaveBeenCalledWith({
      seriesName: 'Visits',
      x: 'Wed',
      value: 15,
      index: 2,
    })
  })

  it('ignores clicks that are not on a series', () => {
    const onPointClick = jest.fn()
    render(
      <Line
        categories={categories}
        series={single}
        onPointClick={onPointClick}
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ componentType: 'xAxis', name: 'Wed' })
    expect(onPointClick).not.toHaveBeenCalled()
  })

  it('calls onReady with the chart instance on mount', () => {
    const onReady = jest.fn()
    render(<Line categories={categories} series={single} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledTimes(1)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('applies numeric height as inline px style', () => {
    render(<Line categories={categories} series={single} height={400} />)
    expect(screen.getByTestId('line-chart')).toHaveStyle({ height: '400px' })
  })

  it('merges extra className onto the container', () => {
    render(
      <Line
        categories={categories}
        series={single}
        className="my-custom-class"
      />
    )
    expect(screen.getByTestId('line-chart')).toHaveClass('my-custom-class')
  })

  it('observes the container for resize', () => {
    render(<Line categories={categories} series={single} />)
    expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })

  it('keeps a single value axis as an object (not a 1-element array)', () => {
    render(<Line categories={categories} series={dual} />)
    const option = lastOption()
    expect(Array.isArray(option.yAxis)).toBe(false)
    expect(option.series[0].yAxisIndex).toBe(0)
  })

  it('builds multiple y-axes from yAxes and binds series by id', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'Flow', yAxis: 'flow', data: [1, 2, 3, 4, 5] },
          { name: 'Rain', yAxis: 'rain', data: [5, 4, 3, 2, 1] },
        ]}
        yAxes={[
          { id: 'flow', name: 'Flow', side: 'left' },
          { id: 'rain', name: 'Rain', side: 'right', inverse: true, min: 0 },
        ]}
      />
    )
    const option = lastOption()
    expect(Array.isArray(option.yAxis)).toBe(true)
    expect(option.yAxis[1].position).toBe('right')
    expect(option.yAxis[1].inverse).toBe(true)
    expect(option.yAxis[1].min).toBe(0)
    expect(option.series[0].yAxisIndex).toBe(0)
    expect(option.series[1].yAxisIndex).toBe(1)
  })

  it('defaults a series with no yAxis to the first axis', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'Flow', data: [1, 2, 3, 4, 5] },
          { name: 'Rain', yAxis: 'rain', data: [5, 4, 3, 2, 1] },
        ]}
        yAxes={[{ id: 'flow' }, { id: 'rain', side: 'right' }]}
      />
    )
    const option = lastOption()
    expect(option.series[0].yAxisIndex).toBe(0)
    expect(option.series[1].yAxisIndex).toBe(1)
  })

  it('formats each series with its own axis formatter in the tooltip', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'Flow', yAxis: 'flow', data: [1, 2, 3, 4, 5] },
          { name: 'Rain', yAxis: 'rain', data: [5, 4, 3, 2, 1] },
        ]}
        yAxes={[
          { id: 'flow', format: v => `${v} m3` },
          { id: 'rain', side: 'right', format: v => `${v} mm` },
        ]}
      />
    )
    const html = lastOption().tooltip.formatter([
      { seriesName: 'Flow', value: 3, axisValue: 'Wed' },
      { seriesName: 'Rain', value: 3, axisValue: 'Wed' },
    ])
    expect(html).toContain('Flow: 3 m3')
    expect(html).toContain('Rain: 3 mm')
  })

  it('adds a themed toolbox only when toolbox is set', () => {
    const { rerender } = render(
      <Line categories={categories} series={single} />
    )
    expect(lastOption().toolbox).toBeUndefined()
    rerender(<Line categories={categories} series={single} toolbox />)
    const tb = lastOption().toolbox
    expect(tb.feature.saveAsImage).toBeDefined()
    expect(tb.feature.dataZoom.yAxisIndex).toBe('none')
    expect(tb.feature.restore).toBeDefined()
  })

  it('opens on the given zoomWindow when zoom is on', () => {
    render(
      <Line
        categories={categories}
        series={single}
        zoom
        zoomWindow={[60, 85]}
      />
    )
    const dz = lastOption().dataZoom
    expect(
      dz.every(
        (z: { start: number; end: number }) => z.start === 60 && z.end === 85
      )
    ).toBe(true)
  })

  it('keeps the value-axis title at the top by default', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[{ name: 'Revenue' }]}
      />
    )
    const y = lastOption().yAxis
    expect(y.nameLocation).toBe('end')
    expect(y.nameRotate).toBe(0)
  })

  it('rotates the value-axis title and widens the left gutter when middle', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[{ name: 'Revenue', position: 'middle' }]}
      />
    )
    const option = lastOption()
    expect(option.yAxis.nameLocation).toBe('middle')
    expect(option.yAxis.nameRotate).toBe(90)
    expect(option.grid.left).toBeGreaterThan(40)
  })

  it('moves the category-axis title to the start when set to left', () => {
    render(
      <Line
        categories={categories}
        series={single}
        xAxis={{ name: 'Weekday', position: 'left' }}
      />
    )
    expect(lastOption().xAxis.nameLocation).toBe('start')
  })

  it('keeps a middle title horizontal when orientation is set, widening the gutter to fit', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[
          {
            name: 'Revenue',
            position: 'middle',
            orientation: 'horizontal',
          },
        ]}
      />
    )
    const option = lastOption()
    expect(option.yAxis.nameLocation).toBe('middle')
    expect(option.yAxis.nameRotate).toBe(0)
    // an upright middle title needs more left room than a thin rotated one
    expect(option.grid.left).toBeGreaterThan(70)
  })

  it('can rotate a top title to vertical via orientation', () => {
    render(
      <Line
        categories={categories}
        series={single}
        yAxes={[{ name: 'Revenue', position: 'top', orientation: 'vertical' }]}
      />
    )
    expect(lastOption().yAxis.nameRotate).toBe(90)
  })

  it('rotates a right-axis title from its own orientation', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'Flow', yAxis: 'flow', data: [1, 2, 3, 4, 5] },
          { name: 'Rain', yAxis: 'rain', data: [5, 4, 3, 2, 1] },
        ]}
        yAxes={[
          { id: 'flow' },
          {
            id: 'rain',
            name: 'Rain',
            side: 'right',
            position: 'top',
            orientation: 'vertical',
          },
        ]}
      />
    )
    expect(lastOption().yAxis[1].nameRotate).toBe(90)
  })

  it('honors each axis side and offsets multiple axes stacked on one side', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'A', yAxis: 0, data: [1, 2, 3, 4, 5] },
          { name: 'B', yAxis: 1, data: [5, 4, 3, 2, 1] },
          { name: 'C', yAxis: 2, data: [2, 3, 4, 5, 6] },
        ]}
        yAxes={[
          { id: 'a', name: 'A', side: 'left' },
          { id: 'b', name: 'B', side: 'left' },
          { id: 'c', name: 'C', side: 'right' },
        ]}
      />
    )
    const yAxis = lastOption().yAxis
    expect(yAxis.map((y: { position: string }) => y.position)).toEqual([
      'left',
      'left',
      'right',
    ])
    expect(yAxis[0].offset).toBe(0)
    expect(yAxis[1].offset).toBeGreaterThan(0)
  })

  it('positions a right-axis title from its own position', () => {
    render(
      <Line
        categories={categories}
        series={[
          { name: 'Flow', yAxis: 'flow', data: [1, 2, 3, 4, 5] },
          { name: 'Rain', yAxis: 'rain', data: [5, 4, 3, 2, 1] },
        ]}
        yAxes={[
          { id: 'flow' },
          { id: 'rain', name: 'Rain', side: 'right', position: 'middle' },
        ]}
      />
    )
    const right = lastOption().yAxis[1]
    expect(right.nameLocation).toBe('middle')
    expect(right.nameRotate).toBe(90)
    expect(lastOption().grid.right).toBeGreaterThan(40)
  })

  it('stacks a left legend and the value-axis title so they do not overlap', () => {
    render(
      <Line
        categories={categories}
        series={dual}
        legendPosition="left"
        yAxes={[{ name: 'Revenue', position: 'middle' }]}
      />
    )
    const option = lastOption()
    // legend lane (96) plus the middle-title gutter, added — not max'd
    expect(option.grid.left).toBeGreaterThan(96)
    expect(option.legend.left).toBe(0)
  })

  it('does not reserve a side lane when the legend is hidden', () => {
    render(
      <Line
        categories={categories}
        series={dual}
        legendPosition="left"
        showLegend={false}
      />
    )
    expect(lastOption().grid.left).toBeLessThan(96)
  })

  it('stacks a bottom legend below the x-axis title so they do not overlap', () => {
    const titleOnly = (() => {
      render(
        <Line
          categories={categories}
          series={single}
          xAxis={{ name: 'Weekday', position: 'middle' }}
        />
      )
      return lastOption().grid.bottom
    })()
    render(
      <Line
        categories={categories}
        series={dual}
        legendPosition="bottom"
        xAxis={{ name: 'Weekday', position: 'middle' }}
      />
    )
    // bottom legend lane is added on top of the x-title gutter, not max'd
    expect(lastOption().grid.bottom).toBeGreaterThan(titleOnly)
  })

  it('reserves no bottom legend lane when the legend sits elsewhere', () => {
    render(
      <Line
        categories={categories}
        series={dual}
        legendPosition="top"
        xAxis={{ name: 'Weekday', position: 'middle' }}
      />
    )
    const withTop = lastOption().grid.bottom
    render(
      <Line
        categories={categories}
        series={dual}
        legendPosition="bottom"
        xAxis={{ name: 'Weekday', position: 'middle' }}
      />
    )
    expect(lastOption().grid.bottom).toBeGreaterThan(withTop)
  })

  it('clears the zoom slider for a middle category title (bottom gutter grows)', () => {
    const { rerender } = render(
      <Line
        categories={categories}
        series={single}
        xAxis={{ name: 'Weekday', position: 'middle' }}
      />
    )
    const withoutZoom = lastOption().grid.bottom
    rerender(
      <Line
        categories={categories}
        series={single}
        xAxis={{ name: 'Weekday', position: 'middle' }}
        zoom
      />
    )
    expect(lastOption().grid.bottom).toBeGreaterThan(withoutZoom)
  })
})
