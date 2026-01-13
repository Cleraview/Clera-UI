import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Select } from '../Select'
import { useState } from 'react'

const meta: Meta<typeof Select> = {
  title: 'UI/Form/Select',
  component: Select,
  tags: ['dev'],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    layout: 'centered',
  },
  argTypes: {
    fullWidth: {
      control: 'boolean',
      type: 'boolean',
      description:
        'Determines if the select should take up the full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Determines if the select is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the select',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Determines if the select is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Determines if the select is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasError: {
      control: 'boolean',
      description: 'Determines if the select has an error',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label for the select input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    options: {
      control: 'object',
      description: 'Options for the select input',
      table: {
        type: { summary: '{ value: string; label: string }[]' },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      control: 'text',
      description:
        'The current value of the select. If provided, the component will be controlled.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    defaultValue: {
      control: 'text',
      description:
        'The initial value of the select. Use when the component is not controlled.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    onChange: {
      action: 'changed',
      description: 'Callback fired when the value is changed',
      table: {
        type: { summary: '(event: ChangeEvent<HTMLSelectElement>) => void' },
        defaultValue: { summary: '' },
      },
    },
    onBlur: {
      action: 'blurred',
      description: 'Callback fired when the select is blurred',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: '' },
      },
    },
  },
  args: {
    label: 'Label',
    options: [
      { value: '', label: 'Select an option' },
      { value: 'option1', label: 'Option 1', disabled: true },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    inputSize: 'md',
  },
  decorators: [
    Story => (
      <div className="min-w-[200px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
  },
}

export const WithError: Story = {
  args: {
    hasError: true,
  },
}

export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState('option2')
    return (
      <div className="min-w-[200px] flex flex-col gap-space-sm">
        <Select {...args} value={value} onChange={setValue} />
        <p className="text-ds-subtle text-body-xs">Chose: {value}</p>
      </div>
    )
  },
}

export const WithoutLabel: Story = {
  args: {
    defaultValue: '',
    label: 'Please select an option p-0 (must be provided for accessibility)',
  },
  decorators: [
    StoryComponent => (
      <div className="max-w-[200px]">
        <StoryComponent />
      </div>
    ),
  ],
}

export const NoLabel: Story = {
  args: {
    label: '',
  },
}
export const Playground: Story = {
  args: {},
}
