'use client'

import { useMemo, useRef, useState } from 'react'
import { LuChartPie, LuArrowRight, LuBookOpen } from 'react-icons/lu'
import { Badge, Button, cn } from '@clera/ui'
import { CategoryTabs } from './CategoryTabs'
import { ChartCard } from './ChartCard'
import { chartGroups, featured } from './registry'
import { toCode } from './toCode'

/** Storybook renders docs in an iframe, so navigate the top-level window. */
const openDocs = (docsId: string) => {
  if (typeof window !== 'undefined')
    window.parent.location.search = `?path=/docs/${docsId}`
}

const CARD_CHART_HEIGHT = 280

/** `WithCustomLegendIcons` -> `With custom legend icons`. */
const humanize = (key: string) => {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}

export const ChartsLanding = () => {
  const [activeId, setActiveId] = useState(chartGroups[0].id)
  const listRef = useRef<HTMLDivElement>(null)

  const group = useMemo(
    () => chartGroups.find(g => g.id === activeId) ?? chartGroups[0],
    [activeId]
  )

  const stories = useMemo(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { default: meta, ...exports } = group.stories as Record<string, any>
    const Component = meta?.component

    return Object.entries(exports)
      .filter(([, story]) => story && typeof story === 'object')
      .map(([key, story]: [string, any]) => {
        const storyArgs = { ...(meta?.args ?? {}), ...(story.args ?? {}) }
        // Stories set their own heights (340, 620, ...) which would make the
        // cards ragged; the grid wants one height.
        const args = { ...storyArgs, height: CARD_CHART_HEIGHT }
        const name = story.name ?? humanize(key)

        let code = ''
        try {
          code = toCode(group.component, storyArgs)
        } catch {
          code = `<${group.component} /* see the ${name} story */ />`
        }

        // A story's `render` is a component, not a plain function — several of
        // them call hooks (Bar's Drilldown, for one). Hand it to React as a
        // component so those hooks belong to it, rather than invoking it here
        // and leaking them into this component's hook list.
        const Story: React.ComponentType =
          typeof story.render === 'function'
            ? () => story.render(args, { args })
            : () => (Component ? <Component {...args} /> : null)

        return { key, name, code, Story }
      })
  }, [group])

  return (
    <div className="sb-unstyled flex flex-col gap-space-xl px-space-xs">
      <header className="flex flex-col items-center gap-space-sm py-space-lg">
        <Badge variant="light" size="sm" rounded="full" icon={<LuChartPie />}>
          Introducing {chartGroups.length} charts
        </Badge>

        <h1 className="text-heading-lg md:text-heading-xl text-center font-semibold text-ds-default">
          Beautiful charts. Built for your design system.
        </h1>

        <p className="max-w-2xl text-center text-body-md text-ds-subtle">
          A collection of chart components built on Apache ECharts and driven by
          Clera design tokens. Copy and paste into your apps — they adapt to
          light and dark mode out of the box.
        </p>

        <div className="flex flex-wrap items-center gap-space-sm">
          <Button
            variant="light"
            iconPosition="right"
            icon={<LuArrowRight />}
            onClick={() => openDocs('charts-bar--docs')}
          >
            Browse Charts
          </Button>
          <Button
            variant="ghost"
            icon={<LuBookOpen />}
            onClick={() =>
              listRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }
          >
            Documentation
          </Button>
        </div>
      </header>

      <ChartCard
        title={featured.title}
        description={featured.description}
        icon={featured.icon}
        code={featured.code}
      >
        {featured.demo}
      </ChartCard>

      <div ref={listRef} className="flex scroll-mt-8 flex-col gap-space-lg">
        <CategoryTabs
          groups={chartGroups}
          activeId={activeId}
          onChange={setActiveId}
        />

        <div
          className={cn(
            'grid auto-rows-fr grid-cols-1 gap-space-lg',
            !['scatter', 'line-matrix', 'pie'].includes(activeId) &&
              'md:grid-cols-2'
          )}
        >
          {stories.map(({ key, name, code, Story }) => (
            <ChartCard key={key} title={name} icon={group.icon} code={code}>
              <Story />
            </ChartCard>
          ))}
        </div>
      </div>
    </div>
  )
}
