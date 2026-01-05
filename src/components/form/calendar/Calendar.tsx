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
import { isSameDay, isSunday, format as formatDateFns } from 'date-fns'
import { GoChevronRight, GoChevronLeft, GoChevronDown } from 'react-icons/go'
import { FiCalendar } from 'react-icons/fi'
import { cn } from '@/utils/tailwind'
import { FormInputWrapper } from '@/components/form/FormInputWrapper'
import { type FieldSize } from '@/components/_core/field-config'
import {
  triggerWrapper,
  inputClass,
  prevButton,
  nextButton,
  dropdownRoot,
  dropdownSelect,
  weekday as weekdayClass,
  iconClass,
  monthCaption,
  dropdownNav,
  chevronIcon,
  selectBase,
  optionClass,
  getClassNamesCommon,
  content as contentClass,
} from './styles'
import { parseSelected } from './_utils/parse'
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
  }) => <div className={cn(monthCaption(className))}>{children}</div>,
  DropdownNav: ({ children }: { children?: React.ReactNode }) => (
    <div className={dropdownNav()}>{children}</div>
  ),
  PreviousMonthButton: (props: React.HTMLAttributes<HTMLButtonElement>) => (
    <button {...props} className={cn(prevButton)}>
      <GoChevronLeft className={chevronIcon} />
    </button>
  ),
  NextMonthButton: (props: React.HTMLAttributes<HTMLButtonElement>) => (
    <button {...props} className={cn(nextButton)}>
      <GoChevronRight className={chevronIcon} />
    </button>
  ),
  Dropdown: (props: {
    options?: DropdownOption[]
    components: CustomComponents
    classNames: ClassNames
    [key: string]: unknown
  }) => {
    const { options, className, components, classNames, ...selectProps } = props
    const cnMap = classNames as Record<string, string> | undefined
    const rawDropdown = cnMap?.[UI.DropdownRoot]
    const dropdownClass =
      typeof rawDropdown === 'string' ? rawDropdown : undefined
    const safeClassName = typeof className === 'string' ? className : undefined
    return (
      <div
        data-disabled={selectProps.disabled}
        className={cn(dropdownClass, dropdownRoot(safeClassName))}
      >
        <components.Select className={cn(dropdownSelect)} {...selectProps}>
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
          <GoChevronDown className={chevronIcon} />
        </span>
      </div>
    )
  },
  Select: ({
    className,
    ...props
  }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={cn(selectBase(className))} />
  ),
  Option: (props: React.OptionHTMLAttributes<HTMLOptionElement>) => (
    <option {...props} className={optionClass} />
  ),
  Weekday: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => {
    const isSun = props['aria-label'] === 'Sunday'
    return <th {...props} className={weekdayClass(isSun)} />
  },
}

const classNamesCommon = (mode: string, isSameDayInRange?: boolean) =>
  getClassNamesCommon(mode, isSameDayInRange)

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

  const parsedValue = useMemo(
    () => parseSelected(selected, mode, formatDate),
    [selected, mode, formatDate]
  )

  const displayMonth = useMemo(() => {
    if (!parsedValue) return undefined
    if (mode === 'single' && parsedValue instanceof Date) return parsedValue
    if (mode === 'multiple' && Array.isArray(parsedValue)) return parsedValue[0]
    if (
      mode === 'range' &&
      typeof parsedValue === 'object' &&
      parsedValue !== null
    ) {
      const pr = parsedValue as DateRange
      return pr.from ?? pr.to ?? undefined
    }
    return undefined
  }, [parsedValue, mode])

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
          <div className={triggerWrapper}>
            <input
              className={inputClass(inputSize, disabled, mode)}
              type="text"
              value={displayValue}
              disabled={disabled}
              readOnly
            />
            {FiCalendar && <FiCalendar className={iconClass} />}
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className={contentClass(className)}
            side="bottom"
            align="center"
            sideOffset={8}
            collisionPadding={8}
            avoidCollisions
          >
            {mode === 'single' && (
              <DayPicker
                {...(merged as PropsSingle)}
                month={displayMonth}
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
                month={displayMonth}
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
                month={displayMonth}
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
