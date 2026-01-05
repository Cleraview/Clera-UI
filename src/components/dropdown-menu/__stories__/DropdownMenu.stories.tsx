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
import { useState } from 'react'
import { DropdownItemDef } from '../DropdownMenu'

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
      <div className="p-space-sm text-label-xs text-ds-subtle bg-ds-neutral-subtle rounded m-space-xs text-center">
        Version 2.0.1
      </div>,
      { type: 'separator' },
      {
        label: 'Delete Account',
        className:
          'text-ds-destructive focus:text-ds-destructive focus:bg-ds-destructive!',
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

export const Controls = () => {
  const [statusBar, setStatusBar] = useState(true)
  const [fullPath, setFullPath] = useState(false)

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifSMS, setNotifSMS] = useState(true)

  const [layoutGrid, setLayoutGrid] = useState(true)
  const [layoutRulers, setLayoutRulers] = useState(false)
  const [layoutGuides, setLayoutGuides] = useState(true)

  const [theme, setTheme] = useState('light')

  const items: DropdownItemDef[] = [
    { type: 'label', label: 'General' },
    {
      type: 'checkbox',
      label: 'Show Status Bar',
      value: 'statusBar',
      checked: statusBar,
      groupId: 'general',
    },
    {
      type: 'checkbox',
      label: 'Show Full Path',
      value: 'fullPath',
      checked: fullPath,
      disabled: true,
      groupId: 'general',
    },
    { type: 'separator' },
    { type: 'label', label: 'Notifications' },
    {
      type: 'checkbox',
      label: 'Email',
      value: 'email',
      checked: notifEmail,
      groupId: 'notifications',
    },
    {
      type: 'checkbox',
      label: 'Push',
      value: 'push',
      checked: notifPush,
      groupId: 'notifications',
    },
    {
      type: 'checkbox',
      label: 'SMS',
      value: 'sms',
      checked: notifSMS,
      groupId: 'notifications',
    },
    { type: 'separator' },
    { type: 'label', label: 'Layout' },
    {
      type: 'checkbox',
      label: 'Grid',
      value: 'grid',
      checked: layoutGrid,
      groupId: 'layout',
    },
    {
      type: 'checkbox',
      label: 'Rulers',
      value: 'rulers',
      checked: layoutRulers,
      groupId: 'layout',
    },
    {
      type: 'checkbox',
      label: 'Guides',
      value: 'guides',
      checked: layoutGuides,
      groupId: 'layout',
    },
    { type: 'separator' },
    { type: 'label', label: 'Theme' },
    {
      type: 'radio',
      label: 'Light',
      value: 'light',
      checked: theme === 'light',
    },
    {
      type: 'radio',
      label: 'Dark',
      value: 'dark',
      checked: theme === 'dark',
    },
    {
      type: 'radio',
      label: 'System',
      value: 'system',
      checked: theme === 'system',
    },
  ]

  return (
    <div className="flex flex-col items-start gap-space-md">
      <Dropdown
        trigger={<Button variant="outlinePrimary">Controls</Button>}
        items={items}
        closeOnSelect={false}
        onGroupSelect={(groupId, value) => {
          switch (groupId) {
            case 'general':
              if (value === 'statusBar') setStatusBar(prevState => !prevState)
              if (value === 'fullPath') setFullPath(prevState => !prevState)
              break
            case 'notifications':
              if (value === 'email') setNotifEmail(prevState => !prevState)
              if (value === 'push') setNotifPush(prevState => !prevState)
              if (value === 'sms') setNotifSMS(prevState => !prevState)
              break
            case 'layout':
              if (value === 'grid') setLayoutGrid(prevState => !prevState)
              if (value === 'rulers') setLayoutRulers(prevState => !prevState)
              if (value === 'guides') setLayoutGuides(prevState => !prevState)
              break
          }
        }}
        onSelect={(value: string) => {
          setTheme(value)
        }}
      />

      <div className="space-y-gap-xs">
        <div className="text-label-xs text-ds-subtle">
          <strong>General:</strong> Show Status Bar: {statusBar ? 'On' : 'Off'}{' '}
          · Full Path: {fullPath ? 'On' : 'Off'}
        </div>
        <div className="text-label-xs text-ds-subtle">
          <strong>Notifications:</strong> Email {notifEmail ? 'On' : 'Off'},
          Push {notifPush ? 'On' : 'Off'}, SMS {notifSMS ? 'On' : 'Off'}
        </div>
        <div className="text-label-xs text-ds-subtle">
          <strong>Layout:</strong> Grid {layoutGrid ? 'On' : 'Off'}, Rulers{' '}
          {layoutRulers ? 'On' : 'Off'}, Guides {layoutGuides ? 'On' : 'Off'}
        </div>
        <div className="text-label-xs text-ds-subtle">
          <strong>Selected theme:</strong> {theme}
        </div>
      </div>
    </div>
  )
}

export const DrillDownNavigation = () => {
  const [open, setOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const items: DropdownItemDef[] = [
    { type: 'label', label: 'Settings' },
    { type: 'separator' },
    {
      label: 'General',
      icon: FaCog,
      children: [
        { type: 'label', label: 'General Settings' },
        { type: 'separator' },
        { label: 'Display Name', value: 'displayName' },
        { label: 'Email Address', value: 'emailAddress' },
        {
          label: 'Language',
          icon: FaGlobe,
          children: [
            { label: 'English', value: 'lang-en' },
            { label: 'Spanish', value: 'lang-es' },
            { label: 'French', value: 'lang-fr' },
            { label: 'German', value: 'lang-de' },
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
            { label: 'Enable via SMS', value: 'tfa-sms' },
            { label: 'Enable via App', value: 'tfa-app' },
          ],
        },
        { label: 'Change Password', value: 'change-password' },
        { label: 'Active Sessions', value: 'active-sessions' },
      ],
    },
    {
      label: 'Appearance',
      icon: FaPalette,
      children: [
        { label: 'Light Mode', value: 'appearance-light' },
        { label: 'Dark Mode', value: 'appearance-dark' },
        { label: 'System Default', value: 'appearance-system' },
      ],
    },
    { type: 'separator' },
    {
      label: 'Log out',
      icon: FaSignOutAlt,
      value: 'logout',
      className:
        'text-ds-destructive hover:text-ds-destructive hover:bg-ds-destructive! focus:bg-ds-destructive! focus:text-ds-destructive',
    },
  ]

  return (
    <div className="flex flex-col items-center gap-space-md">
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        onSelect={value => {
          setSelectedLabel(value)
        }}
        width={280}
        items={items}
        trigger={<Button variant="primary">Open Settings</Button>}
      />

      <div className="text-center text-ds-default text-label-sm rounded w-full">
        <strong>Selected:</strong> {selectedLabel ?? 'None'}
      </div>
    </div>
  )
}
