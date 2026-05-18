export const styles = {
  portal: 'fixed inset-0 z-[9999]',
  overlay: 'absolute inset-0 bg-ds-elevation-surface-overlay',
  drawer: 'absolute bg-ds-elevation-surface shadow-2xl flex flex-col',
  header: 'flex items-center gap-2 p-space-md border-b border-ds-default',
  closeButton:
    'p-space-xs rounded-full hover:bg-ds-inverse-subtle-hovered/20 transition-colors cursor-pointer',
  title: 'text-heading-md font-semibold text-ds-default',
  head: 'p-space-md border-b',
  contentBase: 'flex-1 overflow-auto p-space-md',
  closeIcon: 'w-5 h-5 text-(--fill-ds-icon-subtle)',
}

export default styles
