// import React from 'react'
import { addons, types } from 'storybook/manager-api'
import { ADDON_ID, TOOL_ID, ManagerHeader } from './components/ManagerHeader'
import customSidebar from './addons/custom-sidebar'
import { light } from './theme'
import '@clera/tokens/native/color.css'
import './manager.css'

const DESKTOP_QUERY = '(min-width: 600px)'
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  const original = window.matchMedia.bind(window)
  const normalize = (q: string) => q.replace(/\s+/g, '')
  window.matchMedia = (query: string) => {
    if (typeof query === 'string' && normalize(query) === normalize(DESKTOP_QUERY)) {
      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList
    }
    return original(query)
  }
}

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
  sidebar: customSidebar
})