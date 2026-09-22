import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Radar } from '../Radar'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ RadarChart: {} }))
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
  }
}

const indicators = [
  { name: 'Speed', max: 100 },
  { name: 'Power', max: 100 },
  { name: 'Range', max: 100 },
]

const series = [
  { name: 'Model A', data: [80, 60, 70] },
  { name: 'Model B', data: [50, 90, 40] },
]

describe('components/charts/Radar', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with radar aria attributes', () => {
    render(<Radar indicators={indicators} series={series} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Radar chart')
    expect(container).toHaveAttribute('data-testid', 'radar-chart')
  })

  it('initialises echarts on mount', () => {
    render(<Radar indicators={indicators} series={series} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
  })

  it('maps indicators onto the radar axes', () => {
    render(<Radar indicators={indicators} series={series} />)
    const option = lastOption()
    expect(option.radar.indicator).toEqual([
      { name: 'Speed', max: 100 },
      { name: 'Power', max: 100 },
      { name: 'Range', max: 100 },
    ])
    expect(option.radar.shape).toBe('polygon')
  })

  it('falls back to the chart-level max for indicators without one', () => {
    render(
      <Radar
        max={50}
        indicators={[{ name: 'Speed' }, { name: 'Power', max: 100 }]}
        series={[{ name: 'A', data: [10, 20] }]}
      />
    )
    const [speed, power] = lastOption().radar.indicator
    expect(speed.max).toBe(50)
    expect(power.max).toBe(100)
  })

  it('renders one polygon per series in a single radar series', () => {
    render(<Radar indicators={indicators} series={series} />)
    const option = lastOption()
    expect(option.series).toHaveLength(1)
    expect(option.series[0].type).toBe('radar')
    expect(option.series[0].data).toHaveLength(2)
    expect(option.series[0].data[0].name).toBe('Model A')
    expect(option.series[0].data[0].value).toEqual([80, 60, 70])
  })

  it('fills the polygons when area is on', () => {
    render(<Radar indicators={indicators} series={series} area />)
    const [first] = lastOption().series[0].data
    expect(first.areaStyle.color).toBeDefined()
    expect(first.areaStyle.opacity).toBeUndefined()
  })

  it('leaves the polygons unfilled by default', () => {
    render(<Radar indicators={indicators} series={series} />)
    const [first] = lastOption().series[0].data
    expect(first.areaStyle.opacity).toBe(0)
  })

  it('lets a series override the chart-level area', () => {
    render(
      <Radar
        indicators={indicators}
        series={[{ name: 'A', data: [1, 2, 3], area: true }]}
      />
    )
    const [first] = lastOption().series[0].data
    expect(first.areaStyle.color).toBeDefined()
  })

  it('shows the empty message when there is no data', () => {
    render(<Radar indicators={indicators} series={[]} />)
    expect(lastOption().title.text).toBe('No data')
  })

  it('shows the legend by default for multiple series', () => {
    render(<Radar indicators={indicators} series={series} />)
    expect(lastOption().legend.show).toBe(true)
  })

  it('hides the legend by default for a single series', () => {
    render(<Radar indicators={indicators} series={[series[0]]} />)
    expect(lastOption().legend.show).toBe(false)
  })

  it('dims the other webs when highlightOnHover is on', () => {
    render(<Radar indicators={indicators} series={series} highlightOnHover />)
    const [radar] = lastOption().series
    expect(radar.emphasis.focus).toBe('self')
    expect(radar.blur.lineStyle.opacity).toBeLessThan(1)
  })

  it('still lightens the fill and bolds the line on hover without the toggle', () => {
    render(<Radar indicators={indicators} series={series} area lineWidth={2} />)
    const [radar] = lastOption().series
    expect(radar.emphasis.focus).toBe('none')
    expect(radar.blur).toBeUndefined()
    const [first] = radar.data
    expect(first.emphasis.lineStyle.width).toBeGreaterThan(
      first.lineStyle.width
    )
    expect(first.emphasis.areaStyle.color).toBeDefined()
    expect(first.emphasis.areaStyle.color).not.toBe(first.areaStyle.color)
  })

  // Scaling can move a symbol out from under the cursor, which fires
  // mouseout -> mouseover in a loop and makes the hover (and cursor) flicker.
  // Growing the stroke is safe: the hit area expands around the cursor.
  it('never scales a web on hover', () => {
    render(<Radar indicators={indicators} series={series} highlightOnHover />)
    expect(lastOption().series[0].emphasis.scale).toBe(false)
  })

  it('maps a series click to onSeriesClick', () => {
    const onSeriesClick = jest.fn()
    render(
      <Radar
        indicators={indicators}
        series={series}
        onSeriesClick={onSeriesClick}
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({
      componentType: 'series',
      name: 'Model A',
      value: [80, 60, 70],
      dataIndex: 0,
    })
    expect(onSeriesClick).toHaveBeenCalledWith({
      name: 'Model A',
      values: [80, 60, 70],
      index: 0,
    })
  })

  it('ignores clicks outside the series', () => {
    const onSeriesClick = jest.fn()
    render(
      <Radar
        indicators={indicators}
        series={series}
        onSeriesClick={onSeriesClick}
      />
    )
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ componentType: 'legend', name: 'Model A' })
    expect(onSeriesClick).not.toHaveBeenCalled()
  })

  it('re-applies options on a theme change', () => {
    render(<Radar indicators={indicators} series={series} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => mutationCallback?.())
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('shows the loading overlay when loading', () => {
    render(<Radar indicators={indicators} series={series} loading />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('hides the loading overlay by default', () => {
    render(<Radar indicators={indicators} series={series} />)
    expect(screen.queryByTestId('chart-loading')).not.toBeInTheDocument()
  })

  it('calls onReady with the chart instance', () => {
    const onReady = jest.fn()
    render(<Radar indicators={indicators} series={series} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('disposes the chart and disconnects observers on unmount', () => {
    const { unmount } = render(
      <Radar indicators={indicators} series={series} />
    )
    unmount()
    expect(mockChart.dispose).toHaveBeenCalled()
    expect(mockDisconnect).toHaveBeenCalled()
  })
})
