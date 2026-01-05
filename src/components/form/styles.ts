import { cn } from '@/utils/tailwind'
import type { FieldSize } from '@/components/_core/field-config'
import {
  floatingLabelActive,
  floatingLabelBase,
  floatingLabelBaseText,
  floatingLabelBaseWithIcon,
  floatingLabelActiveWithIcon,
} from '@/components/_core/field-config'
import { fieldIconPosition } from '@/components/_core/field-config'
import { elementIconSizes } from '@/components/_core/element-config'

export const root = (fullWidth?: boolean, disabled?: boolean) =>
  cn(
    'relative bg-ds-elevation-surface',
    fullWidth && 'w-full',
    disabled && 'opacity-60'
  )

export const labelClass = (opts: {
  focused?: boolean
  filled?: boolean
  readOnly?: boolean
  disabled?: boolean
  inputSize?: FieldSize
  inputType?: string
  hasIcon?: boolean
}) => {
  const {
    focused,
    filled,
    readOnly,
    disabled,
    inputSize = 'md',
    inputType,
    hasIcon,
  } = opts

  return cn(
    'absolute transition-all whitespace-nowrap z-[1] pointer-events-none',
    focused || filled || readOnly || disabled
      ? [
          hasIcon
            ? floatingLabelActiveWithIcon[inputSize]
            : floatingLabelActive[inputSize],
        ]
      : [
          hasIcon
            ? floatingLabelBaseWithIcon[inputSize]
            : floatingLabelBase[inputSize],
          floatingLabelBaseText[inputSize],
        ],
    disabled && 'cursor-not-allowed',
    inputType === 'select' && !disabled && 'cursor-pointer'
  )
}

export const container = (disabled?: boolean) =>
  cn('relative', disabled && '[&>*]:cursor-not-allowed!')

export const fieldset = (stateClass: string) =>
  cn(
    'absolute inset-0 rounded-sm pl-2.5 pr-space-xl pointer-events-none border transition-all duration-200',
    stateClass
  )

export const legendClass = (inputSize?: FieldSize, active?: boolean) =>
  cn(
    'w-auto h-0 p-0 transition-all duration-200 invisible whitespace-nowrap',
    floatingLabelBaseText[inputSize ?? 'md'],
    active ? 'max-w-full px-1' : 'max-w-[0.01px] px-0'
  )

export const errorText = 'text-label-sm text-ds-destructive'

export const itemRoot = (className?: string) => cn('space-y-1', className)

export const iconClass = (
  inputSize: FieldSize = 'md',
  position: 'left' | 'right' = 'left'
) =>
  cn(
    elementIconSizes[inputSize],
    'absolute',
    fieldIconPosition[position][inputSize],
    'z-10 text-ds-subtlest pointer-events-none'
  )

export default {
  root,
  labelClass,
  container,
  fieldset,
  legendClass,
  errorText,
  itemRoot,
}
