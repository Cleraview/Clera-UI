import { cva } from 'class-variance-authority'

export const textHeadingSizeMap = {
  md: 'text-heading-md',
  lg: 'text-heading-lg',
  xl: 'text-heading-xl',
  '2xl': 'text-heading-2xl',
  '3xl': 'text-heading-3xl',
  '4xl': 'text-heading-4xl',
}

export const textSizeMap = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
}

export const styles = {
  card: cva('', {
    variants: {
      roundedSize: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-2xl',
        xl: 'rounded-4xl',
      },
      thunmbnailRoundedSize: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-2xl',
        xl: 'rounded-4xl',
      },
      titleSize: textHeadingSizeMap,
      descriptionSize: textSizeMap,
      footerActionSize: textSizeMap,
      paddingAxis: {
        all: 'axis-all',
        y: 'axis-y',
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
      padding: {
        sm: null,
        md: null,
        lg: null,
        xl: null,
      },
      hasFooterAction: {
        true: '',
      },
    },
    compoundVariants: [
      {
        shadow: ['sm', 'md', 'lg', 'xl'],
        class: 'shadow-default',
      },
      { padding: 'sm', paddingAxis: 'all', class: 'p-space-sm' },
      { padding: 'sm', paddingAxis: 'y', class: 'py-space-sm' },
      { padding: 'md', paddingAxis: 'all', class: 'p-space-md' },
      { padding: 'md', paddingAxis: 'y', class: 'py-space-md' },
      { padding: 'lg', paddingAxis: 'all', class: 'p-space-lg' },
      { padding: 'lg', paddingAxis: 'y', class: 'py-space-lg' },
      { padding: 'xl', paddingAxis: 'all', class: 'p-space-xl' },
      { padding: 'xl', paddingAxis: 'y', class: 'py-space-xl' },
    ],
  }),

  footerActionWrapper: cva('transition-translate duration-300 ease-in-out', {
    variants: {
      hasFooterAction: {
        true: '',
      },
      footerActionSize: {
        sm: 'h-[1.4rem]',
        md: 'h-[1.7rem]',
        lg: 'h-[1.7rem]',
      },
    },
    compoundVariants: [
      {
        hasFooterAction: true,
        footerActionSize: ['sm', 'md'],
        class: 'group-hover:-translate-y-6',
      },
      {
        hasFooterAction: true,
        footerActionSize: ['lg'],
        class: 'group-hover:-translate-y-7',
      },
    ],
  }),
  root: 'group w-full relative overflow-hidden',
  link: 'absolute inset-0',
  contentWrapper: 'transition-all space-y-gap-md',
  contentInner: 'flex flex-col',
  titleDescriptionContainer: 'space-y-gap-xs',
  title: 'text-ds-default clamp-2',
  description: 'text-ds-subtle clamp-3',
  extended: 'text-ds-subtle clamp-3',
  badgeInline: 'inline-flex items-center self-start',
  footerContainer: 'overflow-hidden',
  metaItemsContainer: 'flex gap-space-sm text-ds-subtlest',
  footerActionLabelWrapper: 'relative',
  footerActionLabel: 'text-ds-primary',
  footerCustom: 'relative',
  thumbnailWrapper:
    'relative w-full aspect-[16/9] overflow-hidden pointer-events-none',
  thumbnailImage: 'w-full h-full absolute inset-0 m-auto object-cover',
  badgeOverride: 'p-0! text-ds-primary!',
  badgeSpacingMap: {
    xs: 'mb-space-xs',
    sm: 'mb-space-sm',
    md: 'mb-space-md',
    lg: 'mb-space-lg',
  },
  titleSpacingMap: {
    xs: 'space-y-gap-xs',
    sm: 'space-y-gap-sm',
    md: 'space-y-gap-md',
    lg: 'space-y-gap-lg',
  },
  contentSpacingMap: {
    xs: 'gap-space-xs',
    sm: 'gap-space-sm',
    md: 'gap-space-md',
    lg: 'gap-space-lg',
  },
}
