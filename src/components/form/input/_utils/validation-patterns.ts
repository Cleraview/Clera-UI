export const ValidationPatterns = {
  numeric: /^\d+$/,
  alpha: /^[a-zA-Z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphanumericSpaces: /^[a-zA-Z0-9\s]+$/,
  decimal: /^\d+\.?\d*$/,
  positiveNumber: /^[1-9]\d*$/,
  wholeNumber: /^(0|[1-9]\d*)$/,
  negativeNumber: /^-[1-9]\d*$/,
  namePattern: /^[a-zA-Z\s'-]+$/,
  usernamePattern: /^[a-zA-Z0-9._-]+$/,
  noSpaces: /^\S+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
  phoneUS: /^(\+1)?[\s-]?\(?([0-9]{3})\)?[\s-]?([0-9]{3})[\s-]?([0-9]{4})$/,
  zipCode: /^\d{5}(-\d{4})?$/,

  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  strongPassword:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  mediumPassword: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  dateISO: /^\d{4}-\d{2}-\d{2}$/,
  timeFormat: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  ssn: /^\d{3}-?\d{2}-?\d{4}$/,
} as const

export type ValidationPatternKey = keyof typeof ValidationPatterns
