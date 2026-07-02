'use client'

import { useRef, useEffect } from 'react'
import * as echarts from 'echarts/core'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import { setColorScope } from '@/utils'

export interface EChartEventParams {
  componentType?: string
  seriesType?: string
  seriesName?: string
  name?: string
  value?: unknown
  dataIndex?: number
  batch?: Array<{ selected?: Array<{ dataIndex?: number[] }> }>
  breaks?: Array<{ start?: number; end?: number; isExpanded?: boolean }>
}

export type EChartEvents = Record<string, (params: EChartEventParams) => void>

export interface UseEChartOptions {
  buildOption: () => EChartsCoreOption
  loading?: boolean
  loadingColor?: string
  events?: EChartEvents
  onReady?: (chart: ECharts) => void
}

/**
 * Shared ECharts runtime: init, resize, dispose, theme re-resolution, loading,
 * imperative `onReady` escape hatch, and event binding. Chart components supply
 * a `buildOption` builder and register their own ECharts modules; everything
 * else (lifecycle + theme reactivity) is handled here so every chart behaves
 * consistently.
 */
export function useEChart({
  buildOption,
  loading = false,
  loadingColor = 'rgb(124, 58, 237)',
  events,
  onReady,
}: UseEChartOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ECharts | null>(null)
  const settleQueuedRef = useRef(false)

  const buildOptionRef = useRef(buildOption)
  useEffect(() => {
    buildOptionRef.current = buildOption
  }, [buildOption])

  const eventsRef = useRef(events)
  useEffect(() => {
    eventsRef.current = events
  }, [events])

  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = echarts.init(el, undefined, { renderer: 'canvas' })
    chartRef.current = chart

    Object.keys(eventsRef.current ?? {}).forEach(name => {
      chart.on(name, (params: unknown) =>
        eventsRef.current?.[name]?.(params as EChartEventParams)
      )
    })

    onReadyRef.current?.(chart)

    const settle = () => {
      if (!settleQueuedRef.current) return
      settleQueuedRef.current = false
      chartRef.current?.resize()
    }
    chart.on('finished', settle)

    let lastWidth = el.clientWidth
    let lastHeight = el.clientHeight
    const resizeIfChanged = () => {
      const { clientWidth, clientHeight } = el
      if (clientWidth === lastWidth && clientHeight === lastHeight) return
      lastWidth = clientWidth
      lastHeight = clientHeight
      chartRef.current?.resize()
    }

    const observer = new ResizeObserver(resizeIfChanged)
    observer.observe(el)

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(resizeIfChanged)
    }

    return () => {
      observer.disconnect()
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const apply = () => {
      setColorScope(containerRef.current)
      settleQueuedRef.current = true
      chartRef.current?.setOption(buildOptionRef.current(), true)
    }

    // Subtree so a nested `data-theme` scope (e.g. a themed canvas) re-themes
    // the chart, not just the root <html>. Limited to `data-theme` only —
    // watching `class` across the subtree would fire on every hover/focus.
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-theme'],
    })

    const media =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null
    media?.addEventListener('change', apply)

    return () => {
      observer.disconnect()
      media?.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    if (loading) {
      chart.showLoading('default', {
        text: '',
        color: loadingColor,
        maskColor: 'rgba(0, 0, 0, 0)',
        spinnerRadius: 8,
        lineWidth: 2,
      })
    } else {
      chart.hideLoading()
    }
  }, [loading, loadingColor])

  useEffect(() => {
    setColorScope(containerRef.current)
    settleQueuedRef.current = true
    chartRef.current?.setOption(buildOption(), true)
  }, [buildOption])

  return { containerRef, chartRef }
}
