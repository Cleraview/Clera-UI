import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { FiSearch, FiSmartphone, FiUser } from 'react-icons/fi'
import { MaskedInput } from '../MaskedInput'
import { Select } from '@/components/form/select'
import { Button } from '@/components/button'

const meta: Meta<typeof MaskedInput> = {
  title: 'UI/Form/MaskedInput',
  component: MaskedInput,
  tags: [],
  args: {
    inputSize: 'md',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the input field.',
      table: { type: { summary: 'string' } },
    },
    maskPreset: {
      control: 'select',
      options: ['card16', 'expiryMMYY', 'cvc3', 'phoneUS', 'phoneIntlLite'],
      description: 'Predefined mask patterns for common input types.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    mask: {
      control: 'text',
      description:
        'Custom mask pattern using 0 for digits, A for letters, and * for alphanumeric characters.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
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
    fullWidth: {
      control: 'boolean',
      description:
        'Determines if the input should take up the full width of its container',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    icon: {
      control: false,
      description: 'Icon node to render inside the input',
      table: { type: { summary: 'ReactNode' } },
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the icon relative to the input',
      table: {
        type: { summary: 'left | right' },
        defaultValue: { summary: 'right' },
      },
    },
    inputMode: {
      control: 'select',
      options: ['text', 'numeric', 'tel', 'email', 'url'],
      description:
        'Hints at the type of data that might be entered by the user while editing the element or its contents.',
      table: {
        type: { summary: 'text | numeric | tel | email | url' },
        defaultValue: { summary: 'text' },
      },
    },
    autoComplete: {
      control: 'text',
      description:
        'Indicates whether the value of the control can be automatically completed by the browser.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    rawValue: {
      control: 'text',
      description:
        'The unformatted value of the input, useful for controlled components.',
      table: { type: { summary: 'string' } },
    },
    onRawChange: {
      action: 'rawValue changed',
      description:
        'Callback function that is called when the raw (unformatted) value changes.',
      table: { type: { summary: '(raw: string) => void' } },
    },
    onBlur: {
      action: 'blurred',
      description:
        'Callback function that is called when the input loses focus.',
      table: { type: { summary: '() => void' } },
    },
    maxRawLength: {
      control: 'number',
      description:
        'Maximum length of the raw (unformatted) value. Defaults to mask token capacity if not set.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof MaskedInput>

export const CreditCard: Story = {
  args: {
    iconPosition: 'right',
  },
  render: args => {
    const [raw, setRaw] = useState('4111111111111111')

    const sampleOptions = [
      { value: '411111111111111111111', label: 'Visa — 4111 1111 1111 1111' },
      { value: '5555555555554444', label: 'MasterCard — 5555 5555 5555 4444' },
      { value: '378282246310005', label: 'Amex — 3782 822463 10005' },
      { value: '', label: 'Empty' },
    ]

    return (
      <div className="min-w-[280px] space-y-gap-md">
        <Select
          label="Sample Card"
          options={sampleOptions}
          defaultValue={sampleOptions[0].value}
          onChange={(val: string) => setRaw(val)}
        />

        <MaskedInput
          {...args}
          label="Card Number"
          maskPreset="card16"
          inputMode="numeric"
          autoComplete="cc-number"
          rawValue={raw}
          onRawChange={setRaw}
          readOnly
        />

        <MaskedInput
          {...args}
          label="Card Number"
          maskPreset="card16"
          inputMode="numeric"
          autoComplete="cc-number"
        />
      </div>
    )
  },
}

export const ExpiryDate: Story = {
  args: {
    label: 'Expiry (MM/YY)',
    maskPreset: 'expiryMMYY',
    inputMode: 'numeric',
    autoComplete: 'cc-exp',
  },
}

export const CVCCode: Story = {
  render: args => {
    const [raw, setRaw] = useState('')
    const [visible, setVisible] = useState(false)

    return (
      <div className="min-w-[200px] space-y-2">
        <div className="flex flex-col gap-2">
          <div className="">
            <MaskedInput
              {...args}
              label="CVC"
              maskPreset="cvc3"
              inputMode="numeric"
              autoComplete="cc-csc"
              rawValue={raw}
              onRawChange={setRaw}
              type={visible ? 'text' : 'password'}
            />
          </div>

          <Button
            type="button"
            aria-pressed={visible}
            aria-label={visible ? 'Hide CVC' : 'Show CVC'}
            onClick={() => setVisible(state => !state)}
            fullWidth
          >
            {visible ? 'Hide' : 'Show'}
          </Button>
        </div>

        <p className="text-body-xs text-ds-subtlest">
          Raw: {raw ? raw.replace(/.(?=.{1,}$)/g, '*') : '(empty)'}
        </p>
      </div>
    )
  },
}

export const PhoneUS: Story = {
  args: {
    label: 'Phone',
    maskPreset: 'phoneUS',
    inputMode: 'tel',
    autoComplete: 'tel',
    icon: <FiSmartphone />,
    iconPosition: 'left',
  },
}

export const WithIconLeft: Story = {
  render: args => (
    <MaskedInput
      {...args}
      label="Phone"
      maskPreset="phoneUS"
      inputMode="tel"
      icon={<FiSearch />}
      iconPosition="left"
    />
  ),
}

export const WithIconRight: Story = {
  render: args => (
    <MaskedInput
      {...args}
      label="Phone"
      maskPreset="phoneUS"
      inputMode="tel"
      icon={<FiUser />}
      iconPosition="right"
    />
  ),
}

export const ControlledExample: Story = {
  render: () => {
    const [raw, setRaw] = useState('')
    return (
      <div className="max-w-sm space-y-4">
        <MaskedInput
          label="Card Number"
          maskPreset="card16"
          rawValue={raw}
          onRawChange={setRaw}
        />
        <p className="text-body-xs text-ds-subtlest">Raw: {raw}</p>
      </div>
    )
  },
}
