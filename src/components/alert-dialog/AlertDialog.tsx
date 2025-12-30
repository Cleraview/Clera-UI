'use client'

import React, { useState } from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { Button, ButtonProps } from '@/components/button'
import { alertDialogStyles } from './styles'

export type AlertDialogProps = {
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
  showCloseButton = false,
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
          className={alertDialogStyles.overlay({
            state: open ? 'open' : 'closed',
          })}
        />
        <AlertDialogPrimitive.Content
          onEscapeKeyDown={(e: KeyboardEvent) => loading && e.preventDefault()}
          className={alertDialogStyles.content({
            size,
            position,
            state: open ? 'open' : 'closed',
          })}
        >
          {(title || showCloseButton) && (
            <div className={alertDialogStyles.header}>
              {title && (
                <AlertDialogPrimitive.Title className={alertDialogStyles.title}>
                  {title}
                </AlertDialogPrimitive.Title>
              )}
              {showCloseButton && (
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    aria-label="Close alert"
                    disabled={loading}
                    className={alertDialogStyles.closeButton({
                      disabled: loading,
                    })}
                  >
                    <FiX className={alertDialogStyles.closeIcon} />
                  </button>
                </AlertDialogPrimitive.Cancel>
              )}
            </div>
          )}
          {description && (
            <AlertDialogPrimitive.Description
              className={alertDialogStyles.description}
            >
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
  <div className={cn(alertDialogStyles.contentWrapper, className)}>
    {children}
  </div>
)

const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={alertDialogStyles.footer}>{children}</div>

BaseAlertDialog.Content = AlertDialogContent
BaseAlertDialog.Footer = AlertDialogFooter

type AlertDialogWrapperProps = {
  title: string
  message: string
  onOk: () => void | Promise<void>
  okButtonVariant?: ButtonProps['variant']
  okText?: string
  cancelButtonVariant?: ButtonProps['variant']
  cancelText?: string
  trigger?: React.ReactNode
  loading?: boolean
}

const AlertDialog: React.FC<AlertDialogWrapperProps> = ({
  title,
  message,
  onOk,
  okButtonVariant = 'destructive',
  okText = 'Confirm',
  cancelButtonVariant = 'ghost',
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
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
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
            // size="sm"
            variant={cancelButtonVariant}
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            // size="sm"
            variant={okButtonVariant}
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
