'use client'

import { InputHTMLAttributes, useId, useState, ReactNode } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { type FieldSize } from '@/components/_core/field-config'
import { inputClasses } from './../styles'
import { FormInputWrapper } from '../FormInputWrapper'
import { usePasswordMask } from './_hooks/usePasswordMask'
import {
  useInputValidation,
  UseInputValidationOptions,
} from './_hooks/useInputValidation'
import { ValidationPresets } from './_utils/input-validator'

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
  validation?: UseInputValidationOptions
  validationPreset?: keyof typeof ValidationPresets
  showValidationErrors?: boolean
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all'
  onValidationChange?: (isValid: boolean, errors: string[]) => void
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
  validation,
  validationPreset,
  showValidationErrors = true,
  validationMode = 'onBlur',
  onValidationChange,
  autoComplete = 'off',
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

  const validationConfig =
    validation ||
    (validationPreset ? ValidationPresets[validationPreset]() : undefined)
  const shouldUseValidation = validationConfig && !isPassword

  const {
    validationResult,
    touched: validationTouched,
    handleChange: handleValidationChange,
    handleBlur: handleValidationBlur,
    handleKeyPress,
    handlePaste,
    getDisplayErrors: _getDisplayErrors,
  } = useInputValidation({
    ...validationConfig,
    value: shouldUseValidation ? actualValue : '',
    mode: validationMode,
    onValidationChange: result => {
      onValidationChange?.(result.isValid, result.errors)
    },
  })

  const inputHasError =
    hasError ||
    (shouldUseValidation &&
      showValidationErrors &&
      !validationResult.isValid &&
      validationTouched)

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

    if (shouldUseValidation) {
      handleValidationBlur()
    }

    if (onBlur) onBlur()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value

    if (!isPassword || showPassword) {
      let finalValue = inputVal

      if (shouldUseValidation) {
        finalValue = handleValidationChange(inputVal, 'onChange')
      }

      if (!isControlled) setInternalValue(finalValue)
      setFilled(!!finalValue)

      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: finalValue },
      } as React.ChangeEvent<HTMLInputElement>
      restProps.onChange?.(syntheticEvent)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      shouldUseValidation &&
      !handleKeyPress(
        e.key,
        (e.target as HTMLInputElement).value,
        e.nativeEvent
      )
    ) {
      e.preventDefault()
    }
    restProps.onKeyDown?.(e)
  }

  const handlePasteEvent = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (shouldUseValidation && handlePaste) {
      e.preventDefault()

      const pastedText = e.clipboardData.getData('text')
      const currentValue = (e.target as HTMLInputElement).value
      const validPastedText = handlePaste(pastedText, currentValue)

      if (validPastedText) {
        const newValue = currentValue + validPastedText
        let finalValue = newValue

        if (shouldUseValidation) {
          finalValue = handleValidationChange(newValue, 'onChange')
        }

        if (!isControlled) setInternalValue(finalValue)
        setFilled(!!finalValue)

        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: finalValue },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        restProps.onChange?.(syntheticEvent)
      }
    }
    restProps.onPaste?.(e)
  }

  return (
    <FormInputWrapper
      id={inputId}
      label={label}
      inputSize={inputSize}
      hasError={inputHasError}
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
        autoComplete={isPassword ? 'off' : autoComplete}
        className={inputClasses(
          inputSize,
          disabled,
          inputHasError,
          resolvedIcon ? resolvedIconPosition : undefined
        )}
        placeholder={label}
        readOnly={readOnly}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePasteEvent}
        {...restProps}
      />
    </FormInputWrapper>
  )
}
