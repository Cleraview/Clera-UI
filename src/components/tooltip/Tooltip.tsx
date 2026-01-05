'use client'

import { type ReactNode } from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '@/utils/tailwind'
import { VariantProps } from 'class-variance-authority'
import { tooltipVariants, styles } from './styles'

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
              theme === 'dark' ? styles.themeDark : styles.themeLight,
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow
              className={cn(
                theme === 'dark' ? styles.arrowDark : styles.arrowLight
              )}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

Tooltip.displayName = 'Tooltip'
