'use client'

import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ReactElement,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type Attributes,
  type MouseEventHandler,
  type MouseEvent,
} from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { GoChevronRight } from 'react-icons/go'
import { FaCircleCheck, FaCircle } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'

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
      'flex cursor-default select-none items-center rounded-sm p-menu-item-md text-body-sm text-ds-default outline-none',
      'hover:bg-ds-neutral-subtle-hovered focus:bg-ds-neutral-subtle-hovered data-[state=open]:bg-ds-neutral-subtle-hovered',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <GoChevronRight className="ml-auto h-4 w-4 text-ds-subtle" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface p-1 shadow-ds-elevation-overlay animate-in slide-in-from-left-1',
      className
    )}
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
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface p-1 shadow-ds-elevation-overlay animate-in fade-in-80',
        className
      )}
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
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm p-menu-item-md text-body-sm text-ds-default outline-none cursor-pointer transition-colors',
      'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
      'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-space-md',
      className
    )}
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
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body-sm text-ds-default cursor-pointer outline-none transition-colors',
      !checked && [
        'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
        'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
      ],
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      checked && 'bg-ds-primary',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <FaCircleCheck
        className={cn(
          'h-4 w-4',
          checked
            ? 'text-(--fill-ds-icon-accent-violet)'
            : 'text-(--fill-ds-icon)'
        )}
      />
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body-sm text-ds-default outline-none transition-colors',
      'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
      'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <FaCircle className="h-2 w-2 fill-ds-icon-brand" />
    </span>
    {children}
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
    className={cn(
      'p-menu-item-md text-body-sm font-semibold text-ds-default',
      inset && 'pl-8',
      className
    )}
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
    className={cn('my-1 h-px bg-ds-neutral-subtle-pressed', className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

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
      id?: string
    }

interface ContextMenuProps extends ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Root
> {
  items: ContextMenuItemDef[]
  trigger: ReactNode
  width?: string | number
  className?: string
}

const ContextMenu = ({
  trigger,
  items,
  width = 240,
  className,
  onOpenChange,
  ...props
}: ContextMenuProps) => {
  const renderItem = (item: ContextMenuItemDef, index: number) => {
    if (typeof item === 'string') {
      return <ContextMenuItem key={index}>{item}</ContextMenuItem>
    }

    if (isValidElement(item)) {
      return cloneElement(item, { key: index } as Attributes)
    }

    const {
      type = 'item',
      label,
      icon: Icon,
      shortcut,
      children,
      className,
      ...itemProps
    } = item
    const key = item.id || index

    if (children && children.length > 0) {
      return (
        <ContextMenuSub key={key}>
          <ContextMenuSubTrigger
            className={cn('justify-between', className)}
            disabled={itemProps.disabled}
          >
            <div className="flex items-center">
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              <span>{label}</span>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-full min-w-[8rem]">
            {children.map((child, idx) => renderItem(child, idx))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )
    }

    switch (type) {
      case 'separator':
        return <ContextMenuSeparator key={key} className={className} />
      case 'label':
        return (
          <ContextMenuLabel key={key} className={className}>
            {label}
          </ContextMenuLabel>
        )
      case 'checkbox':
        return (
          <ContextMenuCheckboxItem
            key={key}
            className={className}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            disabled={itemProps.disabled}
          >
            {label}
          </ContextMenuCheckboxItem>
        )
      case 'radio':
        return (
          <ContextMenuRadioItem
            key={key}
            className={className}
            value={item.value!}
            disabled={itemProps.disabled}
          >
            {label}
          </ContextMenuRadioItem>
        )
      case 'item':
      default:
        return (
          <ContextMenuItem
            key={key}
            className={className}
            onClick={itemProps.onClick as MouseEventHandler<HTMLDivElement>}
            disabled={itemProps.disabled}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{label}</span>
            {shortcut && (
              <span className="ml-auto text-xs tracking-widest opacity-60">
                {shortcut}
              </span>
            )}
          </ContextMenuItem>
        )
    }
  }

  return (
    <ContextMenuRoot onOpenChange={onOpenChange} {...props}>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent className={cn('p-1', className)} style={{ width }}>
        {items.map(renderItem)}
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
