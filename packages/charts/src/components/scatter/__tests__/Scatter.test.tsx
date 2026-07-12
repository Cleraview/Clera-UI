import { render, screen, act } from '@testing-library/react'
import * as echarts from 'echarts/core'
import { Scatter } from '../Scatter'

jest.mock('echarts/core', () => ({
  use: jest.fn(),
  init: jest.fn(),
}))
jest.mock('echarts/charts', () => ({
  ScatterChart: {},
  CustomChart: {},
  LineChart: {},
  BarChart: {},
}))
jest.mock('echarts/components', () => ({
  GridComponent: {},
  TooltipComponent: {},
  TitleComponent: {},
  LegendComponent: {},
  MarkLineComponent: {},
  TimelineComponent: {},
  AxisPointerComponent: {},
}))
jest.mock('echarts/features', () => ({ UniversalTransition: {} }))
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

const series = [
  {
    name: 'Cohort A',
    data: [
      [1, 4],
      [2, 7],
      [3, 5],
    ] as [number, number][],
  },
  {
    name: 'Cohort B',
    data: [
      [1, 2],
      [2, 3],
    ] as [number, number][],
  },
]

describe('components/charts/Scatter', () => {
  let mockChart: ReturnType<typeof makeMockChart>

  beforeEach(() => {
    jest.clearAllMocks()
    mockChart = makeMockChart()
    ;(echarts.init as jest.Mock).mockReturnValue(mockChart)
  })

  const lastOption = () =>
    mockChart.setOption.mock.calls[mockChart.setOption.mock.calls.length - 1][0]

  it('renders a container with scatter aria attributes', () => {
    render(<Scatter series={series} />)
    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Scatter chart')
    expect(container).toHaveAttribute('data-testid', 'scatter-chart')
  })

  it('initialises echarts on mount', () => {
    render(<Scatter series={series} />)
    expect(echarts.init).toHaveBeenCalledTimes(1)
  })

  it('renders one scatter series per input series', () => {
    render(<Scatter series={series} />)
    const option = lastOption()
    expect(option.series).toHaveLength(2)
    expect(option.series[0].type).toBe('scatter')
    expect(option.series[0].data).toEqual(series[0].data)
    expect(option.series[1].name).toBe('Cohort B')
  })

  it('lays out multiple panels and binds each series by gridIndex', () => {
    render(
      <Scatter
        title="Quartet"
        columns={2}
        showLegend={false}
        xAxis={{ min: 0, max: 20 }}
        yAxis={{ min: 0, max: 15 }}
        series={[
          { name: 'A', data: series[0].data, gridIndex: 0 },
          { name: 'B', data: series[1].data, gridIndex: 1 },
        ]}
      />
    )
    const option = lastOption()
    expect(option.grid).toHaveLength(2)
    expect(option.xAxis).toHaveLength(2)
    expect(option.yAxis).toHaveLength(2)
    expect(option.xAxis[1].gridIndex).toBe(1)
    expect(option.series[0].xAxisIndex).toBe(0)
    expect(option.series[1].xAxisIndex).toBe(1)
    expect(option.series[1].yAxisIndex).toBe(1)
    expect(option.title.text).toBe('Quartet')
  })

  it('draws a trend line when a series sets trendLine', () => {
    render(
      <Scatter
        series={[
          {
            name: 'Cohort A',
            data: series[0].data,
            trendLine: { from: [0, 3], to: [20, 13], label: 'y = 0.5x + 3' },
          },
        ]}
      />
    )
    const [scatterSeries] = lastOption().series
    expect(scatterSeries.markLine.data).toEqual([
      [
        { coord: [0, 3], symbol: 'none' },
        { coord: [20, 13], symbol: 'none' },
      ],
    ])
    expect(scatterSeries.markLine.label.formatter).toBe('y = 0.5x + 3')
    // bold on hover, and never fades when points are hovered
    expect(scatterSeries.markLine.emphasis.lineStyle.width).toBeGreaterThan(
      scatterSeries.markLine.lineStyle.width
    )
    expect(scatterSeries.markLine.blur.lineStyle.opacity).toBe(1)
  })

  it('draws a smooth regression line when a series sets regression', () => {
    render(
      <Scatter
        series={[
          {
            name: 'GDP',
            data: series[0].data,
            regression: {
              points: [
                [1, 2],
                [2, 5],
                [3, 12],
              ],
              label: 'y = 1 * e^(0.9x)',
            },
          },
        ]}
      />
    )
    const all = lastOption().series
    const fit = all[all.length - 1]
    expect(fit.type).toBe('line')
    expect(fit.smooth).toBe(true)
    expect(fit.data).toEqual([
      [1, 2],
      [2, 5],
      [3, 12],
    ])
    expect(fit.endLabel.formatter).toBe('y = 1 * e^(0.9x)')
  })

  it('adds universalTransition to the points when aggregate is set', () => {
    render(<Scatter series={series} aggregate={{ dimension: 0 }} />)
    const option = lastOption()
    expect(option.series[0].type).toBe('scatter')
    expect(option.series[0].id).toBe('Cohort A')
    expect(option.series[0].dataGroupId).toBe('Cohort A')
    expect(option.series[0].universalTransition.enabled).toBe(true)
  })

  it('renders an aggregate bar of per-series averages in bar view', () => {
    render(<Scatter series={series} aggregate={{ dimension: 0 }} view="bar" />)
    const option = lastOption()
    expect(option.xAxis.type).toBe('category')
    expect(option.xAxis.data).toEqual(['Cohort A', 'Cohort B'])
    // One bar series per group (id/name-matched to its scatter series) so the
    // legend keeps per-group show/hide and the morph stays 1:1.
    expect(option.series).toHaveLength(2)
    expect(option.series[0].type).toBe('bar')
    expect(option.series[0].id).toBe('Cohort A')
    expect(option.series[0].name).toBe('Cohort A')
    // Cohort A x-values are [1, 2, 3] -> average 2, at its own category, with a
    // groupId matching its scatter series so the morph stays 1:1.
    expect(option.series[0].data[0].value).toBeCloseTo(2)
    expect(option.series[0].data[0].groupId).toBe('Cohort A')
    expect(option.series[0].data[1]).toBe('-')
    expect(option.series[0].universalTransition.enabled).toBe(true)
  })

  it('keeps the legend when morphing to the aggregate bar view', () => {
    render(<Scatter series={series} aggregate={{ dimension: 0 }} view="bar" />)
    expect(lastOption().legend.show).toBe(true)
  })

  it('shows the empty message when every series is empty', () => {
    render(<Scatter series={[{ name: 'Empty', data: [] }]} />)
    expect(lastOption().title.text).toBe('No data')
  })

  it('shows the legend by default for multiple series', () => {
    render(<Scatter series={series} />)
    expect(lastOption().legend.show).toBe(true)
  })

  it('hides the legend by default for a single series', () => {
    render(<Scatter series={[series[0]]} />)
    expect(lastOption().legend.show).toBe(false)
  })

  it('dims the other series when highlightOnHover is on', () => {
    render(<Scatter series={series} highlightOnHover />)
    const option = lastOption()
    expect(option.series[0].emphasis.focus).toBe('series')
    expect(option.series[0].blur.itemStyle.opacity).toBeLessThan(1)
  })

  it('does not dim other series by default', () => {
    render(<Scatter series={series} />)
    const option = lastOption()
    expect(option.series[0].blur).toBeUndefined()
  })

  it('maps a series click to onPointClick', () => {
    const onPointClick = jest.fn()
    render(<Scatter series={series} onPointClick={onPointClick} />)
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({
      componentType: 'series',
      seriesName: 'Cohort A',
      value: [2, 7],
      dataIndex: 1,
    })
    expect(onPointClick).toHaveBeenCalledWith({
      seriesName: 'Cohort A',
      x: 2,
      y: 7,
      index: 1,
    })
  })

  it('ignores clicks outside the series (e.g. legend)', () => {
    const onPointClick = jest.fn()
    render(<Scatter series={series} onPointClick={onPointClick} />)
    const handler = mockChart.on.mock.calls.find(c => c[0] === 'click')?.[1]
    handler?.({ componentType: 'legend' })
    expect(onPointClick).not.toHaveBeenCalled()
  })

  it('re-applies options on a theme change', () => {
    render(<Scatter series={series} />)
    const before = mockChart.setOption.mock.calls.length
    act(() => {
      mutationCallback?.()
    })
    expect(mockChart.setOption.mock.calls.length).toBeGreaterThan(before)
  })

  it('shows the loading overlay when loading', () => {
    render(<Scatter series={series} loading />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('renders the requested spinner variant', () => {
    render(<Scatter series={series} loading loadingVariant="dots" />)
    expect(screen.getByTestId('chart-loading')).toBeInTheDocument()
  })

  it('calls onReady with the chart instance', () => {
    const onReady = jest.fn()
    render(<Scatter series={series} onReady={onReady} />)
    expect(onReady).toHaveBeenCalledWith(mockChart)
  })

  it('disposes the chart and disconnects observers on unmount', () => {
    const { unmount } = render(<Scatter series={series} />)
    unmount()
    expect(mockChart.dispose).toHaveBeenCalled()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('builds a timeline option when steps are given', () => {
    render(
      <Scatter
        steps={[
          { series: [{ name: 'Cluster 1', data: series[0].data }] },
          {
            series: [
              { name: 'Cluster 1', data: series[0].data },
              { name: 'Cluster 2', data: series[1].data },
            ],
            boundary: { center: [1, 2], radius: 3 },
          },
        ]}
      />
    )
    const option = lastOption()
    expect(option.series).toBeUndefined()
    expect(option.timeline.data).toEqual([0, 1])
    expect(option.options).toHaveLength(2)
    // Every frame keeps the same series shape (max scatter series + 1
    // boundary) so the timeline merges cleanly when it loops back.
    expect(option.options[0].series).toHaveLength(3)
    expect(option.options[1].series).toHaveLength(3)
    const boundary0 = option.options[0].series[2]
    const boundary1 = option.options[1].series[2]
    expect(boundary0.type).toBe('custom')
    expect(boundary0.data).toEqual([])
    expect(boundary1.data).toEqual([[1, 2, 3]])
    // Padded scatter slots carry no points until a step fills them.
    expect(option.options[0].series[1].data).toEqual([])
    expect(option.options[1].series[1].data).toEqual(series[1].data)
  })

  it('ignores series when steps are given', () => {
    render(
      <Scatter
        series={series}
        steps={[{ series: [{ name: 'Cluster 1', data: series[0].data }] }]}
      />
    )
    const option = lastOption()
    // 1 scatter series + 1 boundary series.
    expect(option.options[0].series).toHaveLength(2)
    expect(option.options[0].series[0].data).toEqual(series[0].data)
  })
})
