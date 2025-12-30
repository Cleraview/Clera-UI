'use client'

import React, { useState } from 'react'
import { type VariantProps } from 'class-variance-authority'
import { AiOutlineClose } from 'react-icons/ai'
import { type ElementVariant } from '@/components/_core/element-config'
import { cn } from '@/utils/tailwind'
import { alertStyles } from './styles'

export interface AlertProps extends VariantProps<typeof alertStyles.root> {
  title?: React.ReactNode | string
  description?: React.ReactNode | string
  icon?: React.ReactNode
  action?: React.ReactNode
  variant?: ElementVariant
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

  const shouldAlignCloseStart = !banner && title && description

  return (
    <div
      role="alert"
      className={cn(
        alertStyles.root({ variant, rounded, size, banner }),
        className
      )}
    >
      {icon && <div className={alertStyles.icon}>{icon}</div>}

      <div className={alertStyles.content}>
        {title && <div className={alertStyles.title}>{title}</div>}
        {description && (
          <div className={alertStyles.description}>{description}</div>
        )}
      </div>

      {action && <div className={alertStyles.action}>{action}</div>}

      {closable && (
        <button
          className={alertStyles.close({
            aligned: shouldAlignCloseStart ? 'start' : 'center',
          })}
          onClick={handleClose}
        >
          <AiOutlineClose />
        </button>
      )}
    </div>
  )
}
