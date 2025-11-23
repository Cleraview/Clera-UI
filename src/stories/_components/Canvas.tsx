import React, { isValidElement, useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  RiListSettingsLine,
  RiFileCopyLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
} from 'react-icons/ri'
import { GoChevronDown } from 'react-icons/go'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/dropdown-menu'
import { Button } from '@/components/button'
import { Tooltip } from '@/components/tooltip'
import { useTheme } from '@root/.storybook/context/ThemeContext'
import { cn } from '@/utils/tailwind'

type CanvasProps = {
  children: React.ReactNode
}

type ComponentWithDisplayName = {
  displayName?: string
}

const removeLeadingIndent = (text: string) => {
  if (!text) return text
  const lines = text.split('\n')

  const minIndent = lines.reduce((min, line) => {
    if (line.trim().length === 0) return min
    const match = line.match(/^(\s+)/)
    const indent = match ? match[1].length : 0
    return Math.min(min, indent)
  }, Infinity)

  if (minIndent === Infinity) return text

  return lines
    .map(line => (line.length >= minIndent ? line.slice(minIndent) : line))
    .join('\n')
    .trim()
}

export const Canvas = ({ children }: CanvasProps) => {
  const { theme } = useTheme()
  const [canvasTheme, setCanvasTheme] = useState<
    'dark' | 'light' | 'system' | null
  >(null)
  const [isCopied, setIsCopied] = useState(false)

  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(true)
  const sourceRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    setTimeout(() => {
      if (sourceRef.current) {
        console.log(sourceRef.current.scrollHeight)
        if (sourceRef.current.scrollHeight > 230) {
          setShowExpandButton(true)
        } else {
          setShowExpandButton(false)
        }
      }
    }, 300)
  }, [source])

  const handleCopy = () => {
    const sourceElement = source as React.ReactElement<
      Record<string, Record<string, Record<string, string>>>
    >
    let rawCode = sourceElement?.props?.children?.props?.code

    if (rawCode) {
      const cleanCode = removeLeadingIndent(rawCode)
      navigator.clipboard.writeText(cleanCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="my-space-sm border border-ds-default rounded-lg overflow-hidden">
      <div
        className={cn(
          'flex justify-center items-center p-space-sm',
          (theme === 'dark' && !canvasTheme) || canvasTheme === 'dark'
            ? 'bg-[linear-gradient(45deg,#18191a_25%,transparent_25%),linear-gradient(-45deg,#18191a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18191a_75%),linear-gradient(-45deg,transparent_75%,#18191a_75%)]'
            : 'bg-[linear-gradient(45deg,#f8f8f8_25%,transparent_25%),linear-gradient(-45deg,#f8f8f8_25%,transparent_25%),linear-gradient(45deg,#ffffff_75%,#f8f8f8_75%),linear-gradient(-45deg,#ffffff_75%,#f8f8f8_75%)]',
          'bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0]',
          ((theme === 'dark' && !canvasTheme) || canvasTheme === 'dark') &&
            'bg-[#232323] text-ds-default'
        )}
      >
        <div className="w-full">{story}</div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center px-space-sm py-space-xs bg-ds-elevation-surface-sunken! text-ds-default! border-y border-ds-default">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'px-space-sm py-space-xs bg-ds-transparent outline-none rounded cursor-pointer flex items-center gap-space-xs font-semibold',
              'hover:bg-ds-neutral-hovered data-[state=open]:bg-ds-selected-pressed/40 text-ds-default data-[state=open]:text-ds-accent-violet border border-transparent data-[state=open]:border-selected'
            )}
          >
            <RiListSettingsLine />
            Preferences
            <GoChevronDown className="ml-space-sm" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[400px] bg-ds-elevation-surface! shadow-ds-elevation-overflow border-0!"
            align="start"
          >
            <div className="min-w-[230px] p-space-sm">
              <h2 className="text-body-sm text-ds-default font-semibold">
                Color Theme
              </h2>

              <div className="flex items-center justify-stretch gap-space-xs mt-space-sm">
                <Button
                  className={cn(
                    'min-w-[120px] border',
                    (theme === 'light' && !canvasTheme) ||
                      canvasTheme === 'light'
                      ? 'bg-ds-selected-pressed/40! border-ds-selected text-ds-accent-violet!'
                      : 'border-ds-default text-ds-accent-neutral! hover:bg-ds-neutral-hovered/20'
                  )}
                  onClick={() => setCanvasTheme('light')}
                  size="sm"
                  fullWidth
                  asChild
                >
                  <span className="text-ds-default">Light</span>
                </Button>

                <Button
                  className={cn(
                    'border',
                    (theme === 'dark' && !canvasTheme) || canvasTheme === 'dark'
                      ? 'bg-ds-selected-pressed/40! border-ds-selected text-ds-accent-violet!'
                      : 'border-ds-default text-ds-accent-neutral! hover:bg-ds-neutral-hovered/20'
                  )}
                  onClick={() => setCanvasTheme('dark')}
                  size="sm"
                  fullWidth
                  asChild
                >
                  <span className="text-ds-default">Dark</span>
                </Button>
                <Button
                  className={cn(
                    'border',
                    (theme === 'system' && !canvasTheme) ||
                      canvasTheme === 'system'
                      ? 'bg-ds-selected-pressed/40! border-ds-selected text-ds-accent-violet!'
                      : 'border-ds-default text-ds-accent-neutral! hover:bg-ds-neutral-hovered/20'
                  )}
                  onClick={() => setCanvasTheme('system')}
                  size="sm"
                  fullWidth
                  asChild
                >
                  <span className="text-ds-default">System</span>
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip
          open={isCopied ? true : undefined}
          content={isCopied ? 'Copied!' : 'Copy to clipboard'}
        >
          <button
            onClick={handleCopy}
            className={cn(
              'px-space-sm py-space-xs bg-ds-transparent outline-none rounded cursor-pointer flex items-center gap-space-xs font-semibold',
              'hover:bg-ds-neutral-hovered text-ds-default border border-transparent transition-colors'
            )}
            aria-label="Copy code"
          >
            Copy code
            <RiFileCopyLine />
          </button>
        </Tooltip>
      </div>

      <div className="bg-[#232323]">
        <div
          ref={sourceRef}
          className={cn(
            'relative overflow-hidden',
            !isExpanded && showExpandButton ? 'max-h-[230px]' : 'h-auto'
          )}
        >
          {source}
          {!isExpanded && (
            <div className="absolute -bottom-10 left-0 w-full h-18 blur-lg bg-ds-elevation-surface-sunken"></div>
          )}
        </div>
        {showExpandButton && (
          <div className="relative">
            <Button
              className="bg-ds-elevation-surface-sunken hover:bg-ds-elevation-surface-sunken/97 dark:hover:bg-ds-neutral-hovered/10 border-2 border-transparent focus:border-ds-selected rounded-tl-none rounded-tr-none"
              innerClassName="py-space-xs [&>*]:text-body-sm!"
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              icon={
                isExpanded ? (
                  <RiArrowUpSLine className="text-body-lg" />
                ) : (
                  <RiArrowDownSLine className="text-body-lg" />
                )
              }
              iconPosition="right"
              fullWidth
            >
              SHOW {isExpanded ? 'LESS' : 'MORE'}
            </Button>
          </div>
        )}
      </div>
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
