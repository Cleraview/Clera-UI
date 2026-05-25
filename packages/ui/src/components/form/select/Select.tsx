'use client'

import React, { FC, ReactNode, SyntheticEvent, useId, useState } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { FormInputWrapper } from '../FormInputWrapper'
import { GoChevronDown } from 'react-icons/go'
import { IoCheckmark } from 'react-icons/io5'
import { type FieldSize } from '@/components/_core/field-config'
import { styles, triggerClass, valueClass, itemClass } from './styles'

export type SelectOption = {
  value: string
  label: ReactNode
  disabled?: boolean
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

export const Select: FC<SelectProps> = ({
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
  const placeholder = disabled ? 'Disabled' : readOnly ? 'Read Only' : label
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

  const handleOnItemSelect = (event: SyntheticEvent, option: SelectOption) => {
    if (option.disabled) {
      event.preventDefault()
      event.stopPropagation()
    }
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
      icon={GoChevronDown ? <GoChevronDown /> : undefined}
      iconPosition="right"
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
          className={triggerClass({ inputSize, hasError, disabled, className })}
          onBlur={() => {
            onBlur?.()
          }}
          disabled={disabled || readOnly}
        >
          <SelectPrimitive.Value
            placeholder={placeholder}
            data-filled={filled}
            data-has-error={hasError}
            data-disabled={disabled}
            aria-disabled={disabled}
            className={valueClass(inputSize, hasError)}
          />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={styles.content}
            sideOffset={4}
            position="popper"
            side="bottom"
          >
            <SelectPrimitive.Viewport className={styles.viewport}>
              {options
                .filter(option => option.value && option.value.trim() !== '')
                .map(option => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    aria-disabled={option.disabled}
                    data-disabled={option.disabled}
                    className={itemClass(inputSize, option.disabled)}
                    onSelect={event => handleOnItemSelect(event, option)}
                    disabled={option.disabled}
                  >
                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>

                    <SelectPrimitive.ItemIndicator>
                      {IoCheckmark && (
                        <IoCheckmark className={styles.itemIndicatorIcon} />
                      )}
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
