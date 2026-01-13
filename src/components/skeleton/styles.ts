import { cva } from 'class-variance-authority'

export const skeletonVariants = cva('animate-pulse bg-ds-skeleton shrink-0', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    rounded: 'md',
  },
})

export default {
  skeletonVariants,
}
