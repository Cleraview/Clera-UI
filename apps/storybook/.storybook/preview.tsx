import type React from 'react'
import { ThemeProvider } from '@clera/ui/theme'
import { withThemeProvider } from './decorator/withThemeProvider'
import { DocsContainerArgs, DocWrapper } from './components/DocWrapper'
import '@clera/ui/styles/globals.css'
import '@clera/ui/styles/prose.css'

type DecoratorFn = (Story: React.ComponentType<Record<string, unknown>>) => React.ReactElement

type PreviewConfig = {
  decorators?: DecoratorFn[]
  parameters?: Record<string, unknown>
}

const preview: PreviewConfig = {
  decorators: [withThemeProvider],
  parameters: {
    backgrounds: {
      disable: true,
      grid: {
        disable: true,
      },
    },
    layout: 'centered',
    controls: {
      sort: 'alpha',
      expanded: true,
    },
    options: {
      showPanel: true,
      panelPosition: 'bottom',
      bottomPanelHeight: 300,
      storySort: {
        order: ['Overview', 'Foundations', 'Layout', 'Section', 'Features', 'UI'],
      },
    },
    docs: {
      container: ({ children, context }: DocsContainerArgs): React.ReactElement => {
        const stories = context?.componentStories?.() ?? []
        const storyTitle = stories[0]?.title ?? ''
        const isFoundations = storyTitle.startsWith('Foundations')

        return (
          <ThemeProvider>
            <DocWrapper context={context} isFoundations={isFoundations}>
              {children}
            </DocWrapper>
          </ThemeProvider>
        )
      },
    },
  },
}

export default preview