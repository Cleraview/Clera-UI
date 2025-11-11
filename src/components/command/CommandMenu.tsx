import * as React from 'react'
import { FiCheck } from 'react-icons/fi'
import {
  Command,
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
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  groups,
  placeholder = 'Type a command or search...',
  emptyState = 'No results found.',
  size = 'md',
  value: selectedValue,
  className,
}) => {
  return (
    <Command>
      <CommandInput placeholder={placeholder} size={size} />
      <CommandList>
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
                        isSelected={Boolean(id === selectedValue)}
                      >
                        {Icon && <Icon className="mr-space-sm h-4 w-4" />}
                        <span>{label}</span>
                        <div className="ml-auto flex items-center gap-space-sm">
                          {shortcut && (
                            <kbd className="hidden h-5 select-none items-center gap-1 rounded border border-default bg-inverse px-space-xs font-mono text-xs font-medium text-default sm:inline-flex">
                              {shortcut}
                            </kbd>
                          )}
                          {id === selectedValue && (
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
    </Command>
  )
}
