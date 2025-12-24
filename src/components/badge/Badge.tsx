'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import {
  elementRadius,
  elementPaddings,
  elementVariants,
  elementTextSizes,
} from '@/components/_core/element-config'
import { cn, composeStyles } from '@/utils/tailwind'

const badgeVariants = cva(
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
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  rounded,
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, rounded }),
        iconPosition === 'right' && 'flex-row-reverse',
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  )
}
