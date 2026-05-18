export const tokenHeadingSizes = {
  xl: 'text-heading-xl',
  lg: 'text-heading-lg',
  md: 'text-heading-md',
  sm: 'text-heading-sm',
  xs: 'text-heading-sm',
}

export const tokenTextSizes = {
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
  xl: 'p-4',
} as const

export const tokenBadgePaddings = {
  xs: 'p-0.5',
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
  xl: tokenPaddings.xl,
} as const
