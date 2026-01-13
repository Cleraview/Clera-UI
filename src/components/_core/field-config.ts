import { tokenPaddings, tokenTextSizes } from './tokens'

export type FieldSize = 'sm' | 'md' | 'lg'
export type FieldState = 'default' | 'focused' | 'error' | 'disabled'

export const fieldHorizontalPadding: Record<FieldSize, string> = {
  sm: 'px-2',
  md: 'px-2.5',
  lg: 'px-3',
}

export const floatingLabelBase: Record<FieldSize, string> = {
  sm: 'px-2 translate-y-[10px]',
  md: 'px-2.5 translate-y-[10px]',
  lg: 'px-3 translate-y-[10px]',
}

export const floatingLabelActive: Record<FieldSize, string> = {
  sm: 'px-3.5 -translate-y-1',
  md: 'px-4 -translate-y-1',
  lg: 'px-4.5 -translate-y-1.5',
}

export const floatingLabelBaseText: Record<FieldSize, string> = {
  sm: tokenTextSizes.xs,
  md: tokenTextSizes.sm,
  lg: tokenTextSizes.md,
}

export const floatingLabelTextActive: Record<FieldSize, string> = {
  sm: tokenTextSizes.xxs,
  md: tokenTextSizes.xs,
  lg: tokenTextSizes.sm,
}

export const fieldPaddings: Record<FieldSize, string | string[]> = {
  sm: ['h-[32px]', tokenPaddings.sm],
  md: ['h-[36px]', tokenPaddings.md],
  lg: ['h-[40px]', tokenPaddings.lg],
}

export const fieldIconPosition = {
  left: {
    sm: 'left-2',
    md: 'left-2.5',
    lg: 'left-3',
  },
  right: {
    sm: 'right-2',
    md: 'right-2.5',
    lg: 'right-3',
  },
}

export const fieldPaddingsWithIcon: Record<FieldSize, string> = {
  sm: 'h-[32px] py-2 pl-7 pr-2',
  md: 'h-[36px] py-2.5 pl-8 pr-2.5',
  lg: 'h-[40px] py-3 pl-9 pr-3',
}

export const fieldPaddingsWithIconRight: Record<FieldSize, string> = {
  sm: 'h-[32px] py-2 pl-2 pr-8',
  md: 'h-[36px] py-2.5 pl-2.5 pr-8',
  lg: 'h-[40px] py-3 pl-3 pr-8',
}

export const floatingLabelBaseWithIcon: Record<
  'left' | 'right',
  Record<FieldSize, string>
> = {
  left: {
    sm: 'pl-8 pr-2 translate-y-[10px]',
    md: 'pl-8 pr-2.5 translate-y-[10px]',
    lg: 'pl-8 pr-3 translate-y-[10px]',
  },
  right: {
    sm: 'pl-2 pr-8 translate-y-[10px]',
    md: 'pl-2.5 pr-8 translate-y-[10px]',
    lg: 'pl-3 pr-8 translate-y-[10px]',
  },
}

export const fieldStateStyles: Record<
  FieldState,
  { label: string; border: string; text: string }
> = {
  default: {
    label: 'text-ds-subtlest',
    border: 'border-2 border-ds-input',
    text: 'text-ds-default',
  },
  focused: {
    label: 'text-ds-accent-violet',
    border: 'border-2 border-ds-focused',
    text: 'text-ds-default',
  },
  error: {
    label: 'text-ds-destructive',
    border: 'border-2 border-ds-destructive',
    text: 'text-ds-destructive',
  },
  disabled: {
    label: 'text-ds-disabled',
    border: 'border-2 border-ds-disabled',
    text: 'text-ds-disabled',
  },
}
