import { cn } from '@/utils/tailwind'

export const triggerWrapper = 'w-full [&>input]:cursor-pointer'

export const content = (extra?: string) =>
  cn(
    'z-[9999] bg-ds-elevation-surface p-space-sm rounded-xl shadow-2xl border border-ds-default',
    extra
  )

export const prevButton =
  'rdp-button_previous absolute p-space-xs ml-space-xs! rounded-full focus:bg-ds-input-hovered focus-visible:outline-none transition-colors cursor-pointer'
export const nextButton =
  'rdp-button_next absolute p-space-xs mr-space-xs! rounded-full focus-visible:outline-none transition-colors cursor-pointer'

export const dropdownRoot = (className?: string) =>
  cn('relative border border-ds-input rounded-md overflow-hidden', className)
export const dropdownSelect =
  'py-space-xs pl-space-sm pr-space-lg appearance-none hover:bg-ds-neutral-subtle-hovered transition-all duration-200'

export const weekday = (isSun?: boolean) =>
  cn(
    'text-center font-medium text-body-sm',
    isSun ? 'text-ds-destructive' : 'text-ds-subtle'
  )

export const iconClass =
  'h-4 w-4 absolute inset-y-0 right-3 my-auto flex-shrink-0 text-(--fill-ds-icon) opacity-70 pointer-events-none'

export const monthCaption = (className?: string) =>
  cn('flex items-center justify-between', className)

export const dropdownNav = (className?: string) =>
  cn('flex items-center gap-2', className)

export const chevronIcon = 'h-6 w-6 text-(--fill-ds-icon-subtle)'

export const selectBase = (className?: string) =>
  cn(
    'bg-transparent text-label-sm text-ds-default hover:bg-ds-input-hovered focus:outline-none cursor-pointer',
    className
  )

export const optionClass = 'bg-ds-default'

import type { ClassNames } from 'react-day-picker'

export const getClassNamesCommon = (
  mode: string,
  isSameDayInRange?: boolean
): Partial<ClassNames> => ({
  chevron: 'hover:bg-ds-input-hovered transition',
  outside: 'text-ds-subtlest/20 font-thin',
  disabled:
    'hover:bg-transparent text-ds-subtle/30! [&>button]:cursor-not-allowed!',
  day: cn(
    'h-9 w-9 text-label-sm text-ds-default transition font-semibold',
    'hover:bg-ds-neutral-subtle-hovered dark:hover:bg-ds-neutral-hovered',
    isSameDayInRange ? 'rounded-md!' : 'rounded-md'
  ),
  today: 'text-ds-accent-violet font-bold',
  month_grid: cn(
    'border-separate',
    mode === 'multiple' ? 'border-spacing-1' : 'border-spacing-y-1'
  ),
  range_start:
    'bg-ds-primary-bold hover:bg-ds-primary-bold-hovered! text-ds-inverse rounded-tr-none rounded-br-none',
  range_middle: 'bg-ds-primary rounded-none',
  range_end:
    'bg-ds-primary-bold hover:bg-ds-primary-bold-hovered! text-ds-inverse rounded-tl-none rounded-bl-none',
  selected: cn(
    'bg-ds-primary hover:bg-ds-primary/90 font-semibold',
    mode === 'single' && 'text-ds-accent-violet'
  ),
})

export default {
  triggerWrapper,
  content,
  prevButton,
  nextButton,
  dropdownRoot,
  dropdownSelect,
  weekday,
  iconClass,
  monthCaption,
  dropdownNav,
  chevronIcon,
  selectBase,
  optionClass,
  getClassNamesCommon,
}
