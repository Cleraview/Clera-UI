'use client'

import React, { createContext, useContext } from 'react'
import { Radio } from './Radio'
import type { RadioProps } from './Radio'
import styles, { type RadioGroupVariantProps } from './styles'

type RadioGroupContextProps = {
  value?: string
  onChange?: (value: string) => void
  name?: string
}

const RadioGroupContext = createContext<RadioGroupContextProps>({})

export const useRadioGroup = () => useContext(RadioGroupContext)

export type RadioGroupOption = {
  value: string
  label: RadioProps['label']
} & Omit<
  RadioProps,
  | 'type'
  | 'name'
  | 'checked'
  | 'defaultChecked'
  | 'onChange'
  | 'value'
  | 'label'
>

export type RadioGroupProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  className?: string
  children?: React.ReactNode
  options?: RadioGroupOption[]
  layout?: RadioGroupVariantProps['layout']
  gap?: RadioGroupVariantProps['gap']
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  name,
  className,
  children,
  options,
  layout,
  gap,
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, name }}>
      <div className={styles.container({ layout, gap }, className)}>
        {options
          ? options.map((opt, index) => {
              const id = opt.id ?? `${name ?? 'radio'}-${opt.value}-${index}`

              return (
                <Radio
                  {...opt}
                  key={`${opt.value}-${index}`}
                  id={id}
                  value={opt.value}
                  label={opt.label}
                />
              )
            })
          : children}
      </div>
    </RadioGroupContext.Provider>
  )
}
