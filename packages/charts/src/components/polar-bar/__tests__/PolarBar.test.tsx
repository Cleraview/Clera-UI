import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { PolarBar } from '../PolarBar'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ BarChart: {} }))
jest.mock('echarts/components', () => ({
  PolarComponent: {},
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
  }
}

const sample = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 18 },
  { label: 'Wed', value: 9 },
]

describe('components/charts/PolarBar', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with polar bar aria attributes', () => {
    render(<PolarBar data={sample} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Polar bar chart')
    expect(container).toHaveAttribute('data-testid', 'polar-bar-chart')
  })

  it('initialises echarts on mount', () => {
    render(<PolarBar data={sample} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
  })

  it('renders a polar bar series', () => {
    render(<PolarBar data={sample} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('bar')
    expect(option.series[0].coordinateSystem).toBe('polar')
  })

  it('puts the category on the angle axis in angular orientation', () => {
    render(<PolarBar data={sample} orientation="angular" />)
    const option = lastOption()
    expect(option.angleAxis.type).toBe('category')
    expect(option.radiusAxis.type).toBe('value')
    expect(option.angleAxis.data).toEqual(['Mon', 'Tue', 'Wed'])
  })

  it('puts the category on the radius axis in radial orientation', () => {
    render(<PolarBar data={sample} orientation="radial" />)
    const option = lastOption()
    expect(option.radiusAxis.type).toBe('category')
    expect(option.angleAxis.type).toBe('value')
  })

  it('applies startAngle to the angle axis', () => {
    render(<PolarBar data={sample} startAngle={45} />)
    expect(lastOption().angleAxis.startAngle).toBe(45)
  })

  it('applies an explicit max to the value axis', () => {
    render(<PolarBar data={sample} max={20} />)
    expect(lastOption().radiusAxis.max).toBe(20)
  })

  it('passes roundCap through to the series', () => {
    render(<PolarBar data={sample} roundCap={false} />)
    expect(lastOption().series[0].roundCap).toBe(false)
  })

  it('stacks grouped series when stacked', () => {
    render(
      <PolarBar
        categories={['A', 'B']}
        stacked
        series={[
          { name: 'X', data: [1, 2] },
          { name: 'Y', data: [3, 4] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].stack).toBe('total')
    expect(series[1].stack).toBe('total')
    expect(lastOption().legend.data).toEqual(['X', 'Y'])
  })

  it('focuses the whole series and dims the rest when highlightSeries', () => {
    render(
      <PolarBar
        categories={['A', 'B']}
        highlightSeries
        series={[
          { name: 'X', data: [1, 2] },
          { name: 'Y', data: [3, 4] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].emphasis.focus).toBe('series')
    expect(series[0].blur.itemStyle.opacity).toBeLessThan(1)
  })

  it('lightens only the hovered segment by default (no series focus)', () => {
    render(
      <PolarBar
        categories={['A', 'B']}
        series={[
          { name: 'X', data: [1, 2] },
          { name: 'Y', data: [3, 4] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].emphasis.focus).toBeUndefined()
    expect(series[0].blur).toBeUndefined()
  })

  it('honors a per-datum custom color', () => {
    render(
      <PolarBar
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

  it('renders an empty-state title when there is no data', () => {
    render(<PolarBar data={[]} emptyMessage="Nothing" />)
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('maps a click back to the datum', () => {
    const onBarClick = jest.fn()
    render(<PolarBar data={sample} onBarClick={onBarClick} />)
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ name: 'Tue' })
    expect(onBarClick).toHaveBeenCalledWith(sample[1], 1)
  })

  it('re-applies options on a theme change', () => {
    render(<PolarBar data={sample} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('calls onReady with the chart instance', () => {
    const onReady = jest.fn()
    render(<PolarBar data={sample} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('shows the loading overlay when loading', () => {
    render(<PolarBar data={sample} loading />)
    expect(mockChart.showLoading).toHaveBeenCalled()
  })

  it('disposes on unmount', () => {
    const { unmount } = render(<PolarBar data={sample} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
