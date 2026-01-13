import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
      description: 'Label for the combobox input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Country' },
      },
    },
    options: {
      control: 'object',
      description: 'Options for the combobox input.',
      table: {
        type: { summary: 'ComboBoxOption[]' },
        defaultValue: { summary: '[]' },
      },
    },
    value: {
      control: 'text',
      description: 'The current value of the combobox (controlled).',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The initial value of the combobox (uncontrolled).',
      table: {
        type: { summary: 'string' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value is selected.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Select a country...' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Determines if the combobox should take up the full width.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Determines if the combobox is required.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the combobox.',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Determines if the combobox is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Determines if the combobox is read-only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasError: {
      control: 'boolean',
      description: 'Determines if the combobox has an error.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
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
  decorators: [Story => <div className="min-w-[200px]">{Story()}</div>],
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
        <p className="text-ds-subtle text-body-xs mt-2">
          Selected Value: {value}
        </p>
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
  render: args => {
    const [value, setValue] = useState(args.value ?? 'my')
    return (
      <div className="w-64">
        <ComboBox {...args} value={value} onChange={setValue} />
        <p className="text-ds-subtle text-body-xs mt-space-md">
          Selected Value: {value}
        </p>
      </div>
    )
  },
  args: {
    hasError: true,
    value: 'my',
  },
}

export const Grouped: Story = {
  render: args => {
    const [value, setValue] = useState('')
    const groupedRecord: Record<string, ComboBoxOption[]> = {
      Asia: [
        { value: 'id', label: 'Indonesia' },
        { value: 'sg', label: 'Singapore' },
      ],
      'North America': [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
      ],
      Europe: [
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Germany' },
      ],
    }

    const optionsFromGroups: ComboBoxOption[] = Object.entries(
      groupedRecord
    ).flatMap(([group, items]) => items.map(item => ({ ...item, group })))

    return (
      <div className="w-64">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
          options={optionsFromGroups}
          groupBy="group"
        />
        <p className="text-ds-subtle text-body-xs mt-space-md">
          Selected Value: {value}
        </p>
      </div>
    )
  },
  args: {
    label: 'Select a country',
    placeholder: 'Search...',
  },
}

export const WithDisabledItems: Story = {
  render: args => {
    const [value, setValue] = useState('')
    const optionsWithDisabled: ComboBoxOption[] = [
      { value: 'id', label: 'Indonesia' },
      { value: 'sg', label: 'Singapore', disabled: true },
      { value: 'my', label: 'Malaysia' },
      { value: 'vn', label: 'Vietnam', disabled: true },
      { value: 'th', label: 'Thailand' },
    ]

    return (
      <div className="w-64">
        <ComboBox
          {...args}
          value={value}
          onChange={setValue}
          options={optionsWithDisabled}
        />
        <p className="text-ds-subtle text-body-xs mt-2">
          Selected Value: {value}
        </p>
      </div>
    )
  },
  args: {
    label: 'Select a country',
    placeholder: 'Search...',
  },
}
