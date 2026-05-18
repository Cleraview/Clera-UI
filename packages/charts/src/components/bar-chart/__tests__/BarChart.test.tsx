import { render, screen } from '@testing-library/react'
import { BarChart } from '../BarChart'

const sample = [
  { label: 'Mobile', value: 80 },
  { label: 'Desktop', value: 40 },
  { label: 'Tablet', value: 20 },
]

describe('components/charts/BarChart', () => {
  it('renders one row per datum with label and value', () => {
    render(<BarChart data={sample} />)
    expect(screen.getByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('Desktop')).toBeInTheDocument()
    expect(screen.getByText('Tablet')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('scales bars proportionally to the largest value', () => {
    render(<BarChart data={sample} />)
    const bars = screen.getAllByTestId('bar-chart-bar')
    expect(bars).toHaveLength(3)
    expect(bars[0]).toHaveStyle({ width: '100%' })
    expect(bars[1]).toHaveStyle({ width: '50%' })
    expect(bars[2]).toHaveStyle({ width: '25%' })
  })

  it('scales bars against an explicit max', () => {
    render(<BarChart data={sample} max={200} />)
    const bars = screen.getAllByTestId('bar-chart-bar')
    expect(bars[0]).toHaveStyle({ width: '40%' })
    expect(bars[1]).toHaveStyle({ width: '20%' })
    expect(bars[2]).toHaveStyle({ width: '10%' })
  })

  it('clamps overflowing values to 100%', () => {
    render(<BarChart data={[{ label: 'A', value: 500 }]} max={100} />)
    const bar = screen.getByTestId('bar-chart-bar')
    expect(bar).toHaveStyle({ width: '100%' })
  })

  it('renders 0% width when the ceiling is zero', () => {
    render(<BarChart data={[{ label: 'A', value: 0 }]} />)
    const bar = screen.getByTestId('bar-chart-bar')
    expect(bar).toHaveStyle({ width: '0%' })
  })

  it('hides values when showValues is false', () => {
    render(<BarChart data={sample} showValues={false} />)
    expect(screen.queryByText('80')).not.toBeInTheDocument()
  })

  it('applies a custom formatter to values', () => {
    render(
      <BarChart
        data={[{ label: 'Revenue', value: 1234 }]}
        formatValue={v => `$${v}`}
      />
    )
    expect(screen.getByText('$1234')).toBeInTheDocument()
  })

  it('sets accessible role and aria-valuenow on each track', () => {
    render(<BarChart data={sample} />)
    const tracks = screen.getAllByRole('progressbar')
    expect(tracks).toHaveLength(3)
    expect(tracks[0]).toHaveAttribute('aria-valuenow', '80')
    expect(tracks[0]).toHaveAttribute('aria-valuemax', '80')
  })
})
