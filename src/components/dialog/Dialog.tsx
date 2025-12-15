'use client'

import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva } from 'class-variance-authority'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'

const overlayVariants = cva(
  'fixed inset-0 z-[9998] bg-ds-elevation-surface-overlay transition-opacity duration-300',
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
  'fixed z-[9999] bg-ds-elevation-surface rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
  {
    variants: {
      size: {
        sm: 'w-[90%] max-w-sm',
        md: 'w-[90%] max-w-md',
        lg: 'w-[90%] max-w-2xl',
        xl: 'w-[90%] max-w-4xl',
      },
      position: {
        center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        top: 'top-[10%] left-1/2 -translate-x-1/2',
        bottom: 'bottom-[10%] left-1/2 -translate-x-1/2',
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

export type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: 'center' | 'top' | 'bottom'
  showCloseButton?: boolean
  loading?: boolean
  onOpenAutoFocus?: (event: Event) => void
}

type DialogSubcomponents = {
  Head: React.FC<{ children: React.ReactNode }>
  Content: React.FC<{ children: React.ReactNode; className?: string }>
  Footer: React.FC<{ children: React.ReactNode; className?: string }>
}

const Dialog: React.FC<DialogProps> & DialogSubcomponents = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  loading = false,
  onOpenAutoFocus,
}) => {
  const handleOpenChange = (nextOpen: boolean) => {
    console.log('dialog loading: ', loading)
    if (loading && !nextOpen) return
    onOpenChange(nextOpen)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          onPointerDown={e => {
            if (loading) e.preventDefault()
          }}
          className={cn(overlayVariants({ state: open ? 'open' : 'closed' }))}
        />

        {/* <DialogPrimitive.DialogDescription>
          {"-"}
        </DialogPrimitive.DialogDescription> */}

        <DialogPrimitive.Content
          onOpenAutoFocus={onOpenAutoFocus}
          onInteractOutside={e => {
            if (loading) e.preventDefault()
          }}
          onEscapeKeyDown={e => {
            if (loading) e.preventDefault()
          }}
          className={cn(
            contentVariants({
              size,
              position,
              state: open ? 'open' : 'closed',
            })
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-ds-default p-space-sm">
              {title && (
                <DialogPrimitive.Title className="text-heading-lg font-semibold text-ds-default">
                  {title}
                </DialogPrimitive.Title>
              )}
              {showCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button
                    disabled={loading}
                    aria-label="Close dialog"
                    className={cn(
                      'p-space-xs rounded-full transition-colors',
                      loading
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-ds-inverse-subtle-hovered/20 cursor-pointer'
                    )}
                  >
                    <FiX className="w-5 h-5 text-(--fill-ds-icon-subtle)" />
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>
          )}
          {description && (
            <DialogPrimitive.Description className="px-space-sm py-space-xs text-body-sm text-ds-subtle border-b border-ds-default">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

const DialogHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b p-space-sm text-body-md font-medium">{children}</div>
)

const DialogContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('p-space-sm overflow-auto', className)}>{children}</div>
)

const DialogFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={cn(
      'border-t border-ds-default p-space-sm flex justify-end gap-space-sm bg-ds-elevation-surface',
      className
    )}
  >
    {children}
  </div>
)

Dialog.Head = DialogHead
Dialog.Content = DialogContent
Dialog.Footer = DialogFooter

export default Dialog
