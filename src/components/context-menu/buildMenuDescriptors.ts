import { isValidElement, JSX } from 'react'
import { ContextMenuItemDef } from './types'

type ItemObject = Exclude<ContextMenuItemDef, string | JSX.Element>

export type Descriptor =
  | { kind: 'string'; value: string; index: number }
  | { kind: 'element'; value: JSX.Element; index: number }
  | {
      kind: 'item'
      item: ItemObject
      index: number
      topLevelHasIcon: boolean
    }
  | {
      kind: 'radio-group'
      groupItems: ItemObject[]
      startIndex: number
      groupId?: string
      topLevelHasIcon: boolean
    }

export default function buildMenuDescriptors(
  items: Array<ContextMenuItemDef | string | JSX.Element>,
  nodeHasIcon: (n: ContextMenuItemDef | string | JSX.Element) => boolean
): Descriptor[] {
  const descriptors: Descriptor[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (typeof item === 'string') {
      descriptors.push({ kind: 'string', value: item, index: i })
      continue
    }

    if (isValidElement(item)) {
      descriptors.push({
        kind: 'element',
        value: item as JSX.Element,
        index: i,
      })
      continue
    }

    const def = item as ItemObject

    if (def.type === 'radio') {
      const groupId = def.groupId
      const groupItems: ItemObject[] = []
      let j = i

      if (groupId) {
        while (j < items.length) {
          const it = items[j]
          if (typeof it !== 'string' && !isValidElement(it)) {
            const obj = it as ItemObject
            if (obj.type === 'radio' && obj.groupId === groupId) {
              groupItems.push(obj)
              j++
              continue
            }
          }
          break
        }
      } else {
        while (j < items.length) {
          const it = items[j]
          if (typeof it !== 'string' && !isValidElement(it)) {
            const obj = it as ItemObject
            if (obj.type === 'radio' && !obj.groupId) {
              groupItems.push(obj)
              j++
              continue
            }
          }
          break
        }
      }

      descriptors.push({
        kind: 'radio-group',
        groupItems,
        startIndex: i,
        groupId,
        topLevelHasIcon: groupItems.some(nodeHasIcon),
      })

      i = j - 1
      continue
    }

    descriptors.push({
      kind: 'item',
      item: def,
      index: i,
      topLevelHasIcon: nodeHasIcon(def),
    })
  }

  return descriptors
}
