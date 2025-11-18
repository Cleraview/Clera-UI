import React, { isValidElement, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/dropdown-menu'
import { Button } from '@/components/button'
import { RiListSettingsLine } from 'react-icons/ri'
import { GoChevronDown } from 'react-icons/go'
import { useTheme } from '@root/.storybook/context/ThemeContext'
import { cn } from '@/utils/tailwind'

type CanvasProps = {
  children: React.ReactNode
}

type ComponentWithDisplayName = {
  displayName?: string
}

export const Canvas = ({ children }: CanvasProps) => {
  const { theme } = useTheme()
  const [canvasTheme, setCanvasTheme] = useState<'dark' | 'light' | null>(null)

  const story = React.Children.toArray(children).find(
    (child: ReactNode) =>
      isValidElement(child) &&
      (child.type as ComponentWithDisplayName).displayName === 'Canvas.Story'
  )
  const source = React.Children.toArray(children).find(
    (child: ReactNode) =>
      isValidElement(child) &&
      (child.type as ComponentWithDisplayName).displayName === 'Canvas.Source'
  )

  return (
    <div className="my-6 border border-default rounded-lg overflow-hidden">
      <div
        className={cn(
          'flex justify-center items-center p-6',
          (theme === 'dark' && !canvasTheme) || canvasTheme === 'dark'
            ? 'bg-[linear-gradient(45deg,#18191a_25%,transparent_25%),linear-gradient(-45deg,#18191a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18191a_75%),linear-gradient(-45deg,transparent_75%,#18191a_75%)]'
            : 'bg-[linear-gradient(45deg,#f8f8f8_25%,transparent_25%),linear-gradient(-45deg,#f8f8f8_25%,transparent_25%),linear-gradient(45deg,#ffffff_75%,#f8f8f8_75%),linear-gradient(-45deg,#ffffff_75%,#f8f8f8_75%)]',
          'bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0]',
          ((theme === 'dark' && !canvasTheme) || canvasTheme === 'dark') &&
            'bg-[#232323] text-default'
        )}
      >
        <div className="w-full">{story}</div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-space-md py-space-sm bg-elevation-surface-sunken! text-default! border-y border-default">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'px-space-sm py-space-xs bg-transparent outline-none rounded cursor-pointer flex items-center gap-space-xs font-semibold',
              'hover:bg-neutral-hovered data-[state=open]:bg-selected-pressed/40 text-default data-[state=open]:text-accent-violet border border-transparent data-[state=open]:border-selected'
            )}
          >
            <RiListSettingsLine />
            Preferences
            <GoChevronDown className="ml-space-sm" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[400px] bg-elevation-surface! shadow-elevation-overflow border-0!"
            align="start"
          >
            <div className="min-w-[280px] p-space-sm">
              <h2 className="text-body-sm text-default font-semibold">
                Color Theme
              </h2>

              <div className="flex items-center justify-stretch gap-space-xs mt-space-sm">
                <Button
                  className={cn(
                    'min-w-[120px] border',
                    (theme === 'light' && !canvasTheme) ||
                      canvasTheme === 'light'
                      ? 'bg-selected-pressed/40! border-selected text-accent-violet!'
                      : 'border-default text-accent-neutral! hover:bg-neutral-subtle-hovered!'
                  )}
                  size="sm"
                  onClick={() => setCanvasTheme('light')}
                  asChild
                >
                  <span className="text-default">Light</span>
                </Button>

                <Button
                  className={cn(
                    'min-w-[120px] border',
                    (theme === 'dark' && !canvasTheme) || canvasTheme === 'dark'
                      ? 'bg-selected-pressed/40! border-selected text-accent-violet!'
                      : 'border-default text-accent-neutral! hover:bg-neutral-subtle-hovered!'
                  )}
                  size="sm"
                  onClick={() => setCanvasTheme('dark')}
                  asChild
                >
                  <span className="text-default">Dark</span>
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Source */}
      <div className="h-full bg-[#232323]">{source}</div>
    </div>
  )
}

const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)
StoryWrapper.displayName = 'Canvas.Story'

const SourceWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)
SourceWrapper.displayName = 'Canvas.Source'

Canvas.Story = StoryWrapper
Canvas.Source = SourceWrapper
