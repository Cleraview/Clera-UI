'use client'

import { InputHTMLAttributes, useId, useState, ReactNode } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { type FieldSize } from '@/components/_core/field-config'
import { inputClasses } from './../styles'
import { FormInputWrapper } from '../FormInputWrapper'
import { usePasswordMask } from './_hooks/usePasswordMask'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  fullWidth?: boolean
  defaultValue?: string
  inputSize?: FieldSize
  hasError?: boolean
  onBlur?: () => void
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  maskDelay?: number
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
  maskDelay = 300,
  ...restProps
}) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const [focused, setFocused] = useState<boolean>(false)
  const [filled, setFilled] = useState<boolean>(!!(value as string)?.length)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const isPassword = type === 'password'
  const isControlled = value !== undefined

  const {
    internalValue,
    setInternalValue,
    displayValue,
    showLastChar: _showLastChar,
    setShowLastChar,
    debouncedMask,
  } = usePasswordMask({
    value: value as string | undefined,
    isPassword,
    showPassword,
    maskDelay,
  })

  const actualValue = isControlled ? (value as string) : internalValue

  const resolvedType = isPassword ? 'text' : type
  const resolvedIconPosition = isPassword ? 'right' : iconPosition
  const resolvedIcon = isPassword ? (
    <button
      type="button"
      tabIndex={-1}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      onClick={() => setShowPassword(prev => !prev)}
      className="cursor-pointer focus:outline-none"
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>
  ) : (
    icon
  )

  const handleFocus = () => setFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    setFilled(!!e.target.value)
    if (onBlur) onBlur()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value

    if (!isPassword || showPassword) {
      if (!isControlled) setInternalValue(inputVal)
      setFilled(!!inputVal)
      restProps.onChange?.(e)
      return
    }

    const prevLen = actualValue.length
    const newLen = inputVal.length
    let newActualValue = ''

    if (newLen > prevLen) {
      const addedCount = newLen - prevLen
      const addedChars = inputVal.slice(-addedCount)
      newActualValue = actualValue + addedChars
      setShowLastChar(true)
    } else if (newLen < prevLen) {
      const diff = prevLen - newLen
      newActualValue = actualValue.slice(0, -diff)
      setShowLastChar(false)
    } else {
      newActualValue = actualValue
    }

    debouncedMask()

    if (!isControlled) setInternalValue(newActualValue)
    setFilled(!!newActualValue)

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: newActualValue },
    } as React.ChangeEvent<HTMLInputElement>
    restProps.onChange?.(syntheticEvent)
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
      hasIcon={!!resolvedIcon}
      icon={resolvedIcon}
      iconPosition={resolvedIconPosition}
      iconClickable={isPassword}
      fullWidth={fullWidth}
    >
      <input
        id={inputId}
        type={resolvedType}
        value={isPassword && !showPassword ? displayValue : actualValue}
        autoComplete={isPassword ? 'off' : restProps.autoComplete}
        className={inputClasses(
          inputSize,
          disabled,
          hasError,
          resolvedIcon ? resolvedIconPosition : undefined
        )}
        placeholder={label}
        readOnly={readOnly}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...restProps}
      />
    </FormInputWrapper>
  )
}
