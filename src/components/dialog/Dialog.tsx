'use client'

import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import * as styles from './styles'

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
  headerClassName?: string
  headerStyle?: React.CSSProperties
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
  size = 'lg',
  position = 'center',
  showCloseButton = true,
  loading = false,
  onOpenAutoFocus,
  headerClassName,
  headerStyle,
}) => {
  const handleOpenChange = (nextOpen: boolean) => {
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
          className={cn(styles.overlay({ state: open ? 'open' : 'closed' }))}
        />

        <DialogPrimitive.Content
          onOpenAutoFocus={onOpenAutoFocus}
          onInteractOutside={e => {
            if (loading) e.preventDefault()
          }}
          onEscapeKeyDown={e => {
            if (loading) e.preventDefault()
          }}
          className={cn(
            styles.content({
              size,
              position,
              state: open ? 'open' : 'closed',
            })
          )}
        >
          {(title || showCloseButton) && (
            <div
              className={cn(styles.header, headerClassName)}
              style={headerStyle}
            >
              {title && (
                <DialogPrimitive.Title className={styles.title}>
                  {title}
                </DialogPrimitive.Title>
              )}
              {showCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button
                    disabled={loading}
                    aria-label="Close dialog"
                    className={styles.closeButton(loading)}
                  >
                    {FiX && <FiX className={styles.closeIcon} />}
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>
          )}
          {description && (
            <DialogPrimitive.Description className={styles.description}>
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
  <div className={styles.head}>{children}</div>
)

const DialogContent: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn(styles.contentWrapper, className)}>{children}</div>
)

const DialogFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn(styles.footer, className)}>{children}</div>
)

Dialog.Head = DialogHead
Dialog.Content = DialogContent
Dialog.Footer = DialogFooter

export default Dialog
