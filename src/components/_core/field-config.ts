import { tokenPaddings, tokenTextSizes } from './tokens'

export type FieldSize = 'sm' | 'md' | 'lg'

export const floatingLabelBase: Record<FieldSize, string> = {
  sm: 'translate-x-[14px] translate-y-[4px]',
  md: 'translate-x-[16px] translate-y-[6px]',
  lg: 'translate-x-[20px] translate-y-[12px]',
}

export const floatingLabelActive: Record<FieldSize, string> = {
  sm: 'translate-x-[14px] -translate-y-3',
  md: 'translate-x-[14px] -translate-y-3.5',
  lg: 'translate-x-[14px] -translate-y-3',
}

export const floatingLabelBaseText: Record<FieldSize, string> = {
  sm: tokenTextSizes.xs,
  md: tokenTextSizes.sm,
  lg: tokenTextSizes.md,
}

export const floatingLabelActiveText: Record<FieldSize, string> = {
  sm: 'text-[10px] leading-3',
  md: tokenTextSizes.xs,
  lg: tokenTextSizes.sm,
}

export const fieldPaddings: Record<FieldSize, string> = {
  sm: tokenPaddings.sm,
  md: tokenPaddings.md,
  lg: tokenPaddings.lg,
}

export const fieldStateStyles = {
  default: {
    label: 'text-ds-subtlest',
    border: 'border-ds-input',
    text: 'text-ds-default',
  },
  focused: {
    label: 'text-ds-accent-violet',
    border: 'border-[2px] border-ds-focused',
    text: 'text-ds-default',
  },
  error: {
    label: 'text-ds-destructive',
    border: 'border-ds-destructive',
    text: 'text-ds-destructive',
  },
  disabled: {
    label: 'text-ds-disabled',
    border: 'border-ds-disabled',
    text: 'text-ds-disabled',
  },
}
