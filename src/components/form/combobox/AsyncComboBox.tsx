'use client'

import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react'
import { Skeleton } from '@/components/skeleton'
import { debounce } from '@/utils/debounce'
import {
  BaseComboBox,
  ComboBoxItem,
  ComboBoxGroup,
  ComboBoxEmpty,
  ComboBoxLoading,
} from './BaseComboBox'
import { styles } from './styles'
import { type FieldSize } from '@/components/_core/field-config'

export type AsyncComboBoxOption = {
  value: string
  label: React.ReactNode
  [key: string]: unknown
}

type OptionGroups = Record<string, AsyncComboBoxOption[]>

type LoadingState =
  | boolean
  | React.ReactNode
  | ((count: number) => React.ReactNode)

export type AsyncComboBoxProps = {
  id?: string
  label: string
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  inputSize?: FieldSize
  value?: string
  hasError?: boolean
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  onBlur?: () => void

  loadOptions: (search: string) => Promise<OptionGroups>
  loadDefaultOptions?: () => Promise<OptionGroups>
  loading?: LoadingState
  loadingItemCount?: number
  renderItem: (option: AsyncComboBoxOption) => React.ReactNode
  notFoundContent?: React.ReactNode
  debounceMs?: number
  onValueChange?: (search: string) => void
}

export const AsyncComboBox = forwardRef<HTMLButtonElement, AsyncComboBoxProps>(
  (
    {
      id,
      label,
      fullWidth,
      required,
      disabled,
      readOnly,
      className,
      inputSize = 'md',
      value,
      hasError,
      placeholder,
      onChange,
      onBlur,
      loadOptions,
      loadDefaultOptions,
      loading: loadingProp,
      loadingItemCount = 3,
      renderItem,
      notFoundContent,
      debounceMs = 300,
      onValueChange,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [options, setOptions] = useState<OptionGroups>({})
    const [selectedOption, setSelectedOption] =
      useState<AsyncComboBoxOption | null>(null)

    const allOptionsFlat = useMemo(
      () => Object.values(options).flat(),
      [options]
    )

    useEffect(() => {
      if (value) {
        const found = allOptionsFlat.find(opt => opt.value === value)
        if (found) setSelectedOption(found)
      } else {
        setSelectedOption(null)
      }
    }, [value, allOptionsFlat])

    const performSearch = useCallback(
      (query: string) => {
        setIsLoading(true)
        loadOptions(query).then(newOptions => {
          setOptions(newOptions)
          setIsLoading(false)
        })
      },
      [loadOptions]
    )

    const debouncedSearch = useMemo(
      () => debounce(performSearch, debounceMs),
      [performSearch, debounceMs]
    )

    useEffect(() => {
      if (!open) return

      if (search === '' && loadDefaultOptions) {
        setIsLoading(true)
        loadDefaultOptions().then(defaults => {
          setOptions(defaults)
          setIsLoading(false)
        })
      } else if (open && search) {
        debouncedSearch(search)
      }

      return () => debouncedSearch.cancel()
    }, [search, open, loadDefaultOptions, debouncedSearch])

    const handleSearchChange = (val: string) => {
      setSearch(val)
      onValueChange?.(val)
    }

    const handleSelect = (val: string) => {
      const selected = allOptionsFlat.find(opt => opt.value === val)
      setSelectedOption(selected || null)
      onChange?.(val)
      setOpen(false)
    }

    const effectiveLoading = loadingProp ?? isLoading

    const renderLoading = () => {
      if (typeof loadingProp === 'function')
        return loadingProp(loadingItemCount)

      if (React.isValidElement(loadingProp)) return loadingProp

      return Array.from({ length: loadingItemCount }).map((_, i) => (
        <div key={i} className={styles.loadingRow}>
          <Skeleton rounded="sm" className="h-6 w-6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))
    }

    return (
      <BaseComboBox
        ref={ref}
        id={id}
        label={label}
        value={value}
        displayValue={selectedOption?.label}
        placeholder={placeholder}
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen)
          if (!isOpen) onBlur?.()
        }}
        searchValue={search}
        onSearchChange={handleSearchChange}
        inputSize={inputSize}
        fullWidth={fullWidth}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
        hasError={hasError}
        className={className}
        shouldFilter={false}
      >
        {effectiveLoading ? (
          <ComboBoxLoading>
            <span className="sr-only" role="status">
              Loading results...
            </span>
            {renderLoading()}
          </ComboBoxLoading>
        ) : (
          <>
            <ComboBoxEmpty>
              {notFoundContent ?? 'No results found.'}
            </ComboBoxEmpty>

            {Object.entries(options).map(([group, items]) => (
              <ComboBoxGroup key={group} heading={group}>
                {items.map(option => (
                  <ComboBoxItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    inputSize={inputSize}
                    isSelected={option.value === value}
                  >
                    {renderItem(option)}
                  </ComboBoxItem>
                ))}
              </ComboBoxGroup>
            ))}
          </>
        )}
      </BaseComboBox>
    )
  }
)
AsyncComboBox.displayName = 'AsyncComboBox'
