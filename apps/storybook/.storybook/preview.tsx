import type React from 'react'
import type { Decorator } from '@storybook/nextjs'
import { ThemeProvider } from '@clera/ui/theme'
import { chartLayoutDecorator } from '@clera/docs'
import { withThemeProvider } from './decorator/withThemeProvider'
import { DocsContainerArgs, DocWrapper } from './components/DocWrapper'
import '@clera/ui/styles/globals.css'
import '@clera/ui/styles/prose.css'
import './theme-light-scope.css'

type PreviewConfig = {
  decorators?: Decorator[]
  parameters?: Record<string, unknown>
}

const preview: PreviewConfig = {
  decorators: [withThemeProvider, chartLayoutDecorator],
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
        // A nested array orders that group's children: Charts lists its
        // Overview landing page first, then everything else alphabetically.
        order: [
          'Overview',
          'Foundations',
          'Layout',
          'Section',
          'Features',
          'UI',
          'Charts',
          ['Overview', '*'],
        ],
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