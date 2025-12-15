import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { Dropdown } from '..'
import { Button } from '@/components/button'
import {
  FaUser,
  FaCreditCard,
  FaCog,
  FaKeyboard,
  FaSignOutAlt,
  FaPalette,
  FaGlobe,
  FaLock,
  FaShieldAlt,
} from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown Menu',
  component: Dropdown,
  tags: ['dev'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    align: {
      control: 'radio',
      options: ['start', 'center', 'end'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

export const Simple: Story = {
  args: {
    align: 'end',
    items: [
      { type: 'label', label: 'My Account' },
      { type: 'separator' },
      { label: 'Profile', icon: FaUser, shortcut: '⇧⌘P' },
      { label: 'Billing', icon: FaCreditCard, shortcut: '⌘B' },
      { label: 'Settings', icon: FaCog, shortcut: '⌘S' },
      { type: 'separator' },
      'Log out',
    ],
  },
  render: args => (
    <Dropdown {...args}>
      <Button variant="ghost" icon={<FaGear />}>
        My Account
      </Button>
    </Dropdown>
  ),
}

export const Advanced: Story = {
  args: {
    width: 260,
    items: [
      { type: 'label', label: 'Appearance' },
      { type: 'separator' },
      {
        label: 'Theme',
        icon: FaPalette,
        children: [
          { label: 'Light Mode' },
          { label: 'Dark Mode' },
          { type: 'separator' },
          { label: 'System Default', disabled: true },
        ],
      },
      {
        label: 'Keyboard Shortcuts',
        icon: FaKeyboard,
      },
      { type: 'separator' },
      // eslint-disable-next-line react/jsx-key
      <div className="px-space-sm py-space-sm text-body-xs text-ds-subtle bg-ds-neutral-subtle rounded m-space-xs text-center">
        Version 2.0.1
      </div>,
      { type: 'separator' },
      {
        label: 'Delete Account',
        className:
          'text-ds-destructive-bold hover:text-ds-destructive-bold focus:bg-ds-destructive-subtle',
        icon: FaSignOutAlt,
      },
    ],
  },
  render: args => (
    <Dropdown {...args}>
      <Button>Settings</Button>
    </Dropdown>
  ),
}

export const Checkboxes = () => {
  const [checked, setChecked] = React.useState(true)

  return (
    <Dropdown
      trigger={<Button variant="outlinePrimary">View Options</Button>}
      items={[
        { type: 'label', label: 'Toggle Features' },
        { type: 'separator' },
        {
          type: 'checkbox',
          label: 'Show Status Bar',
          checked: checked,
          onCheckedChange: setChecked,
        },
        {
          type: 'checkbox',
          label: 'Show Full Path',
          checked: false,
          onCheckedChange: () => {},
          disabled: true,
        },
      ]}
    />
  )
}

export const DrillDownNavigation: Story = {
  args: {
    width: 280,
    items: [
      { type: 'label', label: 'Settings' },
      { type: 'separator' },
      {
        label: 'General',
        icon: FaCog,
        children: [
          { type: 'label', label: 'General Settings' },
          { type: 'separator' },
          { label: 'Display Name' },
          { label: 'Email Address' },
          {
            label: 'Language',
            icon: FaGlobe,
            children: [
              { label: 'English' },
              { label: 'Spanish' },
              { label: 'French' },
              { label: 'German' },
            ],
          },
        ],
      },
      {
        label: 'Privacy & Security',
        icon: FaLock,
        children: [
          {
            label: 'Two-Factor Auth',
            icon: FaShieldAlt,
            children: [
              { label: 'Enable via SMS' },
              { label: 'Enable via App' },
            ],
          },
          { label: 'Change Password' },
          { label: 'Active Sessions' },
        ],
      },
      {
        label: 'Appearance',
        icon: FaPalette,
        children: [
          { label: 'Light Mode' },
          { label: 'Dark Mode' },
          { label: 'System Default' },
        ],
      },
      { type: 'separator' },
      {
        label: 'Log out',
        icon: FaSignOutAlt,
        className: 'text-ds-destructive-bold',
      },
    ],
  },
  render: args => (
    <Dropdown {...args}>
      <Button variant="primary">Open Settings</Button>
    </Dropdown>
  ),
}
