import { useLayoutEffect } from 'react'
import { THEME_STORAGE_KEY, ThemeProvider } from '../context/ThemeContext'
import type React from 'react'

export const withThemeProvider = (
  Story: React.ComponentType<Record<string, unknown>>
): React.ReactElement => {
  useLayoutEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        if (event.newValue === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  )
}