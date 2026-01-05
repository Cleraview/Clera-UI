import { cn } from '@/utils/tailwind'
import {
  elementPaddings,
  elementTextSizes,
  elementIconSizes,
} from '@/components/_core/element-config'

export const styles = {
  subTrigger: cn(
    'flex cursor-default select-none items-center rounded-sm text-ds-default outline-none',
    'hover:bg-ds-neutral-subtle-hovered focus:bg-ds-neutral-subtle-hovered data-[state=open]:bg-ds-neutral-subtle-hovered',
    'dark:hover:bg-ds-neutral-hovered dark:focus:bg-ds-neutral-hovered dark:data-[state=open]:bg-ds-neutral-hovered',
    elementPaddings.md,
    elementTextSizes.md
  ),
  subContent: cn(
    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface shadow-ds-elevation-overlay animate-in slide-in-from-left-1 p-space-xs'
  ),
  content: cn(
    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface shadow-ds-elevation-overlay animate-in fade-in-80'
  ),
  item: cn(
    'relative flex select-none items-center rounded-sm outline-none transition-colors',
    'text-ds-default cursor-pointer',
    'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
    'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
    'dark:hover:bg-ds-neutral-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    elementPaddings.md,
    elementTextSizes.md
  ),
  checkboxItem: cn(
    'relative flex select-none items-center outline-none transition-colors text-ds-default cursor-pointer',
    'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
    'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
    'dark:hover:bg-ds-neutral-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    'pl-space-md pr-2 py-2.5',
    elementTextSizes.md
  ),
  radioItem: cn(
    'relative flex select-none items-center rounded-sm outline-none transition-colors text-ds-default cursor-pointer',
    'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
    'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
    'dark:hover:bg-ds-neutral-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    'pl-space-md pr-2 py-2.5',
    elementTextSizes.md
  ),
  label: cn(
    elementPaddings.md,
    elementTextSizes.md,
    'font-semibold text-ds-default'
  ),
  separator: 'my-1 h-px bg-ds-neutral-subtle-pressed',
  subTriggerInset: 'pl-space-md',
  itemJustify: 'justify-between',
  itemInner: 'flex items-center',
  itemInset: 'pl-space-md',
  chevronSmall: 'absolute right-2 h-4 w-4 text-ds-subtle',
  labelGroup: 'flex items-center w-full pl-space-md',
  labelAndChevron: 'flex items-center w-full justify-between',
  labelAndShortcut: 'flex items-center w-full justify-between',
  iconWrapper: cn(
    'absolute left-3 flex items-center justify-center',
    elementIconSizes.sm
  ),
  iconWrapperRadio: cn(
    'absolute left-4 flex items-center justify-center',
    elementIconSizes.sm
  ),
  itemIcon: cn('mr-2', elementIconSizes.sm),

  checkboxIcon: 'h-4 w-4',
  checkboxIconChecked: 'fill-ds-icon-accent-violet dark:fill-ds-icon',
  checkboxIconDefault: 'fill-ds-icon',
  checkboxRoundedSingle: 'rounded-sm',
  checkboxRoundedTop: 'rounded-t-sm',
  checkboxRoundedMiddle: 'rounded-none',
  checkboxRoundedBottom: 'rounded-b-sm',
  radioIcon: 'h-2 w-2 text-(--fill-ds-icon-brand)',
  radioIconChecked: 'text-(--fill-ds-icon-accent-violet)',
  itemSelected:
    'data-[state=checked]:bg-ds-selected data-[state=checked]:text-ds-default data-[state=checked]:hover:bg-ds-selected data-[state=checked]:focus:bg-ds-selected',
  shortcut: 'ml-auto text-xs tracking-widest opacity-60',
  contentPadding: 'p-space-xs',
}

export default styles
