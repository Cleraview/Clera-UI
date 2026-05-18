import type { PropsWithChildren } from 'react'
import { cn } from '@/utils'

type DocContainerProps = {
  toc?: boolean
} & PropsWithChildren

export const DocContainer = ({ children, toc }: DocContainerProps) => {
  return (
    <div
      className={cn(
        'w-full',
        toc &&
          'grid grid-cols-[minmax(0px,10fr)_minmax(11.5rem,2fr)] gap-space-4xl'
      )}
    >
      {children}
    </div>
  )
}
