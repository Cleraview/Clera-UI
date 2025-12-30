'use client'

import {
  type ReactNode,
  ButtonHTMLAttributes,
  forwardRef,
  useMemo,
} from 'react'
import { type VariantProps } from 'class-variance-authority'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '@/utils/tailwind'
import {
  type ElementSize,
  elementPaddings,
  elementTextSizes,
} from '@/components/_core/element-config'
import { styles } from './styles'

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof styles.button> {
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  size?: ElementSize
  innerClassName?: string
  disabled?: boolean
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      innerClassName,
      children,
      icon,
      iconPosition = 'left',
      variant,
      size = 'md',
      fullWidth,
      rounded,
      loading = false,
      asChild = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const childContentStyles = useMemo(
      () => [
        elementPaddings[size as ElementSize],
        elementTextSizes[size as ElementSize],
      ],
      [size]
    )

    return (
      <Comp
        {...props}
        ref={ref}
        data-testid="btn"
        disabled={disabled || loading}
        className={cn(
          styles.button({ variant, fullWidth, rounded, disabled }),
          asChild && childContentStyles,
          className
        )}
      >
        {loading && (
          <div
            className={cn(
              styles.loadingWrapper,
              childContentStyles,
              innerClassName
            )}
          >
            <div
              className={styles.loadingSpinner}
              data-testid="btn-loading-spinner"
              aria-hidden
            />
          </div>
        )}

        <Slottable>
          {asChild ? (
            children
          ) : (
            <div
              className={cn(
                styles.contentWrapper,
                loading && 'invisible',
                iconPosition === 'right' && 'flex-row-reverse',
                childContentStyles,
                innerClassName
              )}
            >
              {!loading && icon && (
                <span className="contents self-stretch">{icon}</span>
              )}
              <span>{children}</span>
            </div>
          )}
        </Slottable>
      </Comp>
    )
  }
)

Button.displayName = 'Button'
