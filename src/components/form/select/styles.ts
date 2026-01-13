import { cn } from '@/utils'
import {
  type FieldSize,
  floatingLabelBaseText,
  fieldPaddings,
} from '@/components/_core/field-config'
import { getPaddingClass } from '../styles'

const base = {
  trigger:
    'w-full bg-transparent text-left whitespace-nowrap overflow-hidden truncate',
  triggerFilledFalse: '[&>[data-filled="false"]]:invisible',
  triggerHasError: '[&>[data-has-error="true"]]:text-ds-destructive',
  triggerDisabled: 'text-ds-subtlest cursor-not-allowed',
  triggerDefault: 'outline-none text-ds-default cursor-pointer',

  valueDefault: 'text-ds-default',
  valueError: 'text-ds-destructive',

  item: cn(
    'flex items-center justify-between rounded-sm cursor-pointer outline-none',
    'text-ds-default focus:text-ds-default focus:bg-ds-neutral-subtle-hovered dark:focus:bg-ds-neutral-hovered',
    'data-[state=checked]:bg-ds-selected data-[state=checked]:text-ds-selected dark:data-[state=checked]:text-ds-default',
    'data-[state=checked]:focus:bg-ds-selected',
    'data-[disabled]:text-ds-disabled data-[disabled]:cursor-not-allowed'
  ),
  itemDisabled:
    'cursor-not-allowed text-ds-disabled [&>svg]:fill-ds-disabled hover:bg-transparent',
}

type TriggerOptions = {
  inputSize: FieldSize
  hasError?: boolean
  disabled?: boolean
  className?: string
}

export const triggerClass = (opts: TriggerOptions) =>
  cn(
    base.trigger,
    base.triggerFilledFalse,
    getPaddingClass(opts.inputSize, 'right'),
    floatingLabelBaseText[opts.inputSize],
    opts.hasError && base.triggerHasError,
    opts.disabled ? base.triggerDisabled : base.triggerDefault,
    opts.className
  )

export const valueClass = (inputSize: FieldSize, hasError?: boolean) =>
  cn(
    hasError ? base.valueError : base.valueDefault,
    floatingLabelBaseText[inputSize]
  )

export const itemClass = (inputSize: FieldSize, disabled?: boolean) =>
  cn(
    base.item,
    fieldPaddings[inputSize],
    floatingLabelBaseText[inputSize],
    disabled && base.itemDisabled
  )

export const styles = {
  iconBase: 'w-4 h-4 ml-space-sm text-ds-subtlest',
  iconError: 'text-ds-destructive!',

  content:
    'w-[var(--radix-select-trigger-width)] z-50 bg-ds-elevation-surface rounded-md bg-default shadow-md border border-ds-default',
  viewport: 'p-space-xs',

  itemIndicatorIcon: 'w-4 h-4 ml-space-md text-(--fill-ds-icon-primary)',
}

export default styles
