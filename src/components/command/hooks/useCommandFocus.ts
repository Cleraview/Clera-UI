import { useCallback } from 'react'

export const useCommandAutoFocus = (enabled: boolean = true) => {
  return useCallback(
    (e: Event) => {
      if (!enabled) return e.preventDefault()

      e.preventDefault()
      setTimeout(() => {
        const input = document.querySelector('[cmdk-input-wrapper] input')
        if (input instanceof HTMLInputElement) {
          input.focus()
        }
      }, 0)
    },
    [enabled]
  )
}
