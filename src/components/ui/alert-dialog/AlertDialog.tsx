'use client'

import React, { useState } from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cva } from 'class-variance-authority'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { Button } from '@/components/ui/button'

const overlayVariants = cva(
  'fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300',
  {
    variants: {
      state: {
        open: 'opacity-100',
        closed: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      state: 'closed',
    },
  }
)

const contentVariants = cva(
  'fixed z-[9999] bg-white rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
  {
    variants: {
      size: {
        sm: 'w-[90%] max-w-sm',
        md: 'w-[90%] max-w-md',
        lg: 'w-[90%] max-w-lg',
      },
      position: {
        center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        top: 'top-[10%] left-1/2 -translate-x-1/2',
      },
      state: {
        open: 'scale-100 opacity-100',
        closed: 'scale-95 opacity-0 pointer-events-none',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'center',
      state: 'closed',
    },
  }
)

type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  position?: 'center' | 'top'
  showCloseButton?: boolean
  loading?: boolean
}

type AlertDialogSubcomponents = {
  Content: React.FC<{ children: React.ReactNode; className?: string }>
  Footer: React.FC<{ children: React.ReactNode }>
}

const BaseAlertDialog: React.FC<AlertDialogProps> &
  AlertDialogSubcomponents = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  loading = false,
}) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (loading && !nextOpen) return
    onOpenChange(nextOpen)
  }

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className={cn(overlayVariants({ state: open ? 'open' : 'closed' }))}
        />
        <AlertDialogPrimitive.Content
          onEscapeKeyDown={(e: KeyboardEvent) => loading && e.preventDefault()}
          className={cn(
            contentVariants({
              size,
              position,
              state: open ? 'open' : 'closed',
            })
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-space-sm">
              {title && (
                <AlertDialogPrimitive.Title className="text-heading-lg font-semibold text-default">
                  {title}
                </AlertDialogPrimitive.Title>
              )}
              {showCloseButton && (
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    aria-label="Close alert"
                    disabled={loading}
                    className={cn(
                      'p-space-xs rounded-full transition-colors',
                      loading
                        ? 'cursor-not-allowed opacity-60'
                        : 'hover:bg-inverse-hovered cursor-pointer'
                    )}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </AlertDialogPrimitive.Cancel>
              )}
            </div>
          )}
          {description && (
            <AlertDialogPrimitive.Description className="px-space-sm py-space-xs text-body-sm text-subtle">
              {description}
            </AlertDialogPrimitive.Description>
          )}
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}

const AlertDialogContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('p-space-sm overflow-auto', className)}>{children}</div>
)

const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex justify-end gap-space-sm p-space-sm">{children}</div>

BaseAlertDialog.Content = AlertDialogContent
BaseAlertDialog.Footer = AlertDialogFooter

type AlertDialogWrapperProps = {
  title: string
  message: string
  onOk: () => void | Promise<void>
  okText?: string
  cancelText?: string
  trigger?: React.ReactNode
  loading?: boolean
}

const AlertDialog: React.FC<AlertDialogWrapperProps> = ({
  title,
  message,
  onOk,
  okText = 'Confirm',
  cancelText = 'Cancel',
  trigger,
  loading: externalLoading,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onOk()
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button onClick={() => setOpen(true)}>Open Alert</Button>
      )}

      <BaseAlertDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={message}
        loading={loading || externalLoading}
      >
        <BaseAlertDialog.Footer>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            loading={loading}
            onClick={handleConfirm}
          >
            {okText}
          </Button>
        </BaseAlertDialog.Footer>
      </BaseAlertDialog>
    </>
  )
}

export default AlertDialog
