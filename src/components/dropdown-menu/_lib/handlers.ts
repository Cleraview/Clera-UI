import type { MouseEvent } from 'react'
import type { ReactNode } from 'react'

export type MinimalItemNode = {
  checked?: boolean
  value?: string
  groupId?: string
  onCheckedChange?: (checked: boolean) => void
  onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
  className?: string
  disabled?: boolean
  id?: string
  label?: ReactNode
}

export type ItemProps = {
  onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export function makeCheckboxClickHandler(
  itemNode: MinimalItemNode,
  propsObj: ItemProps | undefined,
  options: {
    closeOnSelect: boolean
    onSelect?: (value: string, item?: MinimalItemNode) => void
    onGroupSelect?: (
      groupId: string,
      value: string,
      item?: MinimalItemNode
    ) => void
  }
) {
  return (e: MouseEvent) => {
    const nextChecked = !Boolean(itemNode.checked)
    if (propsObj?.onCheckedChange) propsObj.onCheckedChange(nextChecked)
    else if (itemNode.groupId && options.onGroupSelect && itemNode.value)
      options.onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
    else if (options.onSelect && itemNode.value)
      options.onSelect(itemNode.value, itemNode)
    propsObj?.onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
    if (!options.closeOnSelect) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

export function makeRadioClickHandler(
  itemNode: MinimalItemNode,
  propsObj: ItemProps | undefined,
  options: {
    closeOnSelect: boolean
    onSelect?: (value: string, item?: MinimalItemNode) => void
    onGroupSelect?: (
      groupId: string,
      value: string,
      item?: MinimalItemNode
    ) => void
  }
) {
  return (e: MouseEvent) => {
    if (propsObj?.onClick)
      propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
    else if (itemNode.groupId && options.onGroupSelect && itemNode.value)
      options.onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
    else if (options.onSelect && itemNode.value)
      options.onSelect(itemNode.value, itemNode)
    if (!options.closeOnSelect) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}

export function makeClickHandler(
  propsObj: ItemProps | undefined,
  itemNode: MinimalItemNode | undefined,
  options: {
    closeOnSelect: boolean
    onSelect?: (value: string, item?: MinimalItemNode) => void
    onGroupSelect?: (
      groupId: string,
      value: string,
      item?: MinimalItemNode
    ) => void
  }
) {
  return (e: MouseEvent) => {
    if (propsObj?.onClick)
      propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
    else if (itemNode?.groupId && options.onGroupSelect && itemNode.value)
      options.onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
    else if (options.onSelect && itemNode?.value)
      options.onSelect(itemNode.value, itemNode)
    if (!options.closeOnSelect) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
