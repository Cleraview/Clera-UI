'use client'

import React, { useState } from 'react'
import { cn } from '@/utils/tailwind'
import { AiOutlineClose } from 'react-icons/ai'
import {
  roundedMap,
  sizeMap,
  variantMap,
  VariantType,
} from '../_utils/variants'
import { cva, VariantProps } from 'class-variance-authority'

const alertVariants = cva('relative flex items-center', {
  variants: {
    variant: variantMap,
    rounded: roundedMap,
    size: sizeMap,
  },
  defaultVariants: {
    variant: 'primary',
    rounded: 'md',
    size: 'md',
  },
})

export interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: React.ReactNode | string
  description?: React.ReactNode | string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: VariantType
  // showIcon?: boolean
  banner?: boolean
  closable?: boolean
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void
  afterClose?: () => void
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'primary',
  rounded,
  size = 'md',
  // showIcon = false,
  banner = false,
  closable = false,
  onClose,
  afterClose,
  className,
}) => {
  const [visible, setVisible] = useState(true)

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    setVisible(false)
    onClose?.(e)
    setTimeout(() => {
      afterClose?.()
    }, 300)
  }

  if (!visible) return null

  return (
    <div
      role="alert"
      className={cn(
        alertVariants({ variant, rounded, size }),
        banner && 'w-full flex items-center',
        className
      )}
    >
      {icon && (
        <div className="h-6 mr-space-sm self-start flex items-center text-body-xl">
          {icon}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-space-xs">
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="font-thin">{description}</div>}
      </div>
      {action && <div className="ml-4">{action}</div>}
      {closable && (
        <button
          className={cn(
            'ml-space-sm opacity-70 hover:opacity-100 transition cursor-pointer',
            !banner && title && description && 'self-start'
          )}
          onClick={handleClose}
        >
          <AiOutlineClose />
        </button>
      )}
    </div>
  )
}
