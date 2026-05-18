// import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ADDON_ID, TOOL_ID, ManagerHeader } from './components/ManagerHeader'
import customSidebar from './addons/custom-sidebar'
import { light } from './theme'
import './_colors.css'
import './manager.css'

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Custom Header',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: ManagerHeader,
  })
})

addons.setConfig({
  theme: light,
  showNav: true,
  showPanel: true,
  // layoutCustomisations: {
  //   showToolbar() {
  //     return false
  //   },
  // },
  sidebar: customSidebar
})