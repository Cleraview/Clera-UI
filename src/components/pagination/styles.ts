export const styles = {
  root: 'mx-auto flex w-full justify-center',
  content: 'flex flex-row items-center gap-1',
  item: '',
  linkBase:
    'flex items-center justify-center rounded-md text-label-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ds-brand/20 select-none',
  linkTextDefault: 'text-ds-default',
  linkSizeDefault: 'h-9 w-9',
  linkSizeSm: 'h-8 w-8 text-label-xs',
  linkSizeLg: 'h-10 w-10 text-label-md',
  linkActive:
    'bg-ds-selected-bold text-ds-inverse dark:text-ds-default cursor-default',
  linkDisabled: 'cursor-not-allowed opacity-50',
  linkHover: 'hover:bg-ds-neutral-subtle-hovered',
  linkPrevExtra: 'gap-1 pl-2.5 pr-3 w-auto',
  linkNextExtra: 'gap-1 pl-3 pr-2.5 w-auto',
  ellipsis: 'flex h-9 w-9 items-center justify-center text-ds-subtle',
  ellipsisIcon: 'h-4 w-4',
  chevronIcon: 'h-3.5 w-3.5',
}

export default styles
