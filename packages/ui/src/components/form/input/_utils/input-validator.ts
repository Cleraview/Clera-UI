import { ValidationPatterns, ValidationPatternKey } from './validation-patterns'

export interface ValidationRule {
  validate: (value: string) => boolean | string
  message?: string
  trigger?: 'onChange' | 'onBlur' | 'onSubmit'
}

export interface ValidationConfig {
  pattern?: ValidationPatternKey | RegExp
  patternMessage?: string
  required?: boolean
  requiredMessage?: string
  minLength?: number
  maxLength?: number
  lengthMessage?: string

  min?: number
  max?: number
  rangeMessage?: string

  rules?: ValidationRule[]

  preventInvalidInput?: boolean

  transform?: (value: string) => string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  value: string
}

export const ValidationMessages = {
  required: 'This field is required',
  pattern: {
    numeric: 'Only numbers are allowed',
    alpha: 'Only letters are allowed',
    alphanumeric: 'Only letters and numbers are allowed',
    alphanumericSpaces: 'Only letters, numbers, and spaces are allowed',
    decimal: 'Please enter a valid decimal number',
    positiveNumber: 'Please enter a positive number',
    wholeNumber: 'Please enter a whole number',
    negativeNumber: 'Please enter a negative number',
    namePattern: 'Please enter a valid name',
    usernamePattern:
      'Username can only contain letters, numbers, dots, underscores, and hyphens',
    noSpaces: 'Spaces are not allowed',
    noSpecialChars: 'Special characters are not allowed',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    phoneUS: 'Please enter a valid US phone number',
    zipCode: 'Please enter a valid ZIP code',
    url: 'Please enter a valid URL',
    domain: 'Please enter a valid domain name',
    ipv4: 'Please enter a valid IP address',
    strongPassword:
      'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
    mediumPassword:
      'Password must contain at least 6 characters with letters and numbers',
    dateISO: 'Please enter a date in YYYY-MM-DD format',
    timeFormat: 'Please enter time in HH:MM format',
    hexColor: 'Please enter a valid hex color code',
    creditCard: 'Please enter a valid credit card number',
    ssn: 'Please enter a valid SSN',
  },
  minLength: (min: number) => `Minimum ${min} characters required`,
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  rangeLength: (min: number, max: number) =>
    `Length must be between ${min} and ${max} characters`,
  min: (min: number) => `Value must be at least ${min}`,
  max: (max: number) => `Value must be at most ${max}`,
  range: (min: number, max: number) =>
    `Value must be between ${min} and ${max}`,
} as const

export class InputValidator {
  static validatePattern(
    value: string,
    pattern: ValidationPatternKey | RegExp
  ): boolean {
    const regex =
      typeof pattern === 'string' ? ValidationPatterns[pattern] : pattern
    return regex.test(value)
  }

  static validateLength(value: string, min?: number, max?: number): string[] {
    const errors: string[] = []
    const length = value.length

    if (min !== undefined && length < min) {
      errors.push(ValidationMessages.minLength(min))
    }
    if (max !== undefined && length > max) {
      errors.push(ValidationMessages.maxLength(max))
    }

    return errors
  }

  static validateRange(value: string, min?: number, max?: number): string[] {
    const errors: string[] = []
    const numValue = parseFloat(value)

    if (isNaN(numValue)) return errors

    if (min !== undefined && numValue < min) {
      errors.push(ValidationMessages.min(min))
    }
    if (max !== undefined && numValue > max) {
      errors.push(ValidationMessages.max(max))
    }

    return errors
  }

  static validateRequired(value: string): boolean {
    return value.trim().length > 0
  }

  static shouldPreventInput(
    char: string,
    currentValue: string,
    pattern: ValidationPatternKey | RegExp
  ): boolean {
    const newValue = currentValue + char
    return !this.validatePattern(newValue, pattern)
  }

  static transformValue(
    value: string,
    transform?: (value: string) => string
  ): string {
    return transform ? transform(value) : value
  }

  static validate(value: string, config: ValidationConfig): ValidationResult {
    const errors: string[] = []
    let transformedValue = this.transformValue(value, config.transform)

    if (config.required && !this.validateRequired(transformedValue)) {
      errors.push(config.requiredMessage || ValidationMessages.required)
      return { isValid: false, errors, value: transformedValue }
    }

    if (!transformedValue && !config.required) {
      return { isValid: true, errors: [], value: transformedValue }
    }

    if (config.pattern) {
      if (!this.validatePattern(transformedValue, config.pattern)) {
        const _patternKey =
          typeof config.pattern === 'string' ? config.pattern : 'pattern'
        const defaultMessage =
          typeof config.pattern === 'string'
            ? ValidationMessages.pattern[config.pattern]
            : 'Invalid format'
        errors.push(config.patternMessage || defaultMessage)
      }
    }

    if (config.minLength !== undefined || config.maxLength !== undefined) {
      const lengthErrors = this.validateLength(
        transformedValue,
        config.minLength,
        config.maxLength
      )
      if (lengthErrors.length > 0) {
        errors.push(config.lengthMessage || lengthErrors.join(', '))
      }
    }

    if (config.min !== undefined || config.max !== undefined) {
      const rangeErrors = this.validateRange(
        transformedValue,
        config.min,
        config.max
      )
      if (rangeErrors.length > 0) {
        errors.push(config.rangeMessage || rangeErrors.join(', '))
      }
    }

    if (config.rules) {
      for (const rule of config.rules) {
        const result = rule.validate(transformedValue)
        if (result !== true) {
          errors.push(
            typeof result === 'string'
              ? result
              : rule.message || 'Validation failed'
          )
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      value: transformedValue,
    }
  }
}

export const ValidationPresets = {
  email: (): ValidationConfig => ({
    pattern: 'email',
    required: true,
    transform: value => value.toLowerCase().trim(),
  }),

  phone: (): ValidationConfig => ({
    pattern: 'phone',
    transform: value => value.replace(/\s+/g, ''),
  }),

  strongPassword: (): ValidationConfig => ({
    pattern: 'strongPassword',
    minLength: 8,
    required: true,
  }),

  username: (): ValidationConfig => ({
    pattern: 'usernamePattern',
    minLength: 3,
    maxLength: 20,
    required: true,
    transform: value => value.toLowerCase().trim(),
  }),

  name: (): ValidationConfig => ({
    pattern: 'namePattern',
    minLength: 2,
    maxLength: 50,
    required: true,
    transform: value => value.trim(),
  }),

  numeric: (min?: number, max?: number): ValidationConfig => ({
    pattern: 'numeric',
    min,
    max,
    preventInvalidInput: true,
    transform: value => value.replace(/[^\d]/g, ''),
  }),

  decimal: (min?: number, max?: number): ValidationConfig => ({
    pattern: 'decimal',
    min,
    max,
    preventInvalidInput: true,
    transform: value => value.replace(/[^\d.]/g, ''),
  }),

  alphanumeric: (minLength?: number, maxLength?: number): ValidationConfig => ({
    pattern: 'alphanumeric',
    minLength,
    maxLength,
    preventInvalidInput: true,
  }),

  url: (): ValidationConfig => ({
    pattern: 'url',
    transform: value => value.toLowerCase().trim(),
  }),

  zipCode: (): ValidationConfig => ({
    pattern: 'zipCode',
    preventInvalidInput: true,
    transform: value => value.replace(/[^\d-]/g, ''),
  }),
} as const
