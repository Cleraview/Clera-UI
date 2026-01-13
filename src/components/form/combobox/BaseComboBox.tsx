'use client'

import {
  forwardRef,
  useId,
  Children,
  isValidElement,
  Fragment,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
  ReactElement,
  cloneElement,
} from 'react'
import * as Popover from '@radix-ui/react-popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandLoading,
} from 'cmdk'
import { FormInputWrapper } from '../FormInputWrapper'
import { FiChevronDown } from 'react-icons/fi'
import {
  type FieldSize,
  fieldPaddings,
  floatingLabelBaseText,
} from '@/components/_core/field-config'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export type BaseComboBoxProps = {
  id?: string
  label: string
  value?: string
  displayValue?: ReactNode
  placeholder?: string

  open: boolean
  onOpenChange: (open: boolean) => void

  searchValue: string
  onSearchChange: (value: string) => void
  shouldFilter?: boolean

  inputSize?: FieldSize
  fullWidth?: boolean
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  hasError?: boolean

  children: ReactNode
  className?: string
  triggerClassName?: string
}

export const BaseComboBox = forwardRef<HTMLButtonElement, BaseComboBoxProps>(
  (
    {
      id: idProp,
      label,
      value,
      displayValue,
      placeholder = 'Select...',

      open,
      onOpenChange,

      searchValue,
      onSearchChange,
      shouldFilter = true,

      inputSize = 'md',
      fullWidth,
      readOnly,
      disabled,
      required,
      hasError,
      children,
      className,
      triggerClassName,
    },
    ref
  ) => {
    const customId = useId()
    const inputId = idProp ?? customId
    const filled = !!value

    const flatten = (nodes: ReactNode): ReactElement[] => {
      const out: ReactElement[] = []
      Children.forEach(nodes, node => {
        if (!isValidElement(node)) return
        if (node.type === Fragment) {
          const childNodes = (node.props as { children?: ReactNode }).children
          out.push(...flatten(childNodes))
        } else {
          out.push(node)
        }
      })
      return out
    }

    const renderedChildren: ReactNode[] = (() => {
      const flat = flatten(children)
      return flat.map((child, idx, arr) => {
        const next = arr[idx + 1] as ReactElement | undefined

        const isGroup =
          isValidElement(child) &&
          typeof (child.props as { heading?: unknown })?.heading !== 'undefined'
        const nextIsGroup =
          isValidElement(next) &&
          typeof (next?.props as { heading?: unknown })?.heading !== 'undefined'

        if (isValidElement(child) && child.type === ComboBoxItem) {
          const comboBoxChild = child as ReactElement<{ disabled?: boolean }>
          const { disabled } = comboBoxChild.props
          return (
            <Fragment key={idx}>
              {cloneElement(comboBoxChild, { disabled: !!disabled })}
              {isGroup && nextIsGroup && <div className={styles.separator} />}
            </Fragment>
          )
        }

        return (
          <Fragment key={idx}>
            {child}
            {isGroup && nextIsGroup && <div className={styles.separator} />}
          </Fragment>
        )
      })
    })()

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
        className={className}
      >
        <Popover.Root open={open} onOpenChange={onOpenChange}>
          <Popover.Trigger
            ref={ref}
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-label={label}
            disabled={disabled || readOnly}
            className={cn(
              styles.triggerBase,
              styles.triggerFilledFalse,
              disabled ? styles.triggerTextDisabled : styles.triggerTextDefault,
              fieldPaddings[inputSize],
              triggerClassName
            )}
            onClick={() => !readOnly && onOpenChange(!open)}
          >
            <span
              className={cn(
                styles.placeholderSpan,
                floatingLabelBaseText[inputSize]
              )}
            >
              {placeholder}
            </span>
            <span
              data-filled={filled}
              className={cn(
                styles.valueAbsolute,
                hasError ? 'text-ds-destructive' : 'text-ds-default',
                !value && 'invisible',
                floatingLabelBaseText[inputSize]
              )}
            >
              {value ? displayValue : placeholder}
            </span>

            {FiChevronDown && (
              <FiChevronDown
                aria-hidden="true"
                className={cn(
                  styles.chevIcon,
                  hasError && 'text-ds-destructive!',
                  open && 'rotate-180'
                )}
              />
            )}
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content
              className={styles.popoverContent}
              sideOffset={4}
              side="bottom"
              align="start"
            >
              <Command
                className={styles.command}
                shouldFilter={shouldFilter}
                aria-label={`${label} options`}
              >
                <CommandInput
                  className={cn(
                    styles.commandInputBase,
                    fieldPaddings[inputSize]
                  )}
                  placeholder="Search..."
                  value={searchValue}
                  onValueChange={onSearchChange}
                  aria-label={`Search ${label}`}
                />
                <CommandList className={styles.commandList}>
                  {renderedChildren}
                </CommandList>
              </Command>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </FormInputWrapper>
    )
  }
)
BaseComboBox.displayName = 'BaseComboBox'

export const ComboBoxItem = forwardRef<
  ElementRef<typeof CommandItem>,
  ComponentPropsWithoutRef<typeof CommandItem> & {
    inputSize?: FieldSize
    isSelected?: boolean
    disabled?: boolean
  }
>(({ className, inputSize = 'md', isSelected, disabled, ...props }, ref) => (
  <CommandItem
    ref={ref}
    className={cn(
      styles.commandItem,
      isSelected ? styles.commandItemSelected : styles.commandItemUnselected,
      disabled && styles.commandItemDisabled,
      floatingLabelBaseText[inputSize],
      className
    )}
    disabled={disabled}
    {...props}
  />
))
ComboBoxItem.displayName = 'ComboBoxItem'

export const ComboBoxGroup = forwardRef<
  ElementRef<typeof CommandGroup>,
  ComponentPropsWithoutRef<typeof CommandGroup>
>(({ className, ...props }, ref) => (
  <CommandGroup ref={ref} className={cn(styles.group, className)} {...props} />
))
ComboBoxGroup.displayName = 'ComboBoxGroup'

export const ComboBoxEmpty = forwardRef<
  ElementRef<typeof CommandEmpty>,
  ComponentPropsWithoutRef<typeof CommandEmpty>
>(({ className, ...props }, ref) => (
  <CommandEmpty ref={ref} className={cn(styles.empty, className)} {...props} />
))
ComboBoxEmpty.displayName = 'ComboBoxEmpty'

export const ComboBoxLoading = CommandLoading
