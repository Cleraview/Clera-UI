import React, { useState } from 'react'
import { FiX, FiList } from 'react-icons/fi'
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
    <div className={cn('relative', className)}>
      <div className="@container flex gap-space-lg">
        <div className="flex-1 min-w-0 max-w-[800px] overflow-x-hidden">
          {main}
        </div>

        {side.length > 0 && (
          <div className="@max-lg:hidden w-[300px] shrink-0">
            <div className="sticky top-10">{side}</div>
          </div>
        )}
      </div>

      {/* On narrow screens the side column is hidden; a floating button opens
          the table of contents in a drawer instead. Kept outside the
          @container above because container-type breaks fixed positioning. */}
      {side.length > 0 && (
        <>
          <button
            type="button"
            aria-label="Open table of contents"
            onClick={() => setOpen(true)}
            className="hidden max-[34rem]:flex fixed bottom-6 right-6 z-50 h-12 w-12 items-center justify-center rounded-full bg-ds-primary-bold text-white shadow-lg"
          >
            <FiList className="h-5 w-5" />
          </button>

          {open && (
            <div
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setOpen(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-[82%] max-w-[320px] overflow-auto bg-ds-surface p-space-md shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="mb-space-sm flex justify-end">
                  <button
                    type="button"
                    aria-label="Close table of contents"
                    onClick={() => setOpen(false)}
                    className="rounded p-space-xs hover:bg-ds-neutral"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div onClick={() => setOpen(false)}>{side}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default DocsLayout
