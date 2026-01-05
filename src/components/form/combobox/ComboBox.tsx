'use client'

import React, { forwardRef, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { styles } from './styles'
import { type FieldSize } from '@/components/_core/field-config'
import { BaseComboBox, ComboBoxItem, ComboBoxEmpty } from './BaseComboBox'

export type ComboBoxOption = {
  value: string
  label: React.ReactNode
}

export type ComboBoxProps = {
  id?: string
  label: string
  options: ComboBoxOption[]
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  inputSize?: FieldSize
  value?: string
  defaultValue?: string
  hasError?: boolean
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const ComboBox = forwardRef<HTMLButtonElement, ComboBoxProps>(
  (
    {
      id,
      label,
      options,
      fullWidth,
      required,
      disabled,
      readOnly,
      className,
      inputSize = 'md',
      value,
      hasError,
      defaultValue,
      placeholder,
      onChange,
      onBlur,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const isControlled = value !== undefined
    const activeValue = isControlled ? value : internalValue

    const displayLabel = options.find(o => o.value === activeValue)?.label

    const handleSelect = (val: string) => {
      if (!isControlled) setInternalValue(val)
      onChange?.(val)
      setOpen(false)
      setSearch('')
    }

    return (
      <BaseComboBox
        ref={ref}
        id={id}
        label={label}
        value={activeValue}
        displayValue={displayLabel}
        placeholder={placeholder}
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen)
          if (!isOpen) onBlur?.()
        }}
        searchValue={search}
        onSearchChange={setSearch}
        inputSize={inputSize}
        fullWidth={fullWidth}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        hasError={hasError}
        className={className}
        shouldFilter={true}
      >
        <ComboBoxEmpty>No results found.</ComboBoxEmpty>

        {options.map(option => (
          <ComboBoxItem
            key={option.value}
            value={option.value}
            onSelect={handleSelect}
            inputSize={inputSize}
            isSelected={option.value === activeValue}
          >
            <span className={styles.optionLabel}>{option.label}</span>
            {option.value === activeValue && FiCheck && (
              <FiCheck className={styles.optionCheck} aria-hidden="true" />
            )}
          </ComboBoxItem>
        ))}
      </BaseComboBox>
    )
  }
)
ComboBox.displayName = 'ComboBox'
