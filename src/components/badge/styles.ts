import { cva } from 'class-variance-authority'
import {
  elementRadius,
  elementPaddings,
  elementVariants,
  elementTextSizes,
} from '@/components/_core/element-config'
import { composeStyles } from '@/utils/tailwind'

export const styles = {
  badge: cva(
    'inline-flex align-self items-center gap-space-xs font-bold rounded-full border',
    {
      variants: {
        variant: elementVariants,
        rounded: elementRadius,
        size: composeStyles(elementPaddings, elementTextSizes),
      },
      defaultVariants: {
        variant: 'primary',
        size: 'md',
        rounded: 'md',
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
      ],
    }
  ),
}
