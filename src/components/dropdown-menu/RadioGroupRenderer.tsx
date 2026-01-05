import { isValidElement } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './DropdownPrimitives'
import type { ItemProps } from './_lib/handlers'
import type { DropdownObjectItem } from './_lib/types'

export function renderRadioGroup({
  itemsList,
  startIndex,
  makeRadioHandler,
  onSelect,
  onGroupSelect,
  closeOnSelect,
}: {
  itemsList: Array<string | ReactNode | DropdownObjectItem>
  startIndex: number
  makeRadioHandler: (
    itemNode: DropdownObjectItem,
    propsObj: ItemProps | undefined
  ) => (e: MouseEvent) => void
  onSelect?: (value: string, item?: DropdownObjectItem) => void
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: DropdownObjectItem
  ) => void
  closeOnSelect: boolean
}): { node: ReactNode | null; nextIndex: number } {
  const groupItems: DropdownObjectItem[] = []
  const first = itemsList[startIndex]
  const groupId = (
    first && typeof first !== 'string' && !isValidElement(first)
      ? (first as DropdownObjectItem).groupId
      : undefined
  ) as string | undefined
  let idx = startIndex
  if (groupId) {
    while (idx < itemsList.length) {
      const candidate = itemsList[idx]
      if (
        typeof candidate !== 'string' &&
        !isValidElement(candidate) &&
        (candidate as DropdownObjectItem).type === 'radio' &&
        (candidate as DropdownObjectItem).groupId === groupId
      ) {
        groupItems.push({ ...(candidate as DropdownObjectItem), __idx: idx })
        idx++
      } else break
    }
  } else {
    while (idx < itemsList.length) {
      const candidate = itemsList[idx]
      if (
        typeof candidate !== 'string' &&
        !isValidElement(candidate) &&
        (candidate as DropdownObjectItem).type === 'radio' &&
        !(candidate as DropdownObjectItem).groupId
      ) {
        groupItems.push({ ...(candidate as DropdownObjectItem), __idx: idx })
        idx++
      } else break
    }
  }

  const groupValue =
    groupItems.find(item => Boolean(item.checked))?.value ?? undefined

  const handleValueChange = (value: string) => {
    const matched = groupItems.find(item => item.value === value)
    if (!matched) return
    if (matched.groupId && onGroupSelect)
      onGroupSelect(matched.groupId, value, matched)
    else if (onSelect) onSelect(value, matched)
  }

  if (groupItems.length === 0) return { node: null, nextIndex: startIndex }

  const node = (
    <DropdownMenuRadioGroup
      key={`radio-group-${startIndex}-${groupId ?? ''}`}
      value={groupValue}
      onValueChange={handleValueChange}
    >
      {groupItems.map(groupItem => (
        <DropdownMenuRadioItem
          key={groupItem.id ?? groupItem.__idx}
          className={groupItem.className}
          value={groupItem.value!}
          checked={groupItem.checked}
          disabled={groupItem.disabled}
          onClick={makeRadioHandler(groupItem, groupItem as ItemProps)}
          onSelect={e => {
            if (!closeOnSelect) {
              e.preventDefault()
              e.stopPropagation()
            }
          }}
        >
          {groupItem.label}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  )

  return { node, nextIndex: idx }
}
