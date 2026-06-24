import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Combo } from '../Combo'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ BarChart: {}, LineChart: {} }))
jest.mock('echarts/components', () => ({
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
  LegendComponent: {},
  AxisPointerComponent: {},
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

const categories = ['Jan', 'Feb', 'Mar']
const series = [
  { name: 'Revenue', type: 'bar' as const, data: [10, 20, 30] },
  {
    name: 'Orders',
    type: 'line' as const,
    data: [3, 5, 4],
    axis: 'right' as const,
  },
]

describe('components/charts/Combo', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with combo aria attributes', () => {
    render(<Combo categories={categories} series={series} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Combo chart')
    expect(container).toHaveAttribute('data-testid', 'combo-chart')
  })

  it('initialises echarts on mount', () => {
    render(<Combo categories={categories} series={series} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
  })

  it('maps each series to its echarts type', () => {
    render(<Combo categories={categories} series={series} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('bar')
    expect(option.series[1].type).toBe('line')
  })

  it('renders an area series with an areaStyle', () => {
    render(
      <Combo
        categories={categories}
        series={[{ name: 'Visits', type: 'area', data: [1, 2, 3] }]}
      />
    )
    expect(lastOption().series[0].type).toBe('line')
    expect(lastOption().series[0].areaStyle).toBeDefined()
  })

  it('shows the point markers on line series', () => {
    render(
      <Combo
        categories={categories}
        series={[{ name: 'Orders', type: 'line', data: [1, 2, 3] }]}
      />
    )
    expect(lastOption().series[0].showSymbol).toBe(true)
    expect(lastOption().series[0].symbol).toBe('circle')
  })

  it('lightens line and area series on hover instead of dropping their color', () => {
    render(
      <Combo
        categories={categories}
        series={[
          { name: 'L', type: 'line', data: [1, 2, 3] },
          { name: 'A', type: 'area', data: [1, 2, 3] },
        ]}
      />
    )
    const [line, area] = lastOption().series
    expect(line.emphasis.lineStyle.color).toMatch(/^rgb/)
    expect(area.emphasis.lineStyle.color).toMatch(/^rgb/)
    expect(area.emphasis.areaStyle.color).toMatch(/^rgb/)
  })

  it('focuses the whole hovered series and keeps the others visible', () => {
    render(<Combo categories={categories} series={series} />)
    const [bar, line] = lastOption().series
    expect(bar.emphasis.focus).toBe('series')
    expect(line.emphasis.focus).toBe('series')
    // blur state keeps non-focused series at full opacity (no fade)
    expect(bar.blur.itemStyle.opacity).toBe(1)
    expect(line.blur.lineStyle.opacity).toBe(1)
  })

  it('uses a single value axis when all series are on the left', () => {
    render(
      <Combo
        categories={categories}
        series={[{ name: 'Revenue', type: 'bar', data: [10, 20, 30] }]}
      />
    )
    expect(lastOption().yAxis).toHaveLength(1)
  })

  it('adds a second value axis when a series targets the right', () => {
    render(<Combo categories={categories} series={series} />)
    const option = lastOption()
    expect(option.yAxis).toHaveLength(2)
    expect(option.series[1].yAxisIndex).toBe(1)
  })

  it('applies per-axis min/max and titles', () => {
    render(
      <Combo
        categories={categories}
        series={series}
        leftAxis={{ name: 'USD', max: 100 }}
        rightAxis={{ name: 'Count', min: 0 }}
      />
    )
    const [left, right] = lastOption().yAxis
    expect(left.name).toBe('USD')
    expect(left.max).toBe(100)
    expect(right.name).toBe('Count')
    expect(right.min).toBe(0)
  })

  it('builds one value axis per entry in valueAxes and routes series by index', () => {
    render(
      <Combo
        categories={categories}
        valueAxes={[
          { name: 'A', position: 'right' },
          { name: 'B', position: 'right', offset: 80 },
          { name: 'C', position: 'left' },
        ]}
        series={[
          { name: 'S0', type: 'bar', axis: 0, data: [1, 2, 3] },
          { name: 'S1', type: 'bar', axis: 1, data: [4, 5, 6] },
          { name: 'S2', type: 'line', axis: 2, data: [7, 8, 9] },
        ]}
      />
    )
    const option = lastOption()
    expect(option.yAxis).toHaveLength(3)
    expect(option.yAxis[1].position).toBe('right')
    expect(option.yAxis[1].offset).toBe(80)
    expect(
      option.series.map((s: { yAxisIndex: number }) => s.yAxisIndex)
    ).toEqual([0, 1, 2])
  })

  it('reserves extra top space when a top legend meets top axis names', () => {
    const { rerender } = render(
      <Combo
        categories={categories}
        showLegend
        legendPosition="top"
        series={[{ name: 'S', type: 'bar', data: [1, 2, 3] }]}
      />
    )
    const plain = lastOption().grid.top

    rerender(
      <Combo
        categories={categories}
        showLegend
        legendPosition="top"
        valueAxes={[
          { name: 'A' },
          { name: 'B', position: 'right' },
          { name: 'C', position: 'right', offset: 80 },
        ]}
        series={[
          { name: 'S0', type: 'bar', axis: 0, data: [1, 2, 3] },
          { name: 'S1', type: 'bar', axis: 1, data: [4, 5, 6] },
          { name: 'S2', type: 'line', axis: 2, data: [7, 8, 9] },
        ]}
      />
    )
    expect(lastOption().grid.top).toBeGreaterThan(plain)
  })

  it('colors each multi-axis to match the series that targets it', () => {
    render(
      <Combo
        categories={categories}
        valueAxes={[{ name: 'A' }, { name: 'B', position: 'right' }]}
        series={[
          {
            name: 'S0',
            type: 'bar',
            axis: 0,
            color: 'rgb(1, 1, 1)',
            data: [1],
          },
          {
            name: 'S1',
            type: 'line',
            axis: 1,
            color: 'rgb(2, 2, 2)',
            data: [2],
          },
        ]}
      />
    )
    const [a, b] = lastOption().yAxis
    expect(a.axisLine.lineStyle.color).toBe('rgb(1, 1, 1)')
    expect(b.axisLine.lineStyle.color).toBe('rgb(2, 2, 2)')
  })

  it('uses an axis-trigger tooltip', () => {
    render(<Combo categories={categories} series={series} />)
    expect(lastOption().tooltip.trigger).toBe('axis')
  })

  it('does not emphasize series from the axis pointer (hover the bar itself)', () => {
    render(<Combo categories={categories} series={series} />)
    expect(lastOption().tooltip.axisPointer.triggerEmphasis).toBe(false)
  })

  it('uses a cross pointer with a shadow band on the category axis', () => {
    render(<Combo categories={categories} series={series} />)
    const option = lastOption()
    expect(option.tooltip.axisPointer.type).toBe('cross')
    expect(option.xAxis.axisPointer.type).toBe('shadow')
  })

  it('formats the floating value-axis pointer label with the axis format', () => {
    render(
      <Combo
        categories={categories}
        series={series}
        leftAxis={{ format: v => `${v} ml` }}
      />
    )
    const label = lastOption().yAxis[0].axisPointer.label.formatter({
      value: 42.7,
    })
    expect(label).toBe('43 ml')
  })

  it('formats tooltip values with the per-axis formatter', () => {
    render(
      <Combo
        categories={categories}
        series={series}
        leftAxis={{ format: v => `$${v}` }}
        rightAxis={{ format: v => `${v} orders` }}
      />
    )
    const html = lastOption().tooltip.formatter([
      { axisValueLabel: 'Jan', seriesName: 'Revenue', value: 10, marker: '' },
      { axisValueLabel: 'Jan', seriesName: 'Orders', value: 3, marker: '' },
    ])
    expect(html).toContain('Revenue: $10')
    expect(html).toContain('Orders: 3 orders')
  })

  it('lists every series in the legend', () => {
    render(<Combo categories={categories} series={series} />)
    expect(lastOption().legend.data).toEqual(['Revenue', 'Orders'])
  })

  it('renders an empty-state title when there is no data', () => {
    render(<Combo categories={[]} series={[]} emptyMessage="Nothing" />)
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('re-applies options on a theme change', () => {
    render(<Combo categories={categories} series={series} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('calls onReady with the chart instance', () => {
    const onReady = jest.fn()
    render(<Combo categories={categories} series={series} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('shows the loading overlay when loading', () => {
    render(<Combo categories={categories} series={series} loading />)
    expect(mockChart.showLoading).toHaveBeenCalled()
  })

  it('disposes on unmount', () => {
    const { unmount } = render(
      <Combo categories={categories} series={series} />
    )
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
