'use client'

import { InputHTMLAttributes, useId, useState, ReactNode } from 'react'
import { type FieldSize } from '@/components/_core/field-config'
import { inputClasses } from './../styles'
import { FormInputWrapper } from '../FormInputWrapper'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  fullWidth?: boolean
  defaultValue?: string
  inputSize?: FieldSize
  hasError?: boolean
  onBlur?: () => void
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Input: React.FC<Omit<InputProps, 'placeholder'>> = ({
  id,
  label,
  value,
  fullWidth,
  required,
  readOnly,
  disabled,
  onBlur,
  type = 'text',
  inputSize = 'md',
  hasError = false,
  icon,
  iconPosition = 'right',
  ...restProps
}) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const [focused, setFocused] = useState<boolean>(false)
  const [filled, setFilled] = useState<boolean>(!!(value as string)?.length)

  const handleFocus = () => setFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    setFilled(!!e.target.value)

    if (onBlur) onBlur()
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
      hasIcon={!!icon}
      icon={icon}
      iconPosition={iconPosition}
      fullWidth={fullWidth}
    >
      <input
        id={inputId}
        type={type}
        value={value}
        className={inputClasses(
          inputSize,
          disabled,
          hasError,
          icon ? iconPosition : undefined
        )}
        placeholder={label}
        readOnly={readOnly}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={e => {
          setFilled(!!e.target.value)
          restProps.onChange?.(e)
        }}
        {...restProps}
      />
    </FormInputWrapper>
  )
}
