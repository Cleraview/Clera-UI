'use client'

import { ReactNode, useId } from 'react'
import type { FieldSize } from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'
import {
  fieldStateStyles,
  floatingLabelBaseText,
  floatingLabelActiveText,
} from '@/components/_core/field-config'

import {
  root as formRoot,
  labelClass,
  container as formContainer,
  fieldset as fieldsetClass,
  legendClass,
  iconClass,
} from './styles'

export type FormInputWrapperProps = {
  id?: string
  label: string
  inputSize?: FieldSize
  inputType?: 'select' | 'input' | 'textarea'
  hasError?: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  hasIcon?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  filled?: boolean
  focused?: boolean
  fullWidth?: boolean
  children: ReactNode
  className?: string
}

export const FormInputWrapper = ({
  id,
  label,
  required,
  disabled,
  readOnly,
  inputSize = 'md',
  inputType = 'input',
  hasError,
  focused,
  filled,
  fullWidth,
  children,
  className,
  hasIcon,
  icon,
  iconPosition = 'right',
}: FormInputWrapperProps) => {
  const customId = useId()
  const inputId = id ?? customId
  const state = hasError ? 'error' : focused ? 'focused' : 'default'

  const displayLabel = (
    <span
      className={cn(
        fieldStateStyles[state].label,
        floatingLabelBaseText[inputSize],
        (focused || filled || readOnly || disabled) && [
          floatingLabelActiveText[inputSize],
        ]
      )}
    >
      {readOnly ? 'Read Only' : disabled ? 'Disabled' : label}
      {required && !readOnly && !disabled && <span>*</span>}
    </span>
  )

  return (
    <div className={cn(formRoot(fullWidth, disabled), className)}>
      <label
        htmlFor={inputId}
        className={labelClass({
          focused,
          filled,
          readOnly,
          disabled,
          inputSize,
          inputType,
          hasIcon,
        })}
      >
        {displayLabel}
      </label>

      <div className={formContainer(disabled)}>
        <div className="relative flex items-center w-full">
          {icon && iconPosition === 'left' && (
            <span className={iconClass(inputSize, 'left')}>{icon}</span>
          )}

          {children}

          {icon && iconPosition === 'right' && (
            <span className={iconClass(inputSize, 'right')}>{icon}</span>
          )}
        </div>

        <fieldset className={fieldsetClass(fieldStateStyles[state].border)}>
          <legend
            className={legendClass(
              inputSize,
              focused || filled || readOnly || disabled
            )}
          >
            <span className={cn(floatingLabelBaseText[inputSize])}>
              {displayLabel}
            </span>
          </legend>
        </fieldset>
      </div>
    </div>
  )
}
