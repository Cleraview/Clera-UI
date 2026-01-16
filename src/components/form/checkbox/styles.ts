import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

export const checkboxGroupVariants = cva('w-full', {
  variants: {
    layout: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row',
    },
    gap: {
      sm: 'gap-space-sm',
      md: 'gap-space-md',
      lg: 'gap-space-lg',
    },
  },
  defaultVariants: {
    layout: 'vertical',
    gap: 'md',
  },
})

export type CheckboxGroupVariantProps = VariantProps<
  typeof checkboxGroupVariants
>

export const styles = {
  container: (start: boolean) =>
    cn(
      'relative inline-flex cursor-pointer flex flex-[auto_1] gap-space-sm',
      start ? 'items-start' : 'items-center'
    ),
  disabledContainer: 'cursor-not-allowed opacity-60',

  rootBase:
    'peer h-5 w-5 appearance-none rounded-sm border border-ds-input transition-all',
  rootChecked:
    'data-[state=checked]:bg-ds-selected-bold data-[state=checked]:border-ds-selected',
  rootFocus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  rootDisabled:
    'data-[state=checked]:bg-ds-disabled data-[state=checked]:border-ds-disabled cursor-not-allowed',
  rootDefaultCursor: 'cursor-pointer',

  indicatorIcon: 'pl-[2px] text-ds-inverse dark:text-ds-default',

  labelBase: 'text-label-sm select-none',
  labelDisabledCursor: 'pointer-events-none [&>*]:text-ds-disabled!',
  labelDefaultCursor: 'cursor-pointer text-ds-default ',
}

export default styles
