'use client'

import React, { forwardRef } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { FiCheck } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'onChange'
  > {
  label: React.ReactNode
  onChange?: (checked: boolean) => void
}

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ label, id: idProp, className, onChange, ...props }, ref) => {
  const autoId = React.useId()
  const id = idProp || autoId

  return (
    <div className="inline-flex items-center">
      <label
        htmlFor={id}
        className={cn(
          'relative flex items-center cursor-pointer',
          props.disabled && 'cursor-not-allowed opacity-70'
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          className={cn(
            'peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-input transition-all',
            'data-[state=checked]:bg-primary-intense data-[state=checked]:border-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          onCheckedChange={onChange}
          {...props}
        >
          <CheckboxPrimitive.Indicator>
            <FiCheck className="pl-[2px] text-inverse" strokeWidth={3} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <span className="ml-2 text-default cursor-pointer text-body-md font-semibold">
          {label}
        </span>
      </label>
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
