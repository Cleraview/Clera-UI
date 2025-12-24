'use client'

import {
  forwardRef,
  useId,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandLoading,
} from 'cmdk'
import { FormInputWrapper } from '../FormInputWrapper'
import { FiChevronDown } from 'react-icons/fi'
import {
  type FieldSize,
  fieldPaddings,
  floatingLabelBaseText,
} from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'

export type BaseComboBoxProps = {
  id?: string
  label: string
  value?: string
  displayValue?: ReactNode
  placeholder?: string

  open: boolean
  onOpenChange: (open: boolean) => void

  searchValue: string
  onSearchChange: (value: string) => void
  shouldFilter?: boolean

  inputSize?: FieldSize
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  hasError?: boolean

  children: ReactNode
  className?: string
  triggerClassName?: string
}

export const BaseComboBox = forwardRef<HTMLButtonElement, BaseComboBoxProps>(
  (
    {
      id: idProp,
      label,
      value,
      displayValue,
      placeholder = 'Select...',

      open,
      onOpenChange,

      searchValue,
      onSearchChange,
      shouldFilter = true,

      inputSize = 'md',
      fullWidth,
      readOnly,
      disabled,
      required,
      hasError,

      children,
      triggerClassName,
    },
    ref
  ) => {
    const autoId = useId()
    const inputId = idProp ?? autoId
    const filled = !!value

    return (
      <FormInputWrapper
        id={inputId}
        label={label}
        inputSize={inputSize}
        hasError={hasError}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        focused={open}
        filled={filled}
        fullWidth={fullWidth}
      >
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <Popover.Trigger
            ref={ref}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            disabled={disabled || readOnly}
            className={cn(
              'w-full flex items-center justify-between border-none bg-transparent outline-none cursor-pointer',
              '[&>[data-filled="false"]]:text-ds-subtlest',
              disabled ? 'text-ds-subtlest' : 'text-ds-default',
              fieldPaddings[inputSize],
              triggerClassName
            )}
            onClick={() => !readOnly && onOpenChange(!open)}
          >
            <span
              data-filled={filled}
              className={cn(
                'truncate',
                hasError ? 'text-ds-destructive' : 'text-ds-default',
                !value && 'invisible',
                floatingLabelBaseText[inputSize]
              )}
            >
              {value ? displayValue : placeholder}
            </span>

            <FiChevronDown
              aria-hidden="true"
              className={cn(
                'w-4 h-4 ml-space-sm text-ds-subtlest shrink-0 transition-transform duration-200',
                hasError && 'text-ds-destructive!',
                open && 'rotate-180'
              )}
            />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="w-(--radix-popover-trigger-width) z-50 rounded-md bg-ds-elevation-surface shadow-md border border-ds-default animate-in fade-in-0 zoom-in-95"
              sideOffset={4}
              side="bottom"
              align="start"
            >
              <Command
                className="flex flex-col overflow-hidden rounded-md"
                shouldFilter={shouldFilter}
                aria-label={`${label} options`}
              >
                <CommandInput
                  className={cn(
                    'w-full border-b border-ds-default bg-transparent outline-none',
                    'text-body-sm text-ds-default placeholder:text-ds-subtlest',
                    fieldPaddings[inputSize]
                  )}
                  placeholder="Search..."
                  value={searchValue}
                  onValueChange={onSearchChange}
                  aria-label={`Search ${label}`}
                />
                <CommandList className="max-h-60 overflow-y-auto scrollbar p-space-xs">
                  {children}
                </CommandList>
              </Command>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </FormInputWrapper>
    )
  }
)
BaseComboBox.displayName = 'BaseComboBox'

export const ComboBoxItem = forwardRef<
  ElementRef<typeof CommandItem>,
  ComponentPropsWithoutRef<typeof CommandItem> & {
    inputSize?: FieldSize
    isSelected?: boolean
  }
>(({ className, inputSize = 'md', isSelected, ...props }, ref) => (
  <CommandItem
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm outline-none',
      'text-ds-default transition-colors',
      'aria-selected:bg-ds-primary aria-selected:text-ds-primary',

      isSelected && 'bg-ds-primary text-ds-primary outline-none',
      fieldPaddings[inputSize],
      floatingLabelBaseText[inputSize],
      className
    )}
    {...props}
  />
))
ComboBoxItem.displayName = 'ComboBoxItem'

export const ComboBoxGroup = forwardRef<
  ElementRef<typeof CommandGroup>,
  ComponentPropsWithoutRef<typeof CommandGroup>
>(({ className, ...props }, ref) => (
  <CommandGroup
    ref={ref}
    className={cn(
      'overflow-hidden text-ds-default',
      '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
      '[&_[cmdk-group-heading]]:text-body-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-ds-subtle',
      className
    )}
    {...props}
  />
))
ComboBoxGroup.displayName = 'ComboBoxGroup'

export const ComboBoxEmpty = forwardRef<
  ElementRef<typeof CommandEmpty>,
  ComponentPropsWithoutRef<typeof CommandEmpty>
>(({ className, ...props }, ref) => (
  <CommandEmpty
    ref={ref}
    className={cn('py-6 text-center text-body-sm text-ds-subtle', className)}
    {...props}
  />
))
ComboBoxEmpty.displayName = 'ComboBoxEmpty'

export const ComboBoxLoading = CommandLoading
