import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { ComboBox, ComboBoxOption } from '../ComboBox'
import { Form } from '@/components/form'
import { Button } from '@/components/button'

const meta: Meta<typeof ComboBox> = {
  title: 'UI/Form/ComboBox',
  component: ComboBox,
  tags: ['dev'],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the combobox input',
    },
    options: {
      control: 'object',
      description: 'Options for the combobox input',
    },
    value: {
      control: 'text',
      description: 'The current value of the combobox (controlled).',
    },
    defaultValue: {
      control: 'text',
      description: 'The initial value of the combobox (uncontrolled).',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected.',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Determines if the combobox should take up the full width.',
    },
    required: {
      control: 'boolean',
      description: 'Determines if the combobox is required.',
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the combobox.',
    },
    disabled: {
      control: 'boolean',
      description: 'Determines if the combobox is disabled.',
    },
    readOnly: {
      control: 'boolean',
      description: 'Determines if the combobox is read-only.',
    },
    hasError: {
      control: 'boolean',
      description: 'Determines if the combobox has an error.',
    },
  },
  args: {
    label: 'Country',
    options: [
      { value: 'id', label: 'Indonesia' },
      { value: 'sg', label: 'Singapore' },
      { value: 'my', label: 'Malaysia' },
      { value: 'vn', label: 'Vietnam' },
      { value: 'th', label: 'Thailand' },
      { value: 'ph', label: 'Philippines' },
      { value: 'us', label: 'United States' },
      { value: 'gb', label: 'United Kingdom' },
    ],
    placeholder: 'Select a country...',
    inputSize: 'md',
  },
}

export default meta
type Story = StoryObj<typeof ComboBox>

const countryOptions: ComboBoxOption[] = [
  { value: 'id', label: 'Indonesia' },
  { value: 'sg', label: 'Singapore' },
  { value: 'my', label: 'Malaysia' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'th', label: 'Thailand' },
  { value: 'ph', label: 'Philippines' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
]

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div className="w-64">
        <ComboBox {...args} value={value} onChange={setValue} />
        <p className="text-subtle text-body-xs mt-2">Selected Value: {value}</p>
      </div>
    )
  },
  args: {
    options: countryOptions,
  },
}

export const WithForm: Story = {
  render: args => (
    <Form
      className="flex flex-col gap-space-md w-64"
      onSubmit={(data: { country: string }) =>
        alert(JSON.stringify(data, null, 2))
      }
      defaultValues={{ country: 'sg' }}
    >
      <Form.Item name="country">
        <ComboBox {...args} />
      </Form.Item>
      <Button type="submit">Submit</Button>
    </Form>
  ),
  args: {
    options: countryOptions,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'id',
  },
}

export const WithError: Story = {
  args: {
    hasError: true,
    value: 'my',
  },
}

export const Playground: Story = {
  render: args => {
    const [value, setValue] = useState(args.defaultValue || '')
    return (
      <div className="w-64">
        <ComboBox
          {...args}
          value={args.value !== undefined ? args.value : value}
          onChange={val => {
            if (args.value === undefined) {
              setValue(val)
            }
            args.onChange?.(val)
          }}
        />
      </div>
    )
  },
  args: {
    options: countryOptions,
  },
}
