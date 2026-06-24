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

  it('animates on load by default', () => {
    render(<Bar data={sample} />)
    expect(lastOption().animation).toBe(true)
  })

  it('disables animation when animate is false', () => {
    render(<Bar data={sample} animate={false} />)
    expect(lastOption().animation).toBe(false)
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
