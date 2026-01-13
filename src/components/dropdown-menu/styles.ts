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
    elementPaddings.md,
    elementTextSizes.md
  ),
  subTriggerInset: 'pl-space-md',
  subContent:
    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface shadow-ds-elevation-overlay p-space-xs max-h-[60vh]',
  content:
    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-ds-default bg-ds-elevation-surface shadow-ds-elevation-overlay max-h-[60vh]',
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
  itemInset: 'pl-space-md',
  itemWithChildren: 'justify-between',
  itemContent: 'flex items-center',

  checkboxItem: cn(
    'relative flex select-none items-center outline-none transition-colors text-ds-default cursor-pointer',
    'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default',
    'focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
    'dark:hover:bg-ds-neutral-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    'pl-space-md pr-2 py-2.5',
    elementTextSizes.md
  ),
  checkboxItemHover:
    'hover:bg-ds-neutral-subtle-hovered hover:text-ds-default focus:bg-ds-neutral-subtle-hovered focus:text-ds-default',
  checkboxItemChecked: 'bg-ds-primary',
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
  labelInset: 'pl-space-md',
  separator: 'my-1 h-px bg-ds-neutral-subtle-pressed',

  navBackButton:
    'p-1 rounded-sm hover:bg-ds-neutral-subtle-hovered text-ds-subtle hover:text-ds-default transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-ds-brand/20',
  backTitle: 'font-semibold text-heading-sm text-ds-default',
  header:
    'flex-none relative flex items-center gap-space-xs px-1 py-1 mb-1 border-b border-ds-default/50',

  itemsContainer: 'flex-1 overflow-auto scrollbar py-1',
  container: 'w-full max-h-[60vh] flex flex-col',

  itemIcon: cn('mr-2', elementIconSizes.sm),
  iconWrapper: cn(
    'absolute left-3 flex items-center justify-center',
    elementIconSizes.sm
  ),
  iconWrapperRadio: cn(
    'absolute left-4 flex items-center justify-center',
    elementIconSizes.sm
  ),
  labelGroup: 'flex items-center w-full pl-space-md',
  checkboxIcon: 'h-4 w-4',
  checkboxIconDefault: 'fill-ds-icon',
  checkboxIconChecked: 'fill-ds-icon-accent-violet dark:fill-ds-icon',
  radioIcon: 'h-2 w-2 text-(--fill-ds-icon-brand)',

  shortcut: 'ml-auto text-xs tracking-widest opacity-60',
  chevronSmall: 'h-4 w-4 text-ds-subtle',
  chevronLarge: 'ml-auto text-label-md text-ds-subtle',
  itemSelected:
    'data-[state=checked]:bg-ds-selected data-[state=checked]:text-ds-default data-[state=checked]:hover:bg-ds-selected data-[state=checked]:focus:bg-ds-selected',
  contentPadding: 'p-space-xs',
}

export default styles
