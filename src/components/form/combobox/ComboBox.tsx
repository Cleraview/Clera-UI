'use client'

import React, { forwardRef, ReactNode, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { type FieldSize } from '@/components/_core/field-config'
import {
  BaseComboBox,
  ComboBoxItem,
  ComboBoxEmpty,
  ComboBoxGroup,
} from './BaseComboBox'
import { styles } from './styles'
import { cn } from '@/utils'

export type ComboBoxOption = {
  value: string
  label: ReactNode
  group?: string
  disabled?: boolean
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
  groupBy?: keyof ComboBoxOption
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
      groupBy,
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

    const renderChildren = groupBy
      ? Object.entries(
          options.reduce<Record<string, ComboBoxOption[]>>((acc, opt) => {
            const raw = (opt as Record<string, unknown>)[String(groupBy)]
            const key = raw == null ? '' : String(raw)
            if (!acc[key]) acc[key] = []
            acc[key].push(opt)
            return acc
          }, {})
        ).map(([group, items]) => (
          <ComboBoxGroup key={group} heading={group || undefined}>
            {items.map(option => (
              <ComboBoxItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
                inputSize={inputSize}
                isSelected={option.value === activeValue}
                disabled={option.disabled}
              >
                <span className={styles.optionLabel}>{option.label}</span>
                {option.value === activeValue && FiCheck && (
                  <FiCheck className={styles.optionCheck} aria-hidden="true" />
                )}
              </ComboBoxItem>
            ))}
          </ComboBoxGroup>
        ))
      : options.map(option => (
          <ComboBoxItem
            key={option.value}
            value={option.value}
            onSelect={handleSelect}
            inputSize={inputSize}
            isSelected={option.value === activeValue}
            className={cn('p-2.5')}
            disabled={option.disabled}
          >
            <span className={styles.optionLabel}>{option.label}</span>
            {option.value === activeValue && FiCheck && (
              <FiCheck className={styles.optionCheck} aria-hidden="true" />
            )}
          </ComboBoxItem>
        ))

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

        {renderChildren}
      </BaseComboBox>
    )
  }
)
ComboBox.displayName = 'ComboBox'
