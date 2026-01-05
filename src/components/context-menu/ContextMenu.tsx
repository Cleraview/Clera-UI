'use client'

import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ReactElement,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type Attributes,
  type MouseEvent,
} from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { GoChevronRight } from 'react-icons/go'
import { FaCircleCheck, FaCircle } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'
import { styles } from './styles'

const ContextMenuRoot = ContextMenuPrimitive.Root
const ContextMenuTrigger = ContextMenuPrimitive.Trigger
const ContextMenuGroup = ContextMenuPrimitive.Group
const ContextMenuPortal = ContextMenuPrimitive.Portal
const ContextMenuSub = ContextMenuPrimitive.Sub
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      styles.subTrigger,
      inset && styles.subTriggerInset,
      className
    )}
    {...props}
  >
    {children}
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(styles.subContent, className)}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(styles.item, inset && styles.itemInset, className)}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      styles.checkboxItem,
      checked && styles.itemSelected,
      className
    )}
    checked={checked}
    {...props}
  >
    <span className={styles.iconWrapper}>
      {FaCircleCheck && (
        <FaCircleCheck
          className={cn(
            styles.checkboxIcon,
            checked ? styles.checkboxIconChecked : styles.checkboxIconDefault
          )}
        />
      )}
    </span>
    <div className={styles.labelGroup}>
      <span>{children}</span>
    </div>
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    checked?: boolean
  }
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(styles.radioItem, checked && styles.itemSelected, className)}
    {...props}
  >
    <span className={styles.iconWrapperRadio}>
      {FaCircle && <FaCircle className={styles.radioIcon} />}
    </span>
    <div className={styles.labelGroup}>
      <span>{children}</span>
    </div>
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(styles.label, inset && styles.subTriggerInset, className)}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

export type ContextMenuItemDef =
  | string
  | ReactElement
  | {
      type?: 'item' | 'label' | 'separator' | 'checkbox' | 'radio'
      label?: ReactNode
      icon?: ElementType
      shortcut?: string
      disabled?: boolean
      onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
      className?: string
      children?: ContextMenuItemDef[]
      checked?: boolean
      onCheckedChange?: (checked: boolean) => void
      value?: string
      groupId?: string
      id?: string
    }

type RadioItemDef = {
  type?: 'radio'
  label?: ReactNode
  value?: string
  groupId?: string
  checked?: boolean
  className?: string
  disabled?: boolean
  id?: string
}

interface ContextMenuProps extends ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Root
> {
  items: ContextMenuItemDef[] | Record<string, never>[]
  trigger: ReactNode
  width?: string | number
  className?: string
  closeOnSelect?: boolean
  onCheckboxToggle?: (value: string, checked: boolean) => void
  onRadioSelect?: (value: string) => void
  onSelect?: (value: string, item?: ContextMenuItemDef) => void
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: ContextMenuItemDef
  ) => void
}

const ContextMenu = ({
  trigger,
  items,
  width = 240,
  className,
  onOpenChange,
  closeOnSelect = true,
  onCheckboxToggle,
  onRadioSelect,
  onSelect,
  onGroupSelect,
  ...props
}: ContextMenuProps) => {
  type ItemProps = {
    onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
  }

  const invokeOnClick = (props: ItemProps | undefined, e: MouseEvent) => {
    props?.onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
  }

  const isCheckboxChecked = (node: ContextMenuItemDef | undefined) =>
    !!node &&
    typeof node !== 'string' &&
    !isValidElement(node) &&
    node.type === 'checkbox' &&
    Boolean(node.checked)

  const computeRoundedClass = (itemNode: ContextMenuItemDef, idx: number) => {
    const prevChecked = isCheckboxChecked(items[idx - 1])
    const nextChecked = isCheckboxChecked(items[idx + 1])
    const itemChecked = Boolean((itemNode as { checked?: boolean }).checked)

    if (!itemChecked) return styles.checkboxRoundedSingle
    if (prevChecked && nextChecked) return styles.checkboxRoundedMiddle
    if (prevChecked) return styles.checkboxRoundedBottom
    if (nextChecked) return styles.checkboxRoundedTop
    return styles.checkboxRoundedSingle
  }

  const makeCheckboxClickHandler = (
    itemNode: ContextMenuItemDef & {
      checked?: boolean
      value?: string
      groupId?: string
    },
    propsObj: ItemProps | undefined
  ) => {
    return (e: MouseEvent) => {
      const nextCheckedState = !Boolean(itemNode.checked)
      if (propsObj?.onCheckedChange) {
        propsObj.onCheckedChange(nextCheckedState)
      } else if (itemNode.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode.value) {
        onSelect(itemNode.value, itemNode)
      } else if (onCheckboxToggle && itemNode.value) {
        onCheckboxToggle(itemNode.value, nextCheckedState)
      }
      invokeOnClick(propsObj, e)
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeRadioClickHandler = (
    itemNode: ContextMenuItemDef & { value?: string; groupId?: string },
    propsObj: ItemProps | undefined
  ) => {
    return (e: MouseEvent) => {
      if (propsObj?.onClick) {
        propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
      } else if (itemNode.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode.value) {
        onSelect(itemNode.value, itemNode)
      } else if (onRadioSelect && itemNode.value) {
        onRadioSelect(itemNode.value)
      }
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeClickHandler = (
    propsObj: ItemProps | undefined,
    itemNode?: ContextMenuItemDef & { value?: string; groupId?: string }
  ) => {
    return (e: MouseEvent) => {
      if (propsObj?.onClick) {
        propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
      } else if (itemNode?.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode?.value) {
        onSelect(itemNode.value, itemNode)
      }

      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const renderItem = (item: ContextMenuItemDef, index: number) => {
    if (typeof item === 'string') {
      return <ContextMenuItem key={index}>{item}</ContextMenuItem>
    }

    if (isValidElement(item)) {
      return cloneElement(item, { key: index } as Attributes)
    }

    const {
      type = 'item',
      label,
      icon: Icon,
      shortcut,
      children,
      className,
      ...itemProps
    } = item
    const key = item.id || index

    if (children && children.length > 0) {
      return (
        <ContextMenuSub key={key}>
          <ContextMenuSubTrigger
            className={cn(styles.item, className)}
            disabled={itemProps.disabled}
          >
            <div className={styles.itemInner}>
              {Icon && (
                <span className={styles.iconWrapper}>
                  <Icon className={styles.itemIcon} />
                </span>
              )}
              <div className={cn(styles.labelGroup, styles.labelAndChevron)}>
                <span>{label}</span>
                {GoChevronRight && (
                  <GoChevronRight className={styles.chevronSmall} />
                )}
              </div>
            </div>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {children.map((child, idx) => renderItem(child, idx))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )
    }

    switch (type) {
      case 'separator':
        return <ContextMenuSeparator key={key} className={className} />

      case 'label':
        return (
          <ContextMenuLabel key={key} className={className}>
            {label}
          </ContextMenuLabel>
        )

      case 'checkbox': {
        const roundedClass = computeRoundedClass(item, index)

        return (
          <ContextMenuCheckboxItem
            key={key}
            className={cn(className, roundedClass)}
            checked={item.checked}
            onClick={makeCheckboxClickHandler(
              item as ContextMenuItemDef & { checked?: boolean },
              itemProps as ItemProps
            )}
            disabled={itemProps.disabled}
          >
            {label}
          </ContextMenuCheckboxItem>
        )
      }

      case 'radio':
        return (
          <ContextMenuRadioItem
            key={key}
            className={className}
            value={item.value!}
            checked={item.checked}
            disabled={itemProps.disabled}
            onClick={makeRadioClickHandler(
              item as ContextMenuItemDef & { value?: string },
              itemProps as ItemProps
            )}
          >
            {label}
          </ContextMenuRadioItem>
        )

      case 'item':
      default:
        return (
          <ContextMenuItem
            key={key}
            className={className}
            disabled={itemProps.disabled}
            onClick={makeClickHandler(
              itemProps as ItemProps,
              item as ContextMenuItemDef & { value?: string; groupId?: string }
            )}
          >
            {Icon && (
              <span className={styles.iconWrapper}>
                <Icon className={styles.itemIcon} />
              </span>
            )}
            <div className={cn(styles.labelGroup, styles.labelAndShortcut)}>
              <span>{label}</span>
              {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
            </div>
          </ContextMenuItem>
        )
    }
  }

  return (
    <ContextMenuRoot onOpenChange={onOpenChange} {...props}>
      <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
      <ContextMenuContent
        className={cn(styles.content, styles.contentPadding, className)}
        style={{ width }}
      >
        {(() => {
          const nodes: ReactNode[] = []
          for (let i = 0; i < items.length; i++) {
            const item = items[i]

            if (typeof item === 'string' || isValidElement(item)) {
              nodes.push(renderItem(item, i))
              continue
            }

            if (item.type === 'radio') {
              const groupId = item.groupId
              const groupItems: Array<RadioItemDef & { __idx?: number }> = []
              let j = i
              if (groupId) {
                while (j < items.length) {
                  const it = items[j]
                  if (
                    typeof it !== 'string' &&
                    !isValidElement(it) &&
                    it.type === 'radio' &&
                    it.groupId === groupId
                  ) {
                    groupItems.push({
                      ...(it as object as RadioItemDef),
                      __idx: j,
                    })
                    j++
                  } else break
                }
              } else {
                while (j < items.length) {
                  const it = items[j]
                  if (
                    typeof it !== 'string' &&
                    !isValidElement(it) &&
                    it.type === 'radio' &&
                    !it.groupId
                  ) {
                    groupItems.push({
                      ...(it as object as RadioItemDef),
                      __idx: j,
                    })
                    j++
                  } else break
                }
              }

              const groupValue =
                groupItems.find(g => Boolean(g.checked))?.value ?? undefined

              const handleValueChange = (value: string) => {
                const matched = groupItems.find(g => g.value === value)
                if (!matched) return
                if (matched.groupId && onGroupSelect) {
                  onGroupSelect(matched.groupId, value, matched)
                } else if (onSelect) {
                  onSelect(value, matched)
                } else if (onRadioSelect) {
                  onRadioSelect(value)
                }
              }

              nodes.push(
                <ContextMenuRadioGroup
                  key={'radio-group-' + i + (groupId ?? '')}
                  value={groupValue}
                  onValueChange={handleValueChange}
                >
                  {groupItems.map(g => (
                    <ContextMenuRadioItem
                      key={g.id ?? g.__idx}
                      className={g.className}
                      value={g.value!}
                      checked={g.checked}
                      disabled={g.disabled}
                      onClick={makeRadioClickHandler(
                        g as ContextMenuItemDef & { value?: string },
                        g as ItemProps
                      )}
                    >
                      {g.label}
                    </ContextMenuRadioItem>
                  ))}
                </ContextMenuRadioGroup>
              )

              i = j - 1
              continue
            }

            nodes.push(renderItem(item, i))
          }

          return nodes
        })()}
      </ContextMenuContent>
    </ContextMenuRoot>
  )
}

export {
  ContextMenu,
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
