import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CheckboxGroup, { CheckboxOption } from '../CheckboxGroup'

const meta: Meta<typeof CheckboxGroup> = {
  title: 'UI/Form/CheckboxGroup',
  component: CheckboxGroup,
  tags: [],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    layout: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction for the group',
      table: {
        type: { summary: 'vertical | horizontal' },
        defaultValue: { summary: 'vertical' },
      },
    },
    gap: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Gap size between checkboxes',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    name: {
      control: 'text',
      description: 'Accessible name for the group',
      table: { type: { summary: 'string' } },
    },
    options: {
      control: 'object',
      description: 'Array of checkbox options',
      table: { type: { summary: 'CheckboxOption[]' } },
    },
    value: {
      control: 'object',
      description: 'Controlled selected values',
      table: { type: { summary: 'string[]' } },
    },
    defaultValue: {
      control: 'object',
      description: 'Uncontrolled initial values',
      table: { type: { summary: 'string[]' } },
    },
    onChange: {
      action: 'changed',
      description: 'Change handler',
      table: { type: { summary: '(values: string[]) => void' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all checkboxes',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom className',
      table: { type: { summary: 'string' } },
    },
  },
  args: {
    layout: 'vertical',
    gap: 'md',
    name: 'example',
    options: [
      { value: 'one', label: 'Option One' },
      { value: 'two', label: 'Option Two' },
      { value: 'three', label: 'Option Three', disabled: true },
    ],
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof CheckboxGroup>

const options: CheckboxOption[] = [
  { value: 'one', label: 'Option One' },
  { value: 'two', label: 'Option Two' },
  { value: 'three', label: 'Option Three', disabled: true },
]

export const Playground: Story = {
  args: {
    name: 'example',
    options,
  },
}

export const Controlled: Story = {
  render: args => {
    const [vals, setVals] = useState<string[]>(['one'])
    return <CheckboxGroup {...args} value={vals} onChange={setVals} />
  },
  args: { options },
}
