'use client'

import React, { forwardRef, useId } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FiCheck } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'onChange'
> {
  label: React.ReactNode
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, id: idProp, className, onChange, disabled, ...props }, ref) => {
  const autoId = useId()
  const id = idProp || autoId

  return (
    <div className={cn(styles.container, disabled && styles.disabledContainer)}>
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          styles.rootBase,
          styles.rootChecked,
          styles.rootFocus,
          disabled ? styles.rootDisabled : styles.rootDefaultCursor,
          className
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
      <label
        htmlFor={id}
        className={cn(
          styles.labelBase,
          disabled ? styles.labelDisabledCursor : styles.labelDefaultCursor
        )}
      >
        {label}
      </label>
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
