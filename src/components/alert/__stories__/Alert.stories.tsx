import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../Alert'
import { AiOutlineInfoCircle, AiFillAccountBook } from 'react-icons/ai'
import { MdDisabledByDefault } from 'react-icons/md'
import { Button } from '@/components/button'
import { sizeMapKeys, variantMapKeys } from '../../_utils/variants'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['dev'],
  args: {
    variant: 'primary',
    icon: 'info',
    size: 'md',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title text of the alert.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    description: {
      control: 'text',
      description:
        'Additional descriptive text providing more details about the alert.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    banner: {
      control: 'boolean',
      description:
        'When true, styles the alert as a banner that spans the full width of its container.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    closable: {
      control: 'boolean',
      description:
        'When true, displays a close button allowing users to dismiss the alert.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    action: {
      control: 'object',
      description:
        'A React node (e.g., a button) to display as an action within the alert.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'null' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Callback function triggered when the alert is dismissed.',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: '() => {}' },
      },
    },
    afterClose: {
      action: 'after closed',
      description:
        'Callback function triggered after the close animation completes.',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: '() => {}' },
      },
    },
    size: {
      control: { type: 'select' },
      options: sizeMapKeys,
      description:
        'Visual size of the alert, reflecting different semantic purposes.',
      table: {
        type: { summary: sizeMapKeys.join(' | ') },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: variantMapKeys,
      description:
        'Visual style of the alert, reflecting different semantic purposes (e.g., primary for main actions, destructive for dangerous actions).',
      table: {
        type: { summary: variantMapKeys.join(' | ') },
        defaultValue: { summary: 'primary' },
      },
    },
    icon: {
      control: { type: 'select' },
      options: ['none', 'info'],
      description: 'Use <code>react-icons</code> as a based lib',
      mapping: {
        none: null,
        info: <AiOutlineInfoCircle />,
      },
      labels: {
        none: 'None',
        user: 'User Icon',
        arrow: 'Arrow Right Icon',
        description: 'Description Icon',
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof Alert>

export const Solid: Story = {
  render: () => {
    return (
      <Alert
        title="This is an alert"
        description="Here is the description text for the alert."
        variant="primary"
        closable
      />
    )
  },
}

export const Success: Story = {
  render: () => {
    return (
      <Alert
        title="Your data has been successfully saved."
        variant="success"
        icon={<AiFillAccountBook />}
        closable
      />
    )
  },
}

export const Warning: Story = {
  render: () => {
    return (
      <Alert
        title="This is an alert"
        description="Here is the description text for the alert."
        variant="warning"
        closable
      />
    )
  },
}

export const Info: Story = {
  render: () => {
    return (
      <Alert
        description={
          <p>
            We just updated our terms and condition,{' '}
            <a href="javascript:void(0);" className="underline font-semibold">
              learn more
            </a>
          </p>
        }
        variant="info"
        closable
      />
    )
  },
}

export const Destructive: Story = {
  render: () => {
    return (
      <Alert
        title="Your account has been disabled"
        variant="destructive"
        icon={<MdDisabledByDefault />}
      />
    )
  },
}

export const WithAction: Story = {
  args: {
    title: 'Action Alert',
    description: 'This alert includes an action button.',
    closable: true,
    action: (
      <Button className="bg-primary-intense-pressed" size="sm">
        Retry
      </Button>
    ),
  },
}

export const Banner: Story = {
  args: {
    title: 'Banner Alert',
    banner: true,
    closable: true,
    variant: 'outlinePrimary',
  },
}
