import { cva } from 'class-variance-authority'
import { elementTextHeadingSizes } from '../_core/element-config'

export const overlay = cva(
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

export const content = cva(
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

export const header =
  'flex items-center justify-between border-b border-ds-default py-space-sm p-space-md'

export const title = [
  'font-semibold text-ds-default',
  elementTextHeadingSizes.lg,
].join(' ')

export const closeButton = (loading?: boolean) =>
  [
    'p-space-xs rounded-full transition-colors',
    loading
      ? 'cursor-not-allowed opacity-50'
      : 'hover:bg-ds-inverse-subtle-hovered/20 cursor-pointer',
  ].join(' ')

export const closeIcon = 'w-5 h-5 text-(--fill-ds-icon-subtle)'

export const description =
  'px-space-md py-space-xs text-body-sm text-ds-subtle border-b border-ds-default'

export const head = 'border-b p-space-sm text-heading-md font-medium'

export const contentWrapper = 'px-space-md py-space-sm overflow-auto'

export const footer =
  'border-t border-ds-default p-space-sm flex justify-end gap-space-sm bg-ds-elevation-surface'

export default {
  overlay,
  content,
  header,
  title,
  closeButton,
  description,
  head,
  contentWrapper,
  footer,
}
