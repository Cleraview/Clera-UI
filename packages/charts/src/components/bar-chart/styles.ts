import { cva } from 'class-variance-authority'

export const styles = {
  root: cva('flex flex-col gap-space-sm w-full', {
    variants: {
      size: {
        sm: 'text-body-xs',
        md: 'text-body-sm',
        lg: 'text-body-md',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }),
  row: 'flex items-center gap-space-sm',
  label: 'shrink-0 w-24 truncate text-ds-default font-medium',
  track: 'relative flex-1 h-2 rounded-full bg-ds-disabled overflow-hidden',
  bar: cva(
    'absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 ease-out',
    {
      variants: {
        variant: {
          primary: 'bg-ds-primary-bold',
          success: 'bg-ds-success-bold',
          info: 'bg-ds-info-bold',
          warning: 'bg-ds-warning-bold',
          destructive: 'bg-ds-destructive-bold',
        },
      },
      defaultVariants: {
        variant: 'primary',
      },
    }
  ),
  value: 'shrink-0 w-12 text-right tabular-nums text-ds-subtle',
}
