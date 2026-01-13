import { useState, useMemo, useEffect } from 'react'
import { debounce } from '@/utils'

interface UsePasswordMaskOptions {
  value?: string
  isPassword: boolean
  showPassword: boolean
  maskDelay?: number
}

interface UsePasswordMaskReturn {
  internalValue: string
  setInternalValue: React.Dispatch<React.SetStateAction<string>>
  displayValue: string
  showLastChar: boolean
  setShowLastChar: React.Dispatch<React.SetStateAction<boolean>>
  debouncedMask: ReturnType<typeof debounce>
}

export function usePasswordMask({
  value,
  isPassword,
  showPassword,
  maskDelay = 300,
}: UsePasswordMaskOptions): UsePasswordMaskReturn {
  const [internalValue, setInternalValue] = useState<string>('')
  const [showLastChar, setShowLastChar] = useState<boolean>(false)

  const isControlled = value !== undefined
  const actualValue = isControlled ? value : internalValue

  const debouncedMask = useMemo(
    () =>
      debounce(() => {
        setShowLastChar(false)
      }, maskDelay),
    [maskDelay]
  )

  useEffect(() => {
    return () => {
      debouncedMask.cancel()
    }
  }, [debouncedMask])

  const displayValue = useMemo(() => {
    if (!isPassword || showPassword) return actualValue
    if (actualValue.length === 0) return ''
    if (showLastChar) {
      const masked = '•'.repeat(actualValue.length - 1)
      return masked + actualValue.slice(-1)
    }
    return '•'.repeat(actualValue.length)
  }, [actualValue, isPassword, showPassword, showLastChar])

  return {
    internalValue,
    setInternalValue,
    displayValue,
    showLastChar,
    setShowLastChar,
    debouncedMask,
  }
}
