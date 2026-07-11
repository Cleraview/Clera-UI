import { resolveLegendIcon, buildLegendOption } from '../legend'

describe('resolveLegendIcon', () => {
  it('passes built-in shapes through unchanged', () => {
    expect(resolveLegendIcon('circle')).toBe('circle')
    expect(resolveLegendIcon('roundRect')).toBe('roundRect')
    expect(resolveLegendIcon('none')).toBe('none')
  })

  it('replaces pin/arrow with a bounding-box-centered path', () => {
    expect(resolveLegendIcon('pin')).toMatch(/^path:\/\//)
    expect(resolveLegendIcon('arrow')).toMatch(/^path:\/\//)
  })

  it('passes path:// and image:// strings through unchanged', () => {
    expect(resolveLegendIcon('path://M0 0L1 1Z')).toBe('path://M0 0L1 1Z')
    expect(resolveLegendIcon('image://https://x/y.png')).toBe(
      'image://https://x/y.png'
    )
  })

  it('wraps bare image URLs with image://', () => {
    expect(resolveLegendIcon('https://x/y.png')).toBe('image://https://x/y.png')
    expect(resolveLegendIcon('/logo.svg')).toBe('image:///logo.svg')
  })

  it('wraps raw <svg> markup as a data URI', () => {
    const result = resolveLegendIcon('<svg><circle r="1" /></svg>')
    expect(result).toMatch(/^image:\/\/data:image\/svg\+xml/)
    expect(decodeURIComponent(result.split(',')[1])).toContain('<svg>')
  })

  it('renders a React element to a data URI', () => {
    const result = resolveLegendIcon(
      <svg>
        <circle r={1} />
      </svg>
    )
    expect(result).toMatch(/^image:\/\/data:image\/svg\+xml/)
    expect(decodeURIComponent(result.split(',')[1])).toContain('<svg')
  })
})

describe('buildLegendOption icon sizing', () => {
  const colors = { label: '#000', subtle: '#666', line: '#ccc' }

  it('defaults rect/roundRect to a wider-than-tall box', () => {
    const opt = buildLegendOption({
      shown: true,
      position: 'top',
      icon: 'rect',
      colors,
    }) as { itemWidth: number; itemHeight: number }
    expect(opt.itemWidth).toBeGreaterThan(opt.itemHeight)
  })

  it('forces square to equal width/height even with mismatched overrides', () => {
    const opt = buildLegendOption({
      shown: true,
      position: 'top',
      icon: 'square',
      colors,
      style: { itemWidth: 20, itemHeight: 10 },
    }) as { itemWidth: number; itemHeight: number }
    expect(opt.itemWidth).toBe(opt.itemHeight)
  })
})
