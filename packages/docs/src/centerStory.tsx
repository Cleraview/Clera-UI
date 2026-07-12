import type { Decorator } from '@storybook/nextjs'

export interface ChartLayoutParams {
  maxWidth?: number
  padding?: number
}

export const chartLayoutDecorator: Decorator = (
  Story,
  { viewMode, parameters }
) => {
  const chartLayout = (parameters as { chartLayout?: ChartLayoutParams })
    .chartLayout
  if (!chartLayout) return <Story />

  const { maxWidth, padding = 6 } = chartLayout

  if (viewMode === 'docs') {
    return maxWidth ? (
      <div className="mx-auto w-full" style={{ maxWidth }}>
        <Story />
      </div>
    ) : (
      <div className="w-full">
        <Story />
      </div>
    )
  }

  if (!maxWidth) {
    return (
      <div
        className="min-h-screen w-full"
        style={{ paddingTop: padding * 4, paddingBottom: padding * 4 }}
      >
        <Story />
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ padding: padding * 4 }}
    >
      <div className="w-full" style={{ maxWidth }}>
        <Story />
      </div>
    </div>
  )
}
