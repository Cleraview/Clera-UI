import { cn } from '@/utils/tailwind'
import type { FieldSize, FieldState } from '@/components/_core/field-config'
import {
  floatingLabelBase,
  floatingLabelBaseText,
  floatingLabelTextActive,
  floatingLabelBaseWithIcon,
  fieldPaddingsWithIcon,
  fieldPaddingsWithIconRight,
  fieldPaddings,
  fieldStateStyles,
  fieldIconPosition,
  floatingLabelActive,
  fieldHorizontalPadding,
} from '@/components/_core/field-config'
import { elementIconSizes } from '@/components/_core/element-config'
import type { IconPosition } from './types'

type LabelOptions = {
  focused?: boolean
  filled?: boolean
  readOnly?: boolean
  disabled?: boolean
  inputSize?: FieldSize
  inputType?: string
  hasIcon?: boolean
  state: FieldState
  iconPosition?: IconPosition
}

export const getPaddingClass = (size: FieldSize, pos?: IconPosition) =>
  pos === 'left'
    ? fieldPaddingsWithIcon[size]
    : pos === 'right'
      ? fieldPaddingsWithIconRight[size]
      : fieldPaddings[size]

export const root = (fullWidth?: boolean, disabled?: boolean) =>
  cn(
    'relative bg-ds-elevation-surface',
    fullWidth && 'w-full',
    disabled && 'opacity-60'
  )

export const inputContentWrapper = (fullWidth?: boolean, disabled?: boolean) =>
  cn(
    'inline-flex flex-col justify-center',
    fullWidth ? 'w-full' : 'min-w-[20ch]',
    disabled && 'cursor-not-allowed'
  )

export const labelClass = (opts: LabelOptions) => {
  const {
    focused,
    filled,
    readOnly,
    disabled,
    inputSize = 'md',
    inputType,
    hasIcon,
    iconPosition = 'left' as IconPosition,
    state,
  } = opts

  return cn(
    'w-full h-fit absolute inset-y-0 left-0 block transition-all whitespace-nowrap overflow-hidden truncate z-[1] pointer-events-none text-ds-subtlest',
    focused || filled || readOnly || disabled
      ? [floatingLabelActive[inputSize], floatingLabelTextActive[inputSize]]
      : [
          hasIcon
            ? floatingLabelBaseWithIcon[iconPosition][inputSize]
            : floatingLabelBase[inputSize],
          floatingLabelBaseText[inputSize],
        ],

    fieldStateStyles[state].label,
    // disabled && 'cursor-not-allowed',
    inputType === 'select' && !disabled && 'cursor-pointer'
  )
}

export const inputClasses = (
  inputSize: FieldSize,
  disabled?: boolean,
  hasError?: boolean,
  iconPosition?: IconPosition | undefined
) => {
  const paddingClass = getPaddingClass(inputSize, iconPosition)

  return cn(
    'peer w-full placeholder-transparent box-border focus:outline-none bg-transparent',
    paddingClass,
    floatingLabelBaseText[inputSize],
    disabled ? 'text-ds-disabled cursor-not-allowed' : 'text-ds-default',
    hasError && fieldStateStyles.error.text
  )
}

export const sizingShim = (
  inputSize: FieldSize,
  iconPosition?: IconPosition
) => {
  const paddingClass = getPaddingClass(inputSize, iconPosition)
  const textSizeClass = floatingLabelBaseText[inputSize]

  return cn(paddingClass, textSizeClass)
}

export const sizingShimSpan = 'invisible select-none pointer-events-none'

export const interactiveLayer = (disabled: boolean | undefined) =>
  cn(
    'h-fit absolute inset-0 box-border inline-flex items-center',
    disabled && 'pointer-events-none'
  )

export const container = (disabled?: boolean | undefined) =>
  cn('relative', disabled && '[&>*]:cursor-not-allowed!')

export const fieldset = (
  state: FieldState,
  active?: boolean,
  inputSize: FieldSize = 'md'
) =>
  cn(
    'min-w-[0%] absolute bottom-0 left-0 w-full rounded-sm pointer-events-none border transition-all duration-200 overflow-hidden',
    active ? '-top-1.5' : 'top-0',
    fieldHorizontalPadding[inputSize],
    fieldStateStyles[state].border
  )

export const legendClass = (inputSize: FieldSize, active?: boolean) =>
  cn(
    'transition-all duration-200 invisible',
    active
      ? ['max-w-full h-4 px-1', floatingLabelTextActive[inputSize]]
      : 'max-w-[0.01px] h-0 p-0'
  )

export const errorText = 'text-label-sm text-ds-destructive'

export const itemRoot = (className?: string) => cn('space-y-1', className)

export const iconClass = (
  inputSize: FieldSize = 'md',
  position: IconPosition = 'left'
) =>
  cn(
    'absolute z-10 text-ds-subtlest pointer-events-none',
    elementIconSizes[inputSize],
    fieldIconPosition[position][inputSize]
  )

export default {
  root,
  inputContentWrapper,
  labelClass,
  container,
  fieldset,
  legendClass,
  errorText,
  itemRoot,
}
