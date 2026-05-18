import { useLayoutEffect } from 'react'
import type React from 'react'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import { useTheme, getInitialTheme, THEME_STORAGE_KEY } from '../context/ThemeContext'

type StoryTitle = { title?: string }
export type DocsContext = {
  componentStories?: () => StoryTitle[]
}

export type DocsContainerArgs = {
  children: React.ReactNode
  context: DocsContext
}

export type DocWrapperProps = {
  isFoundations: boolean
  context: DocsContext
  children: React.ReactNode
}

export const DocWrapper: React.FC<DocWrapperProps> = ({ isFoundations, context, children }) => {
  const { handleSetTheme } = useTheme()

  useLayoutEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        const theme = getInitialTheme()
        handleSetTheme(theme)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [handleSetTheme])

  return (
    <DocsContainer 
      context={context as unknown as React.ComponentProps<typeof DocsContainer>['context']}
    >
      {children}
    </DocsContainer>
  )
}