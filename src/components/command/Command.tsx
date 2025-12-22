'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { cva, type VariantProps } from 'class-variance-authority'
import Dialog, { DialogProps as CustomDialogProps } from '@/components/dialog'
import { FiSearch } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'

export type CommandDialogProps = CustomDialogProps & {
  autoFocusInput?: boolean
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const CommandDialog = ({
  children,
  autoFocusInput = true,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog
      {...props}
      onOpenAutoFocus={e => {
        if (!autoFocusInput) {
          e.preventDefault()
        } else {
          e.preventDefault()
          setTimeout(() => {
            const input = document.querySelector('[cmdk-input-wrapper] input')
            if (input) {
              ;(input as HTMLInputElement).focus()
            }
          }, 0)
        }
      }}
    >
      {children}
    </Dialog>
  )
}

const commandVariants = cva(
  'flex w-full flex-col overflow-hidden bg-ds-elevation-surface',
  {
    variants: {
      withBorder: {
        true: 'border border-ds-default shadow-md rounded-xl',
        false: '',
      },
    },
    defaultVariants: {
      withBorder: true,
    },
  }
)

export interface CommandProps
  extends
    React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
    VariantProps<typeof commandVariants> {}

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, withBorder, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(commandVariants({ withBorder }), className)}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const commandInputVariants = cva(
  [
    'w-full bg-transparent text-ds-default placeholder:text-ds-subtlest',
    'ml-space-sm focus:outline-none focus:ring-0 border-none p-0',
  ],
  {
    variants: {
      size: {
        xs: 'text-body-xs',
        sm: 'text-body-sm',
        md: 'text-body-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface CommandInputProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'size'>,
    VariantProps<typeof commandInputVariants> {}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, size, ...props }, ref) => (
  <div className="flex items-center border-b border-ds-default p-space-sm">
    <FiSearch className="h-5 w-5 text-(--fill-ds-icon-subtle)" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(commandInputVariants({ size, className }))}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'max-h-[300px] overflow-y-auto overflow-x-hidden p-space-sm outline-none scrollbar',
      className
    )}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-space-md text-center text-body-sm text-ds-subtle"
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const commandGroupVariants = cva(
  [
    'overflow-hidden text-ds-default',
    '[&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ds-subtle',
  ],
  {
    variants: {
      size: {
        xs: '[&_[cmdk-group-heading]]:text-body-xs',
        sm: '[&_[cmdk-group-heading]]:text-body-xs',
        md: '[&_[cmdk-group-heading]]:text-body-sm',
      },
    },
    compoundVariants: [
      { size: 'xs', className: '[&_[cmdk-group-heading]]:p-space-xs' },
      { size: ['sm', 'md'], className: '[&_[cmdk-group-heading]]:p-space-sm' },
    ],
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface CommandGroupProps
  extends
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>,
    VariantProps<typeof commandGroupVariants> {}

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, size, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(commandGroupVariants({ size, className }))}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('h-px bg-default', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const commandItemVariants = cva(
  [
    'relative flex cursor-pointer select-none items-center rounded-md text-ds-default outline-none transition-colors',
    'data-[disabled="true"]:pointer-events-none data-[disabled="true"]:opacity-50',
  ],
  {
    variants: {
      size: {
        xs: 'text-body-xs',
        sm: 'text-body-sm',
        md: 'text-body-md',
      },
      isSelected: {
        true: 'bg-ds-primary-bold text-ds-inverse [&>svg]:text-(--fill-ds-icon-inverse)',
        false: 'aria-selected:bg-ds-neutral-subtle-hovered',
      },
    },
    compoundVariants: [
      { size: 'xs', className: 'p-menu-item-xs' },
      { size: 'sm', className: 'p-menu-item-sm' },
      { size: 'md', className: 'p-menu-item-md' },
    ],
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface CommandItemProps
  extends
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    VariantProps<typeof commandItemVariants> {
  isSelected: boolean
}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, size, isSelected = false, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(commandItemVariants({ size, isSelected, className }))}
    {...props}
  />
))
CommandItem.displayName = CommandItem.displayName

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
