export const variantMap = {
  primary: 'bg-ds-brand-bold text-ds-inverse',
  outlinePrimary: 'border border-ds-brand text-ds-brand bg-transparent',

  secondary: 'bg-ds-neutral-bold text-ds-inverse',
  outlineSecondary: 'border border-ds-bold text-ds-default bg-transparent',

  success: 'bg-ds-success-bold text-ds-inverse',
  outlineSuccess: 'border border-ds-success text-ds-success bg-transparent',

  info: 'bg-ds-info-bold text-ds-inverse',
  outlineInfo: 'border border-ds-info text-ds-info bg-transparent',

  warning: 'bg-ds-warning-bold text-ds-warning-inverse',
  outlineWarning: 'border border-ds-warning text-ds-warning bg-transparent',

  destructive: 'bg-ds-danger-bold text-ds-inverse',
  outlineDestructive:
    'border border-ds-danger text-ds-destructive bg-transparent',

  light: 'bg-ds-neutral text-ds-default',
  outlineLight: 'border border-ds-default text-ds-subtle bg-transparent',

  ghost: 'text-ds-default hover:bg-ds-neutral-subtle-hovered bg-transparent',
} as const

export const roundedMap = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  full: 'rounded-full',
} as const

export const sizeMap = {
  xs: 'p-1.5 text-body-xs leading-3',
  sm: 'px-2.5 py-1.5 text-body-sm leading-4',
  md: 'px-3.5 py-2.5 text-body-md leading-5',
  lg: 'px-4.5 py-3.5 text-body-lg leading-6',
} as const

export const variantMapKeys = Object.keys(variantMap)
export const roundedMapKeys = Object.keys(roundedMap)
export const sizeMapKeys = Object.keys(sizeMap)

export type VariantType = keyof typeof variantMap
export type RoundedType = keyof typeof roundedMap
export type SizeType = keyof typeof sizeMap
