type DebouncedFunction<A extends unknown[]> = {
  (...args: A): void
  cancel: () => void
}

export function debounce<A extends unknown[], R>(
  fn: (...args: A) => R,
  delay: number
): DebouncedFunction<A> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: A) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}
