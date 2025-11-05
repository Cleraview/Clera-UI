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
    <div className="relative inline-flex items-center">
      <CheckboxPrimitive.Root
        ref={ref}
        id={id}
        className={cn(
          'absolute left-0 peer h-5 w-5 cursor-pointer appearance-none rounded-sm border border-input transition-all',
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
      <label
        htmlFor={id}
        className="ml-space-lg text-default cursor-pointer text-body-md font-semibold"
      >
        {label}
      </label>
    </div>
  )
})

Checkbox.displayName = CheckboxPrimitive.Root.displayName
