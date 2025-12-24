'use client'

import React, { forwardRef, useId } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FiCheck } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'

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
    <div
      className={cn(
        'relative inline-flex items-center',
        disabled && 'opacity-50'
      )}
    >
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          'absolute left-0 peer h-5 w-5 appearance-none rounded-sm border border-ds-input transition-all',
          'data-[state=checked]:bg-ds-selected-bold data-[state=checked]:border-ds-selected',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          className
        )}
        onCheckedChange={onChange}
        disabled={disabled}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <FiCheck className="pl-[2px] text-ds-inverse" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={id}
        className={cn(
          'ml-space-lg text-ds-default text-body-md',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        {label}
      </label>
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
