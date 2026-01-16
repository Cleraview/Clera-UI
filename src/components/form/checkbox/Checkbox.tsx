'use client'

import React, { forwardRef, useId, useRef, useImperativeHandle } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FiCheck } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'onChange'
> {
  label: React.ReactNode | string
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, id: idProp, className, onChange, disabled, ...props }, ref) => {
  const autoId = useId()
  const id = idProp || autoId
  const internalRef = useRef<HTMLButtonElement>(null)
  const hasCustomLabel = Boolean(typeof label !== 'string')

  useImperativeHandle(ref, () => internalRef.current as HTMLButtonElement)

  const handleWrapperClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    if (disabled) return
    internalRef.current?.click()
  }

  return (
    <div
      role="none"
      onClick={handleWrapperClick}
      className={cn(
        styles.container(hasCustomLabel),
        disabled && styles.disabledContainer,
        className
      )}
    >
      <CheckboxPrimitive.Root
        ref={internalRef}
        id={id}
        className={cn(
          styles.rootBase,
          styles.rootChecked,
          styles.rootFocus,
          disabled ? styles.rootDisabled : styles.rootDefaultCursor
        )}
        onCheckedChange={onChange}
        disabled={disabled}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          {FiCheck && (
            <FiCheck className={styles.indicatorIcon} strokeWidth={3} />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <span
          className={cn(
            styles.labelBase,
            disabled ? styles.labelDisabledCursor : styles.labelDefaultCursor
          )}
        >
          {typeof label === 'string' ? label : label}
        </span>
      )}
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
