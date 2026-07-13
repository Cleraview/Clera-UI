'use client'

import { useState, type ReactNode } from 'react'
import { LuCheck, LuCopy, LuFileCode2 } from 'react-icons/lu'
import { Button, Drawer } from '@clera/ui'
import { cn } from '@clera/ui/utils'
import { CodeBlock } from './CodeBlock'
import { LazyMount } from './LazyMount'
import { StoryBoundary } from './StoryBoundary'

function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }
  return { copied, copy }
}

const SCROLLBAR = cn(
  '[scrollbar-width:thin]',
  '[scrollbar-color:color-mix(in_srgb,var(--text-color-ds-subtle)_50%,transparent)_transparent]'
)

const snakeCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase()

interface ChartCardProps {
  title: string
  icon: ReactNode
  code: string
  children: ReactNode
  description?: string
}

export const ChartCard = ({
  title,
  icon,
  code,
  children,
  description,
}: ChartCardProps) => {
  const [open, setOpen] = useState(false)
  const { copied, copy } = useCopy(code)

  return (
    <div className="flex h-full min-w-0 flex-col gap-space-sm">
      <div className="flex items-center justify-between gap-space-sm">
        <div className="flex min-w-0 items-center gap-space-sm">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md text-(--fill-ds-icon-subtle)">
            {icon}
          </span>

          <div className="min-w-0">
            <p className="m-0! truncate text-heading-xs font-semibold text-ds-default">
              {title}
            </p>
            {description && (
              <p className="m-0! truncate text-body-sm! text-ds-subtle">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <Button
            size="sm"
            variant="ghost"
            aria-label={copied ? 'Copied' : 'Copy code'}
            onClick={copy}
            icon={copied ? <LuCheck /> : <LuCopy />}
          />
          <Button size="sm" variant="light" onClick={() => setOpen(true)}>
            View code
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-lg',
          'border border-ds-default bg-ds-elevation-surface p-space-md'
        )}
      >
        <StoryBoundary name={title}>
          <LazyMount>{children}</LazyMount>
        </StoryBoundary>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        position="right"
        size="min(760px, 94vw)"
        showCloseButton={false}
      >
        <Drawer.Content className="flex h-full min-h-0 flex-col overflow-hidden p-space-md!">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-ds-default bg-ds-elevation-surface-sunken">
            <div className="flex shrink-0 items-center justify-between gap-space-sm border-b border-ds-default p-space-md">
              <div className="flex min-w-0 items-center gap-space-sm">
                <LuFileCode2 className="shrink-0 text-(--text-color-ds-accent-blue)" />
                <p className="m-0! truncate font-mono text-body-sm! text-ds-default">
                  {snakeCase(title)}.tsx
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                aria-label={copied ? 'Copied' : 'Copy code'}
                onClick={copy}
                icon={copied ? <LuCheck /> : <LuCopy />}
              />
            </div>

            <div
              className={cn(
                'min-h-0 flex-1 overflow-auto py-space-md',
                SCROLLBAR
              )}
            >
              <CodeBlock code={code} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}
