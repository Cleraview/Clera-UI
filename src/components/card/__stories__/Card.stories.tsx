import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { Card } from '..'
import { textHeadingSizeMap, textSizeMap } from '../Card'

import AgileImage from '@/assets/images/agile-methodology.jpg'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import {
  elementPaddingKeys,
  elementVariantKeys,
} from '@/components/_core/element-config'
import { Button } from '../../button'

const textHeadingSizeKeys = Object.keys(textHeadingSizeMap)
const textSizeKeys = Object.keys(textSizeMap)

const CenteredDecorator = (Story: React.ComponentType) => (
  <div className="w-full flex justify-center">
    <div className="w-full max-w-[300px]">
      <Story />
    </div>
  </div>
)

const MultiDecorator = (Story: React.ComponentType) => (
  <div className="w-full flex justify-center">
    <div className="w-full max-w-[1200px]">
      <Story />
    </div>
  </div>
)

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
    'badge.spacing': {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Spacing between badge and title/description section',
      table: {
        type: { summary: 'xs | sm | md | lg' },
        defaultValue: { summary: 'xs' },
      },
    },
    titleSpacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Vertical spacing between title and description',
      table: {
        type: { summary: 'xs | sm | md | lg' },
        defaultValue: { summary: 'sm' },
      },
    },
    contentSpacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Gap between badge, title/description, and extended section',
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
    metaLinkLabel: {
      control: 'text',
      description: 'Label for the footer action (link label)',
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
    'badge.variant': {
      control: { type: 'select' },
      options: elementVariantKeys,
      description:
        'Visual style of the badge, reflecting different semantic purposes.',
      table: {
        type: { summary: elementVariantKeys.join(' | ') },
        defaultValue: { summary: 'primary' },
      },
    },
    'badge.size': {
      control: 'select',
      options: elementPaddingKeys,
      description: 'Size of the badge',
      table: {
        type: { summary: elementPaddingKeys.join(' | ') },
        defaultValue: { summary: 'md' },
      },
    },
  },
  args: {
    title: 'Project Report',
    description: 'View all your KPIs and team metrics in one place.',
    roundedSize: 'lg',
    padding: 'sm',
    className: 'gradient-pink',
    link: 'https://google.com',
    thumbnail: 'Agile Image',
    titleSpacing: 'xs',
    paddingAxis: 'y',
    metaItems: [],
    metaLinkLabel: '',
    'badge.spacing': 'sm',
    'textSize.title': 'md',
    'textSize.description': 'sm',
    'textSize.footerAction': 'sm',
    contentSpacing: 'sm',
    'badge.label': 'Agile',
    'badge.size': 'sm',
    'badge.variant': 'ghost',
  },
}

export default meta

type Story = StoryObj<typeof Card>

export const WithImage: Story = {
  args: {
    thumbnail: AgileImage,
    description: 'Real-time metrics with a clear layout.',
    metaItems: ['Product', '28.2025'],
    metaLinkLabel: 'Read more',
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

WithImage.decorators = [MultiDecorator]

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
          <h3 className="text-heading-md text-ds-default font-bold mb-space-xs">
            Custom Title
          </h3>
          <p className="text-body-md text-ds-subtlest">
            This is a custom body. You can place any content you want here.
          </p>
        </Card.Content>
      </Card>
    </div>
  ),
}

export const WithBadge: Story = {
  args: {
    title: 'Card with Badge',
    description: 'Badge highlights this card',
    badge: { label: 'Featured', variant: 'outlinePrimary' },
    padding: 'md',
  },
}

WithBadge.decorators = [CenteredDecorator]

export const WithFooterActionOnly: Story = {
  args: {
    title: 'Footer Action',
    description: 'Card with only footer action and link',
    metaLinkLabel: 'Open',
    link: 'https://example.com',
  },
}

WithFooterActionOnly.decorators = [CenteredDecorator]

export const MetaOnly: Story = {
  args: {
    title: 'Meta Only',
    description: undefined,
    metaItems: ['Category', '2025-12-30'],
    padding: 'lg',
  },
}

MetaOnly.decorators = [CenteredDecorator]

export const RoundedAndShadow: Story = {
  args: {
    title: 'Rounded and Shadow Variants',
    description: 'Different combinations of rounded corners and shadows',
    badge: { label: 'New' },
    padding: 'md',
  },
  render: args => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
      <Card {...args} roundedSize="sm" shadow="none">
        Small / none
      </Card>
      <Card {...args} roundedSize="md" paddingAxis="all" shadow="md">
        Medium / md
      </Card>
      <Card {...args} roundedSize="lg" paddingAxis="all" shadow="xl">
        XL / xl
      </Card>
    </div>
  ),
}

RoundedAndShadow.decorators = [MultiDecorator]

export const TextSizeMatrix: Story = {
  render: _args => (
    <div className="space-y-space-md">
      {Object.keys(textHeadingSizeMap).map(key => (
        <Card
          key={key}
          title={`Heading ${key}`}
          description={`Description with heading ${key}`}
          textSize={{
            title: key as keyof typeof textHeadingSizeMap,
            description: 'md',
            footerAction: 'sm',
          }}
          className="max-w-2xl"
        />
      ))}
    </div>
  ),
}

TextSizeMatrix.decorators = [MultiDecorator]

export const ClickableCard: Story = {
  args: {
    title: 'Clickable card',
    description: 'This card uses the `link` prop',
    link: 'https://example.com',
    metaLinkLabel: 'Go',
  },
}

ClickableCard.decorators = [CenteredDecorator]

export const CustomNode: Story = {
  args: {
    link: null,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-heading-md text-ds-default font-semibold">
          Custom Node Title
        </span>
      </div>
    ),
    extended: (
      <div className="flex items-center gap-1">
        <AiFillStar className="text-ds-primary" />
        <AiFillStar className="text-ds-primary" />
        <AiFillStar className="text-ds-primary" />
        <AiFillStar className="text-ds-primary" />
        <AiOutlineStar className="text-ds-subtlest" />
        <span className="text-body-sm text-ds-subtlest ml-2">4.0 ratings</span>
      </div>
    ),
    description:
      'This card uses a ReactNode for the title and shows extended info below.',
    padding: 'md',
    badge: {
      label: 'Recommended',
      variant: 'primary',
      size: 'sm',
    },
    footer: (
      <div className="mt-space-lg flex justify-between items-center w-full">
        <Button variant="primary" fullWidth>
          Update Now
        </Button>
      </div>
    ),
  },
  render: args => (
    <div className="max-w-xs mx-auto">
      <Card {...args} />
    </div>
  ),
}

CustomNode.decorators = [CenteredDecorator]
