import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Checkbox } from '../Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Form/Checkbox',
  component: Checkbox,
  tags: ['dev'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label to display next to the checkbox.',
      table: { type: { summary: 'ReactNode' } },
    },
    checked: {
      control: 'boolean',
      description:
        'The controlled checked state of the checkbox. Must be used with `onChange`.',
      table: { type: { summary: 'boolean' } },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state for an uncontrolled checkbox.',
      table: { type: { summary: 'boolean' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents user interaction with the checkbox.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Marks the checkbox as required for form submission.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onChange: {
      action: 'checked changed',
      description: 'Event handler called when the checked state changes.',
      table: { type: { summary: '(checked: boolean) => void' } },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for custom styling.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Accept terms and conditions',
    disabled: false,
    required: false,
  },
}
export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
  args: {
    label: 'Click me',
  },
}

export const Checked: Story = {
  render: args => {
    return <Checkbox {...args} checked={true} />
  },
  args: {
    label: 'I am checked by default',
  },
}

export const Disabled: Story = {
  render: args => {
    return (
      <div className="flex flex-col gap-4">
        <Checkbox {...args} label="Disabled (Unchecked)" />
        <Checkbox {...args} label="Disabled (Checked)" checked={true} />
      </div>
    )
  },
  args: {
    disabled: true,
  },
}
