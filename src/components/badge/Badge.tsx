'use client'

import { type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof styles.badge> {
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
        styles.badge({ variant, size, rounded }),
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
