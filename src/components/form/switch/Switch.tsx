import { forwardRef } from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  checkedChildren?: React.ReactNode
  unCheckedChildren?: React.ReactNode
  className?: string
  autoFocus?: boolean
  onChange?: (checked: boolean) => void
}

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      checked,
      defaultChecked,
      disabled,
      checkedChildren,
      unCheckedChildren,
      autoFocus,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasCheckedChild =
      checkedChildren !== undefined && checkedChildren !== null
    const hasUncheckedChild =
      unCheckedChildren !== undefined && unCheckedChildren !== null
    const fixedWidth = !hasCheckedChild || !hasUncheckedChild
    const hasBothChildren = hasCheckedChild && hasUncheckedChild

    return (
      <SwitchPrimitives.Root
        ref={ref}
        className={cn(
          styles.root({
            checked: checked ?? false,
            disabled: disabled ?? false,
            fixedWidth,
            hasBothChildren,
          }),
          className
        )}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        autoFocus={autoFocus}
        onCheckedChange={state => onChange?.(state)}
        {...props}
      >
        <div
          className={styles.innerContainer({
            checked: checked ?? false,
            hasBothChildren,
          })}
        >
          <span
            className={styles.checkedChildren({ checked: checked ?? false })}
          >
            {checkedChildren}
          </span>
          <span
            className={styles.unCheckedChildren({ checked: checked ?? false })}
          >
            {unCheckedChildren}
          </span>
        </div>

        <SwitchPrimitives.Thumb
          className={styles.thumb({ checked: checked ?? false })}
        />
      </SwitchPrimitives.Root>
    )
  }
)

Switch.displayName = 'Switch'
