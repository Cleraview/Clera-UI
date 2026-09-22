import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { MultiXLine } from '../MultiXLine'
import type { MultiXLineXAxis } from '../types'

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
    dispatchAction: jest.fn(),
    getOption: jest.fn(() => ({})),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  }
}

const axes: MultiXLineXAxis[] = [
  {
    name: '2016',
    categories: ['2016-1', '2016-2', '2016-3'],
    series: [{ name: 'P2016', data: [3, 6, 11] }],
  },
  {
    name: '2015',
    categories: ['2015-1', '2015-2', '2015-3'],
    series: [{ name: 'P2015', data: [2, 6, 9] }],
  },
]

describe('components/charts/MultiXLine', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with the correct aria attributes', () => {
    render(<MultiXLine xAxes={axes} />)
    const el = screen.getByRole('img')
    expect(el).toHaveAttribute('aria-label', 'Multiple x-axis line chart')
    expect(el).toHaveAttribute('data-testid', 'multi-x-line-chart')
  })

  it('builds one x-axis per axis with its own categories', () => {
    render(<MultiXLine xAxes={axes} />)
    const { xAxis } = lastOption()
    expect(xAxis).toHaveLength(2)
    expect(xAxis[0].data).toEqual(['2016-1', '2016-2', '2016-3'])
    expect(xAxis[1].data).toEqual(['2015-1', '2015-2', '2015-3'])
  })

  it('shares a single value (y) axis', () => {
    render(<MultiXLine xAxes={axes} />)
    expect(Array.isArray(lastOption().yAxis)).toBe(false)
    expect(lastOption().yAxis.type).toBe('value')
  })

  it('applies the yAxis title, min/max, and rotated middle position', () => {
    render(
      <MultiXLine
        xAxes={axes}
        yAxis={{ name: 'Precipitation (mm)', min: 0, max: 300 }}
      />
    )
    const y = lastOption().yAxis
    expect(y.name).toBe('Precipitation (mm)')
    expect(y.min).toBe(0)
    expect(y.max).toBe(300)
    // default position is `middle`, which rotates the title
    expect(y.nameLocation).toBe('middle')
    expect(y.nameRotate).toBe(90)
  })

  it('formats value-axis ticks and the crosshair readout with yAxis.format', () => {
    render(<MultiXLine xAxes={axes} yAxis={{ format: v => `${v} mm` }} />)
    const option = lastOption()
    expect(option.yAxis.axisLabel.formatter(42)).toBe('42 mm')
    const readout = option.xAxis[0].axisPointer.label.formatter({
      value: '2016-7',
      seriesData: [{ data: 231.6 }],
    })
    expect(readout).toContain('231.6 mm')
  })

  it('places the first axis on the bottom and the second on top', () => {
    render(<MultiXLine xAxes={axes} />)
    const { xAxis } = lastOption()
    expect(xAxis[0].position).toBe('bottom')
    expect(xAxis[1].position).toBe('top')
  })

  it('binds each series to its own x-axis', () => {
    render(<MultiXLine xAxes={axes} />)
    const { series } = lastOption()
    expect(series).toHaveLength(2)
    expect(series[0].xAxisIndex).toBe(0)
    expect(series[1].xAxisIndex).toBe(1)
    expect(series[0].yAxisIndex).toBe(0)
    expect(series[1].yAxisIndex).toBe(0)
  })

  it('colors each axis line to match its series', () => {
    render(<MultiXLine xAxes={axes} />)
    const { xAxis, series } = lastOption()
    expect(xAxis[0].axisLine.lineStyle.color).toBe(series[0].lineStyle.color)
    expect(xAxis[1].axisLine.lineStyle.color).toBe(series[1].lineStyle.color)
  })

  it('lists every series in the legend', () => {
    render(<MultiXLine xAxes={axes} />)
    expect(lastOption().legend.data).toEqual(['P2016', 'P2015'])
  })

  it('uses a crosshair pointer without a tooltip box', () => {
    render(<MultiXLine xAxes={axes} />)
    const { tooltip } = lastOption()
    expect(tooltip.trigger).toBe('none')
    expect(tooltip.axisPointer.type).toBe('cross')
  })

  it('renders an empty-state title when there is no data', () => {
    render(<MultiXLine xAxes={[]} emptyMessage="Nothing" />)
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('re-resolves colors on a theme change', () => {
    render(<MultiXLine xAxes={axes} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => mutationCallback?.())
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('disposes the chart and observer on unmount', () => {
    const { unmount } = render(<MultiXLine xAxes={axes} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
