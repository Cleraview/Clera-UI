import { cn } from '@/utils'

export type ColorBoxProps = {
  color?: string | null
  value?: string | null
  label?: string
  theme?: 'light' | 'dark'
}

export const ColorBox = ({ color, value, theme = 'light' }: ColorBoxProps) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center gap-space-sm p-[6px] border rounded-md shadow-elevation-overflow/20 cursor-pointer',
        theme === 'dark'
          ? 'bg-neutral-bold/90 hover:bg-neutral-bold-hovered'
          : 'bg-input hover:bg-input-hovered/50 border-default'
      )}
    >
      <div
        className={cn(
          'w-full h-7 rounded shadow-sm',
          theme === 'dark' && 'border border-accent-gray'
        )}
        style={{ backgroundColor: color ?? 'transparent' }}
      />
      <p
        className={cn(
          'm-0! font-mono text-body-sm! text-center pointer-events-none',
          theme === 'dark' ? 'text-inverse!' : ''
        )}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}
