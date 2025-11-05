'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'

const skeletonVariants = cva(
  'animate-pulse bg-neutral-pressed dark:bg-neutral-intense shrink-0',
  {
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
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded,
  ...props
}) => {
  return (
    <div className={cn(skeletonVariants({ rounded }), className)} {...props} />
  )
}
