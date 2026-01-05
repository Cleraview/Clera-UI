import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Dialog from '..'
import { Button } from '@/components/button'
import { Switch } from '@/components/form'

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['dev'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls whether the dialog is open or closed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Sets the dialog width size',
      table: {
        type: { summary: 'sm | md | lg | xl' },
        defaultValue: { summary: 'md' },
      },
    },
    position: {
      control: { type: 'select' },
      options: ['center', 'top', 'bottom'],
      description: 'Sets the position of the dialog on screen',
      table: {
        type: { summary: 'center | top | bottom' },
        defaultValue: { summary: 'center' },
      },
    },
    title: {
      control: 'text',
      description: 'Title text displayed at the top of the dialog',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    description: {
      control: 'text',
      description: 'Description text under the title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button in the dialog header',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    children: {
      control: 'text',
      description: 'Content rendered inside the dialog',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'Dialog content goes here' },
      },
    },
  },
  args: {
    open: false,
    title: 'Dialog Title',
    description: 'This is an example dialog description.',
    size: 'lg',
    position: 'center',
    showCloseButton: true,
    children: '<p>This is a sample dialog content body.</p>',
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  render: args => {
    const [open, setOpen] = useState(args.open)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <div
              className="[&>*]:text-ds-default"
              dangerouslySetInnerHTML={{ __html: args.children }}
            />
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

export const PositionVariants: Story = {
  render: args => {
    const [open, setOpen] = useState(args.open)
    const [position, setPosition] = useState<'center' | 'top' | 'bottom'>(
      'center'
    )

    return (
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <Switch
            checked={position === 'top'}
            onChange={(checked: boolean) =>
              setPosition(checked ? 'top' : 'bottom')
            }
            checkedChildren="Top"
            unCheckedChildren="Bottom"
          />
          <p>Toggle Position</p>
        </div>

        <Button onClick={() => setOpen(true)}>Open Dialog</Button>

        <Dialog
          {...args}
          position={position}
          open={open}
          onOpenChange={setOpen}
        >
          <Dialog.Content>
            <div
              className="[&>*]:text-ds-default"
              dangerouslySetInnerHTML={{ __html: args.children }}
            />
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

export const LargeDialog: Story = {
  render: args => {
    const [open, setOpen] = useState(args.open)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>

        <Dialog {...args} size="lg" open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <div
              className="[&>*]:text-ds-default"
              dangerouslySetInnerHTML={{ __html: args.children }}
            />
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

export const WithFooter: Story = {
  render: args => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>

        <Dialog {...args} open={open} onOpenChange={setOpen} loading={loading}>
          <Dialog.Content>
            <p className="text-body-md text-ds-default">
              This dialog includes a footer with two action buttons.
            </p>
          </Dialog.Content>

          <Dialog.Footer>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => {
                  setLoading(false)
                  setOpen(false)
                }, 3000)
              }}
            >
              Confirm
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    )
  },
}
