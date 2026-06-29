import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { LineMatrix } from '../LineMatrix'
import type { LineMatrixCell } from '../types'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({ LineChart: {} }))
jest.mock('echarts/components', () => ({
  MatrixComponent: {},
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
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

const columns = ['Mon', 'Tue']
const rows = ['EUR/USD', { label: 'Group', divider: true }, 'GBP/USD']
const cells: LineMatrixCell[] = [
  { col: 'Mon', row: 'EUR/USD', data: [1.08, 1.09, 1.1] },
  { col: 'Tue', row: 'EUR/USD', data: [1.1, 1.09, 1.08] },
  { col: 'Mon', row: 'GBP/USD', data: [1.27, 1.28, 1.29] },
  { col: 'Tue', row: 'GBP/USD', data: [1.29, 1.28, 1.27] },
]

describe('components/charts/LineMatrix', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with the correct aria attributes', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    const el = screen.getByRole('img')
    expect(el).toHaveAttribute('aria-label', 'Line matrix chart')
    expect(el).toHaveAttribute('data-testid', 'line-matrix-chart')
  })

  it('builds one grid, axis pair, and line series per cell', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    const option = lastOption()
    expect(option.grid).toHaveLength(cells.length)
    expect(option.xAxis).toHaveLength(cells.length)
    expect(option.yAxis).toHaveLength(cells.length)
    expect(option.series).toHaveLength(cells.length)
    expect(option.series[0].type).toBe('line')
    expect(option.grid[0].coordinateSystem).toBe('matrix')
  })

  it('places each cell at its (col, row) coordinate', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    expect(lastOption().grid[0].coord).toEqual(['Mon', 'EUR/USD'])
  })

  it('renders a merged body cell for a divider row', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    const { body } = lastOption().matrix
    expect(body.data).toHaveLength(1)
    expect(body.data[0].mergeCells).toBe(true)
    expect(body.data[0].value).toBe('Group')
    expect(body.data[0].coord).toEqual([null, 1])
  })

  it('blanks the divider row label in the y dimension', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    expect(lastOption().matrix.y.data).toEqual([
      { value: 'EUR/USD' },
      { value: '' },
      { value: 'GBP/USD' },
    ])
  })

  it('colors cells green/red by trend when colorByTrend is set', () => {
    render(
      <LineMatrix columns={columns} rows={rows} cells={cells} colorByTrend />
    )
    const { series } = lastOption()
    // first cell rises (1.08 -> 1.10), second falls (1.10 -> 1.08)
    expect(series[0].lineStyle.color).not.toBe(series[1].lineStyle.color)
  })

  it('keeps the line visible on hover (explicit emphasis, no disappear)', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    const s = lastOption().series[0]
    expect(s.emphasis.lineStyle.color).toMatch(/^rgb/)
    expect(s.emphasis.lineStyle.color).not.toBe(s.lineStyle.color)
    expect(s.blur).toBeUndefined()
  })

  it('adds a shared dataZoom across all x axes when zoom is set', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} zoom />)
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(2)
    expect(
      dataZoom.every((d: { xAxisIndex: string }) => d.xAxisIndex === 'all')
    ).toBe(true)
  })

  it('omits the dataZoom by default', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    expect(lastOption().dataZoom).toBeUndefined()
  })

  it('keeps only inside zoom (no slider) when zoomSlider is false', () => {
    render(
      <LineMatrix
        columns={columns}
        rows={rows}
        cells={cells}
        zoom
        zoomSlider={false}
      />
    )
    const { dataZoom } = lastOption()
    expect(dataZoom).toHaveLength(1)
    expect(dataZoom[0].type).toBe('inside')
  })

  it('sets the corner label when provided', () => {
    render(
      <LineMatrix
        columns={columns}
        rows={rows}
        cells={cells}
        cornerLabel="Pair / Day"
      />
    )
    expect(lastOption().matrix.corner.data[0].value).toBe('Pair / Day')
  })

  it('renders an empty-state title when there are no cells', () => {
    render(
      <LineMatrix
        columns={columns}
        rows={rows}
        cells={[]}
        emptyMessage="Nothing"
      />
    )
    const option = lastOption()
    expect(option.title.text).toBe('Nothing')
    expect(option.series).toBeUndefined()
  })

  it('re-resolves colors on a theme change', () => {
    render(<LineMatrix columns={columns} rows={rows} cells={cells} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => mutationCallback?.())
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('disposes the chart and observer on unmount', () => {
    const { unmount } = render(
      <LineMatrix columns={columns} rows={rows} cells={cells} />
    )
    unmount()
    expect(mockChart.dispose).toHaveBeenCalledTimes(1)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('applies numeric height as inline px style', () => {
    render(
      <LineMatrix columns={columns} rows={rows} cells={cells} height={480} />
    )
    expect(screen.getByTestId('line-matrix-chart')).toHaveStyle({
      height: '480px',
    })
  })
})
