'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk'
import { FiCheck, FiChevronDown } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import {
  type InputSize,
  sizeClasses,
} from '@/components/form/_props/input-props'
import { FormInputWrapper } from '../FormInputWrapper'

export interface ComboBoxOption {
  value: string
  label: React.ReactNode
}

interface ComboBoxProps {
  id?: string
  label: string
  options: ComboBoxOption[]
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  inputSize?: InputSize
  value?: string
  defaultValue?: string
  hasError?: boolean
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  (
    {
      id: idProp,
      label,
      options,
      fullWidth,
      required,
      disabled,
      readOnly,
      className,
      inputSize = 'md',
      value,
      hasError = false,
      defaultValue,
      placeholder = 'Select an option...',
      onChange,
      onBlur,
    },
    ref
  ) => {
    const autoId = React.useId()
    const inputId = idProp ?? autoId

    const [open, setOpen] = React.useState(false)
    const [filled, setFilled] = React.useState(
      value !== undefined
        ? String(value) !== ''
        : defaultValue !== undefined
          ? String(defaultValue) !== ''
          : false
    )

    const displayLabel =
      options.find(option => option.value === value)?.label ?? ''

    const handleChange = (val: string) => {
      setFilled(val !== '')
      onChange?.(val)
      setOpen(false)
    }

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
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            ref={ref}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full flex items-center justify-between border-none bg-transparent outline-none cursor-pointer',
              '[&>[data-filled="false"]]:text-subtlest',
              sizeClasses[inputSize],
              disabled ? 'text-subtlest' : 'text-default',
              className
            )}
            onBlur={() => {
              onBlur?.()
            }}
            disabled={disabled || readOnly}
            onClick={() => !readOnly && setOpen(o => !o)}
          >
            <span
              data-filled={filled}
              className={cn(
                'truncate',
                hasError ? 'text-destructive' : 'text-default',
                !value && 'invisible'
              )}
            >
              {value ? displayLabel : placeholder}
            </span>

            <FiChevronDown
              className={cn(
                'w-4 h-4 ml-space-sm text-subtlest shrink-0',
                hasError && 'text-destructive!'
              )}
            />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="w-[var(--radix-popover-trigger-width)] z-50 rounded-md bg-default shadow-md border border-default"
              sideOffset={4}
              side="bottom"
              align="start"
              onOpenAutoFocus={e => e.preventDefault()}
              // onMouseDown={(e) => e.preventDefault()}
            >
              <Command
                className="flex flex-col"
                filter={(value: string, search: string) => {
                  const option = options.find(o => o.value === value)
                  const label = option?.label ?? ''
                  if (typeof label === 'string') {
                    return label.toLowerCase().includes(search.toLowerCase())
                      ? 1
                      : 0
                  }
                  return 0
                }}
              >
                <CommandInput
                  className={cn(
                    'w-full px-space-sm py-space-xs text-body-sm outline-none border-b border-default',
                    sizeClasses[inputSize],
                    'placeholder:text-subtlest'
                  )}
                  placeholder="Search..."
                />
                <CommandList className="p-space-xs max-h-60 overflow-y-auto">
                  <CommandEmpty className="text-body-sm p-space-sm">
                    No results found.
                  </CommandEmpty>
                  {options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleChange}
                      className={cn(
                        'flex items-center justify-between rounded-sm p-space-sm text-body-sm cursor-pointer',
                        value === option.value &&
                          'bg-primary text-primary outline-none',
                        'aria-selected:bg-primary aria-selected:text-primary'
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {option.value === value && (
                        <FiCheck className="w-4 h-4 ml-space-md text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </FormInputWrapper>
    )
  }
)

ComboBox.displayName = 'ComboBox'
