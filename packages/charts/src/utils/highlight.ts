import { lighten } from './colors'

export interface ItemHighlightState {
  emphasis: Record<string, unknown>
  blur?: Record<string, unknown>
}

/**
 * `emphasis`/`blur` pair for solid-fill series (bar segments, polar-bar
 * segments): hovering lightens that item always; when `enabled`, it also
 * dims every other series (`focus: 'series'`) instead of leaving them alone.
 *
 * `alwaysFocusSeries` keeps `focus: 'series'` set even when `enabled` is
 * false, so hovering any part of a multi-point series (e.g. Combo's bars)
 * still highlights the whole series — only the dimming of *other* series is
 * gated by `enabled`.
 */
export function buildItemHighlight(
  color: string,
  enabled: boolean,
  blurOpacity = 0.2,
  alwaysFocusSeries = false
): ItemHighlightState {
  return {
    emphasis:
      enabled || alwaysFocusSeries
        ? { focus: 'series', itemStyle: { color: lighten(color) } }
        : { itemStyle: { color: lighten(color) } },
    ...(enabled ? { blur: { itemStyle: { opacity: blurOpacity } } } : {}),
  }
}

export interface LineHighlightAreaOptions {
  /** `areaStyle` applied to the hovered series itself. */
  emphasis: Record<string, unknown>
  /** Fill opacity for other series' areas while one is highlighted. */
  blurOpacity?: number
}

export interface LineHighlightOptions {
  /** Preserve the line's own width on hover (ECharts doesn't inherit it). */
  width?: number
  enabled: boolean
  /** Disables emphasis/blur entirely (e.g. a threshold reference line). */
  disabled?: boolean
  blurOpacity?: number
  area?: LineHighlightAreaOptions
  /**
   * Keeps `focus: 'series'` set even when `enabled` is false, so hovering
   * any point still highlights the whole line — only the dimming of other
   * series is gated by `enabled`. Off by default (focus follows `enabled`).
   */
  alwaysFocusSeries?: boolean
}

/**
 * `emphasis`/`blur` pair for line/area series (Line, Combo's line/area
 * series, MultiXLine): the hovered line always lightens; when `enabled`, it
 * also dims every other series instead of leaving them alone.
 */
export function buildLineHighlight(
  color: string,
  {
    width,
    enabled,
    disabled,
    blurOpacity = 0.2,
    area,
    alwaysFocusSeries = false,
  }: LineHighlightOptions
): ItemHighlightState {
  if (disabled) return { emphasis: { disabled: true } }
  const hover = lighten(color)
  return {
    emphasis: {
      focus: enabled || alwaysFocusSeries ? 'series' : 'none',
      lineStyle: { color: hover, ...(width !== undefined ? { width } : {}) },
      itemStyle: { color: hover },
      ...(area ? { areaStyle: area.emphasis } : {}),
    },
    ...(enabled
      ? {
          blur: {
            lineStyle: { opacity: blurOpacity },
            itemStyle: { opacity: blurOpacity },
            ...(area
              ? { areaStyle: { opacity: area.blurOpacity ?? blurOpacity } }
              : {}),
          },
        }
      : {}),
  }
}
