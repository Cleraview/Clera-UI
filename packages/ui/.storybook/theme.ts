import { create } from 'storybook/theming/create'

const baseTheme = {
  brandTitle: 'Clera UI',
  brandUrl: 'https://clera-ui.vercel.app',
  brandImage: '/brand-logo-ui.png',
  brandTarget: '_self',
  inputBorderRadius: 6,
  appBorderRadius: 8,
}

export const light =  create({
  base: 'light',
  ...baseTheme,

  colorPrimary: '#6D28D9',
  colorSecondary: '#262626',

  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#f9fafb',
  appBorderColor: '#E5E7EB',

  textColor: '#171717',
  textInverseColor: '#ffffff',

  barBg: '#ffffff',
  barTextColor: '#6b7280',
  barHoverColor: '#374151',
  barSelectedColor: '#6D28D9',

  inputBg: '#ffffff',
  inputBorder: '#4B5563',
  inputTextColor: '#171717',
})

export const dark = create({
  base: 'dark',
  ...baseTheme,

  colorPrimary: '#6D28D9',
  colorSecondary: '#262626',

  appBg: '#262626',
  appContentBg: '#262626',
  appPreviewBg: '#262626',
  appBorderColor: '#404040',
  
  textInverseColor: '#0B0D0E',
  textColor: '#E5E5E5',
  
  barTextColor: '#E5E5E5',
  barSelectedColor: '#808080',
  barBg: '#404040',
  barHoverColor: '#CBD5E1',
  
  inputTextColor: '#E5E5E5',
  inputBg: '#404040',
  inputBorder: '#525252',
})