import { tokenRadii, tokenPaddings, tokenTextSizes } from './tokens'

export const elementVariants = {
  primary: 'bg-ds-primary-bold text-ds-inverse',
  outlinePrimary: 'border border-ds-primary text-ds-primary bg-transparent',
  secondary: 'bg-ds-neutral-bold text-ds-inverse',
  outlineSecondary: 'border border-ds-bold text-ds-default bg-transparent',
  success: 'bg-ds-success-bold text-ds-inverse',
  outlineSuccess: 'border border-ds-success text-ds-success bg-transparent',
  info: 'bg-ds-info-bold text-ds-inverse',
  outlineInfo: 'border border-ds-info text-ds-info bg-transparent',
  warning: 'bg-ds-warning-bold text-ds-warning-inverse',
  outlineWarning: 'border border-ds-warning text-ds-warning bg-transparent',
  destructive: 'bg-ds-destructive-bold text-ds-inverse',
  outlineDestructive:
    'border border-ds-destructive text-ds-destructive bg-transparent',
  light: 'bg-ds-neutral text-ds-default',
  outlineLight: 'border border-ds-default text-ds-subtle bg-transparent',
  ghost: 'text-ds-default hover:bg-ds-neutral-subtle-hovered bg-transparent',
} as const

export const elementRadius = tokenRadii

export const elementPaddings = tokenPaddings

export const elementTextSizes = {
  xs: tokenTextSizes.xs,
  sm: tokenTextSizes.xs,
  md: tokenTextSizes.sm,
  lg: tokenTextSizes.md,
} as const

export const elementVariantKeys = Object.keys(elementVariants)
export const elementRadiusKeys = Object.keys(elementRadius)
export const elementPaddingKeys = Object.keys(elementPaddings)

export type ElementVariant = keyof typeof elementVariants
export type ElementRadius = keyof typeof elementRadius
export type ElementSize = keyof typeof elementPaddings
