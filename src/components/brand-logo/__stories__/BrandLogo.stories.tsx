import type { Meta, StoryObj } from '@storybook/nextjs'
import { BrandLogo } from '..'

const meta: Meta<typeof BrandLogo> = {
  title: 'UI/BrandLogo',
  component: BrandLogo,
  tags: ['dev'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'console'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
  args: {
    variant: 'default',
  },
}

export default meta

type Story = StoryObj<typeof BrandLogo>

export const Default: Story = {
  args: {},
}
