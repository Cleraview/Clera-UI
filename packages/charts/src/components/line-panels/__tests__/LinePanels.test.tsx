import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { LinePanels } from '../LinePanels'
import type { LinePanel } from '../types'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ LineChart: {} }))
jest.mock('echarts/components', () => ({
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
  AxisPointerComponent: {},
  DataZoomComponent: {},
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
const panels: LinePanel[] = [
  { label: 'Flow', series: [{ name: 'Flow', data: [10, 20, 15, 30, 25] }] },
  {
    label: 'Rain',
    inverse: true,
    series: [{ name: 'Rain', data: [2, 8, 1, 5, 3] }],
  },
]

describe('components/charts/LinePanels', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with the correct aria attributes', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const el = screen.getByRole('img')
    expect(el).toHaveAttribute('aria-label', 'Stacked line panels chart')
    expect(el).toHaveAttribute('data-testid', 'line-panels-chart')
  })

  it('builds one grid, x-axis, and y-axis per panel', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const option = lastOption()
    expect(option.grid).toHaveLength(2)
    expect(option.xAxis).toHaveLength(2)
    expect(option.yAxis).toHaveLength(2)
  })

  it('assigns each series to its panel grid via x/y axis index', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const { series } = lastOption()
    expect(series).toHaveLength(2)
    expect(series[0].xAxisIndex).toBe(0)
    expect(series[0].yAxisIndex).toBe(0)
    expect(series[1].xAxisIndex).toBe(1)
    expect(series[1].yAxisIndex).toBe(1)
  })

  it('inverts the value axis for an inverse panel', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const { yAxis } = lastOption()
    expect(yAxis[0].inverse).toBeFalsy()
    expect(yAxis[1].inverse).toBe(true)
  })

  it('puts an inverse panel’s x-axis at the top so it mirrors the panel above', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const { xAxis } = lastOption()
    expect(xAxis[0].position).toBeUndefined()
    expect(xAxis[1].position).toBe('top')
  })

  it('names each value axis from the panel label', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const { yAxis } = lastOption()
    expect(yAxis[0].name).toBe('Flow')
    expect(yAxis[1].name).toBe('Rain')
  })

  it('links the crosshair across all panels', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    expect(lastOption().axisPointer.link).toEqual([{ xAxisIndex: 'all' }])
  })

  it('hides the x-axis pointer label when axisPointerLabel is false', () => {
    render(
      <LinePanels
        categories={categories}
        panels={panels}
        axisPointerLabel={false}
      />
    )
    const { xAxis } = lastOption()
    expect(xAxis[0].axisPointer.label.show).toBe(false)
    expect(xAxis[1].axisPointer.label.show).toBe(false)
  })

  it('keeps the x-axis pointer label by default', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    expect(lastOption().xAxis[0].axisPointer).toBeUndefined()
  })

  it('shows x labels only on the last (bottom) panel by default', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const { xAxis } = lastOption()
    expect(xAxis[0].axisLabel.show).toBe(false)
    expect(xAxis[1].axisLabel.show).not.toBe(false)
  })

  it('shows the x-axis on every panel when xAxisPerPanel is set', () => {
    render(<LinePanels categories={categories} panels={panels} xAxisPerPanel />)
    const { xAxis } = lastOption()
    expect(xAxis[0].axisLabel.show).not.toBe(false)
    expect(xAxis[1].axisLabel.show).not.toBe(false)
  })

  it('shows point symbols only on series that opt in', () => {
    render(
      <LinePanels
        categories={categories}
        panels={[
          {
            label: 'A',
            series: [{ name: 'A', showSymbol: true, data: [1, 2] }],
          },
          { label: 'B', series: [{ name: 'B', data: [3, 4] }] },
        ]}
      />
    )
    const { series } = lastOption()
    expect(series[0].showSymbol).toBe(true)
    expect(series[1].showSymbol).toBe(false)
  })

  it('adds a single dataZoom spanning every panel when zoom is set', () => {
    render(<LinePanels categories={categories} panels={panels} zoom />)
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(2)
    expect(
      dataZoom.every(
        (d: { xAxisIndex: number[] }) =>
          Array.isArray(d.xAxisIndex) && d.xAxisIndex.length === 2
      )
    ).toBe(true)
  })

  it('keeps only inside zoom when zoomSlider is false', () => {
    render(
      <LinePanels
        categories={categories}
        panels={panels}
        zoom
        zoomSlider={false}
      />
    )
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(1)
    expect(dataZoom[0].type).toBe('inside')
  })

  it('omits the dataZoom by default', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    expect(lastOption().dataZoom).toBeUndefined()
  })

  it('applies per-panel min/max', () => {
    render(
      <LinePanels
        categories={categories}
        panels={[
          {
            label: 'A',
            min: 0,
            max: 100,
            series: [{ name: 'A', data: [1, 2] }],
          },
        ]}
      />
    )
    const { yAxis } = lastOption()
    expect(yAxis[0].min).toBe(0)
    expect(yAxis[0].max).toBe(100)
  })

  it('renders an empty-state title when there is no data', () => {
    render(
      <LinePanels categories={categories} panels={[]} emptyMessage="Nothing" />
    )
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('re-resolves colors on a theme change', () => {
    render(<LinePanels categories={categories} panels={panels} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => mutationCallback?.())
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('disposes the chart and observer on unmount', () => {
    const { unmount } = render(
      <LinePanels categories={categories} panels={panels} />
    )
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
