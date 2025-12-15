'use client'

import {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  isValidElement,
  cloneElement,
} from 'react'
import type {
  MouseEvent,
  ReactNode,
  ReactElement,
  ElementType,
  ComponentPropsWithoutRef,
  ElementRef,
  Attributes,
  MouseEventHandler,
} from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { FaChevronRight, FaChevronLeft, FaCircle } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm p-space-xs text-body-sm outline-none',
      'hover:bg-ds-neutral-subtle-hovered focus:bg-ds-neutral-subtle-hovered data-[state=open]:bg-ds-neutral-subtle-hovered',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <FaChevronRight className="ml-auto h-4 w-4 text-ds-subtle" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface p-1 shadow-ds-elevation-overlay animate-in slide-in-from-left-1',
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface p-1 shadow-ds-elevation-overlay animate-in fade-in-80',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm p-[8px] text-body-sm text-ds-default outline-none cursor-pointer transition-colors',
      'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
      'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-space-md',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
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
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
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
      <FaCircle className="h-2 w-2 fill-current text-ds-default" />
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'p-[8px] text-body-sm font-semibold text-ds-default',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('my-1 h-px bg-ds-neutral-subtle-pressed', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

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
      id?: string
    }

interface DropdownProps extends ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
> {
  items: DropdownItemDef[]
  trigger?: ReactNode
  align?: ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
  >['align']
  width?: string | number
  className?: string
}

interface MenuState {
  items: DropdownItemDef[]
  title: string
}

const Dropdown = ({
  children,
  trigger,
  items,
  align = 'end',
  width = 240,
  className,
  ...props
}: DropdownProps) => {
  const [history, setHistory] = useState<MenuState[]>([
    { title: 'Main', items: items },
  ])
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev]
      if (newHistory.length > 0) {
        newHistory[0] = { ...newHistory[0], items }
      }
      return newHistory
    })
  }, [items])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setHistory([{ title: 'Main', items: items }])
        setDirection('forward')
      }, 300)
    }
    props.onOpenChange?.(open)
  }

  const currentLayer = history[history.length - 1]
  const isRoot = history.length === 1

  const navigateToSubmenu = (
    e: MouseEvent | Event,
    subItems: DropdownItemDef[],
    title: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('forward')
    setHistory(prev => [...prev, { title, items: subItems }])
  }

  const navigateBack = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('backward')
    setHistory(prev => prev.slice(0, -1))
  }

  const animationClass = useMemo(() => {
    if (isRoot && direction === 'forward') {
      return ''
    }
    return direction === 'forward'
      ? 'animate-in slide-in-from-right-8 fade-in-0 duration-200'
      : 'animate-in slide-in-from-left-8 fade-in-0 duration-200'
  }, [isRoot, direction])

  const renderItem = (item: DropdownItemDef, index: number) => {
    if (typeof item === 'string') {
      return <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
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
        <DropdownMenuItem
          key={key}
          className={cn('justify-between', className)}
          disabled={itemProps.disabled}
          onClick={e => navigateToSubmenu(e, children, label as string)}
        >
          <div className="flex items-center">
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{label}</span>
          </div>
          <FaChevronRight className="h-3 w-3 text-ds-subtle" />
        </DropdownMenuItem>
      )
    }

    switch (type) {
      case 'separator':
        return <DropdownMenuSeparator key={key} className={className} />
      case 'label':
        return (
          <DropdownMenuLabel key={key} className={className}>
            {label}
          </DropdownMenuLabel>
        )
      case 'checkbox':
        return (
          <DropdownMenuCheckboxItem
            key={key}
            className={className}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuCheckboxItem>
        )
      case 'radio':
        return (
          <DropdownMenuRadioItem
            key={key}
            className={className}
            value={item.value!}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuRadioItem>
        )
      case 'item':
      default:
        return (
          <DropdownMenuItem
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
          </DropdownMenuItem>
        )
    }
  }

  return (
    <DropdownMenuRoot {...props} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>{trigger || children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn('p-1 overflow-hidden', className)}
        style={{ width }}
      >
        <div key={currentLayer.title} className={cn('w-full', animationClass)}>
          {!isRoot && (
            <div className="flex items-center px-1 py-1 mb-1 border-b border-ds-default/50">
              <button
                onClick={navigateBack}
                className="p-1 rounded-sm hover:bg-ds-neutral-subtle-hovered text-ds-subtle hover:text-ds-default transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-ds-brand/20"
              >
                <FaChevronLeft className="h-3 w-3" />
              </button>
              <span className="ml-2 text-body-sm font-semibold text-ds-default">
                {currentLayer.title}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            {currentLayer.items.map(renderItem)}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}

export {
  Dropdown,
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
