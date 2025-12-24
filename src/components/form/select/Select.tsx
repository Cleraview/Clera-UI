'use client'

import React, { useId, useState } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { FormInputWrapper } from '../FormInputWrapper'
import { GoChevronDown } from 'react-icons/go'
import { IoCheckmark } from 'react-icons/io5'
import {
  type FieldSize,
  floatingLabelBaseText,
  fieldPaddings,
} from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'

export type SelectOption = {
  value: string
  label: React.ReactNode
}

export type SelectProps = {
  id?: string
  label: string
  options: SelectOption[]
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  inputSize?: FieldSize
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
      inputType="select"
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
            'w-full flex items-center justify-between border border-transparent bg-transparent',
            '[&>[data-filled="false"]]:invisible',
            fieldPaddings[inputSize],
            floatingLabelBaseText[inputSize],
            hasError && '[&>[data-has-error="true"]]:text-ds-destructive',
            disabled
              ? 'text-ds-subtlest'
              : 'outline-none text-ds-default cursor-pointer',
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
            className={cn(
              hasError ? 'text-ds-destructive' : 'text-ds-default',
              floatingLabelBaseText[inputSize]
            )}
          />

          <SelectPrimitive.Icon asChild>
            <GoChevronDown
              className={cn(
                'w-4 h-4 ml-space-sm text-ds-subtlest',
                hasError && 'text-ds-destructive!'
              )}
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="w-[var(--radix-select-trigger-width)] z-50 bg-ds-elevation-surface rounded-md bg-default shadow-md border border-ds-default"
            sideOffset={4}
            position="popper"
            side="bottom"
          >
            <SelectPrimitive.Viewport className="p-space-xs">
              {options
                .filter(option => option.value && option.value.trim() !== '')
                .map(option => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      'flex items-center justify-between rounded-sm cursor-pointer',
                      'focus:bg-ds-primary focus:text-ds-primary outline-none',
                      fieldPaddings[inputSize],
                      floatingLabelBaseText[inputSize]
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>

                    <SelectPrimitive.ItemIndicator>
                      <IoCheckmark className="w-4 h-4 ml-space-md text-(--fill-ds-icon-primary)" />
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
