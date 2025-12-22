import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ContextMenu } from '../ContextMenu'
import { FaCopy, FaPaste, FaTrash, FaCog } from 'react-icons/fa'
import { forwardRef, ComponentProps } from 'react'

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/Context Menu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['dev'],
}

export default meta
type Story = StoryObj<typeof ContextMenu>

const TriggerArea = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  (props, ref) => (
    <div
      {...props}
      ref={ref}
      className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed border-ds-default bg-ds-neutral-subtle/20 text-body-sm text-ds-subtle cursor-context-menu"
    >
      Right click here
    </div>
  )
)
TriggerArea.displayName = 'TriggerArea'

export const Default: Story = {
  args: {
    trigger: <TriggerArea />,
    items: [
      { label: 'Back', shortcut: '⌘[' },
      { label: 'Forward', shortcut: '⌘]', disabled: true },
      { label: 'Reload', shortcut: '⌘R' },
      { type: 'separator' },
      { label: 'Save As...', shortcut: '⌘S' },
      { label: 'Print...', shortcut: '⌘P' },
    ],
  },
}

export const WithIconsAndSubmenu: Story = {
  args: {
    trigger: <TriggerArea />,
    items: [
      { label: 'Copy', icon: FaCopy, shortcut: '⌘C' },
      { label: 'Paste', icon: FaPaste, shortcut: '⌘V' },
      { type: 'separator' },
      {
        label: 'More Tools',
        icon: FaCog,
        children: [
          { label: 'Developer Tools' },
          { label: 'Task Manager' },
          {
            label: 'Extensions',
            children: [
              { label: 'Manage Extensions' },
              { label: 'Visit Web Store' },
            ],
          },
        ],
      },
      { type: 'separator' },
      { label: 'Delete', icon: FaTrash, className: 'text-ds-destructive' },
    ],
  },
}

export const CheckboxesAndRadios: Story = {
  render: () => {
    return (
      <ContextMenu
        trigger={<TriggerArea />}
        items={[
          { type: 'label', label: 'View Options' },
          { type: 'checkbox', label: 'Show Status Bar', checked: true },
          { type: 'checkbox', label: 'Show Full Path', checked: false },
          { type: 'separator' },
          { type: 'label', label: 'People' },
          {
            type: 'radio',
            value: 'pedro',
            label: 'Darwin Nunez',
            id: 'pedro',
          },
          {
            type: 'radio',
            value: 'colm',
            label: 'Harry Kane',
            id: 'colm',
          },
        ]}
      />
    )
  },
}
