'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  DayPicker,
  DayPickerProps,
  PropsSingle,
  PropsRange,
  PropsMulti,
  DateRange,
  CustomComponents,
  ClassNames,
  DropdownOption,
  UI,
} from 'react-day-picker'
import * as Popover from '@radix-ui/react-popover'
import {
  isSameDay,
  isSunday,
  format as formatDateFns,
  isValid as isValidDate,
} from 'date-fns'
import { GoChevronRight, GoChevronLeft, GoChevronDown } from 'react-icons/go'
import { FiCalendar } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { FormInputWrapper } from '@/components/form/FormInputWrapper'
import {
  type FieldSize,
  fieldPaddings,
  floatingLabelBaseText,
} from '@/components/_core/field-config'
import { safeParse } from './_utils/parse'
import 'react-day-picker/dist/style.css'

type CalendarMode = 'single' | 'range' | 'multiple'

export type CalendarProps = {
  label: string
  mode?: CalendarMode
  selected?: Date | Date[] | DateRange | string | string[] | undefined
  onSelect?: (
    value:
      | Date
      | Date[]
      | DateRange
      | string
      | string[]
      | { from?: string; to?: string }
      | undefined
  ) => void
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  hasError?: boolean
  inputSize?: FieldSize
  fullWidth?: boolean
  className?: string
  options?: Partial<DayPickerProps>
  formatDate?: string
}

const defaultBaseOptions = {
  captionLayout: 'dropdown' as const,
  navLayout: 'around' as const,
  showOutsideDays: true,
}

const componentsCommon: Partial<CustomComponents> = {
  MonthCaption: ({
    className,
    children,
  }: {
    className?: string
    children?: React.ReactNode
  }) => (
    <div className={cn('flex items-center justify-between', className)}>
      {children}
    </div>
  ),
  DropdownNav: ({ children }: { children?: React.ReactNode }) => (
    <div className="flex items-center gap-2">{children}</div>
  ),
  PreviousMonthButton: (props: React.HTMLAttributes<HTMLButtonElement>) => (
    <button
      {...props}
      className={cn(
        'rdp-button_previous absolute p-space-xs ml-space-xs! rounded-full focus:bg-ds-input-hovered focus-visible:outline-none transition-colors cursor-pointer'
      )}
    >
      <GoChevronLeft className="h-6 w-6 text-(--fill-ds-icon-subtle)" />
    </button>
  ),
  NextMonthButton: (props: React.HTMLAttributes<HTMLButtonElement>) => (
    <button
      {...props}
      className={cn(
        'rdp-button_next absolute p-space-xs mr-space-xs! rounded-full focus-visible:outline-none transition-colors cursor-pointer'
      )}
    >
      <GoChevronRight className="h-6 w-6 text-(--fill-ds-icon-subtle)" />
    </button>
  ),
  Dropdown: (props: {
    options?: DropdownOption[]
    components: CustomComponents
    classNames: ClassNames
    [key: string]: unknown
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { options, className, components, classNames, ...selectProps } = props
    return (
      <div
        data-disabled={selectProps.disabled}
        className={cn(
          classNames?.[UI.DropdownRoot],
          'relative border border-ds-input rounded-md overflow-hidden'
        )}
      >
        <components.Select
          className={cn(
            'py-space-xs pl-space-sm pr-space-lg appearance-none hover:bg-ds-neutral-subtle-hovered transition-all duration-200'
          )}
          {...selectProps}
        >
          {options?.map(
            ({ value, label, disabled: optDisabled }: DropdownOption) => (
              <components.Option
                key={String(value)}
                value={value}
                disabled={optDisabled}
              >
                {label}
              </components.Option>
            )
          )}
        </components.Select>
        <span className="absolute inset-y-0 right-1 my-auto flex items-center pointer-events-none">
          <GoChevronDown />
        </span>
      </div>
    )
  },
  Select: ({
    className,
    ...props
  }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select
      {...props}
      className={cn(
        'bg-transparent text-body-sm focus:outline-none cursor-pointer',
        className
      )}
    />
  ),
  Option: (props: React.OptionHTMLAttributes<HTMLOptionElement>) => (
    <option {...props} className="bg-ds-default" />
  ),
  Weekday: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => {
    const isSun = props['aria-label'] === 'Sunday'
    return (
      <th
        {...props}
        className={cn(
          'text-center font-medium text-body-sm',
          isSun ? 'text-ds-destructive' : 'text-ds-subtle'
        )}
      />
    )
  },
}

const classNamesCommon = (
  mode: string,
  isSameDayInRange?: boolean
): Partial<ClassNames> => ({
  chevron: 'hover:bg-ds-input-hovered transition',
  outside: 'text-ds-subtlest/20 font-thin',
  disabled:
    'hover:bg-transparent text-ds-subtle/30! [&>button]:cursor-not-allowed!',
  day: cn(
    'h-9 w-9 text-body-sm transition font-semibold',
    'hover:bg-ds-input-hovered',
    // "data-[outside=true]:hover:bg-transparent data-[outside=true]:cursor-not-allowed",
    isSameDayInRange ? 'rounded-md!' : 'rounded-md'
  ),
  today: 'text-ds-accent-violet font-bold',
  month_grid: cn(
    'border-separate',
    mode === 'multiple' ? 'border-spacing-1' : 'border-spacing-y-1'
  ),
  range_start:
    'bg-ds-primary-bold hover:bg-ds-primary-bold-hovered! text-ds-inverse rounded-tr-none rounded-br-none',
  range_middle: 'bg-ds-primary rounded-none',
  range_end:
    'bg-ds-primary-bold hover:bg-ds-primary-bold-hovered! text-ds-inverse rounded-tl-none rounded-bl-none',
  selected: cn(
    'bg-ds-primary hover:bg-ds-primary/90 font-semibold',
    mode === 'single' && 'text-ds-accent-violet'
  ),
})

const Calendar: React.FC<CalendarProps> = ({
  label,
  mode = 'single',
  selected,
  onSelect,
  disabled,
  required,
  readOnly,
  inputSize = 'md',
  hasError,
  fullWidth,
  className,
  options,
  formatDate = 'MM/dd/yyyy',
}) => {
  const [focused, setFocused] = useState(false)
  const [isSameDayInRange, setSameDayInRange] = useState(false)
  const [filled, setFilled] = useState(false)

  const parsedValue = useMemo(() => {
    if (!selected) return undefined

    if (mode === 'single') {
      if (typeof selected === 'string') {
        return safeParse(selected, formatDate)
      }
      if (selected instanceof Date) return selected
      return undefined
    }

    if (mode === 'multiple') {
      if (Array.isArray(selected)) {
        const arr = selected.map(s =>
          typeof s === 'string' ? safeParse(s, formatDate) : s
        ) as Date[]
        return arr?.length ? arr.filter(isValidDate) : undefined
      }

      if (selected instanceof Date) return [selected]
      return undefined
    }

    if (
      typeof selected === 'object' &&
      selected !== null &&
      ('from' in (selected as DateRange) || 'to' in (selected as DateRange))
    ) {
      const sel = selected as DateRange
      const fromRaw = sel.from
      const toRaw = sel.to
      const from =
        typeof fromRaw === 'string'
          ? safeParse(fromRaw, formatDate)
          : (fromRaw as Date | undefined)
      const to =
        typeof toRaw === 'string'
          ? safeParse(toRaw, formatDate)
          : (toRaw as Date | undefined)

      return from || to ? ({ from, to } as DateRange) : undefined
    }

    return undefined
  }, [selected, mode, formatDate])

  const displayValue = useMemo(() => {
    if (!selected && !parsedValue) return ''

    if (parsedValue) {
      if (mode === 'single' && parsedValue instanceof Date) {
        return formatDateFns(parsedValue, formatDate)
      }
      if (mode === 'multiple' && Array.isArray(parsedValue)) {
        return (parsedValue as Date[])
          .map(d => formatDateFns(d, formatDate))
          .join(', ')
      }
      if (
        mode === 'range' &&
        typeof parsedValue === 'object' &&
        ('from' in (parsedValue as DateRange) ||
          'to' in (parsedValue as DateRange))
      ) {
        const pr = parsedValue as DateRange
        const from = pr.from ? formatDateFns(pr.from!, formatDate) : '–'
        const to = pr.to ? formatDateFns(pr.to!, formatDate) : '–'
        return `${from} - ${to}`
      }
    }

    if (mode === 'single' && typeof selected === 'string') {
      return selected
    }
    if (
      mode === 'multiple' &&
      Array.isArray(selected) &&
      selected.every(s => typeof s === 'string')
    ) {
      return (selected as string[]).join(', ')
    }
    if (
      mode === 'range' &&
      typeof selected === 'object' &&
      selected !== null &&
      ('from' in (selected as DateRange) || 'to' in (selected as DateRange))
    ) {
      const sel = selected as DateRange
      const fromStr = sel.from ?? undefined
      const toStr = sel.to ?? undefined
      if (typeof fromStr === 'string' || typeof toStr === 'string') {
        return `${fromStr ?? '–'} - ${toStr ?? '–'}`
      }
    }

    return ''
  }, [selected, parsedValue, mode, formatDate])

  useEffect(() => {
    setFilled(Boolean(displayValue))
    if (
      mode === 'range' &&
      parsedValue &&
      typeof parsedValue === 'object' &&
      'from' in (parsedValue as DateRange)
    ) {
      setSameDayInRange(
        isSameDay(
          (parsedValue as DateRange).from!,
          (parsedValue as DateRange).to!
        )
      )
    }
  }, [displayValue, parsedValue, mode])

  const handleOpenChange = (open: boolean) => {
    if (disabled || readOnly) return
    setFocused(open)
  }

  const handleSelectGenericSingle = (value: Date | undefined) => {
    onSelect?.(value)
    setFilled(Boolean(value))
    setFocused(false)
  }

  const handleSelectGenericMultiple = (value: Date[] | undefined) => {
    onSelect?.(value)
    setFilled(Boolean(value && value?.length > 0))
  }

  const handleSelectGenericRange = (value: DateRange | undefined) => {
    onSelect?.(value)
    setFilled(Boolean(value && (value.from || value.to)))
  }

  const merged = {
    ...defaultBaseOptions,
    numberOfMonths: mode === 'range' ? 2 : 1,
    mode,
    modifiers: { weekend: (date: Date) => isSunday(date) },
    modifiersClassNames: {
      weekend: 'text-ds-destructive',
      outside:
        '[&:not([data-selected="true"])]:text-ds-subtlest/40 [&:not([data-selected="true"])]:font-thin',
    },
    ...options,
  } as Partial<DayPickerProps>

  return (
    <FormInputWrapper
      label={label}
      inputSize={inputSize}
      hasError={hasError}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      focused={focused}
      filled={filled}
      fullWidth={fullWidth}
    >
      <Popover.Root
        open={focused && !disabled && !readOnly}
        onOpenChange={handleOpenChange}
      >
        <Popover.Trigger asChild>
          <div className="relative">
            <input
              className={cn(
                'peer w-full pr-space-lg! placeholder-transparent focus:outline-none cursor-pointer',
                fieldPaddings[inputSize],
                floatingLabelBaseText[inputSize],
                disabled ? 'text-ds-subtlest' : 'text-ds-default',
                mode === 'multiple' && 'truncate max-w-[180px]'
              )}
              type="text"
              value={displayValue}
              disabled={disabled}
              readOnly
            />
            <FiCalendar className="h-4 w-4 absolute inset-y-0 right-3 my-auto flex-shrink-0 opacity-70 pointer-events-none" />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={cn(
              'z-[9999] bg-ds-elevation-surface p-space-sm rounded-xl shadow-2xl border border-ds-default',
              className
            )}
            side="bottom"
            align="center"
            sideOffset={8}
            collisionPadding={8}
            avoidCollisions
          >
            {mode === 'single' && (
              <DayPicker
                {...(merged as PropsSingle)}
                selected={parsedValue as Date | undefined}
                onSelect={(v: Date | undefined) => handleSelectGenericSingle(v)}
                components={componentsCommon as Partial<CustomComponents>}
                classNames={classNamesCommon(mode, isSameDayInRange)}
                showOutsideDays
              />
            )}

            {mode === 'multiple' && (
              <DayPicker
                {...(merged as PropsMulti)}
                selected={parsedValue as Date[] | undefined}
                onSelect={(v: Date[] | undefined) =>
                  handleSelectGenericMultiple(v)
                }
                components={componentsCommon as Partial<CustomComponents>}
                classNames={classNamesCommon(mode, isSameDayInRange)}
                data-mode={mode}
                showOutsideDays
              />
            )}

            {mode === 'range' && (
              <DayPicker
                {...(merged as PropsRange)}
                selected={parsedValue as DateRange | undefined}
                onSelect={(v: DateRange | undefined) =>
                  handleSelectGenericRange(v)
                }
                components={componentsCommon as Partial<CustomComponents>}
                classNames={classNamesCommon(mode, isSameDayInRange)}
                showOutsideDays
              />
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </FormInputWrapper>
  )
}

export default Calendar
