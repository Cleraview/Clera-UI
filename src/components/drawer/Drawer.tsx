import { ReactNode, useEffect, useRef, useState } from 'react'
import * as Portal from '@radix-ui/react-portal'
import { FiX } from 'react-icons/fi'
import { getPositionStyles, getTransformStyles } from './_utils/transform'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export type DrawerProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right' | 'bottom' | 'top'
  size?: string | number
  duration?: number
  overlayOpacity?: number
  title?: string
  showCloseButton?: boolean
  closeIcon?: ReactNode
  fullScreen?: boolean
}

type DrawerSubcomponents = {
  Head: React.FC<{ children: React.ReactNode }>
  Content: React.FC<{
    children: React.ReactNode
    className?: string
    position?: 'left' | 'right' | 'bottom' | 'top'
  }>
}

const Drawer: React.FC<DrawerProps> & DrawerSubcomponents = ({
  open,
  onClose,
  children,
  position = 'right',
  duration = 300,
  overlayOpacity = 0.5,
  title,
  showCloseButton = true,
  closeIcon,
  fullScreen = false,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (open) {
      setIsMounted(true)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setIsVisible(true)
          rafRef.current = null
        })
      })
    } else {
      setIsVisible(false)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [open])

  const handleTransitionEnd = () => {
    if (!open && isMounted) {
      setIsMounted(false)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!isMounted) return null

  return (
    <Portal.Root className={styles.portal}>
      <div
        className={styles.overlay}
        style={{
          opacity: isVisible ? overlayOpacity : 0,
          transition: `opacity ${duration}ms ease-out`,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      <div
        ref={drawerRef}
        className={styles.drawer}
        style={{
          ...getPositionStyles(position, fullScreen),
          ...getTransformStyles(position, isVisible),
          transition: `transform ${duration}ms cubic-bezier(0.32, 0.72, 0, 1)`,
          overflow: 'hidden',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close drawer"
              >
                {closeIcon
                  ? closeIcon
                  : FiX && <FiX className={styles.closeIcon} />}
              </button>
            )}
            {title && <h1 className={styles.title}>{title}</h1>}
          </div>
        )}

        {children}
      </div>
    </Portal.Root>
  )
}

const DrawerHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.head}>{children}</div>
)

const DrawerContent: React.FC<{
  children: React.ReactNode
  className?: string
  position?: 'left' | 'right' | 'bottom' | 'top'
}> = ({ children, className, position }) => {
  const widthClasses = cn(
    styles.contentBase,
    className,
    position === 'left' || position === 'right' ? 'w-[80%] md:w-[378px]' : ''
  )

  return <div className={widthClasses}>{children}</div>
}

Drawer.Head = DrawerHead
Drawer.Content = DrawerContent

export default Drawer
