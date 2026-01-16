import { ReactNode, Children, isValidElement, PropsWithChildren } from 'react'

type SlotComponents = Record<string, React.ComponentType<PropsWithChildren>>

export type SlotData = {
  children: ReactNode
  props: Record<string, unknown>
}

type ExtractSlotsResult = {
  slots: Record<string, SlotData | undefined>
  children: ReactNode
}

type NodeProps = {
  props: Record<string, unknown> & {
    children?: React.ReactNode
  }
}

export function extractSlots(
  children: ReactNode | undefined,
  slotComponents: SlotComponents
): ExtractSlotsResult {
  const slots: Record<string, SlotData | undefined> = {}
  const content: ReactNode[] = []

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      const matchedSlotKey = Object.entries(slotComponents).find(
        ([, component]) => child.type === component
      )?.[0]

      if (matchedSlotKey) {
        const { children: slotChildren, ...restProps } = (child as NodeProps)
          .props
        slots[matchedSlotKey] = {
          children: slotChildren ?? child,
          props: restProps,
        }
        return
      }
    }

    content.push(child)
  })

  return {
    slots,
    children: content.length === 1 ? content[0] : content,
  }
}
