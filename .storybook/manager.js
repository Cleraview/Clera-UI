import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ManagerHeader } from './components/ManagerHeader'
import customSidebar from './addons/custom-sidebar'
import { light } from './theme'
import './manager.css'

addons.register('my-custom-header', () => {
  addons.add('my-custom-header/tool', {
    type: types.TOOL,
    title: 'Custom Header',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <ManagerHeader />,
  })
})

addons.setConfig({
  theme: light,
  showNav: true,
  showPanel: true,
  layoutCustomisations: {
    showToolbar() {
      return false
    },
  },
  sidebar: customSidebar
})