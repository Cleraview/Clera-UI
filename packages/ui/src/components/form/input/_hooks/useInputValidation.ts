import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ValidationConfig,
  ValidationResult,
  InputValidator,
} from '../_utils/input-validator'

export interface UseInputValidationOptions extends ValidationConfig {
  value?: string
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'all'
  onValidationChange?: (result: ValidationResult) => void
  validationDelay?: number
}

export interface UseInputValidationReturn {
  validationResult: ValidationResult
  touched: boolean
  isValidating: boolean
  validate: (value?: string) => ValidationResult
  handleChange: (value: string, trigger?: 'onChange' | 'onBlur') => string
  handleBlur: () => void
  handleKeyPress: (
    key: string,
    currentValue: string,
    event?: KeyboardEvent
  ) => boolean
  handlePaste: (pastedText: string, currentValue: string) => string
  reset: () => void
  setTouched: (touched: boolean) => void
  getDisplayErrors: () => string[]
}

export function useInputValidation(
  options: UseInputValidationOptions
): UseInputValidationReturn {
  const {
    value = '',
    mode = 'onBlur',
    onValidationChange,
    validationDelay = 300,
    ...validationConfig
  } = options

  const [currentValue, setCurrentValue] = useState(value)
  const [touched, setTouched] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult>(
    () => InputValidator.validate(value, validationConfig)
  )

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousValueRef = useRef(value)

  const validateValue = useCallback(
    (valueToValidate: string): ValidationResult => {
      const result = InputValidator.validate(valueToValidate, validationConfig)
      return result
    },
    [validationConfig]
  )

  const debouncedValidate = useCallback(
    (valueToValidate: string, immediate = false) => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }

      if (immediate || validationDelay === 0) {
        setIsValidating(true)
        const result = validateValue(valueToValidate)
        setValidationResult(result)
        setIsValidating(false)
        onValidationChange?.(result)
        return result
      }

      setIsValidating(true)
      validationTimeoutRef.current = setTimeout(() => {
        const result = validateValue(valueToValidate)
        setValidationResult(result)
        setIsValidating(false)
        onValidationChange?.(result)
        validationTimeoutRef.current = null
      }, validationDelay)

      return validationResult
    },
    [validateValue, validationDelay, onValidationChange, validationResult]
  )

  const validate = useCallback(
    (valueToValidate?: string): ValidationResult => {
      const targetValue = valueToValidate ?? currentValue
      return debouncedValidate(targetValue, true)
    },
    [currentValue, debouncedValidate]
  )

  const handleChange = useCallback(
    (newValue: string, trigger: 'onChange' | 'onBlur' = 'onChange'): string => {
      const transformedValue = InputValidator.transformValue(
        newValue,
        validationConfig.transform
      )

      setCurrentValue(transformedValue)
      previousValueRef.current = transformedValue

      if (
        mode === 'all' ||
        mode === trigger ||
        (mode === 'onBlur' && touched)
      ) {
        debouncedValidate(transformedValue)
      }

      return transformedValue
    },
    [validationConfig.transform, mode, touched, debouncedValidate]
  )

  const handleBlur = useCallback(() => {
    setTouched(true)
    if (mode === 'onBlur' || mode === 'all') {
      debouncedValidate(currentValue, true)
    }
  }, [mode, currentValue, debouncedValidate])

  const handleKeyPress = useCallback(
    (key: string, inputValue: string, event?: KeyboardEvent): boolean => {
      if (!validationConfig.preventInvalidInput || !validationConfig.pattern) {
        return true
      }

      if (event) {
        if (event.ctrlKey || event.metaKey || event.altKey) {
          return true
        }
      }

      if (
        key.length > 1 ||
        key === 'Backspace' ||
        key === 'Delete' ||
        key === 'Tab' ||
        key === 'Enter' ||
        key === 'Escape'
      ) {
        return true
      }

      return !InputValidator.shouldPreventInput(
        key,
        inputValue,
        validationConfig.pattern
      )
    },
    [validationConfig.preventInvalidInput, validationConfig.pattern]
  )

  const reset = useCallback(() => {
    setTouched(false)
    setIsValidating(false)
    setCurrentValue(value)
    const initialResult = validateValue(value)
    setValidationResult(initialResult)
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current)
      validationTimeoutRef.current = null
    }
  }, [value, validateValue])

  const getDisplayErrors = useCallback((): string[] => {
    if (!touched && mode === 'onBlur') {
      return []
    }
    if (isValidating) {
      return []
    }
    return validationResult.errors
  }, [touched, mode, isValidating, validationResult.errors])

  useEffect(() => {
    if (previousValueRef.current !== value) {
      setCurrentValue(value)
      const result = validateValue(value)
      setValidationResult(result)
      previousValueRef.current = value
    }
  }, [value, validateValue])

  const handlePaste = useCallback(
    (pastedText: string, currentValue: string): string => {
      if (!validationConfig.preventInvalidInput || !validationConfig.pattern) {
        return pastedText
      }

      let validChars = ''
      for (const char of pastedText) {
        if (
          !InputValidator.shouldPreventInput(
            char,
            currentValue + validChars,
            validationConfig.pattern
          )
        ) {
          validChars += char
        }
      }

      return validChars
    },
    [validationConfig.preventInvalidInput, validationConfig.pattern]
  )

  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current)
      }
    }
  }, [])

  return {
    validationResult,
    touched,
    isValidating,
    validate,
    handleChange,
    handleBlur,
    handleKeyPress,
    handlePaste,
    reset,
    setTouched,
    getDisplayErrors,
  }
}
