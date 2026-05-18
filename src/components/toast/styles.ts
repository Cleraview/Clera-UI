import { cva } from 'class-variance-authority'
import {
  elementVariants,
  elementRadius,
} from '@/components/_core/element-config'
import { cn } from '@/utils/tailwind'

export const toastStyles = {
  root: cva(
    cn(
      'flex gap-space-sm p-space-sm min-w-[280px] max-w-sm rounded-md shadow-md bg-ds-surface elevation-md'
    ),
    {
      variants: {
        variant: elementVariants,
        rounded: elementRadius,
      },
      defaultVariants: {
        variant: 'primary',
        rounded: 'md',
      },
      compoundVariants: [
        {
          variant: ['primary', 'success', 'info', 'destructive'],
          className: 'text-ds-inverse dark:text-ds-default',
        },
      ],
    }
  ),
  icon: 'mt-[4px] shrink-0 text-label-md',
  content: 'flex-1 flex flex-col',
  title: 'text-body-sm',
  description: 'text-body-sm mt-space font-light',
  action: 'mt-space-sm text-body-sm',
  close:
    'p-0! ml-space-sm opacity-70 hover:opacity-100 transition cursor-pointer',
}
