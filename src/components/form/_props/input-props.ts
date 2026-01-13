export type InputSize = 'sm' | 'md' | 'lg'

export const labelPositions: Record<InputSize, string> = {
  sm: 'translate-x-[14px] translate-y-[4px]',
  md: 'translate-x-[16px] translate-y-[6px]',
  lg: 'translate-x-[20px] translate-y-[12px]',
}

export const labelFocusedPositions: Record<InputSize, string> = {
  sm: '-translate-y-3!',
  md: 'translate-x-[14px]! -translate-y-3.5!',
  lg: 'translate-x-[14px]! -translate-y-3!',
}

export const labelSizes: Record<InputSize, string> = {
  sm: 'text-body-sm leading-4',
  md: 'text-body-md leading-5',
  lg: 'text-body-lg leading-6',
}

export const labelFocusedSizes: Record<InputSize, string> = {
  sm: 'text-body-xs',
  md: 'text-body-sm',
  lg: 'text-body-md',
}

export const inputSizes: Record<InputSize, string> = {
  sm: 'px-2 py-2',
  md: 'px-3 py-2',
  lg: 'px-4 py-3',
}

export const inputColors = {
  default: {
    label: 'text-ds-subtlest',
    border: 'border-ds-input',
  },
  focused: {
    label: 'text-ds-accent-violet',
    border: 'border-[2px] border-ds-focused',
  },
  error: {
    label: 'text-ds-destructive',
    border: 'border-ds-destructive',
    text: 'text-ds-destructive',
  },
}
