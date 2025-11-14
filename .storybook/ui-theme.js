import { create } from 'storybook/theming/create'

export default create({
  base: 'light',

  brandTitle: 'Clera UI',
  brandUrl: 'https://clera-ui.vercel.app',
  brandImage: '/brand-logo-ui.png',
  brandTarget: '_self',

  colorPrimary: '#6D28D9',
  colorSecondary: '#374151',

  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#f9fafb',
  appBorderColor: '#f3f4f6',
  appBorderRadius: 8,

  textColor: '#171717',
  textInverseColor: '#ffffff',

  barBg: '#ffffff',
  barTextColor: '#6b7280',
  barHoverColor: '#374151',
  barSelectedColor: '#6D28D9',

  inputBg: '#ffffff',
  inputBorder: '#f3f4f6',
  inputTextColor: '#171717',
  inputBorderRadius: 6,
});