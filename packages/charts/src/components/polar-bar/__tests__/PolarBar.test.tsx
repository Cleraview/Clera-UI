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

  it('gives radial category labels a readable chip above the bars', () => {
    render(<PolarBar data={sample} orientation="radial" />)
    const { radiusAxis } = lastOption()
    expect(radiusAxis.axisLabel.backgroundColor).toMatch(/^rgb/)
    expect(radiusAxis.z).toBeGreaterThan(2)
  })

  it('keeps angular category labels plain (no chip)', () => {
    render(<PolarBar data={sample} orientation="angular" />)
    expect(lastOption().angleAxis.axisLabel.backgroundColor).toBeUndefined()
  })

  it('gives angular value labels a readable chip for contrast', () => {
    render(<PolarBar data={sample} orientation="angular" />)
    expect(lastOption().radiusAxis.axisLabel.backgroundColor).toMatch(/^rgb/)
  })

  it('keeps the dashed value splitline behind the bars (shown, default depth)', () => {
    render(<PolarBar data={sample} orientation="angular" />)
    const { radiusAxis } = lastOption()
    expect(radiusAxis.splitLine.show).toBe(true)
    expect(radiusAxis.z).toBeUndefined()
  })

  it('limits the sweep with endAngle on the angle axis', () => {
    render(
      <PolarBar
        data={sample}
        orientation="angular"
        startAngle={180}
        endAngle={0}
      />
    )
    expect(lastOption().angleAxis.startAngle).toBe(180)
    expect(lastOption().angleAxis.endAngle).toBe(0)
  })

  it('renders an on-bar label from labelFormatter (name + value)', () => {
    render(
      <PolarBar
        data={sample}
        orientation="radial"
        labelFormatter={({ name, value }) => `${name}: ${value}`}
      />
    )
    const { label } = lastOption().series[0]
    expect(label.show).toBe(true)
    expect(label.formatter({ name: 'Mon', value: 12 })).toBe('Mon: 12')
  })

  it('omits the default series name (series0) from single-series tooltips', () => {
    render(<PolarBar data={sample} />)
    const { tooltip } = lastOption()
    expect(
      tooltip.formatter({ name: 'Mon', value: 12, seriesName: 'series0' })
    ).toBe('Mon: 12')
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

  it('focuses the whole series and dims the rest when highlightOnHover', () => {
    render(
      <PolarBar
        categories={['A', 'B']}
        highlightOnHover
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
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('disposes on unmount', () => {
    const { unmount } = render(<PolarBar data={sample} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
