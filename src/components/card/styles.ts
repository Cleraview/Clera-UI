import { cva } from 'class-variance-authority'

export const textHeadingSizeMap = {
  md: 'text-heading-base',
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
      contentSpacing: {
        xs: 'space-y-gap-xs',
        sm: 'space-y-gap-sm',
        md: 'space-y-gap-md',
        lg: 'space-y-gap-lg',
      },
      padding: {
        sm: null,
        md: null,
        lg: null,
        xl: null,
      },
    },
    compoundVariants: [
      {
        shadow: ['sm', 'md', 'lg', 'xl'],
        class: 'shadow-default',
      },

      // sm
      { padding: 'sm', paddingAxis: 'all', class: 'p-space-sm' },
      { padding: 'sm', paddingAxis: 'y', class: 'py-space-sm' },

      // md
      { padding: 'md', paddingAxis: 'all', class: 'p-space-md' },
      { padding: 'md', paddingAxis: 'y', class: 'py-space-md' },

      // lg
      { padding: 'lg', paddingAxis: 'all', class: 'p-space-lg' },
      { padding: 'lg', paddingAxis: 'y', class: 'py-space-lg' },

      // xl
      { padding: 'xl', paddingAxis: 'all', class: 'p-space-xl' },
      { padding: 'xl', paddingAxis: 'y', class: 'py-space-xl' },

      {
        footerActionSize: ['sm'],
        className: 'h-[1rem] group-hover:-translate-y-6',
      },
      {
        footerActionSize: ['md'],
        className: 'h-[1.7rem] group-hover:-translate-y-6',
      },
      {
        footerActionSize: ['lg'],
        className: 'h-[1.7rem] group-hover:-translate-y-7',
      },
    ],
  }),
  root: 'group w-full relative overflow-hidden',
  link: 'absolute inset-0',
  contentWrapper: 'h-full transition-all space-y-gap-md pointer-events-none',
  titleDescriptionContainer: 'space-y-gap-xs',
  title: 'text-ds-default clamp-2',
  description: 'text-ds-subtle clamp-3',
  footerContainer: 'overflow-hidden',
  footerActionWrapper: 'transition-translate duration-300 ease-in-out',
  metaItemsContainer: 'flex gap-space-sm text-ds-subtlest',
  footerActionLabelWrapper: 'relative',
  footerActionLabel: 'text-ds-primary',
  thumbnailWrapper:
    'relative w-full aspect-[16/9] overflow-hidden pointer-events-none',
  thumbnailImage: 'w-full h-full absolute inset-0 m-auto object-cover',
}
