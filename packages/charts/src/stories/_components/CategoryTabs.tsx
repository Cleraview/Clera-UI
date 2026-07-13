'use client'

import { useEffect, useRef, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { Button } from '@clera/ui'
import { cn } from '@clera/ui/utils'
import type { ChartGroup } from './registry'

interface CategoryTabsProps {
  groups: ChartGroup[]
  activeId: string
  onChange: (id: string) => void
}

/**
 * The tab strip scrolls horizontally once it no longer fits, with arrows that
 * only appear when there is actually something to scroll to.
 */
export const CategoryTabs = ({
  groups,
  activeId,
  onChange,
}: CategoryTabsProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState({ start: false, end: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const read = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track
      setOverflow({
        start: scrollLeft > 1,
        end: scrollLeft + clientWidth < scrollWidth - 1,
      })
    }

    read()
    track.addEventListener('scroll', read, { passive: true })
    const observer = new ResizeObserver(read)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', read)
      observer.disconnect()
    }
  }, [groups])

  const scrollBy = (direction: -1 | 1) =>
    trackRef.current?.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    })

  return (
    <div className="relative flex items-center border-b border-ds-default">
      {overflow.start && (
        <Button
          size="md"
          variant="ghost"
          aria-label="Scroll categories left"
          className="absolute left-0 z-10 bg-ds-elevation-surface"
          onClick={() => scrollBy(-1)}
          icon={<LuChevronLeft />}
        />
      )}

      <div
        ref={trackRef}
        role="tablist"
        aria-label="Chart categories"
        className="flex flex-1 gap-space-xs overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {groups.map(group => {
          const selected = group.id === activeId
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(group.id)}
              className={cn(
                'shrink-0 cursor-pointer whitespace-nowrap px-space-md py-space-sm',
                'border-b-2 text-body-md transition-colors',
                selected
                  ? 'border-ds-primary font-semibold text-ds-default'
                  : 'border-transparent text-ds-subtle hover:text-ds-default'
              )}
            >
              {group.label} Charts
            </button>
          )
        })}
      </div>

      {overflow.end && (
        <Button
          size="md"
          variant="ghost"
          aria-label="Scroll categories right"
          className="absolute right-0 z-10 bg-ds-elevation-surface"
          onClick={() => scrollBy(1)}
          icon={<LuChevronRight />}
        />
      )}
    </div>
  )
}
