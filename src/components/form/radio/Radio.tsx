'use client'

import React from 'react'
import { useRadioGroup } from './RadioGroup'
import {
  root,
  wrapper,
  inputClass,
  innerDot,
  label as labelClass,
} from './styles'

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label: string | React.ReactNode
}

export const Radio: React.FC<RadioProps> = ({ label, value, ...props }) => {
  const group = useRadioGroup()
  const id = props.id || value?.toString()

  const checked = group.value === value

  const handleChange = () => {
    group.onChange?.(value as string)
  }

  return (
    <div className={root}>
      <label htmlFor={id} className={wrapper}>
        <input
          id={id}
          type="radio"
          value={value}
          checked={checked}
          name={group.name}
          onChange={handleChange}
          className={inputClass()}
          {...props}
        />
        <span className={innerDot} />
      </label>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  )
}
