'use client'

import { Fragment, ReactNode, useId } from 'react'
import type { FieldSize } from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'
import {
  root as formRoot,
  inputContentWrapper,
  labelClass,
  fieldset as fieldsetClass,
  legendClass,
  iconClass,
  sizingShim,
  sizingShimSpan,
  interactiveLayer,
} from './styles'
import type { IconPosition } from './types'

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
  iconPosition?: IconPosition
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
  iconPosition = 'right' as IconPosition,
}: FormInputWrapperProps) => {
  const customId = useId()
  const inputId = id ?? customId
  const state = hasError ? 'error' : focused ? 'focused' : 'default'
  const isActive =
    (focused || filled || readOnly || disabled) && Boolean(label?.length)

  const displayLabel = (
    <Fragment>
      {readOnly ? 'Read Only' : disabled ? 'Disabled' : label}
      {required && !readOnly && !disabled && <span>*</span>}
    </Fragment>
  )

  return (
    <div className={cn(formRoot(fullWidth, disabled), className)}>
      <div className={cn(inputContentWrapper(fullWidth, disabled))}>
        {label && (
          <Fragment>
            <div
              className={cn(
                sizingShim(inputSize, icon ? iconPosition : undefined)
              )}
            >
              <span aria-hidden className={sizingShimSpan}>
                {label}
              </span>
            </div>

            <label
              htmlFor={inputId}
              className={labelClass({
                focused,
                filled,
                readOnly,
                disabled,
                inputSize,
                inputType,
                hasIcon: hasIcon || !!icon,
                iconPosition,
                state,
              })}
            >
              {displayLabel}
            </label>
          </Fragment>
        )}

        <div className={interactiveLayer(disabled)}>
          {icon && iconPosition === 'left' && (
            <span className={iconClass(inputSize, 'left')}>{icon}</span>
          )}

          {children}

          {icon && iconPosition === 'right' && (
            <span className={iconClass(inputSize, 'right')}>{icon}</span>
          )}

          <fieldset className={fieldsetClass(state, isActive, inputSize)}>
            <legend className={legendClass(inputSize, isActive)}>
              {displayLabel}
            </legend>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
