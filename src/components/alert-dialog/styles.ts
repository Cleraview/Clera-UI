import { cva } from 'class-variance-authority'
import { cn } from '@/utils/tailwind/tailwind'
import { elementPaddings } from '../_core/element-config'

export const alertDialogStyles = {
  overlay: cva(
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
  ),
  content: cva(
    cn(
      'fixed z-[9999] bg-ds-elevation-surface rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
      elementPaddings.xl
    ),
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
  ),
  header: 'flex items-center justify-between',
  title: 'text-heading-md font-semibold text-ds-default',
  closeButton: cva(cn('rounded-full transition-colors', elementPaddings.xs), {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-60',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }),
  closeIcon: 'w-5 h-5 text-(--fill-ds-icon-subtlest)',
  description: 'pt-space-xs text-body-sm text-ds-subtle',
  contentWrapper: cn('overflow-auto', elementPaddings.sm),
  footer: 'pt-space-sm flex justify-end gap-space-sm',
}
