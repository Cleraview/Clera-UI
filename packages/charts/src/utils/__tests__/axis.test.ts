import { resolveAxisName } from '../axis'

describe('utils/axis resolveAxisName', () => {
  it('maps a value-axis "top" to the axis end with no rotation', () => {
    const p = resolveAxisName('top', { orientation: 'vertical', side: 'left' })
    expect(p.nameLocation).toBe('end')
    expect(p.nameRotate).toBe(0)
    expect(p.reserveSide).toBe('top')
  })

  it('maps "bottom" to the axis start', () => {
    const p = resolveAxisName('bottom', {
      orientation: 'vertical',
      side: 'left',
    })
    expect(p.nameLocation).toBe('start')
    expect(p.reserveSide).toBe('bottom')
  })

  it('rotates a vertical "middle" title and reserves the axis side', () => {
    const p = resolveAxisName('middle', {
      orientation: 'vertical',
      side: 'right',
      labelExtent: 40,
    })
    expect(p.nameLocation).toBe('middle')
    expect(p.nameRotate).toBe(90)
    expect(p.nameGap).toBeGreaterThan(40)
    expect(p.reserveSide).toBe('right')
    expect(p.reserve).toBeGreaterThan(p.nameGap)
  })

  it('does not rotate a horizontal "middle" title and reserves the bottom', () => {
    const p = resolveAxisName('middle', {
      orientation: 'horizontal',
      labelExtent: 30,
    })
    expect(p.nameLocation).toBe('middle')
    expect(p.nameRotate).toBe(0)
    expect(p.reserveSide).toBe('bottom')
  })

  it('flips the corner ends when the axis is inverted', () => {
    const normal = resolveAxisName('top', { orientation: 'vertical' })
    const inverted = resolveAxisName('top', {
      orientation: 'vertical',
      inverse: true,
    })
    expect(normal.nameLocation).toBe('end')
    expect(inverted.nameLocation).toBe('start')
  })

  it('maps category "left"/"right" to axis start/end on a horizontal axis', () => {
    expect(
      resolveAxisName('left', { orientation: 'horizontal' }).nameLocation
    ).toBe('start')
    expect(
      resolveAxisName('right', { orientation: 'horizontal' }).nameLocation
    ).toBe('end')
  })

  it('drops a left/right x-axis title one row below the labels, anchored at the axis end', () => {
    const right = resolveAxisName('right', {
      orientation: 'horizontal',
      labelExtent: 22,
    })
    expect(right.nameTextStyle.verticalAlign).toBe('top')
    expect(right.reserveSide).toBe('bottom')
    expect(right.nameTextStyle.align).toBe('left')
    expect(
      resolveAxisName('left', { orientation: 'horizontal' }).nameTextStyle.align
    ).toBe('right')
  })
})
