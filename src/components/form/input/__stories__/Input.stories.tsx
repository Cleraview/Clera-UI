import type { Meta, StoryObj } from '@storybook/nextjs-vite'
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
      control: false,
      description:
        'Icon node to render inside the input. Only works with types other than password.',
      table: { type: { summary: 'ReactNode' } },
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
