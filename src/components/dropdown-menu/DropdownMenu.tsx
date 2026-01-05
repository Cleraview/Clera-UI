'use client'

import {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  isValidElement,
  cloneElement,
  useRef,
} from 'react'

import type {
  MouseEvent,
  ReactNode,
  ReactElement,
  ElementType,
  ComponentPropsWithoutRef,
  ElementRef,
  Attributes,
} from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { GoChevronRight, GoChevronLeft } from 'react-icons/go'
import { FaCircle, FaCircleCheck } from 'react-icons/fa6'

import { cn } from '@/utils/tailwind'
import { elementTextSizes } from '../_core/element-config'
import { styles } from './styles'

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      styles.subTrigger,
      inset && styles.subTriggerInset,
      className
    )}
    {...props}
  >
    {children}
    {GoChevronRight && <GoChevronRight className={styles.chevronLarge} />}
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(styles.subContent, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(styles.content, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(styles.item, inset && styles.itemInset, className)}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    checked?: boolean
  }
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
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
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    checked?: boolean
  }
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
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
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(styles.label, inset && styles.labelInset, className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export type DropdownItemDef =
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
      children?: DropdownItemDef[]
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

interface DropdownProps extends ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
> {
  items: DropdownItemDef[]
  trigger?: ReactNode
  align?: ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
  >['align']
  width?: string | number
  className?: string
  closeOnSelect?: boolean
  onSelect?: (value: string, item?: DropdownItemDef) => void
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: DropdownItemDef
  ) => void
}

interface MenuState {
  items: DropdownItemDef[]
  title: string
}

const Dropdown = ({
  children,
  trigger,
  items,
  align = 'end',
  width = 240,
  className,
  closeOnSelect = true,
  onSelect,
  onGroupSelect,
  ...props
}: DropdownProps) => {
  const [history, setHistory] = useState<MenuState[]>([
    { title: 'Main', items: items },
  ])
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev]
      if (newHistory.length > 0) {
        newHistory[0] = { ...newHistory[0], items }
      }
      return newHistory
    })
  }, [items])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setHistory([{ title: 'Main', items: items }])
        setDirection('forward')
      }, 300)
    }
    props.onOpenChange?.(open)

    if (open) {
      const node = triggerRef.current
      if (node) {
        const rect = node.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const approxItemHeight = 40
        const headerHeight = isRoot ? 0 : 48
        const estimatedHeight = Math.min(
          Math.max(
            approxItemHeight * (currentLayer.items?.length ?? 3) + headerHeight,
            120
          ),
          window.innerHeight * 0.6
        )
        if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow)
          setSide('top')
        else setSide('bottom')
      } else {
        setSide('bottom')
      }
    }
  }

  const [side, setSide] =
    useState<
      ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>['side']
    >('bottom')
  const contentRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLSpanElement | null>(null)

  const currentLayer = history[history.length - 1]
  const isRoot = history.length === 1

  const _placement =
    align === 'start'
      ? 'bottom-start'
      : align === 'end'
        ? 'bottom-end'
        : 'bottom'

  const navigateToSubmenu = (
    e: MouseEvent | Event,
    subItems: DropdownItemDef[],
    title: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('forward')
    setHistory(prev => [...prev, { title, items: subItems }])
  }

  const navigateBack = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('backward')
    setHistory(prev => prev.slice(0, -1))
  }

  type ItemProps = {
    onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
    onCheckedChange?: (checked: boolean) => void
    disabled?: boolean
  }

  const invokeOnClick = (props: ItemProps | undefined, e: MouseEvent) => {
    props?.onClick?.(e as unknown as MouseEvent<HTMLDivElement>)
  }

  const animationClass = useMemo(() => {
    const localIsRoot = history.length === 1
    if (localIsRoot && direction === 'forward') {
      return ''
    }
    return direction === 'forward'
      ? 'animate-in slide-in-from-right-8 fade-in-0 duration-200'
      : 'animate-in slide-in-from-left-8 fade-in-0 duration-200'
  }, [history.length, direction])

  const makeCheckboxClickHandler = (
    itemNode: DropdownItemDef & {
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
      }
      invokeOnClick(propsObj, e)
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeRadioClickHandler = (
    itemNode: DropdownItemDef & { value?: string; groupId?: string },
    propsObj: ItemProps | undefined
  ) => {
    return (e: MouseEvent) => {
      if (propsObj?.onClick) {
        propsObj.onClick(e as unknown as MouseEvent<HTMLDivElement>)
      } else if (itemNode.groupId && onGroupSelect && itemNode.value) {
        onGroupSelect(itemNode.groupId, itemNode.value, itemNode)
      } else if (onSelect && itemNode.value) {
        onSelect(itemNode.value, itemNode)
      }
      if (!closeOnSelect) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const makeClickHandler = (
    propsObj: ItemProps | undefined,
    itemNode?: DropdownItemDef & { value?: string; groupId?: string }
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

  const renderItem = (item: DropdownItemDef, index: number) => {
    if (typeof item === 'string') {
      return <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
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
        <DropdownMenuItem
          key={key}
          className={cn(styles.item, styles.itemWithChildren, className)}
          disabled={itemProps.disabled}
          onClick={e => navigateToSubmenu(e, children, label as string)}
        >
          <div className={styles.itemContent}>
            {Icon && <Icon className={styles.itemIcon} />}
            <span className={cn(elementTextSizes['md'])}>{label}</span>
          </div>
          {GoChevronRight && <GoChevronRight className={styles.chevronSmall} />}
        </DropdownMenuItem>
      )
    }

    switch (type) {
      case 'separator':
        return <DropdownMenuSeparator key={key} className={className} />
      case 'label':
        return (
          <DropdownMenuLabel key={key} className={className}>
            {label}
          </DropdownMenuLabel>
        )
      case 'checkbox':
        return (
          <DropdownMenuCheckboxItem
            key={key}
            className={className}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            onClick={makeCheckboxClickHandler(
              item as DropdownItemDef & { checked?: boolean },
              itemProps as ItemProps
            )}
            onSelect={e => {
              if (!closeOnSelect) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuCheckboxItem>
        )
      case 'radio':
        return (
          <DropdownMenuRadioItem
            key={key}
            className={className}
            value={item.value!}
            checked={item.checked}
            onClick={makeRadioClickHandler(
              item as DropdownItemDef & { value?: string },
              itemProps as ItemProps
            )}
            onSelect={e => {
              if (!closeOnSelect) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuRadioItem>
        )
      case 'item':
      default:
        return (
          <DropdownMenuItem
            key={key}
            className={className}
            onClick={makeClickHandler(
              itemProps as ItemProps,
              item as DropdownItemDef & { value?: string; groupId?: string }
            )}
            disabled={itemProps.disabled}
          >
            {Icon && <Icon className={styles.itemIcon} />}
            <span className={cn(elementTextSizes['md'])}>{label}</span>
            {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
          </DropdownMenuItem>
        )
    }
  }

  const _triggerElement = trigger ?? children

  return (
    <DropdownMenuRoot {...props} onOpenChange={onOpenChange}>
      <span ref={triggerRef} style={{ display: 'inline-block' }}>
        <DropdownMenuTrigger asChild>{trigger ?? children}</DropdownMenuTrigger>
      </span>
      <DropdownMenuContent
        ref={contentRef}
        side={side}
        align={align}
        className={cn(styles.contentPadding, className)}
        style={{ width }}
      >
        <div
          key={currentLayer.title}
          className={cn(styles.container, animationClass)}
        >
          {!isRoot && (
            <div className={styles.header}>
              <button onClick={navigateBack} className={styles.navBackButton}>
                {GoChevronLeft && (
                  <GoChevronLeft className={styles.chevronSmall} />
                )}
              </button>
              <span className={styles.backTitle}>{currentLayer.title}</span>
            </div>
          )}

          <div className={styles.itemsContainer}>
            {(() => {
              const nodes: ReactNode[] = []
              const itemsList = currentLayer.items
              for (let i = 0; i < itemsList.length; i++) {
                const item = itemsList[i]

                if (typeof item === 'string' || isValidElement(item)) {
                  nodes.push(renderItem(item, i))
                  continue
                }

                if (item.type === 'radio') {
                  const groupId = item.groupId
                  const groupItems: Array<RadioItemDef & { __idx?: number }> =
                    []
                  let idx = i
                  if (groupId) {
                    while (idx < itemsList.length) {
                      const candidate = itemsList[idx]
                      if (
                        typeof candidate !== 'string' &&
                        !isValidElement(candidate) &&
                        candidate.type === 'radio' &&
                        candidate.groupId === groupId
                      ) {
                        groupItems.push({
                          ...(candidate as RadioItemDef),
                          __idx: idx,
                        })
                        idx++
                      } else break
                    }
                  } else {
                    while (idx < itemsList.length) {
                      const candidate = itemsList[idx]
                      if (
                        typeof candidate !== 'string' &&
                        !isValidElement(candidate) &&
                        candidate.type === 'radio' &&
                        !candidate.groupId
                      ) {
                        groupItems.push({
                          ...(candidate as RadioItemDef),
                          __idx: idx,
                        })
                        idx++
                      } else break
                    }
                  }

                  const groupValue =
                    groupItems.find(itm => Boolean(itm.checked))?.value ??
                    undefined

                  const handleValueChange = (value: string) => {
                    const matchedItem = groupItems.find(
                      itm => itm.value === value
                    )
                    if (!matchedItem) return
                    if (matchedItem.groupId && onGroupSelect) {
                      onGroupSelect(matchedItem.groupId, value, matchedItem)
                    } else if (onSelect) {
                      onSelect(value, matchedItem)
                    }
                  }

                  nodes.push(
                    <DropdownMenuRadioGroup
                      key={`radio-group-${i}-${groupId ?? ''}`}
                      value={groupValue}
                      onValueChange={handleValueChange}
                    >
                      {groupItems.map(groupItem => (
                        <DropdownMenuRadioItem
                          key={groupItem.id ?? groupItem.__idx}
                          className={groupItem.className}
                          value={groupItem.value!}
                          checked={groupItem.checked}
                          disabled={groupItem.disabled}
                          onClick={makeRadioClickHandler(groupItem, groupItem)}
                          onSelect={e => {
                            if (!closeOnSelect) {
                              e.preventDefault()
                              e.stopPropagation()
                            }
                          }}
                        >
                          {groupItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  )

                  i = idx - 1
                  continue
                }

                nodes.push(renderItem(item, i))
              }

              return nodes
            })()}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}

export {
  Dropdown,
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
