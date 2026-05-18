import { cva } from 'class-variance-authority'
import {
  elementRadius,
  elementVariants,
} from '@/components/_core/element-config'

export const alertStyles = {
  root: cva('relative flex items-center p-space-sm', {
    variants: {
      variant: elementVariants,
      rounded: elementRadius,
      banner: {
        true: 'w-full flex items-center',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      rounded: 'md',
      banner: false,
    },
    compoundVariants: [
      {
        variant: ['primary', 'success', 'info', 'destructive'],
        className: 'text-ds-inverse dark:text-ds-default',
      },
    ],
  }),
  icon: 'h-6 mr-space-sm self-start flex items-center text-label-xl',
  content: 'flex-1 flex flex-col gap-space-xs',
  title: 'font-semibold',
  description: 'font-thin',
  action: 'ml-4',
  close: cva(
    'ml-space-sm opacity-70 hover:opacity-100 transition cursor-pointer',
    {
      variants: {
        aligned: {
          start: 'self-start',
          center: '',
        },
      },
      defaultVariants: {
        aligned: 'center',
      },
    }
  ),
}
