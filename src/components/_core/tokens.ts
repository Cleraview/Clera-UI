// import typographyTokens from '@root/tokens/typography.json'
// import { mapTokenGroup } from '@root/src/utils'

export const tokenHeadingSizes = {
  xl: 'text-heading-xl',
  lg: 'text-heading-lg',
  md: 'text-heading-md',
  sm: 'text-heading-sm',
  xs: 'text-heading-sm',
}

export const tokenTextSizes = {
  // ...mapTokenGroup('label', typographyTokens.typography.label),
  xl: 'text-label-xl',
  lg: 'text-label-lg',
  md: 'text-label-md',
  sm: 'text-label-sm',
  xs: 'text-label-xs',
  xxs: 'text-label-xxs',
}

export const tokenRadii = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  full: 'rounded-full',
} as const

export const tokenPaddings = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
} as const
