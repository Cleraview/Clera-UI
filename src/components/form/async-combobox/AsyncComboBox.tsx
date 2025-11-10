'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from 'cmdk'
import { FiChevronDown } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import {
  type InputSize,
  sizeClasses,
} from '@/components/form/_props/input-props'
import { FormInputWrapper } from '../FormInputWrapper'
import { Skeleton } from '@/components/skeleton'
import { debounce } from '@/utils/debounce'

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
  inputSize?: InputSize
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

export const AsyncComboBox = React.forwardRef<
  HTMLButtonElement,
  AsyncComboBoxProps
>(
  (
    {
      id: idProp,
      label,
      fullWidth,
      required,
      disabled,
      readOnly,
      className,
      inputSize = 'md',
      value,
      hasError = false,
      placeholder = 'Select an option...',
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
    const autoId = React.useId()
    const inputId = idProp ?? autoId

    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [options, setOptions] = React.useState<OptionGroups>({})

    const [selectedOption, setSelectedOption] =
      React.useState<AsyncComboBoxOption | null>(null)

    const filled = !!value

    const allOptionsFlat = React.useMemo(
      () => Object.values(options).flat(),
      [options]
    )

    React.useEffect(() => {
      if (value) {
        const foundOption = allOptionsFlat.find(opt => opt.value === value)
        if (foundOption) {
          setSelectedOption(foundOption)
        }
      } else {
        setSelectedOption(null)
      }
    }, [value, allOptionsFlat])

    const performSearch = React.useCallback(
      (searchQuery: string) => {
        loadOptions(searchQuery).then(newOptions => {
          setOptions(newOptions)
          setIsLoading(false)
        })
      },
      [loadOptions]
    )

    const debouncedSearch = React.useMemo(
      () => debounce(performSearch, debounceMs),
      [performSearch, debounceMs]
    )

    React.useEffect(() => {
      if (!open) return

      if (search === '' && loadDefaultOptions) {
        setIsLoading(true)
        loadDefaultOptions().then(defaultOptions => {
          setOptions(defaultOptions)
          setIsLoading(false)
        })
      } else if (open) {
        setIsLoading(true)
        debouncedSearch(search)
      }

      return () => {
        debouncedSearch.cancel()
      }
    }, [search, loadDefaultOptions, open, debouncedSearch])

    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen)
      if (isOpen) {
        setSearch('')
      }
    }

    const handleChange = (val: string) => {
      const selected = allOptionsFlat.find(opt => opt.value === val)
      setSelectedOption(selected || null)
      onChange?.(val)
      setOpen(false)
    }

    const handleValueChange = (newSearch: string) => {
      setSearch(newSearch)
      onValueChange?.(newSearch)
    }

    const effectiveLoading = loadingProp ?? isLoading

    const renderLoadingState = () => {
      if (typeof loadingProp === 'function') {
        return loadingProp(loadingItemCount)
      }
      if (React.isValidElement(loadingProp)) {
        return loadingProp
      }

      return Array.from({ length: loadingItemCount }, (_, i) => (
        <div key={i} className="flex items-center space-x-2 p-space-sm">
          <Skeleton rounded="sm" className="h-6 w-6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))
    }

    return (
      <FormInputWrapper
        id={inputId}
        label={label}
        inputSize={inputSize}
        hasError={hasError}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        focused={open}
        filled={filled}
        fullWidth={fullWidth}
      >
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
          <Popover.Trigger
            ref={ref}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full flex items-center justify-between border-none bg-transparent outline-none cursor-pointer',
              '[&>[data-filled="false"]]:text-subtlest',
              sizeClasses[inputSize],
              disabled ? 'text-subtlest' : 'text-default',
              className
            )}
            onBlur={onBlur}
            disabled={disabled || readOnly}
            onClick={() => !readOnly && handleOpenChange(!open)}
          >
            <span
              data-filled={filled}
              className={cn(
                'truncate',
                hasError ? 'text-destructive' : 'text-default',
                !value && 'invisible'
              )}
            >
              {value ? selectedOption?.label : placeholder}
            </span>

            <FiChevronDown
              className={cn(
                'w-4 h-4 ml-space-sm text-subtlest shrink-0',
                hasError && 'text-destructive!'
              )}
            />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className="w-[var(--radix-popover-trigger-width)] z-50 rounded-md bg-default shadow-md border border-default"
              sideOffset={4}
              side="bottom"
              align="start"
              onOpenAutoFocus={e => e.preventDefault()}
            >
              <Command className="flex flex-col">
                <CommandInput
                  className={cn(
                    'w-full px-space-sm py-space-xs text-body-sm outline-none border-b border-default',
                    sizeClasses[inputSize],
                    'placeholder:text-subtlest'
                  )}
                  placeholder="Search..."
                  value={search}
                  onValueChange={handleValueChange}
                />
                <CommandList className="p-space-xs max-h-60 overflow-y-auto">
                  {effectiveLoading ? (
                    renderLoadingState()
                  ) : (
                    <>
                      <CommandEmpty className="text-body-sm p-space-sm">
                        {notFoundContent ?? 'No results found.'}
                      </CommandEmpty>

                      {Object.entries(options).map(([group, items]) => (
                        <CommandGroup
                          key={group}
                          heading={group}
                          className="[&_[cmdk-group-heading]]:p-space-sm [&_[cmdk-group-heading]]:text-body-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-subtle"
                        >
                          {items.map(option => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={handleChange}
                              className={cn(
                                'rounded-sm p-0 text-body-sm cursor-pointer',
                                'aria-selected:bg-primary/20 aria-selected:text-primary outline-none'
                              )}
                            >
                              {renderItem(option)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </>
                  )}
                </CommandList>
              </Command>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </FormInputWrapper>
    )
  }
)

AsyncComboBox.displayName = 'AsyncComboBox'
