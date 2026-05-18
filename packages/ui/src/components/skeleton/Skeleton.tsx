'use client'

import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { skeletonVariants } from './styles'

export interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
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
