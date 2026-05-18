'use client'

import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { toastStyles } from './styles'
import { type ElementVariant } from '@/components/_core/element-config'

export type ToastActionPlacement = 'bottom' | 'left' | 'right'

export interface ToastProps extends VariantProps<typeof toastStyles.root> {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  actionPlacement?: ToastActionPlacement
  id?: string | number
  button?: { label: string; onClick?: () => void }
  variant?: ElementVariant
  closable?: boolean
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void
  afterClose?: () => void
  className?: string
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  icon,
  action,
  actionPlacement = 'bottom',
  variant = 'primary',
  rounded,
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
    }, 150)
  }

  if (!visible) return null

  const isBottom = actionPlacement === 'bottom' || !action
  const sideAction = action && !isBottom && (
    <div
      className={cn(
        'flex items-center text-body-sm border-ds-default/20',
        actionPlacement === 'left' && 'border-r pr-space-sm',
        actionPlacement === 'right' && 'border-l pl-space-sm'
      )}
    >
      {action}
    </div>
  )

  return (
    <div
      role="status"
      className={cn(
        toastStyles.root({ variant, rounded }),
        isBottom && title && description ? 'items-start' : 'items-center',
        className
      )}
    >
      {icon && <div className={toastStyles.icon}>{icon}</div>}

      {actionPlacement === 'left' && sideAction}

      <div className={toastStyles.content}>
        {title && (
          <div
            className={cn(toastStyles.title, description && 'font-semibold')}
          >
            {title}
          </div>
        )}
        {description && (
          <div className={toastStyles.description}>{description}</div>
        )}
        {action && isBottom && (
          <div className={toastStyles.action}>{action}</div>
        )}
      </div>

      {actionPlacement === 'right' && sideAction}

      {closable && (
        <button onClick={handleClose} className={toastStyles.close}>
          {AiOutlineClose && <AiOutlineClose aria-label="Close" />}
        </button>
      )}
    </div>
  )
}

Toast.displayName = 'Toast'

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sonner = require('./sonner') as unknown as {
    customToast?: (title: React.ReactNode, opts?: unknown) => unknown
    toast?: (title: React.ReactNode, opts?: unknown) => unknown
  }
  if (sonner && typeof sonner.customToast === 'function') {
    ;(Toast as unknown as { show?: typeof sonner.customToast }).show =
      sonner.customToast
  }
} catch {}
