import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md'
import { Toast } from '../Toast'
import { Button } from '@/components/button'
import { elementVariantKeys } from '@/components/_core/element-config'
import {
  customToast as toast,
  SonnerToaster,
  type ToastPosition,
} from '@/components/toast'
import { createElement, useState } from 'react'
import { Toaster as SonnerRawToaster, toast as sonnerRawToast } from 'sonner'

const positionOptions: ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

type ToastStoryArgs = React.ComponentProps<typeof Toast> & {
  position?: ToastPosition
}

const meta: Meta<ToastStoryArgs> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: elementVariantKeys,
      description:
        'Visual style of the toast, reflecting different semantic purposes (e.g., primary for default, success for confirmations, destructive for errors).',
      table: {
        type: { summary: elementVariantKeys.join(' | ') },
        defaultValue: { summary: 'primary' },
      },
    },
    rounded: {
      control: { type: 'radio' },
      options: ['none', 'sm', 'md', 'full'],
      description:
        'Controls the border radius of the toast for square, subtle rounding, or fully pill-shaped containers.',
      table: {
        type: { summary: "'none' | 'sm' | 'md' | 'full'" },
        defaultValue: { summary: 'md' },
      },
    },
    title: {
      control: 'text',
      description: 'Primary heading text of the toast.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '-' },
      },
    },
    description: {
      control: 'text',
      description: 'Secondary message rendered below the title.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '-' },
      },
    },
    icon: {
      control: { type: 'select' },
      options: ['none', 'info', 'success', 'error'],
      mapping: {
        none: null,
        info: <AiOutlineInfoCircle />,
        success: <MdCheckCircle />,
        error: <MdErrorOutline />,
      },
      labels: {
        none: 'None',
        info: 'Info Icon',
        success: 'Success Icon',
        error: 'Error Icon',
      },
      description: 'Optional icon displayed at the start of the toast.',
      table: {
        type: { summary: 'ReactNode | null' },
        defaultValue: { summary: 'null' },
      },
    },
    action: {
      control: false,
      description:
        'Optional action element (typically a button) rendered below the description.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '-' },
      },
    },
    closable: {
      control: 'boolean',
      description:
        'When true, renders a close button that dismisses the toast.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClose: {
      action: 'closed',
      description: 'Event handler triggered when the close button is clicked.',
      table: {
        type: { summary: '(e: MouseEvent) => void' },
      },
    },
    afterClose: {
      action: 'afterClose',
      description: 'Callback invoked after the toast close transition ends.',
      table: {
        type: { summary: '() => void' },
      },
    },
    className: {
      control: 'text',
      description: 'Custom class name applied to the toast root element.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    position: {
      control: { type: 'select' },
      options: positionOptions,
      description:
        'Screen placement of the toast (top/bottom × left/center/right).',
      table: {
        type: { summary: positionOptions.join(' | ') },
        defaultValue: { summary: 'bottom-right' },
      },
    },
  },
  args: {
    variant: 'primary',
    rounded: 'md',
    title: 'Notification',
    description: 'Something just happened. Check it out.',
    closable: false,
    position: 'bottom-right',
    onClose: action('Toast closed'),
  },
}

export default meta

type Story = StoryObj<ToastStoryArgs>

export const Default: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Something just happened. Check it out', {
            duration: 5000,
            position: args.position,
            variant: args.variant,
            closable: args.closable,
          })
        }
      >
        Show Notification
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const Success: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Saved', {
            description: 'Your changes have been saved.',
            variant: 'success',
            position: args.position,
            closable: false,
          })
        }
      >
        Show Success
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const Destructive: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Failed', {
            description: 'We could not save your changes.',
            variant: 'destructive',
            position: args.position,
          })
        }
      >
        Show Error
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const WithIcon: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Heads up', {
            description: 'This message includes an icon.',
            icon: <AiOutlineInfoCircle />,
            position: args.position,
          })
        }
      >
        Show With Icon
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const WithAction: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('New update available', {
            description: 'Restart the app to get the latest features.',
            position: args.position,
            action: {
              label: 'Restart',
              variant: 'primary',
              onClick: () => console.log('Restart'),
            },
          })
        }
      >
        Show With Action
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const MultipleActions: Story = {
  render: args => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Unsaved changes', {
            description: 'You have edits that have not been saved yet.',
            position: args.position,
            action: [
              {
                label: 'Save',
                variant: 'light',
                onClick: () => console.log('Save'),
              },
              {
                label: 'Discard',
                variant: 'secondary',
                onClick: () => console.log('Discard'),
              },
            ],
          })
        }
      >
        Show Multiple Actions
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const ActionPlacement: Story = {
  render: args => (
    <div className="flex flex-wrap gap-space-sm">
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Saved', {
            description: 'Default placement — action below content.',
            position: args.position,
            actionPlacement: 'bottom',
            action: { label: 'Undo', variant: 'primary' },
          })
        }
      >
        Bottom (default)
      </Button>
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('Connection lost', {
            description: 'Action sits on the left with a divider.',
            position: args.position,
            actionPlacement: 'left',
            action: { label: 'Retry', variant: 'primary' },
          })
        }
      >
        Left placement
      </Button>
      <Button
        variant="outlineLight"
        onClick={() =>
          toast('New message', {
            description: 'Action sits on the right with a divider.',
            position: args.position,
            actionPlacement: 'right',
            action: [{ label: 'Open', variant: 'primary' }, { label: 'Mute' }],
          })
        }
      >
        Right placement
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

const AsyncActionDemo: React.FC<{ position?: ToastPosition }> = ({
  position,
}) => {
  const [savingLoading, setSavingLoading] = useState(false)
  const [publishLoading, setPublishLoading] = useState(false)

  const triggerSave = () =>
    toast('Save changes?', {
      description: 'Click "Save" to persist your edits.',
      position,
      action: {
        label: 'Save',
        onClick: async () => {
          setSavingLoading(true)
          try {
            await new Promise(resolve => setTimeout(resolve, 1500))
          } finally {
            setSavingLoading(false)
          }
        },
        loading: {
          title: 'Saving…',
          description: 'Hang tight while we sync your changes.',
        },
        success: {
          title: 'Saved',
          description: 'Your changes have been saved.',
        },
        error: {
          title: 'Save failed',
          description: 'We could not save your changes.',
        },
      },
    })

  const triggerPublish = () =>
    toast('Publish post?', {
      description: 'This will push your draft live.',
      position,
      action: {
        label: 'Publish',
        onClick: async () => {
          setPublishLoading(true)
          try {
            await new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Network error')), 1500)
            )
          } finally {
            setPublishLoading(false)
          }
        },
        loading: {
          title: 'Publishing…',
          description: 'Pushing your draft to production.',
        },
        success: {
          title: 'Published',
          description: 'Your post is now live.',
        },
        error: (err: unknown) => ({
          title: 'Publish failed',
          description:
            err instanceof Error ? err.message : 'Something went wrong.',
        }),
      },
    })

  return (
    <div className="flex gap-space-sm">
      <Button variant="secondary" loading={savingLoading} onClick={triggerSave}>
        Async Action (resolves)
      </Button>
      <Button
        variant="outlineLight"
        loading={publishLoading}
        onClick={triggerPublish}
      >
        Async Action (rejects)
      </Button>
      <SonnerToaster position={position} />
    </div>
  )
}

export const WithAsyncAction: Story = {
  render: args => <AsyncActionDemo position={args.position} />,
}

export const Stacked: Story = {
  render: args => (
    <div className="flex flex-col gap-space-sm">
      <Button
        variant="outlineLight"
        onClick={() => {
          toast('Upload started', {
            description: 'We are preparing your files.',
            position: args.position,
          })
          setTimeout(
            () =>
              toast('Upload complete', {
                description: 'All files are synced.',
                position: args.position,
              }),
            1000
          )
        }}
      >
        Trigger Upload Flow
      </Button>
      <SonnerToaster position={args.position} />
    </div>
  ),
}

export const SonnerDemo: Story = {
  render: () => (
    <div className="space-y-4">
      <Button
        variant="outlineLight"
        onClick={() =>
          sonnerRawToast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </Button>

      {createElement(SonnerRawToaster, { richColors: false })}
    </div>
  ),
}
