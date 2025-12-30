'use client'

import { ReactNode, useId } from 'react'
import type { FieldSize } from '@/components/_core/field-config'
import {
  fieldStateStyles,
  floatingLabelBase,
  floatingLabelActive,
  floatingLabelBaseText,
  floatingLabelActiveText,
} from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'

export type FormInputWrapperProps = {
  id?: string
  label: string
  inputSize?: FieldSize
  inputType?: 'select' | 'input' | 'textarea'
  hasError?: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  filled?: boolean
  focused?: boolean
  fullWidth?: boolean
  children: ReactNode
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
    <div
      className={cn(
        'relative bg-ds-elevation-surface',
        fullWidth && 'w-full',
        disabled && 'opacity-60'
      )}
    >
      <label
        htmlFor={inputId}
        className={cn(
          'absolute -left-1 transition-all whitespace-nowrap z-[1] pointer-events-none',
          focused || filled || readOnly || disabled
            ? [floatingLabelActive[inputSize]]
            : [floatingLabelBase[inputSize], floatingLabelBaseText[inputSize]],
          disabled && 'cursor-not-allowed',
          inputType === 'select' && !disabled && 'cursor-pointer'
        )}
      >
        {displayLabel}
      </label>

      <div className={cn('relative', disabled && '[&>*]:cursor-not-allowed!')}>
        {children}

        <fieldset
          className={cn(
            'absolute inset-0 rounded-sm px-space-xs pointer-events-none border transition-all duration-200',
            fieldStateStyles[state].border
          )}
        >
          <legend
            className={cn(
              'w-auto h-0 p-0 transition-all duration-200 invisible whitespace-nowrap',
              floatingLabelBaseText[inputSize],
              focused || filled || readOnly || disabled
                ? 'max-w-full px-1'
                : 'max-w-[0.01px] px-0'
            )}
          >
            <span
              className={cn(
                floatingLabelBase[inputSize],
                (focused || filled || readOnly || disabled) && [
                  floatingLabelBaseText[inputSize],
                  floatingLabelActive[inputSize],
                ]
              )}
            >
              {displayLabel}
            </span>
          </legend>
        </fieldset>
      </div>
    </div>
  )
}
