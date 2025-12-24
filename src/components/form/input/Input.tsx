'use client'

import { InputHTMLAttributes, useId, useState } from 'react'
import { cn } from '@/utils/tailwind'
import {
  type FieldSize,
  fieldStateStyles,
  floatingLabelBaseText,
  fieldPaddings,
} from '@/components/_core/field-config'
import { FormInputWrapper } from '../FormInputWrapper'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  fullWidth?: boolean
  defaultValue?: string
  inputSize?: FieldSize
  hasError?: boolean
  onBlur?: () => void
}

export const Input: React.FC<InputProps> = ({
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
      fullWidth={fullWidth}
    >
      <input
        id={inputId}
        className={cn(
          'peer w-full placeholder-transparent focus:outline-none border border-transparent bg-transparent',
          fieldPaddings[inputSize],
          floatingLabelBaseText[inputSize],
          disabled ? 'text-ds-subtlest' : 'text-ds-default',
          hasError && fieldStateStyles.error.text
        )}
        type={type}
        value={value}
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
