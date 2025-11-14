import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tooltip } from '..'
import { Button } from '@/components/button'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['dev'],
  argTypes: {
    content: {
      control: 'text',
      description: 'The text or React node to display inside the tooltip.',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'The preferred side of the trigger to render the tooltip.',
      table: {
        defaultValue: { summary: 'top' },
      },
    },
    sideOffset: {
      control: 'number',
      description: 'The offset from the trigger.',
      table: {
        defaultValue: { summary: '5' },
      },
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Controls the color theme of the tooltip.',
      table: {
        defaultValue: { summary: 'dark' },
      },
    },
    delayDuration: {
      control: 'number',
      description: 'The delay in milliseconds before the tooltip appears.',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    children: {
      control: false,
      description: 'The trigger element for the tooltip.',
    },
  },
  args: {
    content: 'This is a tooltip!',
    side: 'top',
    sideOffset: 5,
    theme: 'dark',
    delayDuration: 300,
  },
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: args => (
    <Tooltip {...args}>
      <Button variant="outlinePrimary">Hover me</Button>
    </Tooltip>
  ),
}

export const LightTheme: Story = {
  render: args => (
    <Tooltip {...args}>
      <Button variant="outlinePrimary">Hover me (Light)</Button>
    </Tooltip>
  ),
  args: {
    content: 'Light theme tooltip',
    theme: 'light',
  },
}

export const AllSides: Story = {
  render: () => (
    <div className="flex gap-4 p-20">
      <Tooltip content="Top side" side="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Right side" side="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip content="Bottom side" side="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left side" side="left">
        <Button>Left</Button>
      </Tooltip>
    </div>
  ),
}
