import { cn } from '@/utils/tailwind'
import {
  type FieldSize,
  fieldPaddings,
  fieldPaddingsWithIcon,
  fieldPaddingsWithIconRight,
  floatingLabelBaseText,
  fieldStateStyles,
} from '@/components/_core/field-config'

export function inputClasses(
  inputSize: FieldSize,
  disabled?: boolean,
  hasError?: boolean,
  iconPosition?: 'left' | 'right'
) {
  const paddingClass =
    iconPosition === 'left'
      ? fieldPaddingsWithIcon[inputSize]
      : iconPosition === 'right'
        ? fieldPaddingsWithIconRight[inputSize]
        : fieldPaddings[inputSize]

  return cn(
    'peer w-full placeholder-transparent focus:outline-none bg-transparent',
    paddingClass,
    floatingLabelBaseText[inputSize],
    disabled ? 'text-ds-subtlest' : 'text-ds-default',
    hasError && fieldStateStyles.error.text
  )
}

export default {
  inputClasses,
}
