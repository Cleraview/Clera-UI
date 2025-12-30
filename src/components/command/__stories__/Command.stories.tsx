import { useState, useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  FiFile,
  FiUser,
  FiSettings,
  FiHome,
  FiCalendar,
  FiCommand,
  FiSave,
  FiPrinter,
  FiEdit,
  FiCopy,
  FiScissors,
  FiFilePlus,
  FiTrash,
  FiFolder,
  FiMaximize,
  FiSidebar,
  FiSearch,
  FiChevronsRight,
  FiHelpCircle,
  FiGitPullRequest,
  FiBox,
} from 'react-icons/fi'
import {
  type CommandDialogProps,
  type CommandMenuProps,
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandMenu,
  CommandMenuGroup,
} from '..'
import { Button } from '@/components/button'

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['dev'],
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandMenu,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title for the `CommandDialog`',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Playground Dialog' },
      },
    },
    dialogSize: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the `CommandDialog`',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'md' },
      },
    },
    autoFocusInput: {
      control: 'boolean',
      description: 'Autofocus the input on dialog open',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the `CommandInput`',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Search for something...' },
      },
    },
    emptyState: {
      control: 'text',
      description: 'Text to display when no results are found',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'No results found.' },
      },
    },
    // componentSize: {
    //   control: 'select',
    //   options: ['xs', 'sm', 'md'],
    //   description: 'Size of the input, group headings, and items',
    //   table: {
    //     type: { summary: "'xs' | 'sm' | 'md'" },
    //     defaultValue: { summary: 'md' },
    //   },
    // },
  },
}

export default meta

type Story = StoryObj<typeof Command>

export const Playground: Story = {
  render: args => {
    const [open, setOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState('calendar')

    const menuGroups: CommandMenuGroup[] = [
      {
        id: 'suggestions',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar'),
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => setSelectedValue('dashboard'),
          },
        ],
      },
      {
        id: 'settings',
        heading: 'Settings',
        items: [
          {
            id: 'profile',
            label: 'Profile',
            icon: FiUser,
            onSelect: () => setSelectedValue('profile'),
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: FiSettings,
            onSelect: () => setSelectedValue('settings'),
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col items-center gap-space-sm">
        <Button onClick={() => setOpen(true)} className="mt-space-sm">
          Open Command
        </Button>
        <p className="text-body-sm text-ds-subtle">
          Selected Value: {selectedValue || 'None'}
        </p>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title={args.title}
          size={(args as CommandDialogProps).dialogSize}
          autoFocusInput={(args as CommandDialogProps).autoFocusInput}
        >
          <CommandMenu
            key={open.toString()}
            groups={menuGroups}
            value={selectedValue}
            placeholder={(args as CommandMenuProps).placeholder}
            emptyState={(args as CommandMenuProps).emptyState}
          />
        </CommandDialog>
      </div>
    )
  },
  args: {
    title: 'Playground Dialog',
    dialogSize: 'md',
    autoFocusInput: true,
    placeholder: 'Search for something...',
    emptyState: 'No results found.',
    componentSize: 'md',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story allows you to test all available props for `CommandDialog` and `CommandMenu` using Storybook controls.',
      },
    },
  },
}

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen(open => !open)
        }
      }

      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }, [])

    const menuGroups: CommandMenuGroup[] = [
      {
        id: 'suggestions',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => {
              setSelectedValue('calendar')
              setOpen(false)
            },
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => {
              setSelectedValue('dashboard')
              setOpen(false)
            },
          },
        ],
      },
      {
        id: 'settings',
        heading: 'Settings',
        items: [
          {
            id: 'profile',
            label: 'Profile',
            icon: FiUser,
            onSelect: () => {
              setSelectedValue('profile')
              setOpen(false)
            },
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: FiSettings,
            onSelect: () => {
              setSelectedValue('settings')
              setOpen(false)
            },
          },
          {
            id: 'invoice',
            label: 'Invoice',
            icon: FiFile,
            onSelect: () => {
              setSelectedValue('invoice')
              setOpen(false)
            },
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col items-center gap-space-sm">
        <p className="text-body-md text-ds-subtle">
          Press{' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-ds-default bg-ds-inverse-subtle px-space-xs font-mono text-body-xs font-medium text-ds-default">
            <span className="text-body-sm">⌘</span>C
          </kbd>{' '}
          or click button
        </p>
        <Button onClick={() => setOpen(true)} className="mt-space-sm">
          Open Command
        </Button>
        <p className="text-body-sm text-ds-subtle">
          Selected Value: {selectedValue || 'None'}
        </p>
        <CommandDialog open={open} onOpenChange={setOpen} title="Command Menu">
          <CommandMenu
            key={open.toString()}
            groups={menuGroups}
            value={selectedValue}
          />
        </CommandDialog>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the `CommandDialog`. The selected value is managed in the parent component using `useState`, showing how to control the component state.',
      },
    },
  },
}

export const AsStaticMenu: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('')

    const menuGroups: CommandMenuGroup[] = [
      {
        id: 'suggestions',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar'),
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => setSelectedValue('dashboard'),
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col gap-space-md w-full max-w-sm">
        <Command>
          <CommandMenu
            groups={menuGroups}
            placeholder="Filter items..."
            value={selectedValue}
          />
        </Command>
        <p className="text-body-sm text-ds-subtle">
          Selected Value: {selectedValue || 'None'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'Command can also be used as a static component. This story also demonstrates a controlled pattern, using `useState` to hold the `selectedValue` and updating it with `onSelect`.',
      },
    },
  },
}

export const SizedItems: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('')

    const sizedMenuGroups: CommandMenuGroup[] = [
      {
        id: 'suggestions',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar'),
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => setSelectedValue('dashboard'),
          },
        ],
      },
    ]

    const sizedMenuGroupsSm: CommandMenuGroup[] = [
      {
        id: 'suggestions-sm',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar-sm',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar-sm'),
          },
          {
            id: 'dashboard-sm',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => setSelectedValue('dashboard-sm'),
          },
        ],
      },
    ]

    const sizedMenuGroupsMd: CommandMenuGroup[] = [
      {
        id: 'suggestions-md',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar-md',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar-md'),
          },
          {
            id: 'dashboard-md',
            label: 'Dashboard',
            icon: FiHome,
            disabled: true,
            onSelect: () => setSelectedValue('dashboard-md'),
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col gap-space-md w-full max-w-sm">
        <Command>
          <CommandMenu
            groups={sizedMenuGroups}
            placeholder="Small items (xs)..."
            size="xs"
            value={selectedValue}
          />
        </Command>
        <Command>
          <CommandMenu
            groups={sizedMenuGroupsSm}
            placeholder="Medium items (sm)..."
            size="sm"
            value={selectedValue}
          />
        </Command>
        <Command>
          <CommandMenu
            groups={sizedMenuGroupsMd}
            placeholder="Default items (md)..."
            size="md"
            value={selectedValue}
          />
        </Command>
        <p className="text-body-sm text-ds-subtle text-center">
          Selected Value: {selectedValue || 'None'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'You can control the font size for the input, group headings, and items using the `size` prop on `CommandMenu`.',
      },
    },
  },
}

export const ControlledSelection: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('calendar')

    const menuGroups: CommandMenuGroup[] = [
      {
        id: 'suggestions',
        heading: 'Suggestions',
        items: [
          {
            id: 'calendar',
            label: 'Calendar',
            icon: FiCalendar,
            onSelect: () => setSelectedValue('calendar'),
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            icon: FiHome,
            onSelect: () => setSelectedValue('dashboard'),
          },
        ],
      },
      {
        id: 'settings',
        heading: 'Settings',
        items: [
          {
            id: 'profile',
            label: 'Profile',
            icon: FiUser,
            onSelect: () => setSelectedValue('profile'),
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col gap-space-md w-full max-w-sm">
        <Command>
          <CommandMenu
            groups={menuGroups}
            placeholder="Filter items..."
            value={selectedValue}
          />
        </Command>
        <p className="text-body-sm text-ds-subtle">
          Selected Value: {selectedValue || 'None'}
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates a controlled component pattern. The selected value is managed in React state using `useState`, initialized with a default value ('calendar'), and updated via the `onSelect` prop passed to each item.",
      },
    },
  },
}

export const KeyboardShortcuts: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen(open => !open)
        }
      }

      document.addEventListener('keydown', down)
      return () => document.removeEventListener('keydown', down)
    }, [])

    const menuGroups: CommandMenuGroup[] = [
      {
        id: 'file',
        heading: 'File',
        items: [
          {
            id: 'new-file',
            label: 'New File',
            icon: FiFilePlus,
            shortcut: '⌘ N',
            onSelect: () => setSelectedValue('new-file'),
          },
          {
            id: 'new-folder',
            label: 'New Folder',
            icon: FiFolder,
            shortcut: '⇧ ⌘ N',
            onSelect: () => setSelectedValue('new-folder'),
          },
          {
            id: 'save',
            label: 'Save',
            icon: FiSave,
            shortcut: '⌘ S',
            onSelect: () => setSelectedValue('save'),
          },
          {
            id: 'print',
            label: 'Print',
            icon: FiPrinter,
            shortcut: '⌘ P',
            onSelect: () => setSelectedValue('print'),
          },
        ],
      },
      {
        id: 'edit',
        heading: 'Edit',
        items: [
          {
            id: 'undo',
            label: 'Undo',
            icon: FiEdit,
            shortcut: '⌘ Z',
            onSelect: () => setSelectedValue('undo'),
          },
          {
            id: 'redo',
            label: 'Redo',
            icon: FiEdit,
            shortcut: '⇧ ⌘ Z',
            onSelect: () => setSelectedValue('redo'),
          },
          {
            id: 'cut',
            label: 'Cut',
            icon: FiScissors,
            shortcut: '⌘ X',
            onSelect: () => setSelectedValue('cut'),
          },
          {
            id: 'copy',
            label: 'Copy',
            icon: FiCopy,
            shortcut: '⌘ C',
            onSelect: () => setSelectedValue('copy'),
          },
          {
            id: 'paste',
            label: 'Paste',
            icon: FiFile,
            shortcut: '⌘ V',
            onSelect: () => setSelectedValue('paste'),
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: FiTrash,
            shortcut: '⌫',
            onSelect: () => setSelectedValue('delete'),
          },
        ],
      },
      {
        id: 'view',
        heading: 'View',
        items: [
          {
            id: 'command-palette',
            label: 'Command Palette',
            icon: FiCommand,
            shortcut: '⌘ K',
            onSelect: () => setSelectedValue('command-palette'),
          },
          {
            id: 'search',
            label: 'Search',
            icon: FiSearch,
            shortcut: '⌘ F',
            onSelect: () => setSelectedValue('search'),
          },
          {
            id: 'fullscreen',
            label: 'Toggle Fullscreen',
            icon: FiMaximize,
            shortcut: 'F11',
            onSelect: () => setSelectedValue('fullscreen'),
          },
          {
            id: 'sidebar',
            label: 'Toggle Sidebar',
            icon: FiSidebar,
            shortcut: '⌘ B',
            onSelect: () => setSelectedValue('sidebar'),
          },
          {
            id: 'zen-mode',
            label: 'Toggle Zen Mode',
            icon: FiBox,
            shortcut: '⌘ K Z',
            onSelect: () => setSelectedValue('zen-mode'),
          },
        ],
      },
      {
        id: 'go',
        heading: 'Go',
        items: [
          {
            id: 'go-to-file',
            label: 'Go to File...',
            icon: FiFile,
            shortcut: '⌘ P',
            onSelect: () => setSelectedValue('go-to-file'),
          },
          {
            id: 'go-to-symbol',
            label: 'Go to Symbol...',
            icon: FiChevronsRight,
            shortcut: '⇧ ⌘ O',
            onSelect: () => setSelectedValue('go-to-symbol'),
          },
          {
            id: 'pull-request',
            label: 'Go to Pull Request...',
            icon: FiGitPullRequest,
            onSelect: () => setSelectedValue('pull-request'),
          },
          {
            id: 'help',
            label: 'Help & Feedback',
            icon: FiHelpCircle,
            onSelect: () => setSelectedValue('help'),
          },
          {
            id: 'settings-menu',
            label: 'Settings',
            icon: FiSettings,
            onSelect: () => setSelectedValue('settings-menu'),
          },
        ],
      },
    ]

    return (
      <div className="flex flex-col items-center gap-space-sm">
        <p className="text-body-md text-ds-subtle">
          Press{' '}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-ds-default bg-inverse px-space-xs font-mono text-body-xs font-medium text-ds-default">
            <span className="text-body-sm">⌘</span>C
          </kbd>{' '}
          or click button
        </p>
        <Button onClick={() => setOpen(true)} className="mt-space-sm">
          Open Command
        </Button>
        <p className="text-body-sm text-ds-subtle">
          Selected Value: {selectedValue || 'None'}
        </p>

        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          size="lg"
          showCloseButton={false}
        >
          <CommandMenu
            key={open.toString()}
            groups={menuGroups}
            value={selectedValue}
            selectable={false}
            placeholder="Search for shortcuts..."
            className="columns-2 [&_[cmdk-group]]:break-inside-avoid"
          />
        </CommandDialog>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates how to display keyboard shortcuts for items. This required adding a `shortcut` prop to the `CommandMenuItem` type and rendering it in the `CommandMenu` component.',
      },
    },
  },
}
