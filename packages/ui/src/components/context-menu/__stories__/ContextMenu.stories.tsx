import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React, { useState, forwardRef, ComponentProps } from 'react'
import { ContextMenu } from '../ContextMenu'
import type { ContextMenuItemDef } from '../types'
import { FaPaste, FaTrash, FaCog } from 'react-icons/fa'

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/Context Menu',
  component: ContextMenu,
  tags: [],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: {
      control: { type: 'number' },
      description: 'Width of the context menu in pixels.',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: '240' },
      },
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether the menu closes after selecting an item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional className applied to the menu container.',
      table: { type: { summary: 'string' } },
    },
    items: {
      control: 'object',
      description: 'Array of menu item descriptors used to build the menu.',
      table: { type: { summary: 'ContextMenuItemDef[]' } },
    },
    onSelect: {
      action: 'onSelect',
      description: 'Item select handler',
      table: {
        type: { summary: '(value: string, item?: ContextMenuItemDef) => void' },
      },
    },
    onCheckboxToggle: {
      action: 'onCheckboxToggle',
      description: 'Checkbox toggle handler',
      table: { type: { summary: '(value: string, checked: boolean) => void' } },
    },
    onRadioSelect: {
      action: 'onRadioSelect',
      description: 'Radio select handler',
      table: { type: { summary: '(value: string) => void' } },
    },
    onGroupSelect: {
      action: 'onGroupSelect',
      description: 'Group select handler',
      table: {
        type: {
          summary:
            '(groupId: string, value: string, item?: ContextMenuItemDef) => void',
        },
      },
    },
    onOpenChange: {
      action: 'onOpenChange',
      description: 'Open state change handler',
      table: { type: { summary: '(open: boolean) => void' } },
    },
    trigger: {
      control: false,
      description: 'Trigger node that opens the context menu (ReactNode).',
      table: { type: { summary: 'ReactNode' } },
    },
  },
  args: {
    width: 240,
    closeOnSelect: true,
  },
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
  render: args => {
    const [selectedLabel, setSelectedLabel] = React.useState<string>('none')

    const baseItems: ContextMenuItemDef[] = [
      { label: 'Back', shortcut: '⌘[', value: 'back' },
      { label: 'Forward', shortcut: '⌘]', disabled: true, value: 'forward' },
      { label: 'Reload', shortcut: '⌘R', value: 'reload' },
      { type: 'separator' },
      { label: 'Save As...', shortcut: '⌘S', value: 'save-as' },
      { label: 'Print...', shortcut: '⌘P', value: 'print' },
    ]

    const items = (args.items as ContextMenuItemDef[] | undefined) ?? baseItems
    const trigger = args.trigger ?? <TriggerArea />

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-body-sm text-ds-subtle">
          <strong>Selected:</strong> {selectedLabel}
        </div>
        <ContextMenu
          trigger={trigger}
          items={items}
          width={args.width}
          closeOnSelect={args.closeOnSelect}
          onSelect={(value: string, item) => {
            args.onSelect?.(value, item)
            setSelectedLabel(item?.label ?? value)
          }}
        />
      </div>
    )
  },
}

export const WithIconsAndSubmenu: Story = {
  render: args => {
    const [selectedLabel, setSelectedLabel] = React.useState<string>('none')

    const defaultItems: ContextMenuItemDef[] = [
      { label: 'Back', shortcut: '⌘[', value: 'back' },
      { label: 'Reload', shortcut: '⌘R', value: 'reload' },
      { type: 'separator' },
      { label: 'Paste', icon: FaPaste, shortcut: '⌘V', value: 'paste' },
      { type: 'separator' },
      {
        label: 'More Tools',
        icon: FaCog,
        children: [
          { label: 'Developer Tools', value: 'devtools' },
          { label: 'Task Manager', value: 'task-manager' },
          {
            label: 'Extensions',
            children: [
              { label: 'Manage Extensions', value: 'manage-extensions' },
              { label: 'Visit Web Store', value: 'visit-web-store' },
            ],
          },
        ],
      },
      { type: 'separator' },
      {
        label: 'Delete',
        icon: FaTrash,
        value: 'delete',
        className:
          'text-label-sm text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive! focus:bg-ds-destructive! focus:text-ds-destructive',
      },
    ] as const

    const items =
      (args.items as ContextMenuItemDef[] | undefined) ?? defaultItems
    const trigger = args.trigger ?? <TriggerArea />

    return (
      <div className="flex flex-col items-center gap-space-md">
        <div className="text-body-sm text-ds-subtle">
          <strong>Selected:</strong> {selectedLabel}
        </div>
        <ContextMenu
          trigger={trigger}
          items={items}
          width={args.width}
          closeOnSelect={args.closeOnSelect}
          onSelect={(value: string, item) => {
            args.onSelect?.(value, item)
            console.log('Selected item:', { value, item })
            setSelectedLabel(item?.label ?? value)
          }}
        />
      </div>
    )
  },
}

export const CheckboxesAndRadios: Story = {
  render: args => {
    const [selectedItems, setSelectedItems] = useState<string[]>([
      'status',
      'toolbar',
      'grid',
    ])
    const [person, setPerson] = useState('pedro')

    const toggleSelected = (value: string, checked: boolean) => {
      setSelectedItems(prev => {
        if (checked) {
          return prev.includes(value) ? prev : [...prev, value]
        }

        return prev.filter(v => v !== value)
      })
    }

    return (
      <div className="flex flex-col items-center gap-space-md">
        <div className="text-body-sm text-ds-subtle">
          <strong>Selected:</strong>{' '}
          {selectedItems.length > 0 ? selectedItems.join(', ') : 'none'}
          {' — '}
          <strong>Person:</strong> {person}
        </div>
        {(() => {
          const baseItems: ContextMenuItemDef[] = [
            { type: 'label', label: 'View Options' },
            {
              type: 'checkbox',
              label: 'Show Status Bar',
              value: 'status',
              groupId: 'view',
            },
            {
              type: 'checkbox',
              label: 'Show Full Path',
              value: 'fullPath',
              groupId: 'view',
            },
            {
              type: 'checkbox',
              label: 'Show Toolbar',
              value: 'toolbar',
              groupId: 'view',
            },
            { type: 'separator' },
            { type: 'label', label: 'Layout' },
            {
              type: 'checkbox',
              label: 'Show Grid',
              value: 'grid',
              groupId: 'layout',
            },
            {
              type: 'checkbox',
              label: 'Show Rulers',
              value: 'rulers',
              groupId: 'layout',
            },
            { type: 'separator' },
            { type: 'label', label: 'People' },
            {
              id: 'pedro',
              type: 'radio',
              value: 'pedro',
              label: 'Darwin Nunez',
            },
            { id: 'colm', type: 'radio', value: 'colm', label: 'Harry Kane' },
          ]

          const items = baseItems.map(it => {
            if (typeof it === 'string' || React.isValidElement(it)) return it
            if (it.type === 'checkbox') {
              const value = it.value as string
              return { ...it, checked: selectedItems.includes(value) }
            }
            if (it.type === 'radio') {
              const value = it.value as string
              return { ...it, checked: person === value }
            }
            return it
          })

          return (
            <ContextMenu
              trigger={<TriggerArea />}
              closeOnSelect={false}
              items={items}
              onGroupSelect={(_: string, value: string) => {
                const next = !selectedItems.includes(value)
                toggleSelected(value, next)
                args.onGroupSelect?.(_, value)
              }}
              onSelect={(value: string) => {
                setPerson(value)
                args.onSelect?.(value)
              }}
            />
          )
        })()}
      </div>
    )
  },
}
