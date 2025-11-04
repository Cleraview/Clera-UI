import React, { PropsWithChildren } from 'react'
import { extractSlots } from '../slots'

const SlotA: React.FC<PropsWithChildren> = ({ children }) => <>{children}</>
const SlotB: React.FC<PropsWithChildren> = ({ children }) => <>{children}</>

const slotsConfig = {
  Header: SlotA,
  Footer: SlotB,
}

describe('utils/slots', () => {
  it('should return no slots and no children when passed null or undefined', () => {
    expect(extractSlots(null, slotsConfig)).toEqual({
      slots: {},
      children: [],
    })
    expect(extractSlots(undefined, slotsConfig)).toEqual({
      slots: {},
      children: [],
    })
  })

  it('should return only children when no slots match', () => {
    const children = <p>Hello</p>
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )
    expect(slots).toEqual({})
    expect(remainingChildren).toEqual(children)
  })

  it('should extract a single slot and no children', () => {
    const children = <SlotA>Header Content</SlotA>
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )
    expect(slots.Header).toBe('Header Content')
    expect(slots.Footer).toBeUndefined()
    expect(remainingChildren).toEqual([])
  })

  it('should extract multiple unique slots and no children', () => {
    const children = [
      <SlotA key="1">Header Content</SlotA>,
      <SlotB key="2">Footer Content</SlotB>,
    ]
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )
    expect(slots.Header).toBe('Header Content')
    expect(slots.Footer).toBe('Footer Content')
    expect(remainingChildren).toEqual([])
  })

  it('should extract slots and remaining children', () => {
    const children = [
      <p key="1">Child 1</p>,
      <SlotA key="2">Header Content</SlotA>,
      <div key="3">Child 2</div>,
      <SlotB key="4">Footer Content</SlotB>,
    ]
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )

    expect(slots.Header).toBe('Header Content')
    expect(slots.Footer).toBe('Footer Content')
    expect(remainingChildren).toEqual([
      <p key="1">Child 1</p>,
      <div key="3">Child 2</div>,
    ])
  })

  it('should return a single child (not in an array) if only one non-slot child remains', () => {
    const children = [
      <SlotA key="1">Header</SlotA>,
      <p key="2">The only child</p>,
    ]
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )
    expect(slots.Header).toBe('Header')
    expect(remainingChildren).toEqual(<p key="2">The only child</p>)
  })

  it('should overwrite slots if multiple of the same type are provided (last one wins)', () => {
    const children = [
      <SlotA key="1">Header 1</SlotA>,
      <p key="2">Hello</p>,
      <SlotA key="3">Header 2</SlotA>,
    ]
    const { slots, children: remainingChildren } = extractSlots(
      children,
      slotsConfig
    )
    expect(slots.Header).toBe('Header 2')
    expect(remainingChildren).toEqual(<p key="2">Hello</p>)
  })

  it('should handle slots with no children (returning the component itself)', () => {
    const children = <SlotA />
    const { slots } = extractSlots(children, slotsConfig)
    expect(slots.Header).toEqual(children)
  })
})
