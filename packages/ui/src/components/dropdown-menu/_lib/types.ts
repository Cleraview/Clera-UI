import type { ReactNode, ReactElement, ElementType, MouseEvent } from 'react'

export type DropdownItemDef =
  | string
  | ReactElement
  | {
      type?: 'item' | 'label' | 'separator' | 'checkbox' | 'radio'
      label?: ReactNode
      icon?: ElementType
      shortcut?: string
      disabled?: boolean
      onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
      className?: string
      children?: DropdownItemDef[]
      checked?: boolean
      onCheckedChange?: (checked: boolean) => void
      value?: string
      groupId?: string
      id?: string
    }

export type DropdownObjectItem = {
  type?: 'item' | 'label' | 'separator' | 'checkbox' | 'radio'
  label?: ReactNode
  icon?: ElementType
  shortcut?: string
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
  className?: string
  children?: DropdownItemDef[]
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  value?: string
  groupId?: string
  id?: string
  __idx?: number
}
