import React, { useState } from 'react'
import { MdTerminal, MdContentCopy, MdCheck } from 'react-icons/md'
import { Tooltip } from '@/components/tooltip'
import { cn } from '@/utils'

export type CodeTabItem = {
  label: string
  content: string
}

type CodeTabsProps = {
  data: CodeTabItem[]
  className?: string
}

export const CodeTabs = ({ data, className = '' }: CodeTabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const activeItem = data[activeIndex]

  const handleCopy = async () => {
    if (!activeItem) return
    try {
      await navigator.clipboard.writeText(activeItem.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden my-space-md border',
        'bg-ds-elevation-surface-sunken dark:bg-ds-elevation-surface-raised border-ds-default',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-ds-default dark:border-ds-accent-gray bg-ds-neutral-subtle">
        <div className="flex items-center">
          <div className="px-space-sm text-ds-subtle flex items-center justify-center h-full">
            <MdTerminal className="w-5 h-5" />
          </div>

          <div className="flex py-space-sm gap-space-xs" role="tablist">
            {data.map((item, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    'px-space-sm py-space-xs',
                    'text-body-sm font-(font-family:--font-code) text-ds-default transition-colors focus:outline-none rounded-md',
                    'border border-transparent cursor-pointer',
                    isActive
                      ? 'border-ds-accent-gray/10! dark:border-ds-accent-gray!'
                      : 'hover:border-ds-default dark:hover:border-ds-accent-gray'
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="px-space-sm">
          <Tooltip
            content="Copy code"
            open={copied ? false : isTooltipOpen}
            onOpenChange={setIsTooltipOpen}
          >
            <button
              onClick={handleCopy}
              className="p-space-xs rounded text-ds-subtle hover:bg-ds-neutral-hovered hover:text-ds-default transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Copy code"
            >
              {copied ? (
                <MdCheck className="w-4 h-4 text-ds-success" />
              ) : (
                <MdContentCopy className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="relative">
        <div className="p-space-sm overflow-x-auto">
          <pre className="text-body-sm! leading-relaxed">
            <code className="border-0! bg-transparent!">
              {activeItem?.content}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
