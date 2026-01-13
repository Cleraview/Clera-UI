'use client'

import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { type VariantProps } from 'class-variance-authority'
import { FiSearch } from 'react-icons/fi'
import Dialog, { DialogProps } from '@/components/dialog'
import { useCommandAutoFocus } from './hooks/useCommandFocus'
import { styles } from './styles'
import { cn } from '@/utils/tailwind'

export type CommandDialogProps = DialogProps & {
  autoFocusInput?: boolean
  children: ReactNode
  title?: string
}

export const CommandDialog = ({
  children,
  autoFocusInput = true,
  ...props
}: CommandDialogProps) => {
  const handleOpenAutoFocus = useCommandAutoFocus(autoFocusInput)

  return (
    <Dialog {...props} onOpenAutoFocus={handleOpenAutoFocus}>
      {children}
    </Dialog>
  )
}

export type CommandProps = ComponentPropsWithoutRef<typeof CommandPrimitive> &
  VariantProps<typeof styles.dialog>

export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, withBorder, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(styles.dialog({ withBorder }), className)}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

export type CommandInputProps = ComponentPropsWithoutRef<
  typeof CommandPrimitive.Input
>

export const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div className={styles.input.wrapper}>
    {FiSearch && <FiSearch className={styles.input.icon} />}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(styles.input.field, className)}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

export const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(styles.list, className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(styles.empty, className)}
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

export type CommandGroupProps = ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
>

export const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(styles.group, className)}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

export const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

export interface CommandItemProps
  extends
    ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    VariantProps<typeof styles.item> {
  isSelected: boolean
}

export const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, isSelected, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(styles.item({ isSelected }), className)}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName
