import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DocsLayout: React.FC<Props> = ({ children, className }) => {
  const parts = React.Children.toArray(children)
  const main = parts[0]
  const side = parts.slice(1)

  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative flex gap-space-4xl', className)}>
      <div className="w-full max-w-[800px]">{main}</div>

      {side.length > 0 && (
        <>
          <div className="hidden md:block flex-1">
            <div className="sticky top-10">{side}</div>
          </div>

          {/* <button
            aria-label={open ? 'Close contents' : 'Open contents'}
            onClick={() => setOpen(v => !v)}
            className="md:hidden fixed z-50 bottom-space-md right-space-md bg-ds-surface px-space-sm py-space-xs rounded-full shadow-md border border-ds-muted"
          >
            {open ? <CloseIcon className="w-4 h-4" /> : <OpenIcon className="w-4 h-4" />}
          </button> */}

          {open && (
            <div className="md:hidden fixed inset-0 z-40 bg-black/40">
              <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[360px] bg-ds-surface p-space-md overflow-auto">
                <div className="flex justify-end mb-space-sm">
                  <button
                    aria-label="Close contents"
                    onClick={() => setOpen(false)}
                    className="px-space-sm py-space-xs rounded bg-ds-muted/20"
                  >
                    {FiX ? <FiX className="w-4 h-4" /> : null}
                  </button>
                </div>
                <div>{side}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocsLayout
