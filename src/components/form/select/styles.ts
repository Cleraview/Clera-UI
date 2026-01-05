import { cn } from '@/utils'

export const styles = {
  triggerBase: 'w-full flex items-center justify-between bg-transparent',
  triggerFilledFalse: '[&>[data-filled="false"]]:invisible',
  triggerHasError: '[&>[data-has-error="true"]]:text-ds-destructive',
  triggerDisabled: 'text-ds-subtlest',
  triggerDefault: 'outline-none text-ds-default cursor-pointer',

  valueDefault: 'text-ds-default',
  valueError: 'text-ds-destructive',

  iconBase: 'w-4 h-4 ml-space-sm text-ds-subtlest',
  iconError: 'text-ds-destructive!',

  content:
    'w-[var(--radix-select-trigger-width)] z-50 bg-ds-elevation-surface rounded-md bg-default shadow-md border border-ds-default',
  viewport: 'p-space-xs',

  itemBase: cn(
    'flex items-center justify-between rounded-sm cursor-pointer outline-none',
    'text-ds-default focus:text-ds-default focus:bg-ds-neutral-subtle-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[state=checked]:bg-ds-selected data-[state=checked]:text-ds-selected dark:data-[state=checked]:text-ds-default',
    'data-[state=checked]:focus:bg-ds-selected'
  ),
  itemIndicatorIcon: 'w-4 h-4 ml-space-md text-(--fill-ds-icon-primary)',
}

export default styles
