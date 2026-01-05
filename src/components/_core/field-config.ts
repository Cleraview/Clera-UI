import { tokenPaddings, tokenTextSizes } from './tokens'

export type FieldSize = 'sm' | 'md' | 'lg'

export const floatingLabelBase: Record<FieldSize, string> = {
  sm: '-left-1 translate-x-[14px] translate-y-[10px]',
  md: '-left-1.5 translate-x-[16px] translate-y-[10px]',
  lg: '-left-2 translate-x-[20px] translate-y-[12px]',
}

export const floatingLabelActive: Record<FieldSize, string> = {
  sm: 'translate-x-[15px] -translate-y-3.5',
  md: 'translate-x-[16px] -translate-y-3.5',
  lg: 'translate-x-[17px] -translate-y-3.5',
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
  sm: 'py-2 pl-7 pr-2',
  md: 'py-2.5 pl-8 pr-2.5',
  lg: 'py-3 pl-9 pr-3',
}

export const fieldPaddingsWithIconRight: Record<FieldSize, string> = {
  sm: 'py-2 pl-2 pr-10',
  md: 'py-2.5 pl-2.5 pr-10',
  lg: 'py-3 pl-3 pr-10',
}

export const floatingLabelBaseWithIcon: Record<FieldSize, string> = {
  sm: 'translate-x-[28px] translate-y-[10px]',
  md: 'translate-x-[32px] translate-y-[10px]',
  lg: 'translate-x-[36px] translate-y-[12px]',
}

export const floatingLabelActiveWithIcon: Record<FieldSize, string> = {
  sm: 'translate-x-[15px] -translate-y-3.5',
  md: 'translate-x-[16px] -translate-y-3.5',
  lg: 'translate-x-[17px] -translate-y-3.5',
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
