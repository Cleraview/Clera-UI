import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { Radio } from '../Radio'
import PromoVipIcon from '@/assets/docs/promo-vip.svg'

const meta: Meta<typeof Radio> = {
  title: 'UI/Form/Radio',
  component: Radio,
  tags: ['dev'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label to display next to the radio.',
    },
    value: { control: 'text', description: 'Value of the radio input.' },
    checked: {
      control: 'boolean',
      description: 'Checked state (for controlled examples).',
    },
  },
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof Radio>

export const Default: Story = {
  render: () => {
    const [checkedValue, setCheckedValue] = useState<string | undefined>('one')

    return (
      <div className="flex flex-col gap-space-md">
        <Radio
          label="Option One"
          value="one"
          checked={checkedValue === 'one'}
          onChange={() => setCheckedValue('one')}
        />
        <Radio
          label="Option Two"
          value="two"
          checked={checkedValue === 'two'}
          onChange={() => setCheckedValue('two')}
        />
      </div>
    )
  },
}

export const Uncontrolled: Story = {
  render: () => <Radio label="Standalone Radio" value="standalone" />,
}

export const CustomLabelContent: Story = {
  render: () => {
    const [checkedValue, setCheckedValue] = useState<string | undefined>('vip')

    return (
      <div className="flex flex-col gap-space-md">
        <Radio
          label={
            <div className="flex items-center gap-space-sm">
              <PromoVipIcon aria-label="VIP" className="w-8 h-8" />
              <div>
                <div className="font-semibold">VIP</div>
                <div className="opacity-80">
                  Early access and member-only deals
                </div>
              </div>
            </div>
          }
          value="vip"
          checked={checkedValue === 'vip'}
          onChange={() => setCheckedValue('vip')}
        />
        <Radio
          label="No promotion"
          value="none"
          checked={checkedValue === 'none'}
          onChange={() => setCheckedValue('none')}
        />
      </div>
    )
  },
}
