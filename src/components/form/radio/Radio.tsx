'use client'

import React, { forwardRef, useId, useImperativeHandle, useRef } from 'react'
import { useRadioGroup } from './RadioGroup'
import styles, { wrapper, inputClass, innerDot } from './styles'
import { cn } from '@/utils/tailwind'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode | string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { label, value, id: idProp, disabled, name: nameProp, className, ...props },
    ref
  ) => {
    const group = useRadioGroup()
    const autoId = useId()
    const id = idProp || autoId
    const internalRef = useRef<HTMLInputElement | null>(null)
    const hasCustomLabel = Boolean(typeof label !== 'string')

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)

    const inGroup =
      typeof group.value !== 'undefined' ||
      typeof group.onChange !== 'undefined' ||
      typeof group.name !== 'undefined'

    const checked =
      inGroup && typeof group.value !== 'undefined'
        ? group.value === String(value)
        : props.checked

    const name = inGroup ? group.name : nameProp

    const handleWrapperClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('input')) return
      if (disabled) return
      internalRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange?.(e)
      if (disabled) return
      if (group.onChange && typeof value !== 'undefined') {
        group.onChange(String(value))
      }
    }

    return (
      <div
        role="none"
        onClick={handleWrapperClick}
        className={cn(
          styles.radioContainer(hasCustomLabel),
          disabled && styles.disabledContainer,
          className
        )}
      >
        <div className={wrapper}>
          <input
            {...props}
            ref={internalRef}
            id={id}
            type="radio"
            value={value}
            name={name}
            disabled={disabled}
            onChange={handleChange}
            checked={checked}
            className={cn(inputClass(), disabled && 'cursor-not-allowed')}
          />
          <span className={innerDot} />
        </div>
        {label && (
          <span
            className={cn(
              styles.labelBase,
              disabled ? styles.labelDisabledCursor : styles.labelDefaultCursor
            )}
          >
            {label}
          </span>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
