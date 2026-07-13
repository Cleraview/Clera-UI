'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Only mounts its children once the card is near the viewport. A tab like Bar
 * has 17 stories, and eagerly booting an ECharts instance (init + setOption +
 * ResizeObserver) for every one of them is what makes switching tabs stall.
 */
export const LazyMount = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-center">
      {visible ? children : null}
    </div>
  )
}
