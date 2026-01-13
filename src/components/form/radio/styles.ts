import { cn } from '@/utils/tailwind'

export const root = 'inline-flex items-center'

export const wrapper = 'relative flex items-center cursor-pointer'

export function inputClass() {
  return cn(
    'peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-ds-input checked:border-ds-selected hover:border-ds-selected/40 transition-all'
  )
}

export const innerDot =
  'absolute bg-ds-selected-bold w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'

export const label = 'ml-2 text-ds-default cursor-pointer text-body-md'

export default {
  root,
  wrapper,
  inputClass,
  innerDot,
  label,
}
