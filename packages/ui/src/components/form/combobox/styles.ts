import { cn } from '@/utils'

export const styles = {
  triggerBase:
    'w-full flex items-center justify-between border-none bg-transparent outline-none cursor-pointer',
  triggerFilledFalse: '[&>[data-filled="false"]]:text-ds-subtlest',
  triggerTextDisabled: 'text-ds-disabled cursor-not-allowed',
  triggerTextDefault: 'text-ds-default',

  valueSpan: 'truncate',
  placeholderSpan: 'invisible',
  valueAbsolute: 'absolute left-2.5 truncate',
  chevIcon:
    'w-4 h-4 ml-space-sm text-ds-subtlest shrink-0 transition-transform duration-200',

  popoverContent:
    'w-(--radix-popover-trigger-width) z-50 rounded-md bg-ds-elevation-surface shadow-md border border-ds-default animate-in fade-in-0 zoom-in-95',

  command: 'flex flex-col overflow-hidden rounded-md',
  commandInputBase:
    'w-full border-b border-ds-default bg-transparent outline-none text-body-sm text-ds-default placeholder:text-ds-subtlest',
  commandList: 'max-h-60 overflow-y-auto scrollbar p-space-xs',

  commandItem: cn(
    'relative flex cursor-pointer select-none items-center rounded-sm outline-none text-ds-default transition-colors p-2.5'
  ),
  commandItemUnselected:
    'aria-selected:bg-ds-neutral-subtle-hovered dark:aria-selected:bg-ds-neutral-hovered',
  commandItemSelected:
    'bg-ds-selected text-ds-selected dark:text-ds-default dark:hover:text-ds-default outline-none',
  commandItemDisabled: cn('cursor-not-allowed [&>*]:text-ds-disabled'),

  group: cn(
    'overflow-hidden text-ds-default',
    '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-body-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-ds-subtle',
    '[&+cmdk-group]:relative [&+cmdk-group]:after:content-[""] [&+cmdk-group]:after:absolute [&+cmdk-group]:after:top-0 [&+cmdk-group]:after:left-0 [&+cmdk-group]:after:w-full [&+cmdk-group]:after:h-px [&+cmdk-group]:after:bg-ds-accent-gray-subtlest'
  ),

  empty: 'py-6 text-center text-body-sm text-ds-subtle',
  loadingRow: 'flex items-center space-x-2 px-2 py-2',

  optionLabel: 'truncate flex-1',
  optionCheck: 'w-4 h-4 ml-2 text-(--fill-ds-icon-primary)',

  separator:
    'py-space-sm flex items-center after:w-full after:h-[1px] after:bg-ds-accent-gray-subtlest',
}

export default styles
