import type { Meta, StoryObj } from '@storybook/nextjs'
import { BarChart } from '../BarChart'

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['dev', 'status:new'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Controls label/value typography scale.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    showValues: {
      control: 'boolean',
      description: 'Show the numeric value at the right of each row.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    max: {
      control: 'number',
      description:
        'Override the max value used to scale bar widths. Defaults to the largest value in `data`.',
      table: { type: { summary: 'number' } },
    },
    data: {
      control: 'object',
      description: 'Array of `{ label, value, variant? }` datums.',
      table: { type: { summary: 'BarChartDatum[]' } },
    },
  },
  args: {
    size: 'md',
    showValues: true,
    data: [
      { label: 'Mobile', value: 482 },
      { label: 'Desktop', value: 318 },
      { label: 'Tablet', value: 117 },
      { label: 'Other', value: 41 },
    ],
  },
}

export default meta

type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  render: args => (
    <div className="w-[420px]">
      <BarChart {...args} />
    </div>
  ),
}

export const Variants: Story = {
  render: args => (
    <div className="w-[420px]">
      <BarChart
        {...args}
        data={[
          { label: 'Primary', value: 920, variant: 'primary' },
          { label: 'Success', value: 720, variant: 'success' },
          { label: 'Info', value: 540, variant: 'info' },
          { label: 'Warning', value: 360, variant: 'warning' },
          { label: 'Destructive', value: 180, variant: 'destructive' },
        ]}
      />
    </div>
  ),
}

export const FormattedValues: Story = {
  render: args => (
    <div className="w-[420px]">
      <BarChart
        {...args}
        formatValue={v => `$${(v / 1000).toFixed(1)}k`}
        data={[
          { label: 'Q1', value: 12400, variant: 'success' },
          { label: 'Q2', value: 18200, variant: 'success' },
          { label: 'Q3', value: 9800, variant: 'warning' },
          { label: 'Q4', value: 21500, variant: 'success' },
        ]}
      />
    </div>
  ),
}

export const WithoutValues: Story = {
  args: { showValues: false },
  render: args => (
    <div className="w-[420px]">
      <BarChart {...args} />
    </div>
  ),
}
