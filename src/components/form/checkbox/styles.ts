export const styles = {
  container: 'relative inline-flex items-center',
  disabledOpacity: 'opacity-50',

  rootBase:
    'absolute left-0 peer h-5 w-5 appearance-none rounded-sm border border-ds-input transition-all',
  rootChecked:
    'data-[state=checked]:bg-ds-selected-bold data-[state=checked]:border-ds-selected',
  rootFocus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  rootDisabled: 'cursor-not-allowed',
  rootDefaultCursor: 'cursor-pointer',

  indicatorIcon: 'pl-[2px] text-ds-inverse',

  labelBase: 'ml-space-lg text-ds-default text-body-md',
  labelDisabledCursor: 'cursor-not-allowed',
  labelDefaultCursor: 'cursor-pointer',
}

export default styles
