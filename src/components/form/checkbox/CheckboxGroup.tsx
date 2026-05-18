'use client'

import { FC, ReactNode, useEffect, useState } from 'react'
import { Checkbox } from './Checkbox'
import { cn } from '@/utils/tailwind'
import { checkboxGroupVariants, CheckboxGroupVariantProps } from './styles'

export type CheckboxOption = {
  id?: string
  label: ReactNode
  value: string
  disabled?: boolean
}

export interface CheckboxGroupProps extends CheckboxGroupVariantProps {
  name?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (values: string[]) => void
  options: CheckboxOption[]
  disabled?: boolean
  className?: string
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  name,
  value,
  defaultValue = [],
  onChange,
  options,
  disabled,
  className,
  layout = 'vertical',
  gap = 'md',
}) => {
  const [internal, setInternal] = useState<string[]>(defaultValue)
  const controlled = value !== undefined
  const selected = controlled ? value! : internal

  useEffect(() => {
    if (controlled && value) setInternal(value)
  }, [controlled, value])

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val]

    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  const containerClass = className
    ? cn(className)
    : checkboxGroupVariants({ layout, gap })

  return (
    <div className={containerClass} role="group" aria-label={name}>
      {options.map(opt => (
        <Checkbox
          key={opt.value}
          id={opt.id}
          disabled={disabled || opt.disabled}
          label={opt.label}
          onChange={() => toggle(opt.value)}
        />
      ))}
    </div>
  )
}

export default CheckboxGroup
