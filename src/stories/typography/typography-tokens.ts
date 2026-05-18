type Token = {
  [key in 'name' | 'token' | 'fontSize' | 'lineHeight']?: string
}

export type TypographyToken = {
  title: string
  tokens: Token[]
}

export const typographyTokens: TypographyToken[] = [
  {
    title: 'Display',
    tokens: [
      {
        name: 'Display / 2XL',
        token: 'text-display-2xl',
        fontSize: '3.75rem / 60px',
        lineHeight: '4.6rem / 75px',
      },
      {
        name: 'Display / XL',
        token: 'text-display-xl',
        fontSize: '2.5rem / 40px',
        lineHeight: '3.25rem / 52px',
      },
      {
        name: 'Display / LG',
        token: 'text-display-lg',
        fontSize: '1.875rem / 30px',
        lineHeight: '2.25rem / 36px',
      },
      {
        name: 'Display / MD',
        token: 'text-display-md',
        fontSize: '1.5rem / 24px',
        lineHeight: '2rem / 33px',
      },
    ],
  },
  {
    title: 'Heading',
    tokens: [
      {
        name: 'Heading / 4XL',
        token: 'text-heading-4xl',
        fontSize: '1.875rem / 30px',
        lineHeight: '2.25rem / 36px',
      },
      {
        name: 'Heading / 3XL',
        token: 'text-heading-3xl',
        fontSize: '1.5rem / 24px',
        lineHeight: '2rem / 33px',
      },
      {
        name: 'Heading / 2XL',
        token: 'text-heading-2xl',
        fontSize: '1.25rem / 20px',
        lineHeight: '1.8rem / 30px',
      },
      {
        name: 'Heading / XL',
        token: 'text-heading-xl',
        fontSize: '1.125rem / 18px',
        lineHeight: '1.6rem / 27px',
      },
      {
        name: 'Heading / LG',
        token: 'text-heading-lg',
        fontSize: '1rem / 16px',
        lineHeight: '1.5rem / 24px',
      },
      {
        name: 'Heading / MD',
        token: 'text-heading-md',
        fontSize: '0.9375rem / 15px',
        lineHeight: '1.4rem / 22px',
      },
      {
        name: 'Heading / SM',
        token: 'text-heading-sm',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
    ],
  },
  {
    title: 'Body',
    tokens: [
      {
        name: 'Body / 2XL',
        token: 'text-body-2xl',
        fontSize: '1.5rem / 24px',
        lineHeight: '1.6',
      },
      {
        name: 'Body / XL',
        token: 'text-body-xl',
        fontSize: '1.25rem / 20px',
        lineHeight: '1.6',
      },
      {
        name: 'Body / LG',
        token: 'text-body-lg',
        fontSize: '1.125rem / 18px',
        lineHeight: '1.6',
      },
      {
        name: 'Body / MD',
        token: 'text-body-md',
        fontSize: '1rem / 16px',
        lineHeight: '1.5',
      },
      {
        name: 'Body / SM',
        token: 'text-body-sm',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.4',
      },
      {
        name: 'Body / XS',
        token: 'text-body-xs',
        fontSize: '0.75rem / 12px',
        lineHeight: '1.25rem / 20px',
      },
    ],
  },
  {
    title: 'Labels',
    tokens: [
      {
        name: 'Label / XL',
        token: 'text-label-xl',
        fontSize: '1.25rem / 20px',
        lineHeight: '1.5rem / 24px',
      },
      {
        name: 'Label / LG',
        token: 'text-label-lg',
        fontSize: '1rem / 16px',
        lineHeight: '1.5rem / 24px',
      },
      {
        name: 'Label / MD',
        token: 'text-label-md',
        fontSize: '0.9375rem / 15px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Label / SM',
        token: 'text-label-sm',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Label / XS',
        token: 'text-label-xs',
        fontSize: '0.75rem / 12px',
        lineHeight: '1rem / 16px',
      },
      {
        name: 'Label / XXS',
        token: 'text-label-xxs',
        fontSize: '0.625rem / 10px',
        lineHeight: '0.625rem / 10px',
      },
    ],
  },
  {
    title: 'Code & Links',
    tokens: [
      {
        name: 'Code / LG',
        token: 'text-code-lg',
        fontSize: '1rem / 16px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Code / MD',
        token: 'text-code-md',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Code / SM',
        token: 'text-code-sm',
        fontSize: '0.75rem / 12px',
        lineHeight: '1rem / 16px',
      },
      {
        name: 'Link / Default',
        token: 'text-link-default',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Link / Subtle',
        token: 'text-link-subtle',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
    ],
  },
  {
    title: 'Helpers & Styles',
    tokens: [
      {
        name: 'Helper / Text',
        token: 'text-helper-text',
        fontSize: '0.75rem / 12px',
        lineHeight: '1rem / 16px',
      },
      {
        name: 'Helper / Error',
        token: 'text-helper-error',
        fontSize: '0.75rem / 12px',
        lineHeight: '1rem / 16px',
      },
      {
        name: 'Muted',
        token: 'text-muted',
        fontSize: '0.875rem / 14px',
        lineHeight: '1.25rem / 20px',
      },
      {
        name: 'Strong',
        token: 'text-strong',
        fontSize: 'inherit',
        lineHeight: 'inherit',
      },
      {
        name: 'Italic / Emphasis',
        token: 'text-italic',
        fontSize: 'inherit',
        lineHeight: 'inherit',
      },
    ],
  },
]
