import {
  tokenRadii,
  tokenPaddings,
  tokenBadgePaddings,
  tokenTextSizes,
  tokenHeadingSizes,
} from './tokens'

export const elementVariants = {
  primary: 'bg-ds-primary-bold',
  outlinePrimary: 'border border-ds-primary text-ds-primary bg-transparent',
  secondary: 'bg-ds-neutral-bold text-ds-inverse',
  outlineSecondary: 'border border-ds-bold text-ds-default bg-transparent',
  success: 'bg-ds-success-bold',
  outlineSuccess: 'border border-ds-success text-ds-success bg-transparent',
  info: 'bg-ds-info-bold',
  outlineInfo: 'border border-ds-info text-ds-info bg-transparent',
  warning: 'bg-ds-warning-bold text-ds-warning-inverse',
  outlineWarning: 'border border-ds-warning text-ds-warning bg-transparent',
  destructive: 'bg-ds-destructive-bold',
  outlineDestructive:
    'border border-ds-destructive text-ds-destructive bg-transparent',
  light: 'bg-ds-neutral text-ds-default',
  outlineLight: 'border border-ds-default text-ds-subtle bg-transparent',
  ghost: 'text-ds-default hover:bg-ds-neutral-subtle-hovered bg-transparent',
} as const

export const elementRadius = tokenRadii

export const elementPaddings = tokenPaddings

export const elementBadgePaddings = tokenBadgePaddings

export const elementTextHeadingSizes = {
  xs: tokenHeadingSizes.sm,
  sm: tokenHeadingSizes.sm,
  md: tokenHeadingSizes.sm,
  lg: tokenHeadingSizes.md,
  xl: tokenHeadingSizes.lg,
} as const

export const elementTextSizes = {
  xs: tokenTextSizes.xxs,
  sm: tokenTextSizes.xs,
  md: tokenTextSizes.sm,
  lg: tokenTextSizes.md,
  xl: tokenTextSizes.lg,
} as const

export const elementIconSizes = {
  xs: tokenTextSizes.xxs,
  sm: tokenTextSizes.xs,
  md: tokenTextSizes.sm,
  lg: tokenTextSizes.md,
  xl: tokenTextSizes.lg,
} as const

export const elementVariantKeys = Object.keys(elementVariants)
export const elementRadiusKeys = Object.keys(elementRadius)
export const elementPaddingKeys = Object.keys(elementPaddings)

export type ElementVariant = keyof typeof elementVariants
export type ElementRadius = keyof typeof elementRadius
export type ElementSize = keyof typeof elementPaddings
