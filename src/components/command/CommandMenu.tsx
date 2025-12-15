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
  CommandItemProps,
} from './Command'
import { cn } from '@/utils/tailwind'

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
  size?: CommandItemProps['size']
  value?: string
  className?: string
  selectable?: boolean
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  groups,
  placeholder = 'Type a command or search...',
  emptyState = 'No results found.',
  size = 'sm',
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
      <CommandInput placeholder={placeholder} size={size} />

      <CommandList
        ref={listRef}
        tabIndex={-1}
        className="bg-ds-elevation-surface"
      >
        <CommandEmpty>{emptyState}</CommandEmpty>
        <div className={cn(className)}>
          {groups.map((group, index) => {
            if (group.items.length === 0) {
              return null
            }

            return (
              <React.Fragment key={group.id}>
                {index > 0 && <CommandSeparator />}

                <CommandGroup heading={group.heading} size={size}>
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
                        size={size}
                        disabled={disabled}
                        isSelected={Boolean(id === selectedValue) && selectable}
                      >
                        {Icon && (
                          <Icon className="mr-space-sm h-4 w-4 text-(--fill-ds-icon-accent-gray)" />
                        )}
                        <span>{label}</span>
                        <div className="ml-auto flex items-center gap-space-sm">
                          {shortcut && (
                            <kbd className="h-5 select-none items-center gap-1 rounded bg-ds-inverse-subtle px-space-xs font-mono text-body-xs font-medium text-ds-default sm:inline-flex">
                              {shortcut}
                            </kbd>
                          )}
                          {id === selectedValue && selectable && (
                            <FiCheck className="h-4 w-4" />
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
