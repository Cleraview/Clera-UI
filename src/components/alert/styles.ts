import { cva } from 'class-variance-authority'
import {
  elementRadius,
  elementPaddings,
  elementVariants,
} from '@/components/_core/element-config'

export const alertStyles = {
  root: cva('relative flex items-center', {
    variants: {
      variant: elementVariants,
      rounded: elementRadius,
      size: elementPaddings,
      banner: {
        true: 'w-full flex items-center',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      rounded: 'md',
      size: 'md',
      banner: false,
    },
  }),
  icon: 'h-6 mr-space-sm self-start flex items-center text-body-xl',
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
