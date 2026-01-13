import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Input } from '../Input'
import { FiSearch, FiUser } from 'react-icons/fi'

const meta: Meta<typeof Input> = {
  title: 'UI/Form/Input',
  component: Input,
  tags: [],
  parameters: {},
  argTypes: {
    fullWidth: {
      control: 'boolean',
      type: 'boolean',
      description:
        'Determines if the input should take up the full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'search'],
      description: 'The type of input',
      table: {
        type: { summary: 'text | password | number | search' },
        defaultValue: { summary: 'text' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Determines if the input is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Determines if the input is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Determines if the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasError: {
      control: 'boolean',
      description: 'Determines if the input has an error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'The label for the input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    icon: {
      control: 'select',
      description:
        'Icon node to render inside the input. Only works with types other than password.',
      table: { type: { summary: 'ReactNode' } },
      options: ['search', 'user'],
      mapping: {
        search: <FiSearch />,
        user: <FiUser />,
      },
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description:
        'Position of the icon relative to the input. Only works with types other than password (password always uses right position for visibility toggle).',
      table: {
        type: { summary: 'left | right' },
        defaultValue: { summary: 'left' },
      },
    },
  },
  args: {
    label: 'Label',
    type: 'text',
    inputSize: 'md',
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Text: Story = {
  args: {
    type: 'text',
    label: 'Make this your text input overflowing to see how it behaves',
  },
  decorators: [
    StoryComponent => (
      <div style={{ width: '280px' }}>
        <StoryComponent />
      </div>
    ),
  ],
}

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    label: 'Number',
    icon: <FiUser />,
    iconPosition: 'right',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    label: 'Search',
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: 'Full Width',
  },
  decorators: [
    StoryComponent => (
      <div style={{ width: '400px' }}>
        <StoryComponent />
      </div>
    ),
  ],
}

export const Required: Story = {
  args: {
    required: true,
    label: 'Required',
  },
}

export const Small: Story = {
  args: {
    inputSize: 'sm',
    label: 'Small',
  },
}

export const Medium: Story = {
  args: {
    inputSize: 'md',
    label: 'Medium',
  },
}

export const Large: Story = {
  args: {
    inputSize: 'lg',
    label: 'Large',
  },
}

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    label: 'Read Only',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled',
  },
}

export const WithIconLeft: Story = {
  args: {
    icon: <FiSearch />,
    iconPosition: 'left' as 'left' | 'right',
    label: 'Search',
  },
  render: args => <Input {...args} />,
}

export const WithIconRight: Story = {
  args: {
    icon: <FiUser />,
    iconPosition: 'right' as 'left' | 'right',
    label: 'Lorem ipsum dolor sit amet consectetur adipisicing',
  },
  render: args => <Input {...args} />,
  decorators: [
    StoryComponent => (
      <div style={{ maxWidth: '300px' }}>
        <StoryComponent />
      </div>
    ),
  ],
}

export const WithValidation: Story = {
  args: {
    label: 'Email Address',
    validationPreset: 'email',
    validationMode: 'onChange',
    showValidationErrors: true,
  },
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <p className="mt-space-md text-label-xs text-ds-subtle">
          Current value: &quot;{value}&quot;
        </p>
        <p className="mt-space-sm text-label-xs text-ds-info">
          Format: Valid email address (e.g., user@example.com)
        </p>
      </div>
    )
  },
}

export const NumericValidation: Story = {
  args: {
    label: 'Age',
    validation: {
      pattern: 'numeric',
      min: 18,
      max: 120,
      required: true,
      preventInvalidInput: true,
    },
    validationMode: 'onChange',
    showValidationErrors: true,
  },
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <p className="mt-space-md text-label-xs text-ds-subtle">
          Current value: &quot;{value}&quot;
        </p>
        <p className="mt-space-sm text-label-xs text-ds-info">
          Format: Numbers only (18-120) • Prevents non-numeric input
        </p>
      </div>
    )
  },
}

export const UsernameValidation: Story = {
  args: {
    label: 'Username',
    validationPreset: 'username',
    validationMode: 'all',
    showValidationErrors: true,
  },
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <p className="mt-2 text-label-xs text-ds-subtle">
          Current value: &quot;{value}&quot;
        </p>
        <p className="mt-space-sm text-label-xs text-ds-info">
          Format: 3-20 characters, letters, numbers, underscore, hyphen
        </p>
      </div>
    )
  },
}

export const CustomValidation: Story = {
  args: {
    label: 'Product Code',
    validation: {
      pattern: /^[A-Z]{2}\d{4}$/,
      patternMessage:
        'Product code must be 2 uppercase letters followed by 4 digits (e.g., AB1234)',
      required: true,
      rules: [
        {
          validate: (value: string) =>
            value !== 'XX0000' || 'This code is reserved',
          message: 'This product code is reserved',
        },
      ],
    },
    validationMode: 'onBlur',
    showValidationErrors: true,
  },
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <p className="mt-2 text-label-xs text-ds-subtle">
          Current value: &quot;{value}&quot;
        </p>
        <p className="mt-space-sm text-label-xs text-ds-info">
          Format: 2 uppercase letters + 4 digits (e.g., AB1234) • Custom regex
          pattern
        </p>
      </div>
    )
  },
}

export const AdvancedValidation: Story = {
  args: {
    label: 'Phone Number',
    validation: {
      pattern: /^[\d\s\-\(\)\+]*$/,
      required: true,
      transform: (value: string) => value.replace(/[^\d\-\(\)\s\+]/g, ''),
      preventInvalidInput: true,
      rules: [
        {
          validate: (value: string) => {
            if (value.replace(/[\s\-\(\)\+]/g, '').length >= 10) {
              return /^(\+1)?[\s-]?\(?([0-9]{3})\)?[\s-]?([0-9]{3})[\s-]?([0-9]{4})$/.test(
                value
              )
            }
            return true
          },
          message:
            'Please enter a valid US phone number (e.g., (555) 123-4567)',
        },
      ],
    },
    validationMode: 'onBlur',
    showValidationErrors: true,
  },
  render: args => {
    const [value, setValue] = useState('')
    return (
      <div>
        <Input
          {...args}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <p className="mt-2 text-label-xs text-ds-subtle">
          Current value: &quot;{value}&quot;
        </p>
        <p className="mt-space-sm text-label-xs text-ds-info">
          Format: Only phone chars allowed • Typing + paste validation •
          Validates complete format
        </p>
      </div>
    )
  },
}
