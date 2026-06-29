/**
 * Escape hatch for customizing an axis's labels — for example, rendering rich
 * labels with icons/images (the "YouTube icon on the x-axis" case).
 *
 * `formatter` is the render function: return plain text, or ECharts rich-text
 * markup (e.g. `` `{yt|}  ${name}` ``) and define the referenced style blocks in
 * `rich`. Put an icon in a block with `backgroundColor: { image: url }`.
 *
 * These fields map straight onto ECharts' `axisLabel`, so anything valid there
 * works; the listed ones are the common knobs.
 */
export type AxisLabelOverride = {
  formatter?: (value: string | number, index: number) => string
  rich?: Record<string, Record<string, unknown>>
  margin?: number
  color?: string
  fontSize?: number
  fontWeight?: number | string
  rotate?: number
  interval?: number | 'auto'
  hideOverlap?: boolean
  width?: number
  overflow?: 'none' | 'truncate' | 'break' | 'breakAll'
}

/** Which side a vertical value axis sits on. */
export type ValueAxisPosition = 'left' | 'right'
