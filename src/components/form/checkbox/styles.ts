export const styles = {
  container: 'relative inline-flex items-center',
  disabledContainer: 'cursor-not-allowed opacity-60',

  rootBase:
    'absolute left-0 peer h-5 w-5 appearance-none rounded-sm border border-ds-input transition-all',
  rootChecked:
    'data-[state=checked]:bg-ds-selected-bold data-[state=checked]:border-ds-selected',
  rootFocus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  rootDisabled:
    'data-[state=checked]:bg-ds-disabled data-[state=checked]:border-ds-disabled cursor-not-allowed',
  rootDefaultCursor: 'cursor-pointer',

  indicatorIcon: 'pl-[2px] text-ds-inverse dark:text-ds-default',

  labelBase: 'ml-space-lg text-body-md',
  labelDisabledCursor: 'pointer-events-none text-ds-disabled',
  labelDefaultCursor: 'cursor-pointer text-ds-default ',
}

export default styles
