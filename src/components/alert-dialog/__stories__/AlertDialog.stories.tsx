import type { Meta, StoryObj } from '@storybook/nextjs'
import AlertDialog from '..'
import { Button } from '@/components/button'

const meta: Meta<typeof AlertDialog> = {
  title: 'UI/AlertDialog',
  component: AlertDialog,
  tags: ['dev'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Alert dialog title text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Delete Project' },
      },
    },
    message: {
      control: 'text',
      description: 'Message content displayed in the alert dialog body',
      table: {
        type: { summary: 'string' },
        defaultValue: {
          summary: 'Are you sure you want to delete this project?',
        },
      },
    },
    okText: {
      control: 'text',
      description: 'Label for the confirm button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Confirm' },
      },
    },
    cancelText: {
      control: 'text',
      description: 'Label for the cancel button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Cancel' },
      },
    },
  },
  args: {
    title: 'Delete Project',
    message:
      'Are you sure you want to delete this project? This action cannot be undone.',
    okText: 'Delete',
    cancelText: 'Cancel',
  },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
  render: args => (
    <AlertDialog
      {...args}
      onOk={() =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 1000)
        })
      }
    />
  ),
}

export const WithTriggerButton: Story = {
  render: args => (
    <AlertDialog
      {...args}
      trigger={<Button variant="outline">Open Alert Dialog</Button>}
      onOk={() =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 1000)
        })
      }
    />
  ),
}

export const WithLoadingState: Story = {
  render: args => (
    <AlertDialog
      {...args}
      title="Deleting Project"
      message="This process may take a few seconds. The dialog will be locked during the operation."
      onOk={() =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 3000)
        })
      }
    />
  ),
}

export const PreventCloseDuringLoading: Story = {
  render: args => (
    <AlertDialog
      {...args}
      title="Processing Request"
      message="You cannot close this dialog while the request is being processed."
      onOk={() =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 4000)
        })
      }
    />
  ),
}

export const CustomText: Story = {
  render: args => (
    <AlertDialog
      {...args}
      title="Archive Project"
      message="Archiving will remove this project from active view. You can restore it later."
      okText="Archive"
      cancelText="Back"
      trigger={<Button variant="secondary">Open Custom Alert</Button>}
      onOk={() =>
        new Promise<void>(resolve => {
          setTimeout(resolve, 1500)
        })
      }
    />
  ),
}
