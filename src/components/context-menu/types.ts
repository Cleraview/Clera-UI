import {
  type ReactElement,
  type ReactNode,
  type ElementType,
  type MouseEvent,
} from 'react'

export type ContextMenuItemDef =
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
      children?: ContextMenuItemDef[]
      checked?: boolean
      onCheckedChange?: (checked: boolean) => void
      value?: string
      groupId?: string
      id?: string
    }

export type RadioItemDef = {
  type?: 'radio'
  label?: ReactNode
  value?: string
  groupId?: string
  checked?: boolean
  className?: string
  disabled?: boolean
  id?: string
}
