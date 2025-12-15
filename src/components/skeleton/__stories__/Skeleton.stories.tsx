import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Skeleton } from '..'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['dev'],
  argTypes: {
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Controls the border radius of the skeleton.',
      table: {
        type: { summary: "'none' | 'sm' | 'md' | 'lg' | 'full'" },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional classes to control size (e.g., `h-4 w-full`).',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  args: {
    rounded: 'md',
    className: 'h-4 w-48',
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: {
    className: 'h-4 w-64',
  },
}

export const RoundedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Skeleton rounded="none" className="h-4 w-full" />
      <Skeleton rounded="sm" className="h-4 w-full" />
      <Skeleton rounded="md" className="h-4 w-full" />
      <Skeleton rounded="lg" className="h-4 w-full" />
      <Skeleton rounded="full" className="h-4 w-full" />
    </div>
  ),
}

export const CardExample: Story = {
  render: () => (
    <div className="w-96 flex items-center space-x-gap-sm p-space-sm border border-ds-default rounded-md">
      <Skeleton rounded="full" className="h-12 w-12" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
}

export const TextBlock: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
}
