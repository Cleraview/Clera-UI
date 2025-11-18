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
        theme === 'dark' ? 'bg-[#262626]' : 'bg-[#ffffff] border-default'
      )}
    >
      <div
        className={cn(
          'w-full h-7 rounded shadow-sm',
          theme === 'dark' && 'border border-[#404040]'
        )}
        style={{ backgroundColor: color ?? 'transparent' }}
      />
      <p
        className={cn(
          'm-0! text-body-sm! text-center pointer-events-none font-(--font-code)',
          theme === 'dark' ? 'text-[#ffffff]!' : 'text-[#262626]!'
        )}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}
