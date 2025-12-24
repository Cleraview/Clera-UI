'use client'

import {
  type ReactNode,
  ButtonHTMLAttributes,
  forwardRef,
  useMemo,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn, composeStyles } from '@/utils/tailwind'
import {
  type ElementSize,
  elementPaddings,
  elementTextSizes,
} from '@/components/_core/element-config'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 border whitespace-nowrap font-bold! tracking-wide cursor-pointer transition-all duration-300 ease-in-out outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-ds-primary-bold hover:bg-ds-primary-bold-hovered text-ds-inverse',
        outlinePrimary:
          'bg-transparent hover:bg-ds-primary border-ds-primary text-ds-primary',

        secondary:
          'bg-ds-neutral-bold hover:bg-ds-neutral-bold-hovered text-ds-inverse',
        outlineSecondary:
          'bg-transparent hover:bg-ds-neutral border-ds-bold text-ds-default',

        success:
          'bg-ds-success-bold hover:bg-ds-success-bold-hovered text-ds-inverse',
        outlineSuccess:
          'bg-transparent hover:bg-ds-success border-ds-success text-ds-success',

        info: 'bg-ds-info-bold hover:bg-ds-info-bold-hovered text-ds-inverse',
        outlineInfo:
          'bg-transparent hover:bg-ds-info border-ds-info text-ds-info',

        warning:
          'bg-ds-warning-bold hover:bg-ds-warning-bold-hovered text-ds-warning-inverse',
        outlineWarning:
          'bg-transparent hover:bg-ds-warning border-ds-warning text-ds-warning',

        destructive:
          'bg-ds-destructive-bold hover:bg-ds-destructive-bold-hovered text-ds-inverse',
        outlineDestructive:
          'bg-transparent hover:bg-ds-destructive border-ds-destructive text-ds-destructive',

        light: 'bg-ds-neutral hover:bg-ds-neutral-hovered text-ds-default',
        outlineLight:
          'bg-transparent hover:bg-ds-neutral border-ds-default text-ds-subtle',

        ghost: 'text-ds-default bg-transparent',
      },
      size: composeStyles(elementPaddings, elementTextSizes),
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        full: 'rounded-full',
      },
      disabled: {
        true: 'bg-disabled! text-ds-disabled disabled:cursor-not-allowed disabled:opacity-50',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      { disabled: false, rounded: 'none', className: 'hover:rounded-md' },
      { disabled: false, rounded: 'sm', className: 'hover:rounded-lg' },
      { disabled: false, rounded: 'md', className: 'hover:rounded-xl' },

      {
        variant: [
          'primary',
          'destructive',
          'info',
          'secondary',
          'warning',
          'success',
          'ghost',
          'light',
        ],
        className: 'border-transparent',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
      disabled: false,
      rounded: 'md',
    },
  }
)

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
          buttonVariants({ variant, fullWidth, rounded, disabled }),
          asChild && childContentStyles,
          className
        )}
      >
        {loading && (
          <div
            className={cn(
              'absolute flex gap-space-sm items-center justify-center cursor-not-allowed',
              childContentStyles,
              innerClassName
            )}
          >
            <div
              className="w-4 h-4 rounded-full inline-block border-t-[2px] border-r-[2px] border-r-transparent box-border animate-spin"
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
                'flex gap-space-sm items-center justify-center',
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
