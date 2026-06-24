import { renderHook, act } from '@testing-library/react'
import { useBarDrilldown, type BarDrilldownDatum } from '../useDrilldown'

const tree: BarDrilldownDatum[] = [
  {
    label: 'Americas',
    value: 1200,
    children: [
      {
        label: 'USA',
        value: 800,
        children: [
          { label: 'NY', value: 400 },
          { label: 'SF', value: 250 },
        ],
      },
      { label: 'Canada', value: 250 },
    ],
  },
  { label: 'EMEA', value: 900 },
]

describe('components/charts/useBarDrilldown', () => {
  it('starts at the root level', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    expect(result.current.data).toBe(tree)
    expect(result.current.path).toEqual(['All'])
    expect(result.current.depth).toBe(0)
    expect(result.current.canDrillUp).toBe(false)
  })

  it('drills into a bar that has children', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    act(() => result.current.onBarClick({ label: 'Americas', value: 1200 }))
    expect(result.current.path).toEqual(['All', 'Americas'])
    expect(result.current.depth).toBe(1)
    expect(result.current.canDrillUp).toBe(true)
    expect(result.current.data.map(d => d.label)).toEqual(['USA', 'Canada'])
  })

  it('does nothing when a leaf bar is clicked', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    act(() => result.current.onBarClick({ label: 'EMEA', value: 900 }))
    expect(result.current.depth).toBe(0)
  })

  it('supports multiple levels', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    act(() => result.current.onBarClick({ label: 'Americas', value: 1200 }))
    act(() => result.current.onBarClick({ label: 'USA', value: 800 }))
    expect(result.current.path).toEqual(['All', 'Americas', 'USA'])
    expect(result.current.data.map(d => d.label)).toEqual(['NY', 'SF'])
  })

  it('goes back one level', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    act(() => result.current.onBarClick({ label: 'Americas', value: 1200 }))
    act(() => result.current.onBarClick({ label: 'USA', value: 800 }))
    act(() => result.current.back())
    expect(result.current.path).toEqual(['All', 'Americas'])
  })

  it('jumps to a level with drillTo', () => {
    const { result } = renderHook(() => useBarDrilldown(tree))
    act(() => result.current.onBarClick({ label: 'Americas', value: 1200 }))
    act(() => result.current.onBarClick({ label: 'USA', value: 800 }))
    act(() => result.current.drillTo(0))
    expect(result.current.path).toEqual(['All'])
    expect(result.current.data).toBe(tree)
  })

  it('passes the parent bar color/variant down to its children', () => {
    const colored: BarDrilldownDatum[] = [
      {
        label: 'Blue',
        value: 10,
        variant: 'info',
        children: [
          { label: 'B1', value: 6 },
          { label: 'B2', value: 4 },
        ],
      },
    ]
    const { result } = renderHook(() => useBarDrilldown(colored))
    act(() => result.current.onBarClick({ label: 'Blue', value: 10 }))
    expect(result.current.data.every(d => d.variant === 'info')).toBe(true)
  })

  it('resets to the root', () => {
    const { result } = renderHook(() => useBarDrilldown(tree, 'Regions'))
    act(() => result.current.onBarClick({ label: 'Americas', value: 1200 }))
    act(() => result.current.reset())
    expect(result.current.path).toEqual(['Regions'])
  })
})
