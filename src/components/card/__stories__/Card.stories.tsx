import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from '..'
import { textHeadingSizeMap, textSizeMap } from '../Card'

import AgileImage from '@/assets/images/agile-methodology.jpg'
import { sizeMapKeys } from '../../_utils/variants'

const textHeadingSizeKeys = Object.keys(textHeadingSizeMap)
const textSizeKeys = Object.keys(textSizeMap)

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['dev'],
  parameters: {
    actions: { disable: true },
    deepControls: {
      enabled: true,
    },
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    thumbnail: {
      control: 'select',
      options: ['Agile Image'],
      mapping: {
        'Agile Image': AgileImage,
      },
      description: 'Image to display as a thumbnail',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'string' },
      },
    },
    roundedSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Corner rounding of the card and thumbnail',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'lg' },
      },
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Shadow depth of the card',
      table: {
        type: { summary: 'none | sm | md | lg | xl' },
        defaultValue: { summary: 'none' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Padding size within the card',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'lg' },
      },
    },
    paddingAxis: {
      control: 'radio',
      options: ['all', 'y'],
      description: 'Axis for applying content padding',
      table: {
        type: { summary: "'all' | 'y'" },
        defaultValue: { summary: 'all' },
      },
    },
    contentSpacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Spacing between content elements inside the card',
      table: {
        type: { summary: 'xs | sm | md | lg' },
        defaultValue: { summary: 'sm' },
      },
    },
    link: {
      control: 'text',
      description: 'Link URL for the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    metaItems: {
      control: 'object',
      description: 'Array of meta items to display',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    footerActionLabel: {
      control: 'text',
      description: 'Label for the footer action',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    'textSize.title': {
      control: 'select',
      options: textHeadingSizeKeys,
      description: 'Text size for the title',
      table: {
        type: { summary: textHeadingSizeKeys.join(' | ') },
        defaultValue: { summary: 'xl' },
      },
    },
    'textSize.description': {
      control: 'select',
      options: textSizeKeys,
      description: 'Text size for the description',
      table: {
        type: { summary: textSizeKeys.join(' | ') },
        defaultValue: { summary: 'md' },
      },
    },
    'textSize.footerAction': {
      control: 'select',
      options: textSizeKeys,
      description: 'Text size for the footer action',
      table: {
        type: { summary: textSizeKeys.join(' | ') },
        defaultValue: { summary: 'md' },
      },
    },
    'badge.label': {
      control: 'text',
      description: 'Label for the badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    'badge.size': {
      control: 'select',
      options: sizeMapKeys,
      description: 'Size of the badge',
      table: {
        type: { summary: sizeMapKeys.join(' | ') },
        defaultValue: { summary: 'md' },
      },
    },
  },
  args: {
    title: 'Project Report',
    description: 'View all your KPIs and team metrics in one place.',
    roundedSize: 'lg',
    padding: 'lg',
    className: 'gradient-pink',
    link: 'https://google.com',
    thumbnail: 'Agile Image',
    paddingAxis: 'y',
    metaItems: [],
    footerActionLabel: '',
    'textSize.title': 'xl',
    'textSize.description': 'md',
    'textSize.footerAction': 'sm',
    'badge.label': 'Agile',
    'badge.size': 'md',
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const Playground: Story = {}

export const WithImage: Story = {
  args: {
    thumbnail: AgileImage,
    description: 'Real-time metrics with a clear layout.',
    metaItems: ['Product', '28.2025'],
    footerActionLabel: 'Read more',
  },
  render: args => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <Card {...args} />
        <Card {...args} />
        <Card {...args} />
      </div>
    )
  },
}

export const WithCustomContent: Story = {
  args: {
    title: undefined,
    description: undefined,
    roundedSize: 'lg',
    padding: 'md',
    paddingAxis: 'all',
    className: 'bg-ds-elevation-surface',
    shadow: 'md',
  },
  render: args => (
    <div className="max-w-xs mx-auto">
      <Card {...args}>
        <Card.Content>
          <h3 className="text-heading-xl font-bold mb-2">Custom Title</h3>
          <p className="text-ds-subtlest">
            This is a custom body. You can place any content you want here.
          </p>
        </Card.Content>
      </Card>
    </div>
  ),
}
