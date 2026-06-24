export function readCssColor(varName: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const probe = document.createElement('span')
  probe.style.color = `var(${varName})`
  probe.style.position = 'absolute'
  probe.style.opacity = '0'
  probe.style.pointerEvents = 'none'
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color || fallback
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
