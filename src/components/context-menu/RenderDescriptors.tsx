/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  cloneElement,
  type ReactNode,
  type Attributes,
  type MouseEvent,
} from 'react'
import type { Descriptor } from './buildMenuDescriptors'
import type { ContextMenuItemDef } from './types'

type ItemProps = {
  onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

type Helpers = {
  renderItem: (
    item: ContextMenuItemDef,
    index: number,
    depth: number,
    siblingHasIcon: boolean
  ) => ReactNode
  makeRadioClickHandler: (
    itemNode: any,
    propsObj?: ItemProps
  ) => (e: MouseEvent<HTMLDivElement> | Event) => void
  ContextMenuRadioGroup: any
  ContextMenuRadioItem: any
  ContextMenuItem: any
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: ContextMenuItemDef
  ) => void
  onSelect?: (value: string, item?: ContextMenuItemDef) => void
  onRadioSelect?: (value: string) => void
}

export default function RenderDescriptors(
  descriptors: Descriptor[],
  helpers: Helpers
): ReactNode[] {
  const {
    renderItem,
    makeRadioClickHandler,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuItem,
    onGroupSelect,
    onSelect,
    onRadioSelect,
  } = helpers

  return descriptors.flatMap(desc => {
    switch (desc.kind) {
      case 'string':
        return <ContextMenuItem key={desc.index}>{desc.value}</ContextMenuItem>
      case 'element':
        return cloneElement(desc.value, { key: desc.index } as Attributes)
      case 'item':
        return renderItem(desc.item, desc.index, 0, desc.topLevelHasIcon)
      case 'radio-group': {
        const groupItems = desc.groupItems
        const groupId = desc.groupId
        const i = desc.startIndex
        const groupValue =
          groupItems.find(g => Boolean(g.checked))?.value ?? undefined

        const handleValueChange = (value: string) => {
          const matched = groupItems.find(g => g.value === value)
          if (!matched) return
          if (matched.groupId && onGroupSelect) {
            onGroupSelect(matched.groupId, value, matched)
          } else if (onSelect) {
            onSelect(value, matched)
          } else if (onRadioSelect) {
            onRadioSelect(value)
          }
        }

        return (
          <ContextMenuRadioGroup
            key={'radio-group-' + i + (groupId ?? '')}
            value={groupValue}
            onValueChange={handleValueChange}
          >
            {groupItems.map(g => (
              <ContextMenuRadioItem
                key={(g as any).id ?? (g as any).__idx}
                className={(g as any).className}
                value={(g as any).value!}
                checked={(g as any).checked}
                disabled={(g as any).disabled}
                onClick={makeRadioClickHandler(g as any, g as ItemProps)}
              >
                {(g as any).label}
              </ContextMenuRadioItem>
            ))}
          </ContextMenuRadioGroup>
        )
      }
      default:
        return null
    }
  })
}
