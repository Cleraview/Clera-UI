import { cva } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import {
  elementPaddings,
  elementTextSizes,
  elementIconSizes,
} from '../_core/element-config'

export const styles = {
  dialog: cva('flex w-full flex-col overflow-hidden bg-ds-elevation-surface', {
    variants: {
      withBorder: {
        true: 'border border-ds-default shadow-md rounded-xl',
        false: '',
      },
    },
    defaultVariants: {
      withBorder: true,
    },
  }),
  input: {
    wrapper:
      'flex items-center border-b border-ds-default py-space-sm px-space-md',
    icon: 'h-5 w-5 text-(--fill-ds-icon-subtle)',
    field: cn(
      'w-full bg-transparent placeholder:text-ds-subtlest',
      'ml-space-sm focus:outline-none focus:ring-0 border-none p-0',
      'caret-(--fill-ds-icon-subtle) text-ds-default',
      elementTextSizes.md
    ),
  },
  list: 'max-h-[300px] overflow-y-auto overflow-x-hidden p-space-sm outline-none scrollbar',
  empty: cn('py-space-md text-center text-ds-subtle', elementTextSizes.md),
  group: cn(
    'overflow-hidden text-ds-default',
    '[&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-ds-subtlest',
    '[&_[cmdk-group-heading]]:p-space-sm',
    elementTextSizes.md
  ),
  separator: 'h-px bg-ds-default',
  item: cva(
    [
      'relative flex cursor-pointer select-none items-center rounded-md text-ds-default outline-none transition-colors aria-disabled:text-ds-subtlest aria-disabled:opacity-40 aria-disabled:cursor-not-allowed',
      elementPaddings.md,
      elementTextSizes.md,
    ],
    {
      variants: {
        isSelected: {
          true: 'bg-ds-primary-bold text-ds-inverse dark:text-ds-default [&>svg]:text-(--fill-ds-icon-inverse) dark:[&>svg]:text-(--fill-ds-icon-default)',
          false:
            'aria-selected:bg-ds-neutral-subtle-hovered dark:aria-selected:bg-ds-neutral-hovered',
        },
      },
      defaultVariants: {
        isSelected: false,
      },
    }
  ),
  menu: {
    list: 'bg-ds-elevation-surface',
    itemIcon: cn(
      'mr-space-sm text-(--fill-ds-icon-accent-gray) dark:text-(--fill-ds-icon-default)',
      elementTextSizes.md
    ),
    itemContent: 'ml-auto flex items-center gap-space-sm',
    shortcut:
      'h-5 select-none items-center gap-1 rounded bg-ds-inverse-subtle px-space-xs font-mono text-label-xs text-ds-default sm:inline-flex',
    checkIcon: elementIconSizes.md,
  },
}
