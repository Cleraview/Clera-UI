'use client'

import React, { useId, useState } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/utils/tailwind'
import {
  sizeClasses,
  type InputSize,
} from '@/components/ui/form/_props/input-props'
import { FormInputWrapper } from '../FormInputWrapper'
import { GoChevronDown } from 'react-icons/go'
import { IoCheckmark } from 'react-icons/io5'

export interface SelectOption {
  value: string
  label: React.ReactNode
}

interface SelectProps {
  id?: string
  label: string
  options: SelectOption[]
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  inputSize?: InputSize
  value?: string
  defaultValue?: string
  hasError?: boolean
  className?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const Select: React.FC<SelectProps> = ({
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
  onChange,
  onBlur,
}) => {
  const autoId = useId()
  const inputId = idProp ?? autoId

  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(
    value !== undefined
      ? String(value) !== ''
      : defaultValue !== undefined
        ? String(defaultValue) !== ''
        : false
  )

  const handleChange = (val: string) => {
    setFilled(val !== '')
    onChange?.(val)
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
      focused={focused}
      filled={filled}
      fullWidth={fullWidth}
    >
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleChange}
        onOpenChange={state => setFocused(state)}
      >
        <SelectPrimitive.Trigger
          id={inputId}
          className={cn(
            'w-full flex items-center justify-between border-none bg-transparent outline-none cursor-pointer',
            "[&>[data-filled='false']]:invisible [&>[data-has-error='true']]:text-destructive",
            sizeClasses[inputSize],
            disabled ? 'text-subtlest' : 'text-default',
            className
          )}
          onBlur={() => {
            onBlur?.()
          }}
          disabled={disabled || readOnly}
        >
          <SelectPrimitive.Value
            placeholder={label}
            data-filled={filled}
            data-has-error={hasError}
            className={cn(hasError ? 'text-destructive' : 'text-default')}
          />

          <SelectPrimitive.Icon asChild>
            <GoChevronDown
              className={cn(
                'w-4 h-4 ml-space-sm text-subtlest',
                hasError && 'text-destructive!'
              )}
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="w-[var(--radix-select-trigger-width)] z-50 rounded-md bg-default shadow-md border border-default"
            sideOffset={4}
            position="popper"
            side="bottom"
          >
            <SelectPrimitive.Viewport className="p-space-xs">
              {options
                .filter(o => o.value && o.value.trim() !== '')
                .map(o => (
                  <SelectPrimitive.Item
                    key={o.value}
                    value={o.value}
                    className={cn(
                      'flex items-center justify-between rounded-sm px-space-sm py-space-xs text-body-sm cursor-pointer',
                      'focus:bg-primary focus:text-primary outline-none'
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {o.label}
                    </SelectPrimitive.ItemText>

                    <SelectPrimitive.ItemIndicator>
                      <IoCheckmark className="w-4 h-4 ml-space-md text-primary" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </FormInputWrapper>
  )
}
