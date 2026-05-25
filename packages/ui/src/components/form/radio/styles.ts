import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'

export const radioGroupVariants = cva('w-full', {
  variants: {
    layout: {
      vertical: 'flex flex-col',
      horizontal: 'inline-flex',
    },
    gap: {
      sm: 'gap-space-sm',
      md: 'gap-space-md',
      lg: 'gap-space-lg',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
    gap: 'md',
  },
})

export type RadioGroupVariantProps = VariantProps<typeof radioGroupVariants>

export const styles = {
  container: (props?: RadioGroupVariantProps, className?: string) =>
    cn(radioGroupVariants(props), className),

  radioContainer: (start: boolean) =>
    cn(
      'relative inline-flex flex flex-[auto_1] gap-space-sm',
      start ? 'items-start' : 'items-center'
    ),
  disabledContainer: 'cursor-not-allowed opacity-60',

  labelBase: 'text-ds-default text-label-sm select-none',
  labelDisabledCursor: 'pointer-events-none [&>*]:text-ds-disabled!',
  labelDefaultCursor: 'cursor-pointer text-ds-default',
}

export const root = 'inline-flex items-center'

export const wrapper = 'relative flex items-center'

export function inputClass() {
  return cn(
    'peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-ds-input checked:border-ds-selected hover:border-ds-selected/40 transition-all'
  )
}

export const innerDot =
  'absolute bg-ds-selected-bold w-2 h-2 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'

export default {
  container: styles.container,
  radioContainer: styles.radioContainer,
  disabledContainer: styles.disabledContainer,
  labelBase: styles.labelBase,
  labelDisabledCursor: styles.labelDisabledCursor,
  labelDefaultCursor: styles.labelDefaultCursor,
  root,
  wrapper,
  inputClass,
  innerDot,
}
