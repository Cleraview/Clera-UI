import { cva } from 'class-variance-authority'
import {
  elementRadius,
  elementBadgePaddings,
  elementVariants,
  elementTextSizes,
} from '@/components/_core/element-config'
import { composeStyles } from '@/utils/tailwind/tailwind'

export const styles = {
  badge: cva(
    'inline-flex align-self items-center gap-space-xs font-bold rounded-full border',
    {
      variants: {
        variant: elementVariants,
        rounded: elementRadius,
        size: composeStyles(elementBadgePaddings, elementTextSizes),
      },
      defaultVariants: {
        variant: 'primary',
        size: 'xs',
        rounded: 'sm',
      },
      compoundVariants: [
        {
          variant: [
            'primary',
            'secondary',
            'success',
            'info',
            'warning',
            'destructive',
            'ghost',
            'light',
          ],
          className: 'border-transparent',
        },

        {
          variant: ['primary', 'success', 'info', 'destructive'],
          className: 'text-ds-inverse dark:text-ds-default',
        },
      ],
    }
  ),
  reverse: 'flex-row-reverse',
}

export default styles
