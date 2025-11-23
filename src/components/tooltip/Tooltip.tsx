'use client'

import { type ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/utils/tailwind'
import { cva, VariantProps } from 'class-variance-authority'

const tooltipVariants = cva(
  'z-50 rounded-md shadow-md animate-in fade-in-0 zoom-in-95',
  {
    variants: {
      size: {
        xs: 'px-space-sm py-space-xs text-body-xs',
        sm: 'px-space-sm py-space-xs text-body-sm',
        md: 'px-space-md py-space-sm text-body-md',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  children: ReactNode
  content: ReactNode
  side?: RadixTooltip.TooltipContentProps['side']
  sideOffset?: number
  className?: string
  theme?: 'light' | 'dark'
  delayDuration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Tooltip = ({
  children,
  content,
  side = 'top',
  sideOffset = 5,
  className,
  theme = 'dark',
  delayDuration = 30,
  open,
  size,
  onOpenChange,
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root open={open} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              tooltipVariants({ size }),
              theme === 'dark'
                ? 'bg-ds-neutral-bold text-ds-inverse'
                : 'bg-ds-neutral text-default',
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow
              className={cn(
                theme === 'dark' ? 'fill-ds-icon' : 'fill-ds-icon-inverse'
              )}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

Tooltip.displayName = 'Tooltip'
