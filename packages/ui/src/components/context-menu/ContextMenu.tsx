'use client'

import {
  forwardRef,
  isValidElement,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type MouseEvent,
} from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { GoChevronRight } from 'react-icons/go'
import { FaCircleCheck, FaCircle } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'
import buildMenuDescriptors from './buildMenuDescriptors'
import RenderDescriptors from './RenderDescriptors'
import createRenderItem from './RenderItem'
import type { ContextMenuItemDef } from './types'

const ContextMenuRoot = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      styles.subTrigger,
      inset && styles.subTriggerInset,
      className
    )}
    {...props}
  >
    {children}
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(styles.subContent, className)}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(styles.item, inset && styles.itemInset, className)}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      styles.checkboxItem,
      checked && styles.itemSelected,
      className
    )}
    checked={checked}
    {...props}
  >
    <span className={styles.iconWrapper}>
      {FaCircleCheck && (
        <FaCircleCheck
          className={cn(
            styles.checkboxIcon,
            checked ? styles.checkboxIconChecked : styles.checkboxIconDefault
          )}
        />
      )}
    </span>
    <div className={styles.labelGroupCheckbox}>
      <span>{children}</span>
    </div>
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    checked?: boolean
  }
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.radioItem, checked && styles.itemSelected, className)}
    {...props}
  >
    <span className={styles.iconWrapperRadio}>
      {FaCircle && <FaCircle className={styles.radioIcon} />}
    </span>
    <div className={styles.labelGroupCheckbox}>
      <span>{children}</span>
    </div>
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(styles.label, inset && styles.subTriggerInset, className)}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const nodeHasIcon = (n: ContextMenuItemDef) =>
  typeof n !== 'string' &&
  !isValidElement(n) &&
  Boolean((n as { icon?: unknown }).icon)

interface ContextMenuProps extends ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Root
> {
  items: ContextMenuItemDef[] | Record<string, never>[]
  trigger: ReactNode
  width?: string | number
  className?: string
  closeOnSelect?: boolean
  onCheckboxToggle?: (value: string, checked: boolean) => void
  onRadioSelect?: (value: string) => void
  onSelect?: (value: string, item?: ContextMenuItemDef) => void
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: ContextMenuItemDef
  ) => void
}

const ContextMenu = ({
  trigger,
  items,
  width = 240,
  className,
  onOpenChange,
  closeOnSelect = true,
  onCheckboxToggle,
  onRadioSelect,
  onSelect,
  onGroupSelect,
  ...props
}: ContextMenuProps) => {
  type ItemProps = {
    onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
  }

  const invokeOnClick = (
    props: ItemProps | undefined,
    e: Event | MouseEvent<HTMLDivElement>
  ) => {
    props?.onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
  }

  const isCheckboxChecked = (node: ContextMenuItemDef | undefined) =>
    !!node &&
    typeof node !== 'string' &&
    !isValidElement(node) &&
    node.type === 'checkbox' &&
    Boolean(node.checked)

  const computeRoundedClass = (itemNode: ContextMenuItemDef, idx: number) => {
    const prevChecked = isCheckboxChecked(items[idx - 1])
    const nextChecked = isCheckboxChecked(items[idx + 1])
    const itemChecked = Boolean((itemNode as { checked?: boolean }).checked)

    if (!itemChecked) return styles.checkboxRoundedSingle
    if (prevChecked && nextChecked) return styles.checkboxRoundedMiddle
    if (prevChecked) return styles.checkboxRoundedBottom
    if (nextChecked) return styles.checkboxRoundedTop
    return styles.checkboxRoundedSingle
  }

  const makeCheckboxClickHandler = (
    itemNode: ContextMenuItemDef & {
      checked?: boolean
      value?: string
      groupId?: string
    },
    propsObj: ItemProps | undefined
  ) => {
    return (e: Event | MouseEvent<HTMLDivElement>) => {
      const nextCheckedState = !Boolean(itemNode.checked)
      if (propsObj?.onCheckedChange) {
        propsObj.onCheckedChange(nextCheckedState)
      } else if (itemNode.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode.value) {
        onSelect(itemNode.value, itemNode)
      } else if (onCheckboxToggle && itemNode.value) {
        onCheckboxToggle(itemNode.value, nextCheckedState)
      }
      invokeOnClick(propsObj, e)
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeRadioClickHandler = (
    itemNode: ContextMenuItemDef & { value?: string; groupId?: string },
    propsObj: ItemProps | undefined
  ) => {
    return (e: Event | MouseEvent<HTMLDivElement>) => {
      if (propsObj?.onClick) {
        propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
      } else if (itemNode.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode.value) {
        onSelect(itemNode.value, itemNode)
      } else if (onRadioSelect && itemNode.value) {
        onRadioSelect(itemNode.value)
      }
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeClickHandler = (
    propsObj: ItemProps | undefined,
    itemNode?: ContextMenuItemDef & { value?: string; groupId?: string }
  ) => {
    return (e: Event | MouseEvent<HTMLDivElement>) => {
      if (propsObj?.onClick) {
        propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
      } else if (itemNode?.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode?.value) {
        onSelect(itemNode.value, itemNode)
      }

      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const renderItem = createRenderItem({
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuSeparator,
    ContextMenuLabel,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    GoChevronRight,
    styles,
    nodeHasIcon,
    computeRoundedClass,
    makeCheckboxClickHandler,
    makeRadioClickHandler,
    makeClickHandler,
    cn,
  })

  const descriptors = buildMenuDescriptors(items, nodeHasIcon)

  const nodes: ReactNode[] = RenderDescriptors(descriptors, {
    renderItem,
    makeRadioClickHandler,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuItem,
    onGroupSelect,
    onSelect,
    onRadioSelect,
  })

  return (
    <ContextMenuRoot onOpenChange={onOpenChange} {...props}>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(styles.content, styles.contentPadding, className)}
        style={{ width }}
      >
        {nodes}
      </ContextMenuContent>
    </ContextMenuRoot>
  )
}

export {
  ContextMenu,
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
