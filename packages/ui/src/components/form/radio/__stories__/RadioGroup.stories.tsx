import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { RadioGroup } from '../RadioGroup'
import { Radio } from '../Radio'
import PromoSaleIcon from '@/assets/docs/promo-sale.svg'
import PromoVipIcon from '@/assets/docs/promo-vip.svg'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/Form/RadioGroup',
  component: RadioGroup,
  tags: ['dev'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value in the radio group.',
      table: { type: { summary: 'string' } },
    },
    onChange: {
      action: 'value changed',
      description:
        'Callback function that is called when the selected value changes.',
      table: { type: { summary: 'function' } },
    },
    name: {
      control: 'text',
      description:
        'The name attribute for the radio inputs, used for form submission.',
      table: { type: { summary: 'string' } },
    },
    layout: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction for the radio group.',
      table: {
        type: { summary: 'vertical | horizontal' },
        defaultValue: { summary: 'vertical' },
      },
    },
    gap: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Gap size between radio buttons.',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    className: {
      control: 'text',
      description:
        'Additional CSS classes to apply to the radio group container.',
      table: { type: { summary: 'string' } },
    },
    options: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    layout: 'vertical',
    gap: 'md',
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('monthly')

    return (
      <RadioGroup value={value} onChange={setValue} name="billingCycle">
        <Radio label="Monthly" value="monthly" />
        <Radio label="Yearly" value="yearly" />
        <Radio label="Lifetime" value="lifetime" />
      </RadioGroup>
    )
  },
}

export const WithOptions: Story = {
  render: () => {
    const [value, setValue] = useState('monthly')

    const options = [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' },
      { label: 'Lifetime', value: 'lifetime' },
    ]

    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        name="billingCycle"
        options={options}
      />
    )
  },
}

export const GroupsWithTitles: Story = {
  render: args => {
    const [paymentPlan, setPaymentPlan] = useState('monthly')
    const [shippingMethod, setShippingMethod] = useState('standard')
    const [promotion, setPromotion] = useState('none')

    const paymentOptions = [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' },
      { label: 'One-time', value: 'one_time' },
    ]

    const shippingOptions = [
      { label: 'Standard', value: 'standard' },
      { label: 'Express', value: 'express' },
      { label: 'Overnight', value: 'overnight', disabled: true },
    ]

    const promoOptions = [
      { label: 'No Promotion', value: 'none' },
      {
        label: (
          <div className="flex items-center gap-space-sm">
            <PromoSaleIcon aria-label="Sale" className="w-8 h-8" />
            <span>Sale — 20% off</span>
          </div>
        ),
        value: 'sale',
      },
      {
        label: (
          <div className="flex items-center gap-space-sm">
            <PromoVipIcon aria-label="Exclusive" className="w-8 h-8" />
            <span>Exclusive Offer</span>
          </div>
        ),
        value: 'exclusive',
        disabled: true,
      },
    ]

    return (
      <div className="flex flex-col gap-space-md">
        <div>
          <h3 className="mb-space-sm text-heading-sm text-ds-default">
            Payment Plan
          </h3>
          <RadioGroup
            layout="horizontal"
            gap={args.gap}
            value={paymentPlan}
            onChange={setPaymentPlan}
            name="billingPlan"
            options={paymentOptions}
          />
        </div>
        <div>
          <h3 className="mb-space-sm text-heading-sm text-ds-default">
            Shipping Method
          </h3>
          <RadioGroup
            layout={args.layout}
            gap={args.gap}
            value={shippingMethod}
            onChange={setShippingMethod}
            name="shippingMethod"
            options={shippingOptions}
          />
        </div>
        <div>
          <h3 className="mb-space-sm text-heading-sm text-ds-default">
            Promotions
          </h3>
          <RadioGroup
            layout={args.layout}
            gap={args.gap}
            value={promotion}
            onChange={setPromotion}
            name="promotion"
            options={promoOptions}
          />
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
          import { useState } from 'react'
          import { RadioGroup } from '@clera-ui/form'
          import PromoSaleIcon from '@/assets/docs/promo-sale.svg'
          import PromoVipIcon from '@/assets/docs/promo-vip.svg'

          export const Example = () => {
            const [paymentPlan, setPaymentPlan] = useState('monthly')
            const [shippingMethod, setShippingMethod] = useState('standard')
            const [promotion, setPromotion] = useState('none')

            const paymentOptions = [
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly', value: 'yearly' },
              { label: 'One-time', value: 'one_time' },
            ]

            const shippingOptions = [
              { label: 'Standard', value: 'standard' },
              { label: 'Express', value: 'express' },
              { label: 'Overnight', value: 'overnight' },
            ]

            const promoOptions = [
              { label: 'No Promotion', value: 'none' },
              {
                label: (
                  <div className="flex items-center gap-space-sm">
                    <PromoSaleIcon aria-label="Sale" className="w-8 h-8" />
                    <span>Sale — 20% off</span>
                  </div>
                ),
                value: 'sale',
              },
              {
                label: (
                  <div className="flex items-center gap-space-sm">
                    <PromoVipIcon aria-label="Exclusive" className="w-8 h-8" />
                    <span>Exclusive Offer</span>
                  </div>
                ),
                value: 'exclusive',
              },
            ]

            return (
              <div className="flex flex-col gap-space-md">
                <div>
                  <h3 className="mb-space-sm text-heading-sm text-ds-default">Payment Plan</h3>
                  <RadioGroup value={paymentPlan} onChange={setPaymentPlan} name="billingPlan" options={paymentOptions} />
                </div>
                <div>
                  <h3 className="mb-space-sm text-heading-sm text-ds-default">Shipping Method</h3>
                  <RadioGroup value={shippingMethod} onChange={setShippingMethod} name="shippingMethod" options={shippingOptions} />
                </div>
                <div>
                  <h3 className="mb-space-sm text-heading-sm text-ds-default">Promotions</h3>
                  <RadioGroup value={promotion} onChange={setPromotion} name="promotion" options={promoOptions} />
                </div>
              </div>
            )
          }`,
      },
    },
  },
}
