import React, { useEffect, useRef } from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { FiCheck } from 'react-icons/fi'
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './Command'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

export type CommandMenuItem = {
  id: string
  label: string
  icon?: React.ElementType
  onSelect: () => void
  value?: string
  disabled?: boolean
  shortcut?: string
}

export type CommandMenuGroup = {
  id: string
  heading?: string
  items: CommandMenuItem[]
}

export type CommandMenuProps = {
  groups: CommandMenuGroup[]
  placeholder?: string
  emptyState?: string
  value?: string
  className?: string
  selectable?: boolean
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  groups,
  placeholder = 'Type a command or search...',
  emptyState = 'No results found.',
  value: selectedValue,
  className,
  selectable = true,
}) => {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.focus()
    }
  }, [])

  return (
    <CommandPrimitive>
      <CommandInput placeholder={placeholder} />

      <CommandList ref={listRef} tabIndex={-1} className={styles.menu.list}>
        <CommandEmpty>{emptyState}</CommandEmpty>
        <div className={cn(className)}>
          {groups.map((group, index) => {
            if (group.items.length === 0) {
              return null
            }

            return (
              <React.Fragment key={group.id}>
                {index > 0 && <CommandSeparator />}

                <CommandGroup heading={group.heading}>
                  {group.items.map(
                    ({
                      id,
                      label,
                      icon: Icon,
                      onSelect,
                      value,
                      disabled,
                      shortcut,
                    }) => (
                      <CommandItem
                        key={id}
                        onSelect={onSelect}
                        value={value ?? label}
                        disabled={disabled}
                        isSelected={Boolean(id === selectedValue) && selectable}
                      >
                        {Icon && <Icon className={styles.menu.itemIcon} />}
                        <span>{label}</span>
                        <div className={styles.menu.itemContent}>
                          {shortcut && (
                            <kbd className={styles.menu.shortcut}>
                              {shortcut}
                            </kbd>
                          )}
                          {id === selectedValue && selectable && FiCheck && (
                            <FiCheck className={styles.menu.checkIcon} />
                          )}
                        </div>
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </React.Fragment>
            )
          })}
        </div>
      </CommandList>
    </CommandPrimitive>
  )
}
