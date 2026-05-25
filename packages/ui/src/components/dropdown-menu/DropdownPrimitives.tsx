import React, { forwardRef } from 'react'
import type { ElementRef, ComponentPropsWithoutRef } from 'react'
import * as Radix from '@radix-ui/react-dropdown-menu'
import { GoChevronRight } from 'react-icons/go'
import { FaCircle, FaCircleCheck } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export const DropdownMenuRoot = Radix.Root
export const DropdownMenuTrigger = Radix.Trigger
export const DropdownMenuGroup = Radix.Group
export const DropdownMenuPortal = Radix.Portal
export const DropdownMenuSub = Radix.Sub
export const DropdownMenuRadioGroup = Radix.RadioGroup

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof Radix.SubTrigger>,
  ComponentPropsWithoutRef<typeof Radix.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <Radix.SubTrigger
    ref={ref}
    className={cn(
      styles.subTrigger,
      inset && styles.subTriggerInset,
      className
    )}
    {...props}
  >
    {children}
    <GoChevronRight className={styles.chevronLarge} />
  </Radix.SubTrigger>
))
DropdownMenuSubTrigger.displayName = Radix.SubTrigger.displayName

export const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof Radix.SubContent>,
  ComponentPropsWithoutRef<typeof Radix.SubContent>
>(({ className, ...props }, ref) => (
  <Radix.Portal>
    <Radix.SubContent
      ref={ref}
      className={cn(styles.subContent, className)}
      {...props}
    />
  </Radix.Portal>
))
DropdownMenuSubContent.displayName = Radix.SubContent.displayName

export const DropdownMenuContent = forwardRef<
  ElementRef<typeof Radix.Content>,
  ComponentPropsWithoutRef<typeof Radix.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Radix.Portal>
    <Radix.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(styles.content, className)}
      {...props}
    />
  </Radix.Portal>
))
DropdownMenuContent.displayName = Radix.Content.displayName

export const DropdownMenuItem = forwardRef<
  ElementRef<typeof Radix.Item>,
  ComponentPropsWithoutRef<typeof Radix.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Radix.Item
    ref={ref}
    className={cn(styles.item, inset && styles.itemInset, className)}
    {...props}
  />
))
DropdownMenuItem.displayName = Radix.Item.displayName

export const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof Radix.CheckboxItem>,
  ComponentPropsWithoutRef<typeof Radix.CheckboxItem> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <Radix.CheckboxItem
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
      <FaCircleCheck
        className={cn(
          styles.checkboxIcon,
          checked ? styles.checkboxIconChecked : styles.checkboxIconDefault
        )}
      />
    </span>
    <div className={styles.labelGroup}>
      <span>{children}</span>
    </div>
  </Radix.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = Radix.CheckboxItem.displayName

export const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof Radix.RadioItem>,
  ComponentPropsWithoutRef<typeof Radix.RadioItem> & { checked?: boolean }
>(({ className, children, checked, ...props }, ref) => (
  <Radix.RadioItem
    ref={ref}
    className={cn(styles.radioItem, checked && styles.itemSelected, className)}
    {...props}
  >
    <span className={styles.iconWrapperRadio}>
      <FaCircle className={styles.radioIcon} />
    </span>
    <div className={styles.labelGroup}>
      <span>{children}</span>
    </div>
  </Radix.RadioItem>
))
DropdownMenuRadioItem.displayName = Radix.RadioItem.displayName

export const DropdownMenuLabel = forwardRef<
  ElementRef<typeof Radix.Label>,
  ComponentPropsWithoutRef<typeof Radix.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <Radix.Label
    ref={ref}
    className={cn(styles.label, inset && styles.labelInset, className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = Radix.Label.displayName

export const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof Radix.Separator>,
  ComponentPropsWithoutRef<typeof Radix.Separator>
>(({ className, ...props }, ref) => (
  <Radix.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = Radix.Separator.displayName
