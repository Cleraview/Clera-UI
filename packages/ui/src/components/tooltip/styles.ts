import { cva } from 'class-variance-authority'

export const tooltipVariants = cva(
  'z-50 rounded-md shadow-md animate-in fade-in-0 zoom-in-95',
  {
    variants: {
      size: {
        xs: 'px-space-sm py-space-xs text-body-xs',
        sm: 'px-space-sm py-space-xs text-body-sm',
        md: 'px-space-md py-space-sm text-body-md',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

export const styles = {
  themeDark: 'bg-ds-neutral-bold text-ds-inverse',
  themeLight: 'bg-ds-neutral text-ds-default',
  arrowDark: 'fill-ds-icon',
  arrowLight: 'fill-ds-icon-inverse',
}

export default styles
